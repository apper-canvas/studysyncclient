import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CourseCard = ({ course, assignmentCount, onEdit, onDelete }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: course.color }}
          />
          <div>
            <h3 className="text-lg font-bold text-slate-900">{course.name}</h3>
            <p className="text-sm text-slate-600 mt-1">{course.instructor}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-4 text-sm text-slate-600">
          <span className="flex items-center space-x-1">
            <ApperIcon name="BookOpen" size={16} />
            <span>{course.credits} credits</span>
          </span>
          <span className="flex items-center space-x-1">
            <ApperIcon name="ClipboardList" size={16} />
            <span>{assignmentCount} assignments</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(course)}
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(course)}
            className="text-error hover:bg-error/10"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;