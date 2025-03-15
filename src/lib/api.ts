
import { toast } from "sonner";

// Base URL for API calls
const API_BASE_URL = "http://localhost:8000";

// Types
export interface User {
  id: number;
  username: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

export interface Income {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

export interface ExpenseSummary {
  date: string;
  total_income: number;
  total_expenses: number;
}

export interface ExpenseByCategory {
  category_name: string;
  total_amount: number;
}

// Helper for making authenticated API requests
const api = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // For 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Something went wrong");
    }

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred";
    toast.error(message);
    throw error;
  }
};

// Auth API calls
export const register = async (username: string, password: string): Promise<User> => {
  return api("/users", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};

export const login = async (username: string, password: string): Promise<{access_token: string; token_type: string}> => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  return fetch(`${API_BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  }).then(async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Login failed");
    }
    return response.json();
  });
};

// Expense Categories API calls
export const getCategories = async (): Promise<Category[]> => {
  return api("/categories");
};

export const createCategory = async (name: string): Promise<Category> => {
  return api("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
};

// Expenses API calls
export const getExpenses = async (): Promise<Expense[]> => {
  return api("/expenses");
};

export const createExpense = async (expense: Omit<Expense, "id">): Promise<Expense> => {
  return api("/expenses", {
    method: "POST",
    body: JSON.stringify(expense),
  });
};

export const deleteExpense = async (id: number): Promise<void> => {
  return api(`/expenses/${id}`, {
    method: "DELETE",
  });
};

// Income Categories API calls
export const getIncomeCategories = async (): Promise<Category[]> => {
  return api("/income-categories");
};

export const createIncomeCategory = async (name: string): Promise<Category> => {
  return api("/income-categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
};

// Income API calls
export const getIncome = async (): Promise<Income[]> => {
  return api("/income");
};

export const createIncome = async (income: Omit<Income, "id">): Promise<Income> => {
  return api("/income", {
    method: "POST",
    body: JSON.stringify(income),
  });
};

export const deleteIncome = async (id: number): Promise<void> => {
  return api(`/income/${id}`, {
    method: "DELETE",
  });
};

// Summary API calls for visualizations
export const getIncomeExpensesSummary = async (
  startDate?: string,
  endDate?: string
): Promise<ExpenseSummary[]> => {
  let endpoint = "/summary/income-expenses";
  
  if (startDate || endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    endpoint += `?${params.toString()}`;
  }
  
  return api(endpoint);
};

export const getExpensesByCategory = async (
  startDate?: string,
  endDate?: string
): Promise<ExpenseByCategory[]> => {
  let endpoint = "/summary/expenses-by-category";
  
  if (startDate || endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    endpoint += `?${params.toString()}`;
  }
  
  return api(endpoint);
};
