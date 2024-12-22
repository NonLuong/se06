package entity

import "gorm.io/gorm"
import "time"

type Employee struct {
	gorm.Model
	Firstname   string
	Lastname    string
	PhoneNumber string
	DateOfBirth time.Time
	StartDate   time.Time
	Salary      float64
	Profile     string 
	Email       string
	Password    string

	PositionID uint
	Position   Position `gorm:"foreignKey:PositionID"`

	GenderID uint
	Gender   Gender `gorm:"foreignKey:GenderID"`

	RolesID uint
	Roles   Roles `gorm:"foreignKey:RolesID"`
}
