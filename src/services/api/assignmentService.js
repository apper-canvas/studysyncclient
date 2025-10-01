import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const assignmentService = {
  async getAll() {
    await delay(300);
    return [...assignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  },

  async getByCourseId(courseId) {
    await delay(200);
    return assignments.filter(a => a.courseId === parseInt(courseId)).map(a => ({ ...a }));
  },

  async create(assignmentData) {
    await delay(300);
    const maxId = assignments.length > 0 ? Math.max(...assignments.map(a => a.Id)) : 0;
    const newAssignment = {
      Id: maxId + 1,
      ...assignmentData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await delay(300);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments[index] = { ...assignments[index], ...assignmentData };
      return { ...assignments[index] };
    }
    return null;
  },

  async delete(id) {
    await delay(300);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments.splice(index, 1);
      return true;
    }
    return false;
  },

  async toggleComplete(id) {
    await delay(200);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      assignments[index].completed = !assignments[index].completed;
      return { ...assignments[index] };
    }
    return null;
  },

  async deleteByCourseId(courseId) {
    await delay(300);
    assignments = assignments.filter(a => a.courseId !== parseInt(courseId));
    return true;
  }
};

export default assignmentService;