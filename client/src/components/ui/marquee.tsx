import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  children: React.ReactNode;
}

export function Marquee({
  className,
  speed = 20,
  pauseOnHover = false,
  direction = "left",
  children,
}: MarqueeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [childrenArray, setChildrenArray] = React.useState<React.ReactNode[]>([]);

  // Convert children to array once when they change
  React.useEffect(() => {
    // Handle both array and single child case
    const childArray = React.Children.toArray(children);
    // Simply set the array without trying to compare objects (which can have circular refs)
    setChildrenArray(childArray);
  }, [children]);

  // Set up the interval to change the active quote
  React.useEffect(() => {
    if (childrenArray.length <= 1) return;
    
    const intervalTime = 5000; // 5 seconds per quote
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [childrenArray.length]); // Only depend on the length, not the entire array

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  // If there's only one item or none, just render it directly
  if (childrenArray.length <= 1) {
    return (
      <div 
        className={cn("flex overflow-hidden", className)}
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    );
  }

  return (
    <div 
      className={cn("flex overflow-hidden", className)}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-center w-full h-full">
        <div 
          className="transition-opacity duration-500"
          style={{
            opacity: 1,
          }}
        >
          {childrenArray[activeIndex]}
        </div>
      </div>
    </div>
  );
}