import { useState, useEffect } from "react";
import { format } from "date-fns";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import SelectField from "@/components/molecules/SelectField";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";

const AssignmentModal = ({ isOpen, onClose, onSubmit, assignment, courses }) => {
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    dueDate: "",
    priority: "medium",
    description: "",
  });

useEffect(() => {
    if (assignment) {
      setFormData({
        courseId: assignment.courseId,
        title: assignment.title,
        dueDate: format(new Date(assignment.dueDate), "yyyy-MM-dd'T'HH:mm"),
        priority: assignment.priority,
        description: assignment.description || "",
      });
    } else {
      setFormData({
        courseId: courses.length > 0 ? courses[0].Id : "",
        title: "",
        dueDate: "",
        priority: "medium",
        description: "",
      });
    }
  }, [assignment, courses, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      courseId: parseInt(formData.courseId),
      dueDate: new Date(formData.dueDate).toISOString(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assignment ? "Edit Assignment" : "Add New Assignment"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Assignment Title"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Final Project Submission"
          required
        />

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
          label="Due Date"
          id="dueDate"
          type="datetime-local"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />

        <SelectField
          label="Priority"
          id="priority"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          required
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </SelectField>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add any additional details about this assignment..."
            rows="4"
            className="w-full px-4 py-2.5 text-base border-2 border-slate-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {assignment ? "Update Assignment" : "Add Assignment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignmentModal;