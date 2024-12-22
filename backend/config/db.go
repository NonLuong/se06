package config

import (
	"fmt"
	"project-se/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"time"
	
)

var db *gorm.DB

// ฟังก์ชันคืนค่า Database Instance
func DB() *gorm.DB {
	return db
}

// ฟังก์ชันเชื่อมต่อฐานข้อมูล
func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("cabana.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("Connected to the database")
	db = database
}

// ฟังก์ชันตั้งค่าโครงสร้างฐานข้อมูลและเพิ่มข้อมูลเริ่มต้น
func SetupDatabase() {
	// AutoMigrate สำหรับสร้างตาราง
	db.AutoMigrate(
		&entity.Gender{},
		&entity.Roles{}, // เพิ่ม Role เข้าไปในระบบ
		&entity.Status{},
		&entity.Position{},
		&entity.Employee{},
		&entity.Passenger{},
		&entity.Driver{},
		&entity.Message{},
		&entity.Booking{},
		&entity.Location{},
		&entity.VehicleType{},
		&entity.Vehicle{},
		&entity.StartLocation{},
		&entity.Destination{},
		&entity.DiscountType{},
		&entity.Promotion{},
		&entity.StatusPromotion{},
		&entity.TrainBook{},
		&entity.Trainers{},
		&entity.Rooms{},

	)

	GenderMale := entity.Gender{Gender: "Male"}
	GenderFemale := entity.Gender{Gender: "Female"}
	db.FirstOrCreate(&GenderMale, &entity.Gender{Gender: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Gender{Gender: "Female"})

	promotions := []entity.Promotion{
		{
			PromotionCode:        "DRIVE001",
			PromotionName:        "ส่งฟรี ไม่มีข้อแม้!",
			PromotionDescription: "รับบริการส่งฟรีสำหรับระยะทางไม่เกิน 10 กม.",
			Discount:             100.0, // คิดเป็นส่วนลดเต็ม 100%
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             5,
			UseCount:             0,
			Distance:             10.0,
			Photo:                "promo1.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE002",
			PromotionName:        "แค่ 5 กม. ก็ลดเลย!",
			PromotionDescription: "เดินทางในระยะทาง 5 กม. ขึ้นไป ลดทันที 50 บาท",
			Discount:             50.0,
			EndDate:              time.Now().Add(60 * 24 * time.Hour),
			UseLimit:             3,
			UseCount:             0,
			Distance:             5.0,
			Photo:                "promo2.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE003",
			PromotionName:        "ระยะทางไกลก็ลดให้!",
			PromotionDescription: "รับส่วนลด 15% สำหรับการเดินทางในระยะทาง 20 กม. ขึ้นไป",
			Discount:             15.0,
			EndDate:              time.Now().Add(90 * 24 * time.Hour),
			UseLimit:             2,
			UseCount:             0,
			Distance:             20.0,
			Photo:                "promo3.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:              1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE004",
			PromotionName:        "ยิ่งขยับ ยิ่งลด!",
			PromotionDescription: "รับส่วนลด 30 บาทเมื่อเดินทางในระยะทางเกิน 3 กม.",
			Discount:             30.0,
			EndDate:              time.Now().Add(120 * 24 * time.Hour),
			UseLimit:             1,
			UseCount:             0,
			Distance:             3.0,
			Photo:                "promo4.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE005",
			PromotionName:        "8 กม. ส่งฟรี ไม่มีเงื่อนไข",
			PromotionDescription: "รับบริการส่งฟรีเมื่อระยะทางไม่เกิน 8 กม.",
			Discount:             100.0, // คิดเป็นส่วนลดเต็ม 100%
			EndDate:              time.Now().Add(45 * 24 * time.Hour),
			UseLimit:             1,
			UseCount:             0,
			Distance:             8.0,
			Photo:                "promo5.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             1, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE006",
			PromotionName:        "15 กม. ลดให้เลย 20%",
			PromotionDescription: "รับส่วนลด 20% สำหรับการเดินทางที่ระยะทางขั้นต่ำ 15 กม.",
			Discount:             20.0,
			EndDate:              time.Now().Add(180 * 24 * time.Hour),
			UseLimit:             1,
			UseCount:             0,
			Distance:             15.0,
			Photo:                "promo6.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:              2, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE007",
			PromotionName:        "12 กม. ขึ้นไป ลด 100!",
			PromotionDescription: "รับส่วนลด 100 บาทสำหรับการเดินทางที่ระยะทางเกิน 12 กม.",
			Discount:             100.0,
			EndDate:              time.Now().Add(60 * 24 * time.Hour),
			UseLimit:             3,
			UseCount:             0,
			Distance:             12.0,
			Photo:                "promo7.jpg",
			DiscountTypeID:       1, // Amount discount
			StatusPromotionID:             2, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE008",
			PromotionName:        "6 กม. สุดคุ้ม!",
			PromotionDescription: "เดินทางในระยะทางไม่เกิน 6 กม. รับส่วนลด 50%",
			Discount:             50.0,
			EndDate:              time.Now().Add(30 * 24 * time.Hour),
			UseLimit:             5,
			UseCount:             0,
			Distance:             6.0,
			Photo:                "promo8.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             2, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE009",
			PromotionName:        "18 กม. ลดแรง 25%",
			PromotionDescription: "ลด 25% สำหรับระยะทางเกิน 18 กม.",
			Discount:             25.0,
			EndDate:              time.Now().Add(90 * 24 * time.Hour),
			UseLimit:             3,
			UseCount:             0,
			Distance:             18.0,
			Photo:                "promo9.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:             2, // ACTIVE
		},
		{
			PromotionCode:        "DRIVE010",
			PromotionName:        "ระยะทางใกล้ ส่งฟรี!",
			PromotionDescription: "ระยะทางไม่เกิน 5 กม. รับบริการส่งฟรี",
			Discount:             100.0, // คิดเป็นส่วนลดเต็ม 100%
			EndDate:              time.Now().Add(60 * 24 * time.Hour),
			UseLimit:             1,
			UseCount:             0,
			Distance:             5.0,
			Photo:                "promo10.jpg",
			DiscountTypeID:       2, // Percent discount
			StatusPromotionID:              2, // ACTIVE
		},
	}
	// บันทึกข้อมูลโปรโมชั่นตัวอย่างลงในฐานข้อมูล
	for _, promo := range promotions {
		db.FirstOrCreate(&promo, &entity.Promotion{PromotionCode: promo.PromotionCode})
	}

	// สร้างข้อมูลตัวอย่าง Status
	ActiveStatus := entity.StatusPromotion{Status: "ACTIVE"}
	ExpiredStatus := entity.StatusPromotion{Status: "EXPIRED"}
	db.FirstOrCreate(&ActiveStatus, &entity.StatusPromotion{Status: "ACTIVE"})
	db.FirstOrCreate(&ExpiredStatus, &entity.StatusPromotion{Status: "EXPIRED"})

	// สร้างข้อมูลตัวอ ย่าง DiscountType
	AmountDiscount := entity.DiscountType{DiscountType: "amount"}
	PercentDiscount := entity.DiscountType{DiscountType: "percent"}
	db.FirstOrCreate(&AmountDiscount, &entity.DiscountType{DiscountType: "amount"})
	db.FirstOrCreate(&PercentDiscount, &entity.DiscountType{DiscountType: "percent"})
	
	// สร้าง Position
	PositionOwner := entity.Position{Position: "Owner"}
	PositionEmployee := entity.Position{Position: "Employee"}
	PositionAdmin := entity.Position{Position: "Admin"}
	db.FirstOrCreate(&PositionOwner, &entity.Position{Position: "Owner"})
	db.FirstOrCreate(&PositionEmployee, &entity.Position{Position: "Employee"})
	db.FirstOrCreate(&PositionAdmin, &entity.Position{Position: "Admin"})

	// สร้าง Role
	rolePassenger := &entity.Roles{Role: "Passenger"}
	roleDriver := &entity.Roles{Role: "Driver"}
	roleEmployee := &entity.Roles{Role: "Employee"}
	roleAdmin := &entity.Roles{Role: "Admin"}
	db.FirstOrCreate(&rolePassenger, entity.Roles{Role: "Passenger"})
	db.FirstOrCreate(&roleDriver, entity.Roles{Role: "Driver"})
	db.FirstOrCreate(&roleEmployee, entity.Roles{Role: "Employee"})
	db.FirstOrCreate(&roleAdmin, entity.Roles{Role: "Admin"})

	// เข้ารหัสรหัสผ่าน
	hashedPassword, err := HashPassword("123456")
	if err != nil {
		panic("Failed to hash password for Driver")
	}

	// ข้อมูลพนักงานทั้งหมด
	employees := []*entity.Employee{
		{
			Firstname:   "Chanyeol",
			Lastname:    "Park",
			PhoneNumber: "0692345678",
			DateOfBirth: time.Date(1992, time.November, 27, 0, 0, 0, 0, time.UTC),
			StartDate:   time.Date(2013, time.December, 25, 0, 0, 0, 0, time.UTC),
			Salary:      100000.00,
			Email:       "Chanyeol@gmail.com",
			Password:    hashedPassword, // เก็บ Hash
			RolesID:     roleAdmin.ID,
			GenderID:    GenderMale.ID,
			PositionID:  PositionOwner.ID,
		},
		{
			Firstname:   "Seolhyun",
			Lastname:    "Kim",
			PhoneNumber: "0992345678",
			DateOfBirth: time.Date(1995, time.January, 3, 0, 0, 0, 0, time.UTC),
			StartDate:   time.Date(2019, time.December, 25, 0, 0, 0, 0, time.UTC),
			Salary:      40000.00,
			Email:       "Seolhyun@gmail.com",
			Password:    hashedPassword, // เก็บ Hash
			RolesID:     roleEmployee.ID,
			GenderID:    GenderFemale.ID,
			PositionID:  PositionEmployee.ID,
		},
		{
			Firstname:   "Jihoon",
			Lastname:    "Seo",
			PhoneNumber: "0892345678",
			DateOfBirth: time.Date(1997, time.April, 24, 0, 0, 0, 0, time.UTC),
			StartDate:   time.Date(2020, time.December, 25, 0, 0, 0, 0, time.UTC),
			Salary:      40000.00,
			Email:       "Jihoon@gmail.com",
			Password:    hashedPassword, // เก็บ Hash
			RolesID:     roleAdmin.ID,
			GenderID:    GenderMale.ID,
			PositionID:  PositionAdmin.ID,
		},
	}

	// วนลูปบันทึกข้อมูลพนักงานลงฐานข้อมูล
	for _, e := range employees {
		db.FirstOrCreate(e, entity.Employee{Email: e.Email})
	}

	// ข้อมูล Driver ทั้งหมด
	drivers := []*entity.Driver{
		{
			Firstname:                   "Somchai", // คนแรก (ตัวอย่างเดิม)
			Lastname:                    "Prasertsak",
			IdentificationNumber:        "1234567890123",
			DriverLicensenumber:         "48867890",
			DriverLicenseExpirationDate: time.Date(2027, time.December, 1, 0, 0, 0, 0, time.UTC),
			Email:                       "Somchai@gmail.com",
			PhoneNumber:                 "0812345678",
			Password:                    hashedPassword,
			Income:                      25000.50,
			DateOfBirth:                 time.Date(1985, time.December, 1, 0, 0, 0, 0, time.UTC),
			RoleID:                     roleDriver.ID,
			GenderID:                    GenderMale.ID,
			EmployeeID:                  2,
			VehicleID:					 1,
		},
		{
			Firstname:                   "Somsak",
			Lastname:                    "Jantakan",
			IdentificationNumber:        "9876543210987",
			DriverLicensenumber:         "51234567",
			DriverLicenseExpirationDate: time.Date(2028, time.January, 15, 0, 0, 0, 0, time.UTC),
			Email:                       "SomsakJ@gmail.com",
			PhoneNumber:                 "0897654321",
			Password:                    hashedPassword,
			Income:                      27000.75,
			DateOfBirth:                 time.Date(1986, time.January, 15, 0, 0, 0, 0, time.UTC),
			RoleID:                     roleDriver.ID,
			GenderID:                    GenderMale.ID,
			EmployeeID:                  2,
			VehicleID:					 2,
		},
		{
			Firstname:                   "Prasit",
			Lastname:                    "Thongchai",
			IdentificationNumber:        "4567891234567",
			DriverLicensenumber:         "67890123",
			DriverLicenseExpirationDate: time.Date(2026, time.June, 1, 0, 0, 0, 0, time.UTC),
			Email:                       "PrasitT@gmail.com",
			PhoneNumber:                 "0823456789",
			Password:                    hashedPassword,
			Income:                      28000.25,
			DateOfBirth:                 time.Date(1983, time.June, 15, 0, 0, 0, 0, time.UTC),
			RoleID:                     roleDriver.ID,
			GenderID:                    GenderMale.ID,
			EmployeeID:                  3,
			VehicleID:					 6,
		},
		{
			Firstname:                   "Thannam",
			Lastname:                    "Suwan",
			IdentificationNumber:        "1231231231234",
			DriverLicensenumber:         "87654321",
			DriverLicenseExpirationDate: time.Date(2027, time.August, 20, 0, 0, 0, 0, time.UTC),
			Email:                       "Thannam@gmail.com",
			PhoneNumber:                 "0811112233",
			Password:                    hashedPassword,
			Income:                      29000.00,
			DateOfBirth:                 time.Date(1987, time.February, 10, 0, 0, 0, 0, time.UTC),
			RoleID:                     roleDriver.ID,
			GenderID:                    GenderFemale.ID,
			EmployeeID:                  3,
			VehicleID:					 4,
		},
		{
			Firstname:                   "Anan",
			Lastname:                    "Phanwichai",
			IdentificationNumber:        "6543219876543",
			DriverLicensenumber:         "33445566",
			DriverLicenseExpirationDate: time.Date(2025, time.September, 10, 0, 0, 0, 0, time.UTC),
			Email:                       "Anan@gmail.com",
			PhoneNumber:                 "0888889999",
			Password:                    hashedPassword,
			Income:                      25000.00,
			DateOfBirth:                 time.Date(1988, time.September, 25, 0, 0, 0, 0, time.UTC),
			RoleID:                     roleDriver.ID,
			GenderID:                    GenderFemale.ID,
			EmployeeID:                  2,
			VehicleID:					 5,
		},
		{
			Firstname:                   "Supa",
			Lastname:                    "Rungroj",
			IdentificationNumber:        "1112223334445",
			DriverLicensenumber:         "44332211",
			DriverLicenseExpirationDate: time.Date(2028, time.March, 30, 0, 0, 0, 0, time.UTC),
			Email:                       "Supa@gmail.com",
			PhoneNumber:                 "0801234567",
			Password:                    hashedPassword,
			Income:                      26000.75,
			DateOfBirth:                 time.Date(1984, time.April, 5, 0, 0, 0, 0, time.UTC),
			RoleID:                     roleDriver.ID,
			GenderID:                    GenderFemale.ID,
			EmployeeID:                  2,
			VehicleID:					 3,
		},
	}

	// บันทึก Driver ทั้งหมดลงฐานข้อมูล
	for _, d := range drivers {
		db.FirstOrCreate(d, entity.Driver{DriverLicensenumber: d.DriverLicensenumber})
	}

		// สร้าง Gender
		VehicleType1 := entity.VehicleType{VehicleType: "Motorcycle"}
		VehicleType2 := entity.VehicleType{VehicleType: "Car"}
		// ใช้ db.FirstOrCreate เพื่อป้องกันข้อมูลซ้ำ
		db.FirstOrCreate(&VehicleType1, &entity.VehicleType{VehicleType: "Motorcycle"})
		db.FirstOrCreate(&VehicleType2, &entity.VehicleType{VehicleType: "Car"})

	vehicles := []entity.Vehicle{
		// มอเตอร์ไซค์ 3 คัน
		{
			LicensePlate:                "กกก123",
			Brand:                       "Yamaha",
			VehicleModel:                "NMAX",
			Color:                       "Blue",
			DateOfPurchase:              time.Date(2021, time.January, 10, 0, 0, 0, 0, time.UTC),
			ExpirationDateOfVehicleAct:  time.Date(2026, time.January, 10, 0, 0, 0, 0, time.UTC),
			Capacity:                    2,
			VehicleTypeID:               1, // มอเตอร์ไซค์
			EmployeeID:                  3,
		},
		{
			LicensePlate:                "ขข5678",
			Brand:                       "Honda",
			VehicleModel:                "PCX",
			Color:                       "Red",
			DateOfPurchase:              time.Date(2020, time.June, 15, 0, 0, 0, 0, time.UTC),
			ExpirationDateOfVehicleAct:  time.Date(2025, time.June, 15, 0, 0, 0, 0, time.UTC),
			Capacity:                    2,
			VehicleTypeID:               1, // มอเตอร์ไซค์
			EmployeeID:                  3,
		},
		{
			LicensePlate:                "คค9012",
			Brand:                       "Kawasaki",
			VehicleModel:                "Z125",
			Color:                       "Green",
			DateOfPurchase:              time.Date(2022, time.February, 20, 0, 0, 0, 0, time.UTC),
			ExpirationDateOfVehicleAct:  time.Date(2027, time.February, 20, 0, 0, 0, 0, time.UTC),
			Capacity:                    2,
			VehicleTypeID:               1, // มอเตอร์ไซค์
			EmployeeID:                  3,
		},
	
		// รถยนต์ 3 คัน
		{
			LicensePlate:                "งง3456",
			Brand:                       "Toyota",
			VehicleModel:                "Camry",
			Color:                       "White",
			DateOfPurchase:              time.Date(2019, time.March, 5, 0, 0, 0, 0, time.UTC),
			ExpirationDateOfVehicleAct:  time.Date(2024, time.March, 5, 0, 0, 0, 0, time.UTC),
			Capacity:                    5,
			VehicleTypeID:               2, // รถยนต์
			EmployeeID:                  3,
		},
		{
			LicensePlate:                "จจ7890",
			Brand:                       "Honda",
			VehicleModel:                "Civic",
			Color:                       "Black",
			DateOfPurchase:              time.Date(2020, time.July, 20, 0, 0, 0, 0, time.UTC),
			ExpirationDateOfVehicleAct:  time.Date(2025, time.July, 20, 0, 0, 0, 0, time.UTC),
			Capacity:                    5,
			VehicleTypeID:               2, // รถยนต์
			EmployeeID:                  3,
		},
		{
			LicensePlate:                "ฉฉ1234",
			Brand:                       "Mazda",
			VehicleModel:                "CX-5",
			Color:                       "Gray",
			DateOfPurchase:              time.Date(2021, time.September, 15, 0, 0, 0, 0, time.UTC),
			ExpirationDateOfVehicleAct:  time.Date(2026, time.September, 15, 0, 0, 0, 0, time.UTC),
			Capacity:                    5,
			VehicleTypeID:               2, // รถยนต์
			EmployeeID:                  3,
		},
	}
	
	// บันทึกข้อมูล Vehicle ลงฐานข้อมูล
	for _, v := range vehicles {
		db.FirstOrCreate(&v, entity.Vehicle{LicensePlate: v.LicensePlate})
	}
	
	passengers := []entity.Passenger{
		{
			UserName:     "Anuwat",
			FirstName:    "Anuwat",
			LastName:     "Thongchai",
			PhoneNumber:  "0811111111",
			Email:        "anuwat1@gmail.com",
			Password:     hashedPassword, // เก็บ Hash
			GenderID:     1,
			RoleID:       1,
		},
		{
			UserName:     "Chatchai",
			FirstName:    "Chatchai",
			LastName:     "Prasert",
			PhoneNumber:  "0812222222",
			Email:        "chatchai2@gmail.com",
			Password:     hashedPassword,
			GenderID:     1,
			RoleID:       1,
		},
		{
			UserName:     "Kittipong",
			FirstName:    "Kittipong",
			LastName:     "Suwan",
			PhoneNumber:  "0813333333",
			Email:        "kittipong3@gmail.com",
			Password:     hashedPassword,
			GenderID:     1,
			RoleID:       1,
		},
		{
			UserName:     "Nattapon",
			FirstName:    "Nattapon",
			LastName:     "Somchai",
			PhoneNumber:  "0814444444",
			Email:        "nattapon4@gmail.com",
			Password:     hashedPassword,
			GenderID:     1,
			RoleID:       1,
		},
		{
			UserName:     "Siriporn",
			FirstName:    "Siriporn",
			LastName:     "Jantakan",
			PhoneNumber:  "0815555555",
			Email:        "siriporn1@gmail.com",
			Password:     hashedPassword,
			GenderID:     2,
			RoleID:       1,
		},
		{
			UserName:     "Nanthicha",
			FirstName:    "Nanthicha",
			LastName:     "Phanwichai",
			PhoneNumber:  "0816666666",
			Email:        "nanthicha2@gmail.com",
			Password:     hashedPassword,
			GenderID:     2,
			RoleID:       1,
		},
		{
			UserName:     "Chanidapa",
			FirstName:    "Chanidapa",
			LastName:     "Rungroj",
			PhoneNumber:  "0817777777",
			Email:        "chanidapa3@gmail.com",
			Password:     hashedPassword,
			GenderID:     2,
			RoleID:       1,
		},
		{
			UserName:     "Supattra",
			FirstName:    "Supattra",
			LastName:     "Kraiwit",
			PhoneNumber:  "0818888888",
			Email:        "supattra4@gmail.com",
			Password:     hashedPassword,
			GenderID:     GenderFemale.ID,
			RoleID:       1,
		},
	}
	
	// บันทึกข้อมูล Passenger ลงฐานข้อมูล
	for _, p := range passengers {
		db.FirstOrCreate(&p, entity.Passenger{Email: p.Email})
	}

	fmt.Println("Database setup and seeding completed")
}
