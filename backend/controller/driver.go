package controller

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"project-se/config"
	"project-se/entity"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateDriver - สร้าง Driver พร้อมแปลงวันที่และบันทึกรูปโปรไฟล์
func CreateDriver(c *gin.Context) {
	var driver entity.Driver

	// รับข้อมูลจาก form-data
	firstname := c.PostForm("firstname")
	lastname := c.PostForm("lastname")
	phoneNumber := c.PostForm("phone_number")
	identificationNumber := c.PostForm("identification_number")
	driverLicenseNumber := c.PostForm("driver_license_number")
	dateOfBirthStr := c.PostForm("date_of_birth") // รับ dateOfBirth เป็น string
	expirationDateStr := c.PostForm("driver_license_expiration_date")
	incomeStr := c.PostForm("income")
	email := c.PostForm("email")
	password := c.PostForm("password")

	// ตรวจสอบว่าข้อมูลที่ต้องการไม่ว่าง
	if firstname == "" || lastname == "" || dateOfBirthStr == "" || expirationDateStr == "" || incomeStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Required fields are missing"})
		return
	}

	// แปลงวันที่จาก string เป็น time.Time
	dateOfBirth, err := time.Parse("2006-01-02", dateOfBirthStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date_of_birth format, must be YYYY-MM-DD"})
		return
	}

	expirationDate, err := time.Parse("2006-01-02", expirationDateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid driver_license_expiration_date format, must be YYYY-MM-DD"})
		return
	}

	// แปลง income จาก string เป็น float64
	income, err := strconv.ParseFloat(incomeStr, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid income format"})
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

	// สร้าง Driver object
	driver = entity.Driver{
		Firstname:                   firstname,
		Lastname:                    lastname,
		PhoneNumber:                 phoneNumber,
		DateOfBirth:                 dateOfBirth,
		IdentificationNumber:        identificationNumber,
		DriverLicensenumber:         driverLicenseNumber,
		DriverLicenseExpirationDate: expirationDate,
		Income:                      income,
		Email:                       email,
		Password:                    password,
	}

	// ใช้ Transaction สำหรับการบันทึกข้อมูล
	tx := config.DB().Begin()

	// บันทึกข้อมูล Driver
	if err := tx.Create(&driver).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot save driver"})
		return
	}

	// ตั้งชื่อไฟล์รูปภาพ
	newFileName := fmt.Sprintf("driver_id%03d.png", driver.ID)
	uploadPath := filepath.Join("Images", "Drivers", newFileName)

	// ตรวจสอบและสร้างโฟลเดอร์
	if err := os.MkdirAll(filepath.Dir(uploadPath), os.ModePerm); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot create directory"})
		return
	}

	// บันทึกไฟล์ในระบบ
	if err := c.SaveUploadedFile(file, uploadPath); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot save file"})
		return
	}

	// อัปเดต path รูปภาพ
	driver.Profile = uploadPath
	if err := tx.Save(&driver).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot update driver profile path"})
		return
	}

	// Commit Transaction
	tx.Commit()

	// ส่ง Response กลับ
	c.JSON(http.StatusCreated, gin.H{
		"message": "Driver created successfully",
		"data":    driver,
	})
}

// GetDrivers - ดึงข้อมูล Driver ทั้งหมด
func GetDrivers(c *gin.Context) {
	var drivers []entity.Driver

	// ดึงข้อมูล Driver พร้อม Preload ข้อมูลที่เกี่ยวข้อง
	if err := config.DB().Preload("Gender").Preload("Status").Find(&drivers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch drivers"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"drivers": drivers})
}

// GetDriverDetail - ดึงข้อมูล Driver รายบุคคล
func GetDriverDetail(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid driver ID"})
		return
	}

	var driver entity.Driver
	if err := config.DB().Preload("Gender").Preload("Status").Where("id = ?", id).First(&driver).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Driver not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch driver details"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"driver": driver})
}

// UpdateDriver - อัปเดตข้อมูล Driver
func UpdateDriver(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid driver ID"})
		return
	}

	// ค้นหา Driver
	var driver entity.Driver
	if err := config.DB().First(&driver, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Driver not found"})
		return
	}

	// รับข้อมูลใหม่จาก FormData
	if err := c.ShouldBind(&driver); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	// บันทึกการเปลี่ยนแปลง
	if err := config.DB().Save(&driver).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update driver"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Driver updated successfully", "data": driver})
}

// DeleteDriver - ลบข้อมูล Driver
func DeleteDriver(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid driver ID"})
		return
	}

	if err := config.DB().Delete(&entity.Driver{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete driver"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Driver deleted successfully"})
}
