export interface Income {
  id: number;
  amount: number;
  source: string;
  date: string;
  description: string;
}

// const API_BASE_URL = 'http://127.0.0.1:5000/income';

// export async function getAllIncomes(): Promise<Income[]> {
//   try {
//     const response = await fetch(API_BASE_URL);
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to fetch incomes');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error reading income data:', error);
//     throw error;
//   }
// }

// export async function addIncome(newIncome: Omit<Income, 'id'>): Promise<Income> {
//   try {
//     const response = await fetch(API_BASE_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newIncome),
//     });
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to add income');
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error adding income:', error);
//     throw error;
//   }
// }

// export async function deleteIncome(id: number): Promise<void> {
//   try {
//     const response = await fetch(API_BASE_URL, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ id }),
//     });
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to delete income');
//     }
//   } catch (error) {
//     console.error('Error deleting income:', error);
//     throw error;
//   }
// }

// export async function updateIncome(updatedIncome: Income): Promise<Income> {
//   try {
//     const response = await fetch(API_BASE_URL, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(updatedIncome),
//     });
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to update income');
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error updating income:', error);
//     throw error;
//   }
// } 


export async function getAllIncome(): Promise<Income[]> {
  try {
    const response = await fetch('http://localhost:5000/income');
    if (!response.ok) {
      throw new Error('Failed to fetch income');
    }
    const data = await response.json();
    return data.income || [];
  } catch (error) {
    console.error('Error fetching income:', error);
    return [];
  }
}

export async function addIncome(income: Omit<Income, 'id'>): Promise<Income | null> {
  try {
    const res = await fetch('http://localhost:5000/income', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: income.amount,
        source: income.source,
        date: income.date,
        description: income.description,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to add income');
    }

    return await res.json();
  } catch (err) {
    console.error('Error in addProperty:', err);
    return null;
  }
  
  // try {
  //   const response = await fetch('http://localhost:5000/income', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(income),
  //   });

  //   console.log('income', income)

  //   if (!response.ok) {
  //     throw new Error('Failed to add income');
  //   }

  //   return await response.json();
  // } catch (error) {
  //   console.error('Error adding income:', error);
  //   return null;
  // }
}

export async function getIncomeByDateRange(startDate: string, endDate: string): Promise<Income[]> {
  const income = await getAllIncome();
  return income.filter(income => {
    const incomeDate = new Date(income.date);
    return incomeDate >= new Date(startDate) && incomeDate <= new Date(endDate);
  });
}

export async function getIncomeByCategory(category: string): Promise<Income[]> {
  const income = await getAllIncome();
  return income.filter(income => income.category === category);
} 