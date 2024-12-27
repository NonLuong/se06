import { EmployeeInterface } from "../../../interfaces/IEmployee";
import axios from "axios";

const apiUrl = "http://localhost:8080";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Create Employee
async function createEmployee(data: EmployeeInterface) {
  const requestOptions = {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/employees`, requestOptions);
    console.log(response)
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating employee:", error);
    return { status: 500, message: "Server Error" };
  }
}


// List Employees
async function listEmployees() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/employees`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error listing employees:", error);
    return [];
  }
}

// List Genders
async function listGenders() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/gender`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error listing genders:", error);
    return [];
  }
}

// List Positions
async function listPositions() {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/positions`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error listing positions:", error);
    return [];
  }
}

// Delete Employee
async function deleteEmployee(id: number) {
  const requestOptions = {
    method: "DELETE",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/employee/${id}`, requestOptions);
    return response.ok;
  } catch (error) {
    console.error("Error deleting employee:", error);
    return false;
  }
}

// service/https/Employee/index.ts
export const updateEmployee = async (employee: EmployeeInterface) => {
  try {
    const response = await axios.put(`/employees/${employee.id}`, employee);
    return response;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

// Get Employee by ID
export const getEmployee = async (id: string | number) => {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),
  };

  try {
    const response = await fetch(`${apiUrl}/employees/${id}`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    throw error;
  }
};


export {
  createEmployee,
  listEmployees,
  listGenders,
  listPositions,
  deleteEmployee,
};
