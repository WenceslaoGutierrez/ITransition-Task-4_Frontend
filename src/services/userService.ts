import type { UserData } from '@/components/UserTable/UserTable';

const API_BASE_URL = 'https://itransition-task-4backend-production.up.railway.app/api/users';

interface GetAllUsersResponse {
  message: string;
  count: number;
  users: UserData[];
}

interface BulkActionResponse {
  message: string;
  affectedRows?: number;
}

export async function getAllUsers(token: string, sortBy?: string, sortOrder?: string): Promise<GetAllUsersResponse> {
  const params = new URLSearchParams();
  if (sortBy) params.append('sortBy', sortBy);
  if (sortOrder) params.append('sortOrder', sortOrder);

  const url = `${API_BASE_URL}/dashboard${params.toString() ? `?${params.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch users');
  }
  return data as GetAllUsersResponse;
}

export async function deleteMultipleUsers(token: string, userIds: number[]): Promise<BulkActionResponse> {
  const response = await fetch(`${API_BASE_URL}/bulk-delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userIds })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete users');
  }
  return data as BulkActionResponse;
}

export async function updateMultipleUsersStatus(token: string, userIds: number[], status: 'active' | 'blocked'): Promise<BulkActionResponse> {
  const response = await fetch(`${API_BASE_URL}/bulk-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userIds, status })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update user statuses');
  }
  return data as BulkActionResponse;
}
