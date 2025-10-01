import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'grade_c';

const gradeService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "course_id_c" }, referenceField: { field: { Name: "name_c" } } },
          { field: { Name: "assignment_name_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "category_c" } }
        ]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        courseId: grade.course_id_c?.Id || null,
        courseName: grade.course_id_c?.name_c || '',
        assignmentName: grade.assignment_name_c || '',
        score: grade.score_c || 0,
        maxScore: grade.max_score_c || 100,
        weight: grade.weight_c || 0,
        category: grade.category_c || 'Homework'
      }));
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      toast.error("Failed to load grades");
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "course_id_c" }, referenceField: { field: { Name: "name_c" } } },
          { field: { Name: "assignment_name_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "category_c" } }
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);

      if (!response.success || !response.data) {
        return null;
      }

      const grade = response.data;
      return {
        Id: grade.Id,
        courseId: grade.course_id_c?.Id || null,
        courseName: grade.course_id_c?.name_c || '',
        assignmentName: grade.assignment_name_c || '',
        score: grade.score_c || 0,
        maxScore: grade.max_score_c || 100,
        weight: grade.weight_c || 0,
        category: grade.category_c || 'Homework'
      };
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByCourseId(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "course_id_c" }, referenceField: { field: { Name: "name_c" } } },
          { field: { Name: "assignment_name_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "max_score_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "category_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        courseId: grade.course_id_c?.Id || null,
        courseName: grade.course_id_c?.name_c || '',
        assignmentName: grade.assignment_name_c || '',
        score: grade.score_c || 0,
        maxScore: grade.max_score_c || 100,
        weight: grade.weight_c || 0,
        category: grade.category_c || 'Homework'
      }));
    } catch (error) {
      console.error("Error fetching grades by course:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(gradeData) {
    try {
      const params = {
        records: [{
          course_id_c: parseInt(gradeData.courseId),
          assignment_name_c: gradeData.assignmentName,
          score_c: parseFloat(gradeData.score),
          max_score_c: parseFloat(gradeData.maxScore),
          weight_c: parseFloat(gradeData.weight),
          category_c: gradeData.category
        }]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} grade(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          toast.success("Grade created successfully");
          return {
            Id: created.Id,
            courseId: created.course_id_c?.Id || null,
            courseName: created.course_id_c?.name_c || '',
            assignmentName: created.assignment_name_c || '',
            score: created.score_c || 0,
            maxScore: created.max_score_c || 100,
            weight: created.weight_c || 0,
            category: created.category_c || 'Homework'
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
      toast.error("Failed to create grade");
      return null;
    }
  },

  async update(id, gradeData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          course_id_c: parseInt(gradeData.courseId),
          assignment_name_c: gradeData.assignmentName,
          score_c: parseFloat(gradeData.score),
          max_score_c: parseFloat(gradeData.maxScore),
          weight_c: parseFloat(gradeData.weight),
          category_c: gradeData.category
        }]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} grade(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          toast.success("Grade updated successfully");
          return {
            Id: updated.Id,
            courseId: updated.course_id_c?.Id || null,
            courseName: updated.course_id_c?.name_c || '',
            assignmentName: updated.assignment_name_c || '',
            score: updated.score_c || 0,
            maxScore: updated.max_score_c || 100,
            weight: updated.weight_c || 0,
            category: updated.category_c || 'Homework'
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
      toast.error("Failed to update grade");
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} grade(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        toast.success("Grade deleted successfully");
        return successful.length === 1;
      }

      return false;
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      toast.error("Failed to delete grade");
      return false;
    }
  },

  async deleteByCourseId(courseId) {
    try {
      const grades = await this.getByCourseId(courseId);
      
      if (grades.length === 0) {
        return true;
      }

      const recordIds = grades.map(g => g.Id);
      const params = {
        RecordIds: recordIds
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} grade(s):${JSON.stringify(failed)}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting grades by course:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default gradeService;