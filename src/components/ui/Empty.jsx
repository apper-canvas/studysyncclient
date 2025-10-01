import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "BookOpen",
  title = "Nothing here yet", 
  message = "Get started by adding your first item",
  actionLabel,
  onAction 
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[400px] space-y-4 px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600 text-center max-w-md">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="lg">
          <ApperIcon name="Plus" size={20} />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;