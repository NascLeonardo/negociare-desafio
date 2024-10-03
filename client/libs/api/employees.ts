// lib/api.ts
interface Employee {
  id: number;
  name: string;
  days_worked: number;
  hour_cost: number;
  hours_worked: number;
}

export const fetchEmployees = async (page: number = 1, query: string = "", orderBy: string = "") => {
    const url = 'http://127.0.0.1:8000/api/employee'
    const response = await fetch(url + '?page=' + page + '&query=' + query + '&orderBy=' + orderBy);

    if (!response.ok) {
        throw new Error("Failed to fetch employees");
    }
    return response.json();
};

export const deleteEmployees = async (id: number) => {
    const url = 'http://127.0.0.1:8000/api/employee'
    try {
        const response = await fetch(url + `/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            return false
        }
        return true
        // Refresh or update state
    } catch (error) {
        console.error(error);
        return false
    }
};

export const updateEmployees = async (id: number, employee: Employee) => {
    const url = 'http://127.0.0.1:8000/api/employee'
    const response = await fetch(url + `/${employee.id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
    });
    if (!response.ok) {
        return false
    } else {
        return true
    }
};

export const createEmployees = async (employee: Employee) => {
    const url = 'http://127.0.0.1:8000/api/employee'
    const response = await fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(employee),
    });
    if (!response.ok) {
        return false
    } else {
        return true
    }
};

