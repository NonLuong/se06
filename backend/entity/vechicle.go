package entity

import "gorm.io/gorm"
import "time"

type Vehicle struct {
	gorm.Model
	LicensePlate       				string
    Brand        					string
    VehicleModel     				string
	Color     						string
    DateOfPurchase        			time.Time
    ExpirationDateOfVehicleAct      time.Time
    Capacity        				int
    
    VehicleTypeID       uint
    VehicleType         VehicleType `gorm:"foreignKey:VehicleTypeID"`

    EmployeeID         uint
    Employee           Employee   `gorm:"foreignKey:EmployeeID"`

	StatusID         uint
    Status           Status   `gorm:"foreignKey:StatusID"`
	
    Drivers       []Driver  `gorm:"foreignKey:VehicleID" json:"drivers"` // ความสัมพันธ์ hasMany
}

