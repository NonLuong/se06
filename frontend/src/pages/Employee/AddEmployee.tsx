import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  Form,
  message,
  Modal,
} from "antd";
import AdminSidebar from "../../components/sider/AdminSidebar";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import {
  createEmployee,
  listGenders,
  listPositions,
} from "../../services/https/Employee/index";
import { IEmployee } from "../../interfaces/IEmployee";
import type { UploadFile } from "antd";

const { Option } = Select;

const AddEmployee: React.FC = () => {
  const [form] = Form.useForm();
  const [genders, setGenders] = useState([]);
  const [positions, setPositions] = useState([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Fetch Genders and Positions on component mount
  useEffect(() => {
    const fetchData = async () => {
      const genderData = await listGenders();
      const positionData = await listPositions();
      if (genderData) setGenders(genderData);
      if (positionData) setPositions(positionData);
    };

    fetchData();
  }, []);

  const onChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList.slice(-1)); // จำกัดให้สามารถอัปโหลดได้เพียง 1 รูป
  };

  const onPreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleFinish = async (values: any) => {
    try {
      // ตรวจสอบว่า gender และ position ถูกแปลงเป็น Number
      const genderId = Number(values.gender);
      const positionId = Number(values.position);
  
      // เช็คว่า genderId และ positionId เป็นตัวเลขที่ถูกต้อง
      if (isNaN(genderId) || isNaN(positionId)) {
        throw new Error("กรุณาเลือกเพศและตำแหน่งที่ถูกต้อง");
      }
  
      let roleId: number | null = null;
      if (positionId === 2) {
        roleId = 3; // Employee
      } else if (positionId === 1 || positionId === 3) {
        roleId = 4; // Owner or Admin
      }
  
      const employeeData: IEmployee = {
        firstname: values.firstname,
        lastname: values.lastname,
        phoneNumber: values.phone,
        genderId: genderId, // ใช้ genderId ที่ตรวจสอบแล้ว
        positionId: positionId, // ใช้ positionId ที่ตรวจสอบแล้ว
        salary: values.salary,
        email: values.email,
        password: values.password,
        startDate: values.startdate.format("YYYY-MM-DD"),
        dateOfBirth: values.birthdate.format("YYYY-MM-DD"),
        //RolesID: roleId,
        profile: fileList[0]?.thumbUrl || "",
      };
  
      console.log("Sending Employee Data:", employeeData);
  
      const response = await createEmployee(employeeData);
  
      if (response.status === 201) {
        message.success("บันทึกข้อมูลพนักงานสำเร็จ!");
        form.resetFields();
        setFileList([]);
      } else {
        throw new Error(response.data?.message || "Unknown error");
      }
    } catch (error: any) {
      console.error("Error creating employee:", error);
      message.error(`บันทึกข้อมูลล้มเหลว: ${error.message}`);
    }
  };
  

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ flex: 1, background: "#D9D7EF" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          เพิ่มข้อมูลพนักงานใหม่
        </h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{
            width: "100%",
            maxWidth: "1200px",
            height: "67%",
            margin: "0 auto",
            background: "#ffffff",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {/* Other form items */}
            <Form.Item
              label="ชื่อจริง"
              name="firstname"
              rules={[{ required: true, message: "กรุณากรอกชื่อจริง" }]}
            >
              <Input placeholder="กรอกชื่อจริง" />
            </Form.Item>

            <Form.Item
              label="นามสกุล"
              name="lastname"
              rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
            >
              <Input placeholder="กรอกนามสกุล" />
            </Form.Item>

            <Form.Item
              label="เพศ"
              name="gender"
              rules={[{ required: true, message: "กรุณาเลือกเพศ" }]}
            >
              <Select placeholder="เลือกเพศ">
                {genders.map((gender: any) => (
                  <Option key={gender.id} value={Number(gender.id)}>
                    {gender.gender}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="เบอร์โทรศัพท์"
              name="phone"
              rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์" }]}
            >
              <Input placeholder="กรอกเบอร์โทรศัพท์" />
            </Form.Item>

            <Form.Item
              label="วันเกิด"
              name="birthdate"
              rules={[{ required: true, message: "กรุณาเลือกวันเกิด" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="เลือกวันเกิด"
              />
            </Form.Item>

            <Form.Item
              label="ตำแหน่ง"
              name="position"
              rules={[{ required: true, message: "กรุณาเลือกตำแหน่ง" }]}
            >
              <Select placeholder="เลือกตำแหน่ง">
                {positions.map((position: any) => (
                  <Option key={position.id} value={Number(position.id)}>
                    {position.position}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="เงินเดือน"
              name="salary"
              rules={[{ required: true, message: "กรุณากรอกเงินเดือน" }]}
            >
              <Input placeholder="กรอกเงินเดือน" type="number" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "กรุณากรอกอีเมลที่ถูกต้อง",
                },
              ]}
            >
              <Input placeholder="กรอกอีเมล" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "กรุณากรอก Password" }]}
            >
              <Input.Password placeholder="กรอก Password" />
            </Form.Item>

            <Form.Item
              label="วันที่เริ่มงาน"
              name="startdate"
              rules={[{ required: true, message: "กรุณาเลือกวันที่เริ่มงาน" }]}
              style={{ gridColumn: "span 1" }}
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="เลือกวันที่เริ่มงาน"
              />
            </Form.Item>

            <Form.Item
              label="รูปประจำตัว"
              name="profile"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              style={{ gridColumn: "span 1" }}
            >
              <ImgCrop rotationSlider>
                <Upload
                  fileList={fileList}
                  onChange={onChange}
                  listType="picture-card"
                  onPreview={onPreview}
                >
                  {fileList.length < 1 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>อัพโหลด</div>
                    </div>
                  )}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </div>

          {/* Buttons */}
          <Form.Item
            style={{
              textAlign: "center",
              gridColumn: "span 3",
            }}
          >
            <Button type="primary" htmlType="submit">
              เพิ่มพนักงาน
            </Button>
          </Form.Item>
        </Form>

        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img
            alt="profile"
            style={{ width: "100%" }}
            src={previewImage}
          />
        </Modal>
      </div>
    </div>
  );
};

export default AddEmployee;
