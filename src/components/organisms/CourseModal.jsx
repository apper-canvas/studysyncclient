import { useState, useEffect } from "react";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import ColorPicker from "@/components/molecules/ColorPicker";
import Button from "@/components/atoms/Button";

const CourseModal = ({ isOpen, onClose, onSubmit, course }) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "#6366f1",
    instructor: "",
    credits: 3,
  });

useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        color: course.color,
        instructor: course.instructor,
        credits: course.credits,
      });
    } else {
      setFormData({
        name: "",
        color: "#6366f1",
        instructor: "",
        credits: 3,
      });
    }
  }, [course, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={course ? "Edit Course" : "Add New Course"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Course Name"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Introduction to Computer Science"
          required
        />

        <FormField
          label="Instructor"
          id="instructor"
          value={formData.instructor}
          onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
          placeholder="e.g., Dr. Sarah Chen"
          required
        />

        <FormField
          label="Credits"
          id="credits"
          type="number"
          value={formData.credits}
          onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
          min="1"
          max="6"
          required
        />

        <ColorPicker
          label="Course Color"
          value={formData.color}
          onChange={(color) => setFormData({ ...formData, color })}
          required
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {course ? "Update Course" : "Add Course"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CourseModal;