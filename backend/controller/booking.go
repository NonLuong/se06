package controller

import (
	"net/http"
	"project-se/config"
	"project-se/entity"
	"github.com/gin-gonic/gin"
	"time"
	"fmt"
	"math"
)

/*func CreateBooking(c *gin.Context) {
    var booking entity.Booking

    // ตรวจสอบ JSON ที่ส่งมา
    if err := c.ShouldBindJSON(&booking); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }

    // เชื่อมต่อฐานข้อมูล
    db := config.DB()

    // บันทึกข้อมูลลงในฐานข้อมูล
    if err := db.Create(&booking).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
        return
    }

    // ส่งข้อมูลที่สร้างกลับไปยัง client
    c.JSON(http.StatusCreated, gin.H{
        "message": "Booking created successfully",
        "data":    booking,
    })
}*/


// ดึงข้อมูล Booking ทั้งหมด
func GetAllBookings(c *gin.Context) {
	var bookings []entity.Booking
	db := config.DB()

	if err := db.Preload("StartLocation").Preload("Destination").Find(&bookings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    bookings,
	})
}

// ดึงข้อมูล Booking ตาม ID
func GetBookingByID(c *gin.Context) {
	var booking entity.Booking
	db := config.DB()

	id := c.Param("id")
	if err := db.Preload("StartLocation").Preload("Destination").First(&booking, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    booking,
	})
}


func CreateBooking(c *gin.Context) {
	var booking entity.Booking

	// ตรวจสอบ JSON ที่ส่งมา
	if err := c.ShouldBindJSON(&booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// เชื่อมต่อฐานข้อมูล
	db := config.DB()

	// กำหนดค่าเริ่มต้นใน Backend
	if booking.BookingStatus == "" {
		booking.BookingStatus = "Pending" // ถ้าสถานะยังไม่ถูกส่งมา กำหนดเป็น "Pending"
	}
	if booking.BookingTime == "" {
		booking.BookingTime = fmt.Sprintf("%v", time.Now()) // กำหนดเวลาการจองเป็นเวลาปัจจุบัน
	}

	// ดึงข้อมูลตำแหน่งเริ่มต้นของผู้โดยสาร
	var startLocation entity.StartLocation
	if err := db.First(&startLocation, booking.StartLocationID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch start location"})
		return
	}

	// บันทึกข้อมูลการจองลงในฐานข้อมูล
	if err := db.Create(&booking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create booking"})
		return
	}

	// คำนวณหาคนขับที่ใกล้ที่สุด
	var drivers []entity.Driver
	db.Find(&drivers)

	var closestDriver entity.Driver
	minDistance := math.MaxFloat64 // ตั้งค่าระยะทางเริ่มต้นให้มากที่สุด

	// คำนวณหาคนขับที่ใกล้ที่สุด
	for _, driver := range drivers {
		// ดึงข้อมูลตำแหน่งของคนขับจาก Location
		var driverLocation entity.Location
		if err := db.First(&driverLocation, "driver_id = ?", driver.ID).Error; err != nil {
			fmt.Println("Error fetching driver location:", err)
			continue // ถ้าหากไม่สามารถดึงข้อมูลตำแหน่งของคนขับได้, ข้ามไป
		}

		// แสดงค่าพิกัดของจุดเริ่มต้นการจองและคนขับ
		fmt.Printf("Start Location: %f, %f | Driver Location: %f, %f\n", 
			startLocation.Latitude, startLocation.Longitude,
			driverLocation.Latitude, driverLocation.Longitude)

		// คำนวณระยะทาง
		distance := calculateDistance(startLocation.Latitude, startLocation.Longitude, driverLocation.Latitude, driverLocation.Longitude)
		fmt.Printf("Checking driver %d: distance = %f\n", driver.ID, distance) // แสดงผลข้อมูลการคำนวณระยะทาง

		if distance < minDistance {
			closestDriver = driver
			minDistance = distance
		}
	}

	// เช็คกรณีที่ไม่มีคนขับที่ใกล้ที่สุด
	if closestDriver.ID == 0 { // เช็คว่าค่า ID ของ closestDriver เป็น 0 หรือไม่
		c.JSON(http.StatusNotFound, gin.H{"error": "No driver available"})
		return
	}

	// แสดงผลข้อมูลของคนขับที่ใกล้ที่สุด
	fmt.Printf("Found closest driver: %d, distance: %f\n", closestDriver.ID, minDistance)

	// ส่งคำขอไปยังคนขับที่ใกล้ที่สุดเพื่อรับหรือปฏิเสธ
	booking.DriverID = closestDriver.ID // อัปเดตการจับคู่กับคนขับ
	booking.BookingStatus = "Waiting for driver acceptance"
	db.Save(&booking) // อัปเดตข้อมูลการจองในฐานข้อมูล

	// ส่งข้อมูลที่อัปเดตกลับไปยัง client
	c.JSON(http.StatusCreated, gin.H{
		"message": "Booking created, waiting for driver acceptance",
		"data":    booking,
	})
}


// ฟังก์ชันคำนวณระยะทางระหว่างสองพิกัด (ใช้ Haversine Formula)
func calculateDistance(lat1, lon1, lat2, lon2 float64) float64 {
	const EarthRadius = 6371.0 // รัศมีโลก (กิโลเมตร)

	// แปลงค่าองศาเป็นเรเดียน
	dlat := degToRad(lat2 - lat1)
	dlon := degToRad(lon2 - lon1)

	// คำนวณระยะทางด้วย Haversine formula
	a := math.Sin(dlat/2)*math.Sin(dlat/2) +
		math.Cos(degToRad(lat1))*math.Cos(degToRad(lat2))*math.Sin(dlon/2)*math.Sin(dlon/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	// คืนค่าระยะทางเป็นกิโลเมตร
	return EarthRadius * c
}

// ฟังก์ชันแปลงจากองศาเป็นเรเดียน
func degToRad(deg float64) float64 {
	return deg * math.Pi / 180
}



// ฟังก์ชันที่ backend เพื่อรับการยืนยันการจองจากคนขับ
func AcceptBooking(c *gin.Context) {
    db := config.DB()
    bookingID := c.Param("id") // ดึง Booking ID จาก URL

    // หาข้อมูลการจองที่ตรงกับ ID ที่ได้รับ
    var booking entity.Booking
    if err := db.First(&booking, bookingID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Booking not found"})
        return
    }

    // ตรวจสอบว่า Booking สถานะเป็น Pending ก่อน
    if booking.BookingStatus != "Pending" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Booking already processed"})
        return
    }

    // เปลี่ยนสถานะเป็น "Accepted" และบันทึกคนขับที่รับงาน
    booking.BookingStatus = "Accepted"
    if err := db.Save(&booking).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to accept booking"})
        return
    }

    // ส่งข้อมูลการจองที่ถูกอัปเดตกลับไปยัง client
    c.JSON(http.StatusOK, gin.H{
        "message": "Booking accepted successfully",
        "data":    booking,
    })
}

