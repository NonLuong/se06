package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"project-se/entity"
	"project-se/config"
)

// ดึงข้อมูล Room ทั้งหมด
func GetRooms(c *gin.Context) {
	var rooms []entity.Rooms
	db := config.DB()
	results := db.Preload("Trainer").Find(&rooms)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, rooms)
}

// ดึง Room ตาม ID
func GetRoomByID(c *gin.Context) {
	id := c.Param("id")
	var room entity.Rooms
	db := config.DB()
	results := db.Preload("Trainer").First(&room, id) // Preload Trainer เพื่อดึงข้อมูลเทรนเนอร์มาด้วย

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, room)
}

// สร้าง Room ใหม่
func CreateRoom(c *gin.Context) {
	var room entity.Rooms
	if err := c.ShouldBindJSON(&room); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db := config.DB()
	result := db.Create(&room)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create room"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Room created successfully", "room": room})
}

// อัปเดต Room
func UpdateRoom(c *gin.Context) {
	id := c.Param("id")
	var room entity.Rooms

	db := config.DB()
	result := db.First(&room, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	var payload entity.Rooms
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// อัปเดตข้อมูล
	room.RoomName = payload.RoomName
	room.Capacity = payload.Capacity
	room.TrainerID = payload.TrainerID
	room.Detail = payload.Detail

	result = db.Save(&room)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to update room"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Room updated successfully"})
}

// ลบ Room
func DeleteRoom(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()
	if tx := db.Delete(&entity.Rooms{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Room deleted successfully"})
}

// อัปเดตจำนวนการจอง
func UpdateRoomBookings(c *gin.Context) {
    id := c.Param("cid")

    var room entity.Rooms
    if err := config.DB().First(&room, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
        return
    }

    // รับข้อมูลการจองจาก JSON Request
    var input struct {
        CurrentBookings uint8 `json:"current_bookings"`
    }
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
        return
    }

    // ตรวจสอบจำนวนการจองว่าเกินความจุหรือไม่
    if input.CurrentBookings > room.Capacity {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bookings exceed room capacity"})
        return
    }

    // อัปเดตจำนวนการจอง
    room.CurrentBookings = input.CurrentBookings
    if err := config.DB().Save(&room).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to update bookings"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Room booked successfully", "room": room})
}