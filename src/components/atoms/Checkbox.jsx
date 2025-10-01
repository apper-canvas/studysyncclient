import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  checked,
  className,
  onChange,
  ...props 
}, ref) => {
  return (
    <motion.button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange && onChange(!checked)}
      className={cn(
        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
        checked 
          ? "bg-primary border-primary" 
          : "bg-white border-slate-300 hover:border-primary",
        className
      )}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          <ApperIcon name="Check" size={16} className="text-white" />
        </motion.div>
      )}
    </motion.button>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;