import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isPast, isToday, isTomorrow, isThisWeek } from "date-fns";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AssignmentCard from "@/components/organisms/AssignmentCard";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Assignments = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddAssignment = () => {
    setSelectedAssignment(null);
    setIsModalOpen(true);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDeleteAssignment = (assignment) => {
    setAssignmentToDelete(assignment);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!assignmentToDelete) return;
    
    try {
      await assignmentService.delete(assignmentToDelete.Id);
      setAssignments(assignments.filter(a => a.Id !== assignmentToDelete.Id));
      toast.success("Assignment deleted successfully");
      setAssignmentToDelete(null);
    } catch (err) {
      toast.error("Failed to delete assignment");
    }
  };

  const handleToggleComplete = async (assignmentId) => {
    try {
      const updated = await assignmentService.toggleComplete(assignmentId);
      setAssignments(assignments.map(a => a.Id === assignmentId ? updated : a));
      toast.success(updated.completed ? "Assignment completed!" : "Assignment marked incomplete");
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };

  const handleSubmit = async (assignmentData) => {
    try {
      if (selectedAssignment) {
        const updated = await assignmentService.update(selectedAssignment.Id, assignmentData);
        setAssignments(assignments.map(a => a.Id === selectedAssignment.Id ? updated : a));
        toast.success("Assignment updated successfully");
      } else {
        const newAssignment = await assignmentService.create(assignmentData);
        setAssignments([...assignments, newAssignment]);
        toast.success("Assignment added successfully");
      }
    } catch (err) {
      toast.error(selectedAssignment ? "Failed to update assignment" : "Failed to add assignment");
    }
  };

  const getFilteredAssignments = () => {
    const now = new Date();
    
    switch (filter) {
      case "overdue":
        return assignments.filter(a => !a.completed && isPast(new Date(a.dueDate)));
      case "today":
        return assignments.filter(a => !a.completed && isToday(new Date(a.dueDate)));
      case "thisWeek":
        return assignments.filter(a => !a.completed && isThisWeek(new Date(a.dueDate)));
      case "completed":
        return assignments.filter(a => a.completed);
      case "pending":
        return assignments.filter(a => !a.completed);
      default:
        return assignments;
    }
  };

  const groupAssignmentsByDate = () => {
    const filtered = getFilteredAssignments();
    const sorted = [...filtered].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    const groups = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: []
    };

    sorted.forEach(assignment => {
      const dueDate = new Date(assignment.dueDate);
      
      if (assignment.completed) {
        return;
      }
      
      if (isPast(dueDate)) {
        groups.overdue.push(assignment);
      } else if (isToday(dueDate)) {
        groups.today.push(assignment);
      } else if (isTomorrow(dueDate)) {
        groups.tomorrow.push(assignment);
      } else if (isThisWeek(dueDate)) {
        groups.thisWeek.push(assignment);
      } else {
        groups.later.push(assignment);
      }
    });

    if (filter === "completed") {
      return { completed: filtered };
    }

    return groups;
  };

  if (loading) return <Loading message="Loading your assignments..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const groupedAssignments = groupAssignmentsByDate();
  const filteredCount = getFilteredAssignments().length;

  const filters = [
    { value: "all", label: "All Assignments", count: assignments.length },
    { value: "pending", label: "Pending", count: assignments.filter(a => !a.completed).length },
    { value: "overdue", label: "Overdue", count: assignments.filter(a => !a.completed && isPast(new Date(a.dueDate))).length },
    { value: "today", label: "Due Today", count: assignments.filter(a => !a.completed && isToday(new Date(a.dueDate))).length },
    { value: "thisWeek", label: "This Week", count: assignments.filter(a => !a.completed && isThisWeek(new Date(a.dueDate))).length },
    { value: "completed", label: "Completed", count: assignments.filter(a => a.completed).length },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Assignments</h1>
          <p className="text-slate-600 mt-2">Track and manage your academic assignments</p>
        </div>
        <Button variant="primary" size="lg" onClick={handleAddAssignment}>
          <ApperIcon name="Plus" size={20} />
          Add Assignment
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === f.value
                ? "bg-primary text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {f.label} <span className="ml-1 opacity-75">({f.count})</span>
          </button>
        ))}
      </div>

      {assignments.length === 0 ? (
        <Empty
          icon="ClipboardList"
          title="No assignments yet"
          message="Add your first assignment to start tracking your academic work"
          actionLabel="Add Assignment"
          onAction={handleAddAssignment}
        />
      ) : filteredCount === 0 ? (
        <Empty
          icon="Filter"
          title="No assignments found"
          message={`No assignments match the "${filters.find(f => f.value === filter)?.label}" filter`}
        />
      ) : (
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {Object.entries(groupedAssignments).map(([groupName, groupAssignments]) => {
              if (groupAssignments.length === 0) return null;

              const groupTitles = {
                overdue: "Overdue",
                today: "Due Today",
                tomorrow: "Due Tomorrow",
                thisWeek: "This Week",
                later: "Later",
                completed: "Completed"
              };

              return (
                <motion.div
                  key={groupName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                    <span>{groupTitles[groupName]}</span>
                    <span className="text-lg font-normal text-slate-500">
                      ({groupAssignments.length})
                    </span>
                  </h2>
                  <div className="space-y-3">
                    {groupAssignments.map((assignment, index) => {
                      const course = courses.find(c => c.Id === assignment.courseId);
                      return (
                        <motion.div
                          key={assignment.Id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <AssignmentCard
                            assignment={assignment}
                            course={course}
                            onToggle={handleToggleComplete}
                            onEdit={handleEditAssignment}
                            onDelete={handleDeleteAssignment}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        assignment={selectedAssignment}
        courses={courses}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${assignmentToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Assignment"
        variant="error"
      />
    </div>
  );
};

export default Assignments;