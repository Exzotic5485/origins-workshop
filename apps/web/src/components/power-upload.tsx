import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { uploadPower } from "@/lib/api/powers";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    type ConfigurableFieldType,
    powerSchema,
    uploadPowerFormSchema,
    type UploadPowerFormType,
    uploadPowerSchema,
} from "@repo/schemas";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon, UploadIcon } from "lucide-react";
import {
    createContext,
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import {
    useFieldArray,
    useForm,
    useFormContext,
    type UseFormReturn,
} from "react-hook-form";
import { z, ZodError } from "zod";

export default function PowerUpload() {
    const form = useForm<UploadPowerFormType>({
        resolver: zodResolver(uploadPowerFormSchema),
    });

    const mutation = useMutation({
        mutationFn: uploadPower,
    });

    const navigate = useNavigate();

    const onSubmit = async (data: UploadPowerFormType) => {
        try {
            const parsed = uploadPowerSchema.safeParse({
                ...data,
                data: JSON.parse(data.data),
            });

            if (!parsed.success) {
                for (const error of parsed.error.issues) {
                    form.setError(
                        error.path[0] === "data"
                            ? "data"
                            : (error.path.join(
                                  "."
                              ) as keyof UploadPowerFormType),
                        {
                            message: error.message,
                        }
                    );
                }
                return;
            }

            form.clearErrors();

            const power = await mutation.mutateAsync(parsed.data);

            navigate({ to: `/library/${power.id}` });
        } catch (e: unknown) {
            form.setError("data", {
                type: z.ZodIssueCode.custom,
                message: "Not valid JSON",
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <Card className="p-6">
                    <InformationFields />
                </Card>
                <Card className="p-6">
                    <ConfigurableFieldList />
                </Card>
                <Card className="p-6 grid">
                    {mutation.error?.message}
                    <Button
                        type="submit"
                        className="ml-auto"
                    >
                        <UploadIcon className="size-4 mr-2" />
                        Upload
                    </Button>
                </Card>
            </form>
        </Form>
    );
}

function InformationFields() {
    const form = useFormContext();

    return (
        <div className="grid space-y-6">
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
                            Does not have to be the same as in the power json
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
                            A longer description of your power, include any
                            other information here
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
                                placeholder={`{
  "type": "origins:attribute",
  "modifier": {
    "attribute": "minecraft:generic.max_health",
    "value": 0,
    "operation": "addition"
  }
}`}
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
        </div>
    );
}

function ConfigurableFieldList() {
    const form = useFormContext<UploadPowerFormType>();

    const { fields, append } = useFieldArray({
        control: form.control,
        name: "configurableFields",
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <span className="text-2xl font-medium">
                        Configurable Fields
                    </span>
                    <p className="text-sm text-muted-foreground">
                        Configurable fields allow you to define certain fields
                        as configurable by the user per origin project
                    </p>
                </div>
                <Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    onClick={() =>
                        append({
                            name: "",
                            description: "",
                            fieldPath: "",
                            type: "string",
                        })
                    }
                >
                    <PlusIcon className="size-4 mr-2" /> Add Configurable Field
                </Button>
            </div>
            <div className="grid divide-y border-t [&>*]:py-4">
                {fields.map((item: ConfigurableFieldType, i) => (
                    <ConfigurableField
                        key={item.id}
                        idx={i}
                    />
                ))}
            </div>
        </div>
    );
}

type ConfigurableFieldProps = {
    idx: number;
};

function ConfigurableField({ idx }: ConfigurableFieldProps) {
    const form = useFormContext<UploadPowerFormType>();

    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name={`configurableFields.${idx}.name`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Amount of Health"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            The name of the configurable field
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`configurableFields.${idx}.description`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="The amount of health to modify"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            A short description of what the configurable field
                            is for
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name={`configurableFields.${idx}.fieldPath`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Field Path</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="modifier.value"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            The JSON dot notation of the path this configurable
                            field should modify
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
