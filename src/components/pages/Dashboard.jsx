import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format, isPast, isToday } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Assignments from "@/components/pages/Assignments";
import Grades from "@/components/pages/Grades";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import courseService from "@/services/api/courseService";
import gradeService from "@/services/api/gradeService";
import assignmentService from "@/services/api/assignmentService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [coursesData, assignmentsData, gradesData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll(),
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleComplete = async (assignmentId) => {
    try {
      const updated = await assignmentService.toggleComplete(assignmentId);
      setAssignments(assignments.map(a => a.Id === assignmentId ? updated : a));
      toast.success(updated.completed ? "Assignment completed!" : "Assignment marked incomplete");
    } catch (err) {
      toast.error("Failed to update assignment");
    }
  };

  if (loading) return <Loading message="Loading your dashboard..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const upcomingAssignments = assignments
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const overdueAssignments = upcomingAssignments.filter(a => isPast(new Date(a.dueDate)));
  const completedCount = assignments.filter(a => a.completed).length;
  const totalAssignments = assignments.length;
  const completionRate = totalAssignments > 0 ? Math.round((completedCount / totalAssignments) * 100) : 0;

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
    
    return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
  };

  const overallAverage = courses.length > 0
    ? Math.round(
        courses.reduce((sum, course) => {
          const avg = calculateCourseAverage(course.Id);
          return sum + (avg || 0);
        }, 0) / courses.filter(c => calculateCourseAverage(c.Id) !== null).length
      )
    : 0;

  const stats = [
    {
      label: "Active Courses",
      value: courses.length,
      icon: "BookOpen",
      color: "primary",
      bgColor: "bg-primary/10",
      textColor: "text-primary"
    },
    {
      label: "Pending Assignments",
      value: upcomingAssignments.length,
      icon: "ClipboardList",
      color: "secondary",
      bgColor: "bg-secondary/10",
      textColor: "text-secondary"
    },
    {
      label: "Overdue",
      value: overdueAssignments.length,
      icon: "AlertCircle",
      color: "error",
      bgColor: "bg-error/10",
      textColor: "text-error"
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: "TrendingUp",
      color: "success",
      bgColor: "bg-success/10",
      textColor: "text-success"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Welcome back! Here's your academic overview</p>
        </div>
        <Button 
          variant="primary" 
          size="lg"
          onClick={() => navigate("/assignments")}
        >
          <ApperIcon name="Plus" size={20} />
          Quick Add Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <ApperIcon name={stat.icon} className={stat.textColor} size={28} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Upcoming Assignments</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/assignments")}>
              View All
            </Button>
          </div>

          {upcomingAssignments.length === 0 ? (
            <Empty
              icon="CheckCircle2"
              title="All caught up!"
              message="You have no pending assignments. Great work!"
            />
          ) : (
<div className="space-y-3">
              {upcomingAssignments.map((assignment) => {
                const course = courses.find(c => c.Id === assignment.courseId);
                const dueDate = new Date(assignment.dueDate);
                const isOverdue = isPast(dueDate) && !isToday(dueDate);
                const isDueToday = isToday(dueDate);
                
                return (
                  <motion.div
                    key={assignment.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-shadow"
                  >
                    <Checkbox
                      checked={assignment.completed}
                      onChange={() => handleToggleComplete(assignment.Id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        {course && (
                          <>
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: course.color }}
                            />
                            <span className="text-sm font-medium text-slate-700">{course.name}</span>
                          </>
                        )}
                      </div>
                      <h3 className={`font-semibold text-slate-900 mb-1 ${
                        assignment.completed ? 'line-through text-slate-500' : ''
                      }`}>
                        {assignment.title}
                      </h3>
                    </div>

                    <Badge variant={isOverdue ? "error" : isDueToday ? "warning" : "default"}>
                      <ApperIcon name="Calendar" size={12} className="mr-1" />
                      {format(dueDate, "MMM d")}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Course Grades</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/grades")}>
              View All
            </Button>
          </div>

          {courses.length === 0 ? (
            <Empty
              icon="GraduationCap"
              title="No courses yet"
              message="Add your courses to start tracking grades"
              actionLabel="Add Course"
              onAction={() => navigate("/courses")}
            />
          ) : (
            <div className="space-y-4">
              {courses.slice(0, 5).map((course) => {
const average = calculateCourseAverage(course.Id);
                
                return (
<div key={course.Id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-900">{course.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-lg font-bold ${average >= 90 ? "text-success" : average >= 80 ? "text-primary" : average >= 70 ? "text-warning" : "text-error"}`}>
                        {average !== null ? `${average}%` : "N/A"}
                      </span>
                    </div>
                    {average !== null && (
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${average >= 90 ? "bg-success" : average >= 80 ? "bg-primary" : average >= 70 ? "bg-warning" : "bg-error"}`}
                          style={{ width: `${average}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {courses.filter(c => calculateCourseAverage(c.Id) !== null).length > 0 && (
                <div className="pt-4 mt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-slate-900">Overall Average</span>
                    <span className={`text-2xl font-bold ${overallAverage >= 90 ? "text-success" : overallAverage >= 80 ? "text-primary" : overallAverage >= 70 ? "text-warning" : "text-error"}`}>
                      {overallAverage}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;