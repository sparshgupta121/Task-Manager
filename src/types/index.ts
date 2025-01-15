export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  dueDate:string | any;
  isEditing?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}