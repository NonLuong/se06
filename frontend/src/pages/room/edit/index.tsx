import { useState, useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
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
  
    const fetchTrainers = async () => {
      const res = await GetTrainers();
      if (res.status === 200) setTrainers(res.data);
    };
  
    const getRoomById = async (id: string) => {
      const res = await GetRoomById(Number(id));
      if (res.status === 200) {
        form.setFieldsValue(res.data);
      } else {
        messageApi.error("ไม่พบข้อมูลห้อง");
        navigate("/room");
      }
    };
  
    const onFinish = async (values: RoomInterface) => {
      const res = await UpdateRoomById(Number(id), values);
      if (res.status === 200) {
        messageApi.success("แก้ไขข้อมูลสำเร็จ");
        navigate("/room");
      } else {
        messageApi.error("เกิดข้อผิดพลาด");
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
          <Form form={form} onFinish={onFinish}>
            <Form.Item name="RoomName" label="ชื่อห้อง" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="Capacity" label="ความจุ" rules={[{ required: true }]}>
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item name="TrainerID" label="เทรนเนอร์" rules={[{ required: true }]}>
              <Select>
                {trainers.map((trainer) => (
                  <Select.Option key={trainer.ID} value={trainer.ID}>
                    {trainer.FirstName} {trainer.LastName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button onClick={() => navigate("/room")}>ยกเลิก</Button>
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
