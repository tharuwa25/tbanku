export interface Asset {
  id: number;
  name:string;
  originalValue: number;
  date: string;
  description: string;
  location: string;
  currentValue: number;

}

const API_BASE_URL = '/api/assets';


export async function getAllAssets(): Promise<Asset[]> {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch assets');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading assets data:', error);
    throw error;
  }
}


export async function addAssets(newAssets: Omit<Asset, 'id'>): Promise<Asset> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAssets),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add assets');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding assets:', error);
    throw error;
  }
}

export async function deleteAssets(id: number): Promise<void> {
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
      throw new Error(error.error || 'Failed to delete assets');
    }
  } catch (error) {
    console.error('Error deleting assets:', error);
    throw error;
  }
}

export async function updateAssets(updatedAssets: Asset): Promise<Asset> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAssets),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update assets');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating assets:', error);
    throw error;
  }
} 