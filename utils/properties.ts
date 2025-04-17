export interface Property {
  id: number;
  name: string;
  location: string;
  date: string;
  value: number;         // Add this
  usedtime: number;      // Add this if not present
  worth: number;         // Add this if not present
  description: string;
}

const API_BASE_URL = '/api/properties';

export async function getAllProperty(): Promise<Property[]> {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch Property');
    }
    return await response.json();
  } catch (error) {
    console.error('Error reading property data:', error);
    throw error;
  }
}

export async function addProperty(newProperty: Omit<Property, 'id'>): Promise<Property> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProperty),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add property');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
}

export async function deleteProperty(id: number): Promise<void> {
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
      throw new Error(error.error || 'Failed to delete property');
    }
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
}

export async function updateProperty(updatedProperty: Property): Promise<Property> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProperty),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update property');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
} 