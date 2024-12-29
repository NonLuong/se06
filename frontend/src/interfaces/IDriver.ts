export interface IDriver {
  id?: number; // สำหรับการอัปเดตหรือดึงข้อมูล
  firstname: string;
  lastname: string;
  phoneNumber: string;
  dateOfBirth: string; // รูปแบบ "YYYY-MM-DD"
  identificationNumber: string;
  driverLicenseNumber: string;
  driverLicenseExpirationDate: string; // รูปแบบ "YYYY-MM-DD"
  income: number;
  profile?: string; // อาจไม่มีรูปโปรไฟล์
  email: string;
  password: string;
  genderId: number; // อ้างอิง ID ของ Gender
  statusId?: number; // อาจไม่มี
  employeeId: number;
  locationId?: number; // อาจไม่มี
  rolesId: number;
  vehicleId: number;
}
