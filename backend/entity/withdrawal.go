package entity

import (
	"gorm.io/gorm"
	"time"
)

type Withdrawal struct {
	gorm.Model

	WithdrawalAmount     int       `json:"withdrawal_amount"`      // จำนวนเงินที่ถอน
	WithdrawalCommission float64   `json:"withdrawal_commission"`  // ค่าคอมมิชชั่นจากการถอน (หัก 30)
	WithdrawalNetAmount  float64   `json:"withdrawal_net_amount"`  // จำนวนเงินสุทธิหลังหักค่าคอมมิชชั่น
	WithdrawalBankNumber string    `json:"withdrawal_bank_number"` // หมายเลขบัญชีธนาคาร
	WithdrawalDate       time.Time `json:"withdrawal_date"`        // วันที่ทำการถอน

	BankNameID uint      `json:"bank_name_id"` // ชื่อธนาคารที่ถอนเงิน
	BankName   *BankName `gorm:"foreignKey: bank_name_id" json:"bank_name"`

	DriverID 	uint    `json:"driver_id"` // เก็บ DriverID
	Driver   *Driver `gorm:"foreignKey:DriverID" json:"driver"`
}
