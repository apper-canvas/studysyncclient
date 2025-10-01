import { motion } from "framer-motion";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";

const AssignmentCard = ({ assignment, course, onToggle, onEdit, onDelete }) => {
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = isPast(dueDate) && !assignment.completed;
  const isDueToday = isToday(dueDate);
  const isDueTomorrow = isTomorrow(dueDate);

  const getDueDateColor = () => {
    if (assignment.completed) return "success";
    if (isOverdue) return "error";
    if (isDueToday) return "warning";
    return "default";
  };

  const getDueDateText = () => {
    if (isDueToday) return "Due Today";
    if (isDueTomorrow) return "Due Tomorrow";
    return format(dueDate, "MMM d, yyyy");
  };

  const priorityColors = {
    low: "default",
    medium: "warning",
    high: "error"
  };

  const getBorderColor = () => {
    if (assignment.completed) return "success";
    return assignment.priority === "high" ? "error" : assignment.priority === "medium" ? "warning" : "default";
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border-l-4 border-slate-200 p-4 hover:shadow-md transition-all duration-200"
      style={{
        borderLeftColor: assignment.completed 
          ? "#10b981" 
          : assignment.priority === "high" 
            ? "#ef4444" 
            : assignment.priority === "medium"
              ? "#f59e0b"
              : "#e2e8f0"
      }}
      whileHover={{ x: 2 }}
      layout
    >
      <div className="flex items-start space-x-3">
        <Checkbox 
          checked={assignment.completed}
          onChange={() => onToggle(assignment.Id)}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${assignment.completed ? "line-through text-slate-400" : "text-slate-900"}`}>
                {assignment.title}
              </h3>
              {assignment.description && (
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  {assignment.description}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onEdit(assignment)}
                className="text-slate-400 hover:text-primary transition-colors"
              >
                <ApperIcon name="Edit2" size={16} />
              </button>
              <button
                onClick={() => onDelete(assignment)}
                className="text-slate-400 hover:text-error transition-colors"
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {course && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: course.color }}
                />
                <span className="text-sm font-medium text-slate-700">{course.name}</span>
              </div>
            )}
            
            <Badge variant={getDueDateColor()}>
              <ApperIcon name="Calendar" size={12} className="mr-1" />
              {getDueDateText()}
            </Badge>

            <Badge variant={priorityColors[assignment.priority]}>
              {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)} Priority
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssignmentCard;