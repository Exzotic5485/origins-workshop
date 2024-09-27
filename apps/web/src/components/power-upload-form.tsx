import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { uploadPower } from "@/lib/api/powers";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadPowerSchema } from "@repo/schemas";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { UploadIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = uploadPowerSchema.merge(
    z.object({
        data: z.string(),
    })
);

type FormSchemaType = z.infer<typeof formSchema>;

export default function PowerUploadForm() {
    const mutation = useMutation({
        mutationFn: uploadPower,
    });

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        disabled: mutation.isPending || mutation.isSuccess,
        defaultValues: {
            name: "",
            summary: "",
            description: "",
            data: ""
        }
    });

    const navigate = useNavigate();

    const handleSubmit = async (data: FormSchemaType) => {
        try {
            const parsed = uploadPowerSchema.safeParse({
                ...data,
                data: JSON.parse(data.data),
            });

            if (!parsed.success) {
                for (const [key, value] of Object.entries(
                    parsed.error.formErrors.fieldErrors
                )) {
                    form.setError(key as keyof typeof data, {
                        type: z.ZodIssueCode.custom,
                        message: value.join(","),
                    });
                }

                return;
            }

            form.clearErrors();

            const power = await mutation.mutateAsync(parsed.data);

            navigate({ to: `/library/${power.id}` });
        } catch {
            form.setError("data", {
                type: z.ZodIssueCode.custom,
                message: "Not valid JSON",
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="grid space-y-6"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Health Modifier"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Does not have to be the same as in the power
                                json
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Summary</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Modifies the players health either addition or subtraction."
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                A short summary to describe what your power does
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder=""
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                A longer description of your power or any other
                                information to add
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Separator />
                <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Power JSON</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={9}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                The contents of your power file
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    className="ml-auto"
                    type="submit"
                    size="sm"
                    disabled={form.formState.disabled}
                >
                    <UploadIcon className="size-4 mr-2" />
                    Upload
                </Button>
            </form>
        </Form>
    );
}
