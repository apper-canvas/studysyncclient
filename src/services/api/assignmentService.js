import { toast } from "react-toastify";
import React from "react";

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'assignment_c';

const assignmentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "course_id_c" }, referenceField: { field: { Name: "name_c" } } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "created_at_c" } }
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

      return response.data.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || null,
        courseName: assignment.course_id_c?.name_c || '',
        title: assignment.title_c || '',
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c || 'medium',
        completed: assignment.completed_c || false,
        description: assignment.description_c || '',
        createdAt: assignment.created_at_c
      }));
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      toast.error("Failed to load assignments");
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "course_id_c" }, referenceField: { field: { Name: "name_c" } } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);

      if (!response.success || !response.data) {
        return null;
      }

      const assignment = response.data;
      return {
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || null,
        courseName: assignment.course_id_c?.name_c || '',
        title: assignment.title_c || '',
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c || 'medium',
        completed: assignment.completed_c || false,
        description: assignment.description_c || '',
        createdAt: assignment.created_at_c
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByCourseId(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "course_id_c" }, referenceField: { field: { Name: "name_c" } } },
          { field: { Name: "title_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "created_at_c" } }
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

      return response.data.map(assignment => ({
        Id: assignment.Id,
        courseId: assignment.course_id_c?.Id || null,
        courseName: assignment.course_id_c?.name_c || '',
        title: assignment.title_c || '',
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c || 'medium',
        completed: assignment.completed_c || false,
        description: assignment.description_c || '',
        createdAt: assignment.created_at_c
      }));
    } catch (error) {
      console.error("Error fetching assignments by course:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(assignmentData) {
    try {
      const params = {
        records: [{
          course_id_c: parseInt(assignmentData.courseId),
          title_c: assignmentData.title,
          due_date_c: assignmentData.dueDate,
          priority_c: assignmentData.priority,
          completed_c: false,
          description_c: assignmentData.description || ''
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
          console.error(`Failed to create ${failed.length} assignment(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          toast.success("Assignment created successfully");
          return {
            Id: created.Id,
            courseId: created.course_id_c?.Id || null,
            courseName: created.course_id_c?.name_c || '',
            title: created.title_c || '',
            dueDate: created.due_date_c,
            priority: created.priority_c || 'medium',
            completed: created.completed_c || false,
            description: created.description_c || '',
            createdAt: created.created_at_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      toast.error("Failed to create assignment");
      return null;
    }
  },

  async update(id, assignmentData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      if (assignmentData.courseId !== undefined) {
        updateData.course_id_c = parseInt(assignmentData.courseId);
      }
      if (assignmentData.title !== undefined) {
        updateData.title_c = assignmentData.title;
      }
      if (assignmentData.dueDate !== undefined) {
        updateData.due_date_c = assignmentData.dueDate;
      }
      if (assignmentData.priority !== undefined) {
        updateData.priority_c = assignmentData.priority;
      }
      if (assignmentData.completed !== undefined) {
        updateData.completed_c = assignmentData.completed;
      }
      if (assignmentData.description !== undefined) {
        updateData.description_c = assignmentData.description;
      }

      const params = {
        records: [updateData]
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
          console.error(`Failed to update ${failed.length} assignment(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          toast.success("Assignment updated successfully");
          return {
            Id: updated.Id,
            courseId: updated.course_id_c?.Id || null,
            courseName: updated.course_id_c?.name_c || '',
            title: updated.title_c || '',
            dueDate: updated.due_date_c,
            priority: updated.priority_c || 'medium',
            completed: updated.completed_c || false,
            description: updated.description_c || '',
            createdAt: updated.created_at_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
      toast.error("Failed to update assignment");
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
          console.error(`Failed to delete ${failed.length} assignment(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        toast.success("Assignment deleted successfully");
        return successful.length === 1;
      }

      return false;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      toast.error("Failed to delete assignment");
      return false;
    }
  },

  async toggleComplete(id) {
    try {
      const current = await this.getById(id);
      if (!current) {
        toast.error("Assignment not found");
        return null;
      }

      const params = {
        records: [{
          Id: parseInt(id),
          completed_c: !current.completed
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
          console.error(`Failed to toggle ${failed.length} assignment(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            courseId: updated.course_id_c?.Id || null,
            courseName: updated.course_id_c?.name_c || '',
            title: updated.title_c || '',
            dueDate: updated.due_date_c,
            priority: updated.priority_c || 'medium',
            completed: updated.completed_c || false,
            description: updated.description_c || '',
            createdAt: updated.created_at_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error toggling assignment:", error?.response?.data?.message || error);
      toast.error("Failed to toggle assignment");
      return null;
    }
  },

  async deleteByCourseId(courseId) {
    try {
      const assignments = await this.getByCourseId(courseId);
      
      if (assignments.length === 0) {
        return true;
      }

      const recordIds = assignments.map(a => a.Id);
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
          console.error(`Failed to delete ${failed.length} assignment(s):${JSON.stringify(failed)}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting assignments by course:", error?.response?.data?.message || error);
return false;
    }
  }
};

export default assignmentService;