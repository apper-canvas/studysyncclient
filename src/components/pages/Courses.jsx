import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import gradeService from "@/services/api/gradeService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CourseCard from "@/components/organisms/CourseCard";
import CourseModal from "@/components/organisms/CourseModal";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

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
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    
    try {
      await courseService.delete(courseToDelete.Id);
      await assignmentService.deleteByCourseId(courseToDelete.Id);
      await gradeService.deleteByCourseId(courseToDelete.Id);
      
      setCourses(courses.filter(c => c.Id !== courseToDelete.Id));
      setAssignments(assignments.filter(a => a.courseId !== courseToDelete.Id));
      
      toast.success("Course deleted successfully");
      setCourseToDelete(null);
    } catch (err) {
      toast.error("Failed to delete course");
    }
  };

  const handleSubmit = async (courseData) => {
    try {
      if (selectedCourse) {
        const updated = await courseService.update(selectedCourse.Id, courseData);
        setCourses(courses.map(c => c.Id === selectedCourse.Id ? updated : c));
        toast.success("Course updated successfully");
      } else {
        const newCourse = await courseService.create(courseData);
        setCourses([...courses, newCourse]);
        toast.success("Course added successfully");
      }
    } catch (err) {
      toast.error(selectedCourse ? "Failed to update course" : "Failed to add course");
    }
  };

  const getAssignmentCount = (courseId) => {
    return assignments.filter(a => a.courseId === courseId).length;
  };

  if (loading) return <Loading message="Loading your courses..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Courses</h1>
          <p className="text-slate-600 mt-2">Manage your academic courses</p>
        </div>
        <Button variant="primary" size="lg" onClick={handleAddCourse}>
          <ApperIcon name="Plus" size={20} />
          Add Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <Empty
          icon="BookOpen"
          title="No courses yet"
          message="Add your first course to get started with organizing your academic journey"
          actionLabel="Add Course"
          onAction={handleAddCourse}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {courses.map((course, index) => (
            <motion.div
              key={course.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCard
                course={course}
                assignmentCount={getAssignmentCount(course.Id)}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        course={selectedCourse}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${courseToDelete?.name}"? This will also delete all associated assignments and grades. This action cannot be undone.`}
        confirmText="Delete Course"
        variant="error"
      />
    </div>
  );
};

export default Courses;