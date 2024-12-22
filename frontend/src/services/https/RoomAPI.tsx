import { RoomInterface } from "../../interfaces/IRoom";

const apiUrl = "http://localhost:8080";

// ดึงข้อมูลห้องทั้งหมด
export async function GetRooms() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const res = await fetch(`${apiUrl}/rooms`, requestOptions); // แก้เป็น /rooms
    if (res.ok) {
      return await res.json(); // แปลงผลลัพธ์เป็น JSON หากสำเร็จ
    } else {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลห้อง");
      return false;
    }
  } catch (error) {
    console.error("ข้อผิดพลาด:", error);
    return false;
  }
}

// ดึงข้อมูลห้องตาม ID
export async function GetRoomById(id: number | undefined) {
  if (!id) {
    throw new Error("กรุณาระบุ ID ของห้อง");
  }

  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const res = await fetch(`${apiUrl}/rooms/${id}`, requestOptions); // แก้เป็น /rooms
    if (res.ok) {
      return await res.json(); // แปลงผลลัพธ์เป็น JSON หากสำเร็จ
    } else {
      console.error("ไม่พบข้อมูลห้อง ID นี้");
      return false;
    }
  } catch (error) {
    console.error("ข้อผิดพลาด:", error);
    return false;
  }
}

// สร้างห้องใหม่
export async function CreateRoom(data: RoomInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${apiUrl}/rooms`, requestOptions); // แก้เป็น /rooms
    if (res.ok) {
      return await res.json(); // แปลงผลลัพธ์เป็น JSON หากสำเร็จ
    } else {
      console.error("ไม่สามารถสร้างห้องได้");
      return false;
    }
  } catch (error) {
    console.error("ข้อผิดพลาด:", error);
    return false;
  }
}

// อัปเดตข้อมูลห้อง
export async function UpdateRoomById(id: number, data: RoomInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${apiUrl}/rooms/${id}`, requestOptions); // แก้เป็น /rooms
    if (res.ok) {
      return await res.json(); // แปลงผลลัพธ์เป็น JSON หากสำเร็จ
    } else {
      console.error("ไม่สามารถอัปเดตข้อมูลห้องได้");
      return false;
    }
  } catch (error) {
    console.error("ข้อผิดพลาด:", error);
    return false;
  }
}

// ลบห้อง
export async function DeleteRoomById(id: number) {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const res = await fetch(`${apiUrl}/rooms/${id}`, requestOptions); // แก้เป็น /rooms
    if (res.ok) {
      return { status: res.status };
    } else {
      console.error("ไม่สามารถลบห้องได้");
      return { status: res.status, error: true };
    }
  } catch (error) {
    console.error("ข้อผิดพลาด:", error);
    return { status: 500, error: true };
  }
}
