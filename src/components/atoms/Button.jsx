import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:brightness-110 focus:ring-primary shadow-sm",
    secondary: "bg-secondary text-white hover:brightness-110 focus:ring-secondary shadow-sm",
    accent: "bg-accent text-white hover:brightness-110 focus:ring-accent shadow-sm",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300",
    outline: "bg-transparent border-2 border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;