
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    showStars?: boolean
  }
>(({ className, showStars = false, ...props }, ref) => {
  const value = props.value?.[0] || 0
  const max = props.max || 100
  const progressPercentage = (value / max) * 100
  
  return (
    <div className="relative">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-kid-purple/20 shadow-inner">
          <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-kid-green via-kid-blue to-kid-purple transition-all duration-300" 
            style={{
              backgroundSize: "200% 200%",
              animation: "gradient-shift 3s ease infinite"
            }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-7 w-7 rounded-full border-2 border-kid-purple bg-white shadow-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 hover:rotate-12 transition-transform" />
      </SliderPrimitive.Root>
      
      {showStars && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-evenly pointer-events-none">
          {[...Array(5)].map((_, i) => {
            const starPosition = (i + 1) * 20 // Position stars at 20%, 40%, 60%, 80%, 100%
            return (
              <Star
                key={i}
                size={14}
                className={cn(
                  "transition-all duration-300",
                  progressPercentage >= starPosition
                    ? "text-kid-yellow fill-kid-yellow animate-bounce"
                    : "text-white/30"
                )}
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "0.7s",
                  left: `${starPosition}%`
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
