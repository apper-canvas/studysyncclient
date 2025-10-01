import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  children,
  className,
  error,
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 text-base border-2 rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
        "disabled:bg-slate-50 disabled:cursor-not-allowed",
        "bg-white cursor-pointer",
        error ? "border-error" : "border-slate-300",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;