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
  DatePicker,
  InputNumber,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { TrainersInterface } from "../../../interfaces/ITrainer";
import { Gender } from "../../../interfaces/IGender";
import { GetTrainerById, UpdateTrainerById,} from "../../../services/https/TainerAPI";
//import { GetGender };
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

function TrainerEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [gender, setGender] = useState<Gender[]>([]);
  const [form] = Form.useForm();

  // ดึงข้อมูลเพศ
  const fetchGenders = async () => {
    try {
      const res = await GetGender();
      if (res.status === 200) {
        setGender(res.data);
      } else {
        messageApi.error("ไม่สามารถดึงข้อมูลเพศได้");
        setTimeout(() => navigate("/trainers"), 2000);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  // ดึงข้อมูลเทรนเนอร์ตาม ID
  const fetchTrainerById = async (trainerId: string) => {
    try {
      const res = await GetTrainerById(trainerId);
      if (res.status === 200) {
        form.setFieldsValue({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          email: res.data.email,
          birthday: dayjs(res.data.birthday),
          age: res.data.age,
          gender_id: res.data.gender_id,
        });
      } else {
        messageApi.error("ไม่พบข้อมูลเทรนเนอร์");
        setTimeout(() => navigate("/trainers"), 2000);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลเทรนเนอร์");
    }
  };

  // ฟังก์ชันสำหรับบันทึกการแก้ไข
  const onFinish = async (values: TrainersInterface) => {
    const payload: TrainersInterface = {
      FirstName: values.FirstName || "",
      LastName: values.LastName || "",
      Email: values.Email || "",
      Phone: values.Phone || "",
      BirthDay: values.BirthDay ? dayjs(values.BirthDay).toISOString() : "",
      Age: values.Age || 0,
      GenderID: values.GenderID || 0,
    };
  
    try {
      const res = await UpdateTrainerById(id!, payload); // id เป็น string หรือ number ต้องตรงกับประเภท
      if (res.status === 200) {
        messageApi.success("แก้ไขข้อมูลสำเร็จ!");
        navigate("/trainers");
      } else {
        messageApi.error(res.data?.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      messageApi.error("ไม่สามารถแก้ไขข้อมูลได้");
    }
  };    

  useEffect(() => {
    fetchGenders();
    fetchTrainerById(id!);
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูล เทรนเนอร์</h2>
        <Divider />
        <Form
          name="basic"
          layout="vertical"
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="ชื่อจริง"
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่อ!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="นามสกุล"
                name="last_name"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกนามสกุล!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="อีเมล"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "รูปแบบอีเมลไม่ถูกต้อง!",
                  },
                  {
                    required: true,
                    message: "กรุณากรอกอีเมล!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="วัน/เดือน/ปี เกิด"
                name="birthday"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกวัน/เดือน/ปี เกิด!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="อายุ"
                name="age"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกอายุ!",
                  },
                ]}
              >
                <InputNumber min={1} max={99} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="เพศ"
                name="gender_id"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกเพศ!",
                  },
                ]}
              >
                <Select placeholder="เลือกเพศ">
                  {gender.map((item) => (
                    <Select.Option key={item.ID} value={item.ID}>
                      {item.GenderName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col>
              <Space>
                <Button onClick={() => navigate("/trainers")}>ยกเลิก</Button>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
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

export default TrainerEdit;