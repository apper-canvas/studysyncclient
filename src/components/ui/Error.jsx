import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[400px] space-y-4 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">Oops!</h3>
      <p className="text-slate-600 text-center max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;