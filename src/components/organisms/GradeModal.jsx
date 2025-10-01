import { useState, useEffect } from "react";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import SelectField from "@/components/molecules/SelectField";
import Button from "@/components/atoms/Button";

const GradeModal = ({ isOpen, onClose, onSubmit, grade, courses }) => {
  const [formData, setFormData] = useState({
    courseId: "",
    assignmentName: "",
    score: "",
    maxScore: 100,
    weight: 10,
    category: "Homework",
  });

  useEffect(() => {
    if (grade) {
      setFormData({
        courseId: grade.courseId,
        assignmentName: grade.assignmentName,
        score: grade.score,
        maxScore: grade.maxScore,
        weight: grade.weight,
        category: grade.category,
      });
    } else {
      setFormData({
        courseId: courses.length > 0 ? courses[0].Id : "",
        assignmentName: "",
        score: "",
        maxScore: 100,
        weight: 10,
        category: "Homework",
      });
    }
  }, [grade, courses, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      courseId: parseInt(formData.courseId),
      score: parseFloat(formData.score),
      maxScore: parseFloat(formData.maxScore),
      weight: parseFloat(formData.weight),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={grade ? "Edit Grade" : "Add New Grade"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <SelectField
          label="Course"
          id="courseId"
          value={formData.courseId}
          onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
          required
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.Id} value={course.Id}>
              {course.name}
            </option>
          ))}
        </SelectField>

        <FormField
          label="Assignment Name"
          id="assignmentName"
          value={formData.assignmentName}
          onChange={(e) => setFormData({ ...formData, assignmentName: e.target.value })}
          placeholder="e.g., Midterm Exam"
          required
        />

        <SelectField
          label="Category"
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        >
          <option value="Homework">Homework</option>
          <option value="Quizzes">Quizzes</option>
          <option value="Exams">Exams</option>
          <option value="Projects">Projects</option>
          <option value="Labs">Labs</option>
          <option value="Participation">Participation</option>
          <option value="Papers">Papers</option>
          <option value="Essays">Essays</option>
        </SelectField>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Score"
            id="score"
            type="number"
            value={formData.score}
            onChange={(e) => setFormData({ ...formData, score: e.target.value })}
            placeholder="e.g., 85"
            min="0"
            step="0.01"
            required
          />

          <FormField
            label="Max Score"
            id="maxScore"
            type="number"
            value={formData.maxScore}
            onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
            placeholder="e.g., 100"
            min="0"
            step="0.01"
            required
          />
        </div>

        <FormField
          label="Weight (%)"
          id="weight"
          type="number"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          placeholder="e.g., 25"
          min="0"
          max="100"
          step="0.01"
          required
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {grade ? "Update Grade" : "Add Grade"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GradeModal;