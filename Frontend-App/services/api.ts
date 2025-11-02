// API Service for backend communication
import { buildUrl, API_ENDPOINTS } from '../config/api';

// User API
export const userApi = {
  createUser: async (name: string, email: string) => {
    const response = await fetch(buildUrl(API_ENDPOINTS.USERS), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create user');
    }

    return response.json();
  },

  searchUsers: async (criteria: { name?: string; email?: string }) => {
    const response = await fetch(buildUrl(API_ENDPOINTS.USER_SEARCH), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(criteria),
    });

    if (!response.ok) {
      throw new Error('Failed to search users');
    }

    return response.json();
  },
};

// Expense API
export const expenseApi = {
  processAudio: async (audioFile: any, userId: number) => {
    const formData = new FormData();
    formData.append('file', audioFile);

    const response = await fetch(
      `${buildUrl(API_ENDPOINTS.PROCESS_AUDIO)}?user_id=${userId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to process audio');
    }

    return response.json();
  },

  getExpenses: async (userId: number) => {
    const response = await fetch(buildUrl(API_ENDPOINTS.GET_EXPENSES), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    return response.json();
  },

  updateExpense: async (expenseId: number, data: {
    amount: number;
    description: string;
    category_id: number;
    user_id: number;
  }) => {
    const response = await fetch(buildUrl(`${API_ENDPOINTS.UPDATE_EXPENSE}${expenseId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update expense');
    }

    return response.json();
  },

  deleteExpense: async (expenseId: number) => {
    const response = await fetch(buildUrl(`${API_ENDPOINTS.DELETE_EXPENSE}${expenseId}`), {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete expense');
    }

    return response.json();
  },
};

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
