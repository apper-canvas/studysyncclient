import { useState, useEffect } from "react";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import SelectField from "@/components/molecules/SelectField";
import Button from "@/components/atoms/Button";

function StudentModal({ isOpen, onClose, onSubmit, student }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    major: "",
    gpa: "",
    enrollmentDate: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        major: student.major,
        gpa: student.gpa.toString(),
        enrollmentDate: student.enrollmentDate,
        status: student.status,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        major: "",
        gpa: "",
        enrollmentDate: new Date().toISOString().split("T")[0],
        status: "Active",
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.major.trim()) {
      newErrors.major = "Major is required";
    }

    if (!formData.gpa) {
      newErrors.gpa = "GPA is required";
    } else {
      const gpaValue = parseFloat(formData.gpa);
      if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4.0) {
        newErrors.gpa = "GPA must be between 0.0 and 4.0";
      }
    }

    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = "Enrollment date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        gpa: parseFloat(formData.gpa),
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? "Edit Student" : "Add New Student"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Full Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          required
          placeholder="Enter student's full name"
        />

        <FormField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          required
          placeholder="student@example.com"
        />

        <FormField
          label="Major"
          value={formData.major}
          onChange={(e) => handleChange("major", e.target.value)}
          error={errors.major}
          required
          placeholder="e.g., Computer Science"
        />

        <FormField
          label="GPA"
          type="number"
          step="0.01"
          min="0"
          max="4"
          value={formData.gpa}
          onChange={(e) => handleChange("gpa", e.target.value)}
          error={errors.gpa}
          required
          placeholder="0.00 - 4.00"
        />

        <FormField
          label="Enrollment Date"
          type="date"
          value={formData.enrollmentDate}
          onChange={(e) => handleChange("enrollmentDate", e.target.value)}
          error={errors.enrollmentDate}
          required
        />

        <SelectField
          label="Status"
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Graduated">Graduated</option>
        </SelectField>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {student ? "Update Student" : "Create Student"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default StudentModal;