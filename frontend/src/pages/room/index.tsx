import { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  Col,
  Row,
  Divider,
  message,
  Empty,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetRooms, DeleteRoomById } from "../../services/https/RoomAPI";
import { RoomInterface } from "../../interfaces/IRoom";
import { Link, useNavigate } from "react-router-dom";

function Rooms() {
  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const userRole = "admin"; // สมมติว่ามีตัวแปรกำหนดสิทธิ์ของผู้ใช้

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await GetRooms();
      if (res && Array.isArray(res)) {
        const mappedRooms = res.map((room: any) => ({
          ID: room.ID,
          RoomName: room.room_name,
          Capacity: room.capacity,
          CurrentBookings: room.current_bookings || 0,
        }));
        setRooms(mappedRooms);
      } else {
        messageApi.error("ไม่สามารถดึงข้อมูลได้");
        setRooms([]);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      console.error("Error fetching rooms:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await DeleteRoomById(id);
      if (res && res.status === 200) {
        messageApi.success("ลบห้องสำเร็จ");
        fetchRooms();
      } else {
        messageApi.error("ไม่สามารถลบห้องได้");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการลบห้อง");
      console.error("Error deleting room:", error);
    }
  };

  const handleBooking = (id: number) => {
    navigate(`/rooms/trainbook/${id}`);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const columns: ColumnsType<RoomInterface> = [
    {
      title: "ลำดับ",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "ชื่อห้อง",
      dataIndex: "RoomName",
      key: "RoomName",
    },
    {
      title: "ความจุ",
      key: "Capacity",
      render: (record: RoomInterface) =>
        `${record.CurrentBookings}/${record.Capacity}`,
    },
    {
      title: "การกระทำ",
      key: "actions",
      render: (record: RoomInterface) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleBooking(record.ID!)}
          >
            จอง
          </Button>
          {userRole === "admin" && (
            <>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate(`/rooms/edit/${record.ID}`)}
              >
                แก้ไข
              </Button>
              <Popconfirm
                title="ยืนยันการลบห้อง?"
                onConfirm={() =>
                  record.ID !== undefined && handleDelete(record.ID)
                }
                okText="ใช่"
                cancelText="ไม่"
              >
                <Button danger icon={<DeleteOutlined />}>
                  ลบ
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>จัดการข้อมูลห้อง</h2>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          {userRole === "admin" && (
            <Space>
              <Link to="/">
                <Button type="default" icon={<HomeOutlined />}>
                  หน้าแรก
                </Button>
              </Link>
              <Link to="/rooms/create">
                <Button type="primary" icon={<PlusOutlined />}>
                  สร้างห้อง
                </Button>
              </Link>
            </Space>
          )}
        </Col>
      </Row>
      <Divider />
      {rooms.length === 0 && !loading ? (
        <Empty description="ไม่มีข้อมูลห้องในขณะนี้" />
      ) : (
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={rooms}
          loading={loading}
          style={{ width: "100%", marginTop: "20px" }}
        />
      )}
    </>
  );
}

export default Rooms;
