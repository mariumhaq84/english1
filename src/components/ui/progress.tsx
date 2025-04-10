import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string
    showStars?: boolean
  }
>(({ className, value, indicatorClassName, showStars = false, ...props }, ref) => {
  // Calculate how many stars to show based on progress value
  const progressPercentage = value || 0
  const starCount = Math.floor(progressPercentage / 20) // One star for each 20% of progress

  return (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-6 w-full overflow-hidden rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-kid-purple/20 shadow-inner",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-in-out bg-gradient-to-r from-kid-green via-kid-blue to-kid-purple",
            indicatorClassName
          )}
          style={{ 
            transform: `translateX(-${100 - progressPercentage}%)`,
            backgroundSize: "200% 200%",
            animation: "gradient-shift 3s ease infinite"
          }}
        />
      </ProgressPrimitive.Root>
      
      {showStars && progressPercentage > 0 && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-evenly pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={cn(
                "transition-all duration-300",
                i < starCount 
                  ? "text-kid-yellow fill-kid-yellow" 
                  : "text-white/30"
              )}
              style={{ 
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
