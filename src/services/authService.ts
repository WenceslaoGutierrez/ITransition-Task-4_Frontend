const API_BASE_URL = 'https://itransition-task-4backend-production.up.railway.app/api/users';

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  job_title?: string | null;
  company?: string | null;
}

export interface AuthSuccessResponse {
  message: string;
  token: string;
  userId?: number;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  job_title?: string;
  company?: string;
}

async function handleApiResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`);
  return data;
}

export async function login(credentials: LoginCredentials): Promise<AuthSuccessResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  return handleApiResponse(response);
}

export async function register(userData: RegisterData): Promise<AuthSuccessResponse> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  return handleApiResponse(response);
}

export async function logout(token: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  return handleApiResponse(response);
}
