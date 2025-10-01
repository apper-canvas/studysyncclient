import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const gradeService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(g => g.Id === parseInt(id));
    return grade ? { ...grade } : null;
  },

  async getByCourseId(courseId) {
    await delay(200);
    return grades.filter(g => g.courseId === parseInt(courseId)).map(g => ({ ...g }));
  },

  async create(gradeData) {
    await delay(300);
    const maxId = grades.length > 0 ? Math.max(...grades.map(g => g.Id)) : 0;
    const newGrade = {
      Id: maxId + 1,
      ...gradeData
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await delay(300);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      grades[index] = { ...grades[index], ...gradeData };
      return { ...grades[index] };
    }
    return null;
  },

  async delete(id) {
    await delay(300);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index !== -1) {
      grades.splice(index, 1);
      return true;
    }
    return false;
  },

  async deleteByCourseId(courseId) {
    await delay(300);
    grades = grades.filter(g => g.courseId !== parseInt(courseId));
    return true;
  }
};

export default gradeService;