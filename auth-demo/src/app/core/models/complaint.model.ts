export interface Department {
  id: number;
  name: string;
}

export interface MyUser {
  id?: number;
  name: string;
  age: number;
  place: string;
  department: Department;
  batch: number;
  semester: number;
  phoneno: string;
  email: string;
}

export interface Complaint {
  timeStamp: string; // LocalDateTime from backend will be received as string
  user: MyUser;
  status: string;
  location: string;
  complaintType: string;
  comment: string;
  isNewlyUpdated?: boolean; // Flag to indicate if complaint was recently edited
  newlyUpdated?: boolean; // Alternative property name for backend compatibility
  isNewlyUpdatedForAdmin?: boolean; // Flag to indicate if complaint is newly created for admin notification
}
