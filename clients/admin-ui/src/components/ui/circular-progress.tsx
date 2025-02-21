import * as React from "react"
import { cn } from "@/lib/utils"

export interface CircularProgressProps extends React.SVGAttributes<SVGElement> {
    value: string | number
    size?: number
    strokeWidth?: number
    showValue?: boolean
    valueClassName?: string
}

const CircularProgress = React.forwardRef<SVGSVGElement, CircularProgressProps>(
    ({ value = "0%", size = 100, strokeWidth = 10, showValue = true, className, valueClassName, ...props }, ref) => {
        const radius = (size - strokeWidth) / 2
        const circumference = 2 * Math.PI * radius

        const parseValue = (val: string | number): { numericValue: number; isPositive: boolean } => {
            if (typeof val === "number") {
                return { numericValue: Math.abs(val), isPositive: val >= 0 }
            }
            const match = val.match(/^([+-]?)(\d+(?:\.\d+)?)%?$/)
            if (match) {
                const numericValue = Number.parseFloat(match[2])
                const isPositive = match[1] !== "-"
                return { numericValue, isPositive }
            }
            return { numericValue: 0, isPositive: true }
        }

        const { numericValue, isPositive } = parseValue(value)
        const cappedValue = Math.min(numericValue, 100)
        const strokeDashoffset = circumference - (cappedValue / 100) * circumference

        const valueColor = isPositive ? "text-green-600" : "text-red-600"
        const circleColor = isPositive ? "text-green-500" : "text-red-500"

        return (
            <div className="relative inline-flex items-center justify-center">
                <svg
                    className={cn("transform -rotate-90", className)}
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    ref={ref}
                    {...props}
                >
                    <circle
                        className="text-muted-foreground/20"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    <circle
                        className={cn("transition-all duration-300 ease-in-out", circleColor)}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                </svg>
                {showValue && (
                    <div
                        className={cn(
                            "absolute inset-0 flex items-center justify-center text-lg font-medium",
                            valueColor,
                            valueClassName,
                        )}
                    >
                        {typeof value === "string" ? value : `${isPositive ? "+" : "-"}${numericValue}%`}
                    </div>
                )}
            </div>
        )
    },
)
CircularProgress.displayName = "CircularProgress"

export { CircularProgress }

