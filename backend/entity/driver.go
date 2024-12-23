
package entity

import (
	"time"
	"gorm.io/gorm"
)

type Driver struct {
	gorm.Model
	
	Firstname       				string
    Lastname       					string
    PhoneNumber     				string
    DateOfBirth        				time.Time
	IdentificationNumber			string
	DriverLicensenumber				string
	DriverLicenseExpirationDate 	time.Time
    Income          				float64
	Profile                         string 
    Email           				string
    Password        				string

	GenderID         uint       `json:"gender_id"`
	Gender           Gender    `gorm:"foreignKey:GenderID" json:"gender"` 

	LocationID       uint       `json:"location_id"`
	Location         Location  `gorm:"foreignKey:LocationID" json:"location"` 
	
	VehicleID        uint       `json:"vehicle_id"`
	Vehicle          Vehicle   `gorm:"foreignKey:VehicleID" json:"vehicle"` 

	EmployeeID       uint
    Employee         Employee 	`gorm:"foreignKey:EmployeeID"`

	StatusID         uint       `json:"status_id"`
	Status           Status    `gorm:"foreignKey:StatusID" json:"status"` 

	Bookings         []Booking `gorm:"foreignKey:DriverID" json:"bookings"` 

	Messages         []Message `gorm:"foreignKey:DriverID" json:"messages"` 

	RoleID   uint   `gorm:"not null"`
    Role     Roles  `gorm:"foreignKey:RoleID"`
}



