export interface Department {
  id: number;
  departmentName: string;
}

export interface User {
  id: number;
  name: string;
  age: number;
  place: string;
  semester: number;
  department: Department | null;
  batch: number;
  phoneno: string;
  email: string;
  userName: string;
  password: string;
  isAdmin: boolean;
  isActive: boolean;
}
