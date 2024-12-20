import { useState, useEffect } from "react";
import { CreateTrainbook } from "../../../services/https/TrainBookAPI";
import { GetRoomById } from "../../../services/https/RoomAPI";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, message } from "antd";
import { TrainbookInterface } from "../../../interfaces/ITrainbook";

function Trainbook() {
  const { id } = useParams(); // รับค่า ID ห้องจาก URL
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // ฟังก์ชันดึงข้อมูลห้อง
  const fetchRoomDetails = async () => {
    try {
      const res = await GetRoomById(Number(id));
      if (res.status === 200) {
        setRoom(res.data);
      } else {
        messageApi.error("ไม่พบข้อมูลห้อง");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  // ฟังก์ชันสำหรับการจองห้อง
  const handleBooking = async () => {
    if (!room) return;
  
    try {
      const userID = localStorage.getItem("driver_id"); // ตรวจสอบว่า Driver ID ถูกดึงมา
      if (!userID) {
        message.error("ไม่พบข้อมูลผู้ขับ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
        return;
      }
  
      const trainbook: TrainbookInterface = {
        RoomID: Number(id),
        DriverID: Number(userID),
        Status: "Confirmed",
      };
  
      const res = await CreateTrainbook(trainbook);
  
      if (res.status === 201 || res.status === 200) {
        message.success("ยืนยันการจองสำเร็จ!");
        navigate("/room"); // กลับไปยังหน้า Room
      } else {
        message.error(res.data?.error || "เกิดข้อผิดพลาดในการจองห้อง");
      }
    } catch (error) {
      console.error("Booking error:", error);
      message.error("เกิดข้อผิดพลาดในการจองห้อง");
    }
  };  

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <Card title="รายละเอียดห้องที่ต้องการจอง" bordered>
        {room ? (
          <div>
            <p>
              <strong>ชื่อห้อง:</strong> {room.room_name}
            </p>
            <p>
              <strong>ความจุ:</strong> {room.current_bookings}/{room.capacity}
            </p>
            <p>
              <strong>เทรนเนอร์:</strong>{" "}
              {room.trainer
                ? `${room.trainer.first_name} ${room.trainer.last_name}`
                : "ไม่มีเทรนเนอร์"}
            </p>
            <p>
              <strong>รายละเอียด:</strong>{" "}
              {room.detail || "ไม่มีรายละเอียด"}
            </p>
          </div>
        ) : (
          <p>กำลังโหลดข้อมูล...</p>
        )}
      </Card>
      <div style={{ marginTop: "20px" }}>
        <Button type="primary" onClick={handleBooking}>
          ยืนยันการจอง
        </Button>
        <Button style={{ marginLeft: "10px" }} onClick={() => navigate("/room")}>
          กลับ
        </Button>
      </div>
    </div>
  );
}

export default Trainbook;
