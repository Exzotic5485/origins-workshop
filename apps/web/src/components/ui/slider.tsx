import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
        showValue?: boolean;
    }
>(({ className, value, showValue, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex w-full touch-none select-none items-center group",
            showValue && "pt-6",
            className
        )}
        value={value}
        {...props}
    >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full bg-primary group-aria-disabled:bg-primary/20" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="peer relative block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-105 group-aria-disabled:opacity-50">
            {showValue && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-muted-foreground pt-6">
                    {value}
                </span>
            )}
        </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
