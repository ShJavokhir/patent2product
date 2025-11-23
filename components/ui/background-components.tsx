import { cn } from "@/lib/utils";
import React from "react";

interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export const Component = ({ children, className }: ComponentProps) => {
  return (
   <div className={cn("min-h-screen w-full relative bg-[#f0fdf4] overflow-hidden", className)}>
    {/* Soft Yellow Glow - Adapted to Greenish Theme as requested previously, but keeping the user's structure */}
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: `
          radial-gradient(circle at center, #d1fae5 0%, transparent 70%)
        `,
        opacity: 0.8,
        // mixBlendMode: "multiply", // Removed multiply as it might darken too much on light bg, normal or overlay might be better
      }}
    />
     {children}
   </div>
  );
};

