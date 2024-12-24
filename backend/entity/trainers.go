package entity


import (

   "time"

   "gorm.io/gorm"

)

type Trainers struct {

   gorm.Model

   FirstName string    `json:"first_name"`

   LastName  string    `json:"last_name"`

   Email     string    `json:"email"`

   Age       uint8     `json:"age"`

   BirthDay  time.Time `json:"birthday"`

   GenderID  uint      `json:"gender_id"`

   Gender    *Gender  `gorm:"foreignKey: gender_id" json:"gender"`

   RoleID   uint   `gorm:"not null"`
   Role     Roles  `gorm:"foreignKey:RoleID"`

}
