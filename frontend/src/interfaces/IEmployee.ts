export interface IEmployee {
  id: number;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  dateOfBirth: string; // ต้องเป็น string ที่มีรูปแบบ YYYY-MM-DD
  startDate: string;   // ต้องเป็น string ที่มีรูปแบบ YYYY-MM-DD
  salary: number;
  profile: string;
  email: string;
  password: string;
  positionId: number;
  genderId: number;
}
