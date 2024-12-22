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
import { PlusOutlined } from "@ant-design/icons";
import { RoomInterface } from "../../../interfaces/IRoom";
import { CreateRoom } from "../../../services/https/RoomAPI";
import { GetTrainers } from "../../../services/https/TainerAPI";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { TrainersInterface } from "../../../interfaces/ITrainer";

function RoomCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [trainers, setTrainers] = useState<TrainersInterface[]>([]);

  // ฟังก์ชันดึงข้อมูลเทรนเนอร์
  const fetchTrainers = async () => {
    try {
      const res = await GetTrainers();
      console.log("Trainer Response:", res);
  
      if (res && res.status === 200 && res.data) {
        const mappedTrainers = res.data.map((trainer: any) => ({
          ID: trainer.ID,
          FirstName: trainer.FirstName || "ไม่มีชื่อ",
          LastName: trainer.LastName || "ไม่มีนามสกุล",
          message: "", // เพิ่มค่า message ให้มีค่าเริ่มต้นที่ว่างเปล่า
        }));
        setTrainers(mappedTrainers);
      } else {
        messageApi.error(res.error || "ไม่สามารถดึงข้อมูลเทรนเนอร์ได้");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับ API");
      console.error("Error fetching trainers:", error);
    }
  };  

  // ฟังก์ชันบันทึกข้อมูลห้องใหม่
  const onFinish = async (values: RoomInterface) => {
    const payload = {
      room_name: values.RoomName || "",
      capacity: values.Capacity || 0,
      trainer_id: values.TrainerID || 0,
      detail: values.Detail || "",
    };

    console.log("Payload ส่งไปยัง Backend:", payload);

    try {
      const res = await CreateRoom(payload);

      if (res && res.status === 201) {
        messageApi.success(res.data?.message || "สร้างห้องสำเร็จ");
        setTimeout(() => navigate("/rooms"), 2000);
      } else {
        console.error("Response Error:", res?.data);
        messageApi.error(res?.error || "ไม่สามารถบันทึกข้อมูลได้");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      messageApi.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>เพิ่มข้อมูลห้อง</h2>
        <Divider />
        <Form name="basic" layout="vertical" onFinish={onFinish}>
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="ชื่อห้อง"
                name="RoomName"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่อห้อง",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="ความจุ"
                name="Capacity"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกความจุ",
                  },
                ]}
              >
                <InputNumber min={1} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="เทรนเนอร์"
                name="TrainerID"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกเทรนเนอร์",
                  },
                ]}
              >
                <Select placeholder="เลือกเทรนเนอร์">
                  {trainers.map((trainer) => (
                    <Select.Option key={trainer.ID} value={trainer.ID}>
                      {`${trainer.FirstName} ${trainer.LastName}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="รายละเอียด"
                name="Detail"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกรายละเอียดของห้อง",
                  },
                ]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Col>
              <Space>
                <Link to="/rooms">
                  <Button>ยกเลิก</Button>
                </Link>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                >
                  บันทึก
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default RoomCreate;
