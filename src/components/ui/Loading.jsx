import { motion } from "framer-motion";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-primary rounded-full"
            animate={{
              y: ["0%", "-50%", "0%"],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.15,
            }}
          />
        ))}
      </motion.div>
      <p className="text-slate-600 font-medium">{message}</p>
    </div>
  );
};

export default Loading;