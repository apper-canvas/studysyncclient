import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children,
  className,
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;