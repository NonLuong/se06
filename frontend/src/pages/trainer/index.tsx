import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetTrainers, DeleteTrainerById } from "../../services/https/TainerAPI";
import { TrainersInterface } from "../../interfaces/ITrainer";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function Trainers() {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState<TrainersInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // ฟังก์ชันดึงข้อมูลเทรนเนอร์
  const getTrainers = async () => {
    let res = await GetTrainers();

    if (res.status == 200) {
      setTrainers(res.data);
    } else {
      setTrainers([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  // ฟังก์ชันลบเทรนเนอร์
  const deleteTrainer = async (id: number) => {
    let res = await DeleteTrainerById(id); // เรียกใช้ฟังก์ชัน DeleteTrainerById
  
    if (res && res.status === 200) { // ตรวจสอบว่า res มีค่าและ status = 200
      messageApi.open({
        type: "success",
        content: res.data?.message || "ลบสำเร็จ",
      });
      await getTrainers(); // ดึงข้อมูลใหม่
    } else {
      messageApi.open({
        type: "error",
        content: res?.data?.error || "ไม่สามารถลบได้",
      });
    }
  };

  useEffect(() => {
    getTrainers();
  }, []);

  const columns: ColumnsType<TrainersInterface> = [
    {
      title: "ลำดับ",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1, // คำนวณลำดับเริ่มต้นที่ 1
    },
    {
      title: "ชื่อ",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "นามสกุล",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "วัน/เดือน/ปี เกิด",
      key: "birthday",
      render: (record) => <>{dayjs(record.birthday).format("DD/MM/YYYY")}</>,
    },
    {
      title: "อายุ",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "เพศ",
      key: "gender",
      render: (record) => <>{record?.gender?.gender}</>,
    },
    {
      title: "",
      render: (record) => (
        <Space>
          {/* ปุ่มแก้ไข */}
          <Button
            type="primary"
            onClick={() => navigate(`/trainers/edit/${record.ID}`)}
          >
            แก้ไขข้อมูล
          </Button>
  
          {/* ปุ่มลบ พร้อมยืนยัน */}
          <Popconfirm
            title="ยืนยันการลบเทรนเนอร์นี้?"
            onConfirm={() => deleteTrainer(record.ID)}
            okText="ใช่"
            cancelText="ไม่"
          >
            <Button type="dashed" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];  

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>จัดการข้อมูลเทรนเนอร์</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/trainers/create">
              <Button type="primary" icon={<PlusOutlined />}>
                สร้างข้อมูล
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={trainers}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>
    </>
  );
}

export default Trainers;
