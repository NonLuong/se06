import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getBookingById, acceptBooking } from '../../services/https';  // ฟังก์ชันที่ใช้งานจาก services
import { Booking } from '../../interfaces/IBooking';  // นำเข้า interface Booking
import './DriverBooking.css';

const DriverBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = location.state || {};  // ดึง Booking ID จาก state ของหน้าอื่น
  console.log("bookingid:",bookingId )
  const [booking, setBooking] = useState<Booking | null>(null); // กำหนดประเภทให้กับ booking

  // ดึงข้อมูลการจองจาก Backend
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(bookingId);
        console.log("Fetched booking data: ", data);  // ตรวจสอบข้อมูลที่ดึงมา
        setBooking(data);  // เซ็ตข้อมูลการจองใน state
      } catch (error) {
        console.error('Error fetching booking:', error);
        alert('ไม่สามารถดึงข้อมูลการจองได้');
      }
    };
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);
  
  

  const handleAcceptBooking = async () => {
    if (!booking) return;

    // ตรวจสอบสถานะการจอง
    if (booking.BookingStatus !== 'Pending') {
      alert('การจองนี้ไม่สามารถรับได้ เนื่องจากสถานะไม่เป็น Pending');
      return;
    }

    try {
      const result = await acceptBooking(bookingId);  // เรียกใช้ฟังก์ชันรับงานจาก Backend
      if (result.success) {
        alert('คุณรับงานแล้ว!');
        navigate('/driver-dashboard');  // นำทางไปยังหน้า dashboard ของคนขับ
      } else {
        alert('ไม่สามารถรับงานได้');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการรับงาน');
      console.error('Error accepting booking:', error);
    }
  };

  return (
    <div className="driver-booking">
      {booking ? (
        <div>
          <h2>Booking Details</h2>
          <p><strong>Start Location:</strong> {booking.StartLocation}</p> {/* แก้ไขเป็น StartLocation */}
          <p><strong>Destination:</strong> {booking.Destination}</p> {/* แก้ไขเป็น Destination */}
          <p><strong>Distance:</strong> {booking.Distance} km</p> {/* แก้ไขเป็น Distance */}
          <p><strong>Fare:</strong> {booking.TotalPrice} Baht</p> {/* แก้ไขเป็น TotalPrice */}

          <div className="accept-btn-container">
            <button onClick={handleAcceptBooking}>Accept Booking</button>
          </div>
        </div>
      ) : (
        <p>Loading booking details...</p>
      )}
    </div>
  );
};

export default DriverBooking;
