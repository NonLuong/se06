import React from 'react';

const JobDriver = ({ job, onAccept, onReject }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-md">
      <h2 className="text-lg font-bold text-gray-800">งานใหม่เข้ามา!</h2>
      <p className="text-gray-600">ผู้โดยสาร: {job.passengerName}</p>
      <p className="text-gray-600">จุดเริ่มต้น: {job.pickup}</p>
      <p className="text-gray-600">ปลายทาง: {job.destination}</p>
      <p className="text-gray-600">ระยะทาง: {job.distance} กิโลเมตร</p>
      <p className="text-gray-600">เวลานัดหมาย: {job.time}</p>
      <p className="text-gray-600 font-bold">ค่าบริการโดยประมาณ: {job.fare} บาท</p>
      <div className="flex justify-between mt-4">
        <button
          onClick={onReject}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
          ปฏิเสธงาน
        </button>
        <button
          onClick={onAccept}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
        >
          รับงาน
        </button>
      </div>
    </div>
  );
};

export default JobDriver;
