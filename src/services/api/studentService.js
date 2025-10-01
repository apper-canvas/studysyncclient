import mockStudents from "@/services/mockData/students.json";

let students = [...mockStudents];
let nextId = Math.max(...students.map((s) => s.Id), 0) + 1;

export const studentService = {
  async getAll() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return students.map((s) => ({ ...s }));
  },

  async getById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const student = students.find((s) => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

  async create(studentData) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newStudent = {
      Id: nextId++,
      name: studentData.name,
      email: studentData.email,
      major: studentData.major,
      gpa: studentData.gpa,
      enrollmentDate: studentData.enrollmentDate,
      status: studentData.status,
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = students.findIndex((s) => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    students[index] = {
      ...students[index],
      name: studentData.name,
      email: studentData.email,
      major: studentData.major,
      gpa: studentData.gpa,
      enrollmentDate: studentData.enrollmentDate,
      status: studentData.status,
    };
    return { ...students[index] };
  },

  async delete(id) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = students.findIndex((s) => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    students.splice(index, 1);
    return true;
  },
};