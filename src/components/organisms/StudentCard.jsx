import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

function StudentCard({ student, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border-green-200";
      case "Inactive":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Graduated":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-lg">
              {student.name}
            </h3>
            <p className="text-sm text-slate-500">{student.major}</p>
          </div>
        </div>
        <Badge className={getStatusColor(student.status)}>
          {student.status}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <ApperIcon name="Mail" size={16} className="text-slate-400" />
          <span className="truncate">{student.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <ApperIcon name="Calendar" size={16} className="text-slate-400" />
          <span>Enrolled {formatDate(student.enrollmentDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <ApperIcon name="Award" size={16} className="text-slate-400" />
          <span>GPA: {student.gpa.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(student)}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <ApperIcon name="Edit" size={16} />
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(student)}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <ApperIcon name="Trash2" size={16} />
          Delete
        </Button>
      </div>
    </motion.div>
  );
}

export default StudentCard;