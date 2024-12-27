package entity

import "gorm.io/gorm"

type Status struct {
	gorm.Model   
    StatusName string    `json:"status_name"`
    StatusType string    `json:"status_type"`
	
    Drivers    []Driver  `gorm:"foreignKey:StatusID" json:"drivers"` // ความสัมพันธ์ hasMany
    Vehicles   []Vehicle `gorm:"foreignKey:StatusID" json:"vehicles"` // ความสัมพันธ์ hasMany
}