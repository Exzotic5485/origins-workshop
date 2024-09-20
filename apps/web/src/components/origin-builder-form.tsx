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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useOriginBuilder } from "@/hooks/use-origin-builder";
import { getMinecraftAssetImage } from "@/lib/utils";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    name: z.string(),
    icon: z.string(),
    impact: z.number().min(0).max(3),
    description: z.string(),
    unchoosable: z.boolean(),
});

export default function OriginBuilderForm() {
    const { selectedOrigin, updateSelectedOrigin } = useOriginBuilder();

    const form = useForm<z.infer<typeof formSchema>>({
        values: selectedOrigin || {
            impact: 0,
            unchoosable: false,
            description: "",
            icon: "",
            name: "",
        },
    });

    const icon = useWatch({
        control: form.control,
        name: "icon",
    });

    useEffect(() => {
        const subscriber = form.watch((data) => {
            console.log("~ Form Save:", data);
            updateSelectedOrigin(data);
        });

        return () => subscriber.unsubscribe();
    }, [updateSelectedOrigin, form]);

    // only olution I could find to stop errors when setting disabled in form options
    useEffect(() => {
        form.control._disableForm(!selectedOrigin);
    }, [selectedOrigin, form]);

    return (
        <Form {...form}>
            <form
                className="space-y-6"
                autoComplete="off"
            >
                <div className="grid lg:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Avian"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The display name of the origin.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Icon</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            placeholder="minecraft:feather"
                                            {...field}
                                        />
                                    </FormControl>
                                    <img
                                        className="absolute top-1/2 -translate-y-1/2 right-2 size-8 image-pixelated"
                                        src={getMinecraftAssetImage(icon)}
                                        alt=""
                                    />
                                </div>
                                <FormDescription>
                                    The item stack which is displayed as the
                                    icon for the origin.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="The Avian race has lost their ability to fly a long time ago. Now these peaceful creatures can be seen gliding from one place to another."
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                The description of the origin.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="impact"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Impact</FormLabel>
                            <FormControl>
                                <Slider
                                    {...field}
                                    value={[Number(field.value)]}
                                    onValueChange={(v) => field.onChange(v[0])}
                                    min={0}
                                    max={3}
                                    step={1}
                                    showValue
                                />
                            </FormControl>
                            <FormDescription>
                                Specifies the impact of this origin with a
                                number from 0 (none) to 3 (high).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="unchoosable"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <FormLabel>Unchoosable</FormLabel>
                                    <FormDescription>
                                        If set to true, this origin will not
                                        show up in any origin layer to choose
                                        it.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={field.disabled}
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
