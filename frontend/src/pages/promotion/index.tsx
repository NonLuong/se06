import { useState, useEffect } from "react";
import { Table, Button, Col, Row, Divider, message, Image, Input } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";  // นำเข้า EditOutlined
import type { ColumnsType } from "antd/es/table";
import { GetPromotions, DeletePromotionById } from "../../services/https/indexpromotion";
import { PromotionInterface } from "../../interfaces/IPromotion";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

// นำเข้าคลาส CSS
import "./Promotion.css";

function Promotion() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<PromotionInterface[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<PromotionInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Columns for the table
  const columns: ColumnsType<PromotionInterface> = [
    {
      title: "รูปภาพ",
      dataIndex: "photo",
      key: "photo",
      render: (text) => text ? <Image width={50} src={text} alt="Promotion" /> : "-",
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
    {
      title: "CODE",
      dataIndex: "promotion_code",
      key: "promotion_code",
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
    {
      title: "ชื่อโปรโมชั่น",
      dataIndex: "promotion_name",
      key: "promotion_name",
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
    {
      title: "สถานะ",
      dataIndex: "status_promotion_id",
      key: "status_promotion_id",
      render: (text) => {
        if (text === 1) {
          return (
            <span style={{ color: "green", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CheckCircleOutlined style={{ marginRight: 5 }} />

            </span>
          );
        }
        if (text === 2) {
          return (
            <span style={{ color: "red", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CloseCircleOutlined style={{ marginRight: 5 }} />

            </span>
          );
        }
        return "ไม่ระบุ";
      },
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
    {
      title: "ประเภท",
      dataIndex: "discount_type_id",
      key: "discount_type_id",
      render: (text) => {
        if (text === 1) return "จำนวนเงิน";
        if (text === 2) return "เปอร์เซ็นต์";
        return "ไม่ระบุ"; // Fallback for any other values
      },
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
    {
      title: "ส่วนลด",
      dataIndex: "discount",
      key: "discount",
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
    {
      title: "จำนวนสิทธิ์",
      dataIndex: "use_limit",
      key: "use_limit",
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
    {
      title: "จำนวนที่ใช้สิทธิ์", // เพิ่มคอลัมน์นี้เพื่อแสดง use_count
      dataIndex: "use_count",
      key: "use_count",
      render: (text) => text || 0, // ถ้าไม่มีค่าให้แสดง 0
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
    {
      title: "ระยะทาง",
      dataIndex: "distance_promotion",
      key: "distance_promotion",
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
    {
      title: "วันหมดเขต",
      key: "end_date",
      render: (record) => <>{dayjs(record.end_date).format("DD/MM/YYYY")}</>,
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
    {
      title: "คำอธิบายโปรโมชั่น",
      dataIndex: "promotion_description",
      key: "promotion_description",
      render: (text) => (
        <div style={{ wordWrap: "break-word", whiteSpace: "normal", maxWidth: "200px" }}>
          {text || "-"}
        </div>
      ),
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
    {
      title: "",
      render: (record) => (
        <Button
          type="dashed"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deletePromotionById(record.ID!)} // ใช้ 'id' ตาม interface
          className="promotion-delete-button"
        >
          ลบ
        </Button>
      ),
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
    {
      title: "",
      render: (record) => (
        <Button
          type="primary"
          onClick={() => {
            if (record.ID) {
              navigate(`/promotion/edit/${record.ID}`);
            } else {
              messageApi.error("ไม่พบข้อมูลโปรโมชั่นที่ต้องการแก้ไข");
            }
          }}
          className="promotion-edit-button"
          icon={<EditOutlined />} // เพิ่มไอคอน EditOutlined
        >
          แก้ไขข้อมูล
        </Button>
      ),
      align: "center", // จัดตำแหน่งหัวข้อและเนื้อหากลาง
    },
  ];


  // Fetch promotions data
  const getPromotions = async () => {
    try {
      const res = await GetPromotions();
      if (res.status === 200) {
        setPromotions(res.data);
        setFilteredPromotions(res.data); // Initially set filtered promotions to all promotions
      } else {
        setPromotions([]);
        messageApi.error(res.data.error);
      }
    } catch (error) {
      messageApi.error("ไม่สามารถดึงข้อมูลโปรโมชันได้");
    }
  };

  // Delete promotion by ID
  const deletePromotionById = async (id: number) => {
    try {
      const res = await DeletePromotionById(String(id)); // แปลง id เป็น string
      if (res.status === 200) {
        messageApi.success(res.data.message);
        getPromotions(); // Refresh data
      } else {
        messageApi.error(res.data.error);
      }
    } catch (error) {
      messageApi.error("ไม่สามารถลบโปรโมชันได้");
    }
  };

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterPromotions(value);
  };

  // Filter promotions by code
  const filterPromotions = (search: string) => {
    const filtered = promotions.filter((promotion) =>
      promotion.promotion_code.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPromotions(filtered);
  };

  // Fetch data on component mount
  useEffect(() => {
    getPromotions();
  }, []);

  return (
    <>
      {contextHolder}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 className="promotion-header">จัดการโปรโมชั่น</h2>
        </Col>
        <Col style={{ textAlign: "right", display: "flex", gap: "10px" }}>
          <Input
            placeholder="ค้นหารหัสโปรโมชั่น"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 250 }}
            prefix={<SearchOutlined />} // ใส่ไอคอนในช่องค้นหา
          />
          <Link to="/promotion/create">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="promotion-button"
            >
              สร้างข้อมูล
            </Button>
          </Link>
        </Col>
      </Row>

      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredPromotions} // ใช้ข้อมูลที่กรองแล้ว
          className="promotion-table"
          bordered
          pagination={{ pageSize: 10 }} // กำหนดจำนวนแถวต่อหน้า
        />
      </div>
    </>
  );
}

export default Promotion;