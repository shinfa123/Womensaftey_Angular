export interface Department {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  age: number;
  place: string;
  semester: number;
  department: Department;
  batch: number;
  phoneno: string;
  email: string;
  userName: string;
  password: string;
  isAdmin: boolean;
}
