package entity

import "gorm.io/gorm"

type VehicleType struct {
	gorm.Model   
    VehicleType 	string 
    
    Vehicles      []Vehicle `gorm:"foreignKey:VehicleTypeID" json:"vehicles"` // ความสัมพันธ์ hasMany
}

