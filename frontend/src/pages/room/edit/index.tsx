import { useState, useEffect } from "react";
import {
  Space,
  Button,
  Divider,
  Form,
  Input,
  Card,
  message,
  InputNumber,
  Select,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { GetRoomById, UpdateRoomById } from "../../../services/https/RoomAPI";
import { GetTrainers } from "../../../services/https/TainerAPI";
import { RoomInterface } from "../../../interfaces/IRoom";
import { TrainersInterface } from "../../../interfaces/ITrainer";

const RoomEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [trainers, setTrainers] = useState<TrainersInterface[]>([]);

  // ฟังก์ชันดึงข้อมูลเทรนเนอร์
  const fetchTrainers = async () => {
    try {
      const res = await GetTrainers();
      if (res.status === 200 && Array.isArray(res.data)) {
        setTrainers(res.data);
      } else {
        messageApi.error("ไม่สามารถดึงข้อมูลเทรนเนอร์ได้");
      }
    } catch (error) {
      console.error("Error fetching trainers:", error);
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลเทรนเนอร์");
    }
  };

  // ฟังก์ชันดึงข้อมูลห้อง
  const getRoomById = async (id: string) => {
    try {
      const res = await GetRoomById(Number(id));
      if (res.status === 200) {
        form.setFieldsValue({
          RoomName: res.data.room_name,
          Capacity: res.data.capacity,
          TrainerID: res.data.trainer_id,
        });
      } else {
        messageApi.error("ไม่พบข้อมูลห้อง");
        navigate("/rooms");
      }
    } catch (error) {
      console.error("Error fetching room by ID:", error);
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลห้อง");
      navigate("/rooms");
    }
  };

  // ฟังก์ชันบันทึกข้อมูลที่แก้ไข
  const onFinish = async (values: RoomInterface) => {
    try {
      const payload = {
        room_name: values.RoomName,
        capacity: values.Capacity,
        trainer_id: values.TrainerID,
      };
      const res = await UpdateRoomById(Number(id), payload);
      if (res.status === 200) {
        messageApi.success("แก้ไขข้อมูลสำเร็จ");
        navigate("/rooms");
      } else {
        messageApi.error(res?.data?.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      messageApi.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  useEffect(() => {
    fetchTrainers();
    if (id) getRoomById(id);
  }, [id]);

  return (
    <>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูลห้อง</h2>
        <Divider />
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="RoomName"
            label="ชื่อห้อง"
            rules={[{ required: true, message: "กรุณากรอกชื่อห้อง" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Capacity"
            label="ความจุ"
            rules={[{ required: true, message: "กรุณากรอกความจุ" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="TrainerID"
            label="เทรนเนอร์"
            rules={[{ required: true, message: "กรุณาเลือกเทรนเนอร์" }]}
          >
            <Select placeholder="เลือกเทรนเนอร์">
              {trainers.map((trainer) => (
                <Select.Option key={trainer.ID} value={trainer.ID}>
                  {trainer.FirstName} {trainer.LastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => navigate("/rooms")}>ยกเลิก</Button>
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default RoomEdit;
