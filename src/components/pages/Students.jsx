import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import StudentCard from "@/components/organisms/StudentCard";
import StudentModal from "@/components/organisms/StudentModal";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import { studentService } from "@/services/api/studentService";

function Students() {
  const { user } = useSelector((state) => state.user);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, statusFilter]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
student.name.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term)
        );
      }
  
      if (statusFilter !== "all") {
        filtered = filtered.filter((student) => student.status === statusFilter);
    }

    setFilteredStudents(filtered);
  };

  const handleCreate = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (student) => {
    setDeleteConfirm(student);
  };

  const confirmDelete = async () => {
    try {
      await studentService.delete(deleteConfirm.Id);
      setStudents((prev) => prev.filter((s) => s.Id !== deleteConfirm.Id));
      toast.success("Student deleted successfully");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error("Failed to delete student");
    }
  };

const handleSubmit = async (studentData) => {
    try {
      const userContext = {
        userId: user?.userId,
        companyId: user?.accounts?.[0]?.companyId
      };
      
      if (editingStudent) {
        const updated = await studentService.update(editingStudent.Id, studentData);
        setStudents((prev) =>
          prev.map((s) => (s.Id === editingStudent.Id ? updated : s))
        );
        toast.success("Student updated successfully");
      } else {
        const created = await studentService.create(studentData, userContext);
        setStudents((prev) => [...prev, created]);
        toast.success("Student created successfully");
      }
      setIsModalOpen(false);
      setEditingStudent(null);
    } catch (err) {
      toast.error(editingStudent ? "Failed to update student" : "Failed to create student");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Students</h1>
          <p className="text-slate-600 mt-1">Manage student records and enrollments</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={20} />
          Add Student
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon
                name="Search"
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:w-48"
          >
            <option value="all">All Status</option>
<option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </Select>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <Empty
          icon="GraduationCap"
          title="No students found"
          description={
            searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by adding your first student"
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, index) => (
            <motion.div
key={student.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StudentCard
                student={student}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </div>
      )}

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleSubmit}
        student={editingStudent}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}

export default Students;