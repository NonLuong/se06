package controller

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"project-se/config"
	"project-se/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreatePassenger - สร้าง Passenger พร้อมจัดการข้อมูลและไฟล์โปรไฟล์
func CreatePassenger(c *gin.Context) {
	var passenger entity.Passenger

	// รับข้อมูลจาก form-data
	username := c.PostForm("username")
	firstname := c.PostForm("first_name")
	lastname := c.PostForm("last_name")
	phoneNumber := c.PostForm("phone_number")
	email := c.PostForm("email")
	password := c.PostForm("password")
	genderIDStr := c.PostForm("gender_id") // รับ Gender ID

	// ตรวจสอบค่าที่จำเป็น
	if username == "" || firstname == "" || lastname == "" || phoneNumber == "" || email == "" || password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Required fields are missing"})
		return
	}

	// แปลง GenderID เป็น uint
	genderID, err := strconv.Atoi(genderIDStr)
	if err != nil || genderID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid gender_id"})
		return
	}

	// รับไฟล์รูปภาพ
	file, err := c.FormFile("profile")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file upload"})
		return
	}

	// ตรวจสอบประเภทไฟล์
	if file.Header.Get("Content-Type") != "image/png" && file.Header.Get("Content-Type") != "image/jpeg" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only PNG and JPEG files are allowed"})
		return
	}

	// สร้าง Passenger object
	passenger = entity.Passenger{
		UserName:      username,
		FirstName:     firstname,
		LastName:      lastname,
		PhoneNumber:   phoneNumber,
		Email:         email,
		Password:      password,
		GenderID:      uint(genderID),
	}

	// ใช้ Transaction สำหรับการบันทึกข้อมูล
	tx := config.DB().Begin()

	// บันทึกข้อมูล Passenger
	if err := tx.Create(&passenger).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot save passenger"})
		return
	}

	// ตั้งชื่อไฟล์รูปภาพ
	newFileName := fmt.Sprintf("passenger_id%03d.png", passenger.ID)
	uploadPath := filepath.Join("Images", "Passengers", newFileName)

	// ตรวจสอบและสร้างโฟลเดอร์
	if err := os.MkdirAll(filepath.Dir(uploadPath), os.ModePerm); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot create directory"})
		return
	}

	// Commit Transaction
	tx.Commit()

	// ส่ง Response กลับ
	c.JSON(http.StatusCreated, gin.H{
		"message": "Passenger created successfully",
		"data":    passenger,
	})
}

// GetPassengers - ดึงข้อมูล Passenger ทั้งหมด
func GetPassengers(c *gin.Context) {
	var passengers []entity.Passenger

	if err := config.DB().Preload("Gender").Find(&passengers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch passengers"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"passengers": passengers})
}

// GetPassengerDetail - ดึงข้อมูล Passenger รายบุคคล
func GetPassengerDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid passenger ID"})
		return
	}

	var passenger entity.Passenger
	if err := config.DB().Preload("Gender").Where("id = ?", id).First(&passenger).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Passenger not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch passenger details"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"passenger": passenger})
}

// UpdatePassenger - อัปเดตข้อมูล Passenger
func UpdatePassenger(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid passenger ID"})
		return
	}

	// ค้นหา Passenger
	var passenger entity.Passenger
	if err := config.DB().First(&passenger, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Passenger not found"})
		return
	}

	// รับข้อมูลใหม่จาก FormData
	if err := c.ShouldBind(&passenger); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	// บันทึกการเปลี่ยนแปลง
	if err := config.DB().Save(&passenger).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update passenger"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Passenger updated successfully", "data": passenger})
}

// DeletePassenger - ลบข้อมูล Passenger
func DeletePassenger(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid passenger ID"})
		return
	}

	if err := config.DB().Delete(&entity.Passenger{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete passenger"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Passenger deleted successfully"})
}
