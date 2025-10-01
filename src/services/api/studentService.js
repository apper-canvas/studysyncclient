import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'student_c';
export const studentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "major_c" } },
          { field: { Name: "gpa_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } }
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

      return response.data.map(student => ({
        Id: student.Id,
        name: student.name_c || '',
        email: student.email_c || '',
        major: student.major_c || '',
        gpa: student.gpa_c || 0,
        enrollmentDate: student.enrollment_date_c,
        status: student.status_c || 'Active'
      }));
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      toast.error("Failed to load students");
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "major_c" } },
          { field: { Name: "gpa_c" } },
          { field: { Name: "enrollment_date_c" } },
          { field: { Name: "status_c" } }
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);

      if (!response.success || !response.data) {
        throw new Error("Student not found");
      }

      const student = response.data;
      return {
        Id: student.Id,
        name: student.name_c || '',
        email: student.email_c || '',
        major: student.major_c || '',
        gpa: student.gpa_c || 0,
        enrollmentDate: student.enrollment_date_c,
        status: student.status_c || 'Active'
      };
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      throw new Error("Student not found");
    }
  },

async create(studentData) {
    try {
      const params = {
        records: [{
          name_c: studentData.name,
          email_c: studentData.email,
          major_c: studentData.major,
          gpa_c: parseFloat(studentData.gpa),
          enrollment_date_c: studentData.enrollmentDate,
          status_c: studentData.status
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
          console.error(`Failed to create ${failed.length} student(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          toast.success("Student created successfully");
          
          // Create corresponding contact in CompanyHub
          try {
            const companyHubResult = await apperClient.functions.invoke(
              import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT,
              {
                body: JSON.stringify(created),
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
            
            if (companyHubResult.success) {
              const responseData = await companyHubResult.json();
              if (responseData.success) {
                toast.success('Contact created in CompanyHub');
              } else {
                console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT}. The response body is: ${JSON.stringify(responseData)}.`);
                toast.info('Student created, but CompanyHub sync failed');
              }
            }
          } catch (error) {
            console.info(`apper_info: An error was received in this function: ${import.meta.env.VITE_CREATE_COMPANYHUB_CONTACT}. The error is: ${error.message}`);
            toast.info('Student created, but CompanyHub sync failed');
          }
          
          return {
            Id: created.Id,
            name: created.name_c || '',
            email: created.email_c || '',
            major: created.major_c || '',
            gpa: created.gpa_c || 0,
            enrollmentDate: created.enrollment_date_c,
            status: created.status_c || 'Active'
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      toast.error("Failed to create student");
      return null;
    }
  },

  async update(id, studentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: studentData.name,
          email_c: studentData.email,
          major_c: studentData.major,
          gpa_c: parseFloat(studentData.gpa),
          enrollment_date_c: studentData.enrollmentDate,
          status_c: studentData.status
        }]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update student");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} student(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update student");
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          toast.success("Student updated successfully");
          return {
            Id: updated.Id,
            name: updated.name_c || '',
            email: updated.email_c || '',
            major: updated.major_c || '',
            gpa: updated.gpa_c || 0,
            enrollmentDate: updated.enrollment_date_c,
            status: updated.status_c || 'Active'
          };
        }
      }

      throw new Error("Failed to update student");
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
      toast.error("Failed to update student");
      throw new Error("Failed to update student");
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
        throw new Error("Failed to delete student");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} student(s):${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete student");
        }

        toast.success("Student deleted successfully");
        return successful.length === 1;
      }

      throw new Error("Failed to delete student");
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      toast.error("Failed to delete student");
      throw new Error("Failed to delete student");
    }
  }
};