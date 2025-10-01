import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'course_c';

const courseService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "credits_c" } },
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

      return response.data.map(course => ({
        Id: course.Id,
        name: course.name_c || '',
        color: course.color_c || '#6366f1',
        instructor: course.instructor_c || '',
        credits: course.credits_c || 0,
        createdAt: course.created_at_c
      }));
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      toast.error("Failed to load courses");
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);

      if (!response.success || !response.data) {
        return null;
      }

      const course = response.data;
      return {
        Id: course.Id,
        name: course.name_c || '',
        color: course.color_c || '#6366f1',
        instructor: course.instructor_c || '',
        credits: course.credits_c || 0,
        createdAt: course.created_at_c
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(courseData) {
    try {
      const params = {
        records: [{
          name_c: courseData.name,
          color_c: courseData.color,
          instructor_c: courseData.instructor,
          credits_c: parseInt(courseData.credits)
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
          console.error(`Failed to create ${failed.length} course(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          toast.success("Course created successfully");
          return {
            Id: created.Id,
            name: created.name_c || '',
            color: created.color_c || '#6366f1',
            instructor: created.instructor_c || '',
            credits: created.credits_c || 0,
            createdAt: created.created_at_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      toast.error("Failed to create course");
      return null;
    }
  },

  async update(id, courseData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: courseData.name,
          color_c: courseData.color,
          instructor_c: courseData.instructor,
          credits_c: parseInt(courseData.credits)
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
          console.error(`Failed to update ${failed.length} course(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          toast.success("Course updated successfully");
          return {
            Id: updated.Id,
            name: updated.name_c || '',
            color: updated.color_c || '#6366f1',
            instructor: updated.instructor_c || '',
            credits: updated.credits_c || 0,
            createdAt: updated.created_at_c
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
      toast.error("Failed to update course");
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
          console.error(`Failed to delete ${failed.length} course(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        toast.success("Course deleted successfully");
        return successful.length === 1;
      }

      return false;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      toast.error("Failed to delete course");
      return false;
    }
  }
};
export default courseService;