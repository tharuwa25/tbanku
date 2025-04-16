export interface Income {
  id: number;
  amount: number;
  source: string;
  date: string;
  description: string;
}

const API_BASE_URL = '/api/income';

export async function getAllIncomes(): Promise<Income[]> {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch incomes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading income data:', error);
    throw error;
  }
}

export async function addIncome(newIncome: Omit<Income, 'id'>): Promise<Income> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newIncome),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add income');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding income:', error);
    throw error;
  }
}

export async function deleteIncome(id: number): Promise<void> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete income');
    }
  } catch (error) {
    console.error('Error deleting income:', error);
    throw error;
  }
}

export async function updateIncome(updatedIncome: Income): Promise<Income> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedIncome),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update income');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating income:', error);
    throw error;
  }
} 