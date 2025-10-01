import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import courseService from "@/services/api/courseService";
import gradeService from "@/services/api/gradeService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import GradeModal from "@/components/organisms/GradeModal";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [gradeToDelete, setGradeToDelete] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [coursesData, gradesData] = await Promise.all([
        courseService.getAll(),
        gradeService.getAll(),
      ]);
      setCourses(coursesData);
      setGrades(gradesData);
      if (coursesData.length > 0 && !activeCourse) {
        setActiveCourse(coursesData[0].Id);
      }
    } catch (err) {
      setError(err.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddGrade = () => {
    setSelectedGrade(null);
    setIsModalOpen(true);
  };

  const handleEditGrade = (grade) => {
    setSelectedGrade(grade);
    setIsModalOpen(true);
  };

  const handleDeleteGrade = (grade) => {
    setGradeToDelete(grade);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!gradeToDelete) return;
    
    try {
      await gradeService.delete(gradeToDelete.Id);
      setGrades(grades.filter(g => g.Id !== gradeToDelete.Id));
      toast.success("Grade deleted successfully");
      setGradeToDelete(null);
    } catch (err) {
      toast.error("Failed to delete grade");
    }
  };

  const handleSubmit = async (gradeData) => {
    try {
      if (selectedGrade) {
        const updated = await gradeService.update(selectedGrade.Id, gradeData);
        setGrades(grades.map(g => g.Id === selectedGrade.Id ? updated : g));
        toast.success("Grade updated successfully");
      } else {
        const newGrade = await gradeService.create(gradeData);
        setGrades([...grades, newGrade]);
        toast.success("Grade added successfully");
      }
    } catch (err) {
      toast.error(selectedGrade ? "Failed to update grade" : "Failed to add grade");
    }
  };

  const calculateCourseAverage = (courseId) => {
    const courseGrades = grades.filter(g => g.courseId === courseId);
    if (courseGrades.length === 0) return null;
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    courseGrades.forEach(grade => {
      const percentage = (grade.score / grade.maxScore) * 100;
      totalWeightedScore += percentage * grade.weight;
      totalWeight += grade.weight;
    });
    
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  };

  const getCategoryGrades = (courseId) => {
    const courseGrades = grades.filter(g => g.courseId === courseId);
    const categories = {};
    
    courseGrades.forEach(grade => {
      if (!categories[grade.category]) {
        categories[grade.category] = [];
      }
      categories[grade.category].push(grade);
    });
    
    return categories;
  };

  if (loading) return <Loading message="Loading your grades..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (courses.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Grades</h1>
            <p className="text-slate-600 mt-2">Track your academic performance</p>
          </div>
        </div>
        <Empty
          icon="BarChart3"
          title="No courses yet"
          message="Add courses first to start tracking your grades"
        />
      </div>
    );
  }

  const activeCourseName = courses.find(c => c.Id === activeCourse)?.name;
  const courseGrades = grades.filter(g => g.courseId === activeCourse);
  const courseAverage = calculateCourseAverage(activeCourse);
  const categoryGrades = getCategoryGrades(activeCourse);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Grades</h1>
          <p className="text-slate-600 mt-2">Track your academic performance</p>
        </div>
        <Button variant="primary" size="lg" onClick={handleAddGrade}>
          <ApperIcon name="Plus" size={20} />
          Add Grade
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-200">
          {courses.map((course) => (
            <button
              key={course.Id}
              onClick={() => setActiveCourse(course.Id)}
              className={`relative px-6 py-4 font-medium transition-all duration-200 ${
                activeCourse === course.Id
                  ? "text-primary bg-primary/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: course.color }}
                />
                <span>{course.name}</span>
              </div>
              {activeCourse === course.Id && (
                <motion.div
                  layoutId="activeCourseTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCourse}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {courseGrades.length === 0 ? (
                <Empty
                  icon="BarChart3"
                  title="No grades yet"
                  message={`Add your first grade entry for ${activeCourseName}`}
                  actionLabel="Add Grade"
                  onAction={handleAddGrade}
                />
              ) : (
                <div className="space-y-8">
                  {courseAverage !== null && (
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Course Average</p>
                          <p className={`text-5xl font-bold mt-2 ${courseAverage >= 90 ? "text-success" : courseAverage >= 80 ? "text-primary" : courseAverage >= 70 ? "text-warning" : "text-error"}`}>
                            {courseAverage.toFixed(1)}%
                          </p>
                        </div>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${courseAverage >= 90 ? "bg-success/20" : courseAverage >= 80 ? "bg-primary/20" : courseAverage >= 70 ? "bg-warning/20" : "bg-error/20"}`}>
                          <ApperIcon 
                            name={courseAverage >= 90 ? "TrendingUp" : courseAverage >= 70 ? "Minus" : "TrendingDown"} 
                            className={courseAverage >= 90 ? "text-success" : courseAverage >= 80 ? "text-primary" : courseAverage >= 70 ? "text-warning" : "text-error"} 
                            size={32} 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {Object.entries(categoryGrades).map(([category, categoryItems]) => {
                      const categoryAverage = categoryItems.reduce((sum, g) => {
                        return sum + (g.score / g.maxScore) * 100;
                      }, 0) / categoryItems.length;

                      return (
                        <div key={category} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900">{category}</h3>
                            <span className="text-lg font-semibold text-slate-600">
                              {categoryAverage.toFixed(1)}%
                            </span>
                          </div>

                          <div className="bg-slate-50 rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-slate-200">
                                  <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Assignment</th>
                                  <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Score</th>
                                  <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Weight</th>
                                  <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Grade</th>
                                  <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {categoryItems.map((grade, index) => {
                                  const percentage = (grade.score / grade.maxScore) * 100;
                                  return (
                                    <tr 
                                      key={grade.Id}
                                      className={`${index !== categoryItems.length - 1 ? "border-b border-slate-200" : ""} hover:bg-white transition-colors`}
                                    >
                                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                        {grade.assignmentName}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-center text-slate-700">
                                        {grade.score} / {grade.maxScore}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-center text-slate-700">
                                        {grade.weight}%
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${percentage >= 90 ? "bg-success/10 text-success" : percentage >= 80 ? "bg-primary/10 text-primary" : percentage >= 70 ? "bg-warning/10 text-warning" : "bg-error/10 text-error"}`}>
                                          {percentage.toFixed(1)}%
                                        </span>
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                          <button
                                            onClick={() => handleEditGrade(grade)}
                                            className="text-slate-400 hover:text-primary transition-colors"
                                          >
                                            <ApperIcon name="Edit2" size={16} />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteGrade(grade)}
                                            className="text-slate-400 hover:text-error transition-colors"
                                          >
                                            <ApperIcon name="Trash2" size={16} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <GradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        grade={selectedGrade}
        courses={courses}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Grade"
        message={`Are you sure you want to delete this grade entry? This action cannot be undone.`}
        confirmText="Delete Grade"
        variant="error"
      />
    </div>
  );
};

export default Grades;