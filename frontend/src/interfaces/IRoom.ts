import { TrainersInterface } from "./ITrainer"; // Import TrainersInterface

export interface RoomInterface {
  ID?: number; // ลำดับห้อง
  RoomName?: string; // ชื่อห้อง (ใช้ใน Frontend)
  room_name?: string; // ชื่อห้อง (ใช้ใน API)
  Capacity?: number; // ความจุ (ใช้ใน Frontend)
  capacity?: number; // ความจุ (ใช้ใน API)
  TrainerID?: number; // ID ของเทรนเนอร์
  Trainer?: TrainersInterface; // ความสัมพันธ์กับ TrainersInterface
  Detail?: string; // รายละเอียดของห้อง (ใช้ใน Frontend)
  detail?: string; // รายละเอียดของห้อง (ใช้ใน API)
  CurrentBookings?: number; // จำนวนผู้จอง (ใช้ใน Frontend)
  current_bookings?: number; // จำนวนผู้จอง (ใช้ใน API)
}
