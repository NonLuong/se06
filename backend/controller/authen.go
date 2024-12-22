package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"project-se/config"
	"project-se/entity"
	"project-se/services"
)

// UniversalSignin handles user sign-in requests
func UniversalSignin(c *gin.Context) {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Bind JSON input to loginData
	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Get database connection
	db := config.DB()
	var user interface{}
	var role string

	// Search in Employee entity
	if err := db.Preload("Role").Where("email = ?", loginData.Email).First(&user).Error; err == nil {
		switch u := user.(type) {
		case *entity.Employee:
			role = "Employee"
			// Verify the password for Employee
			if !config.CheckPasswordHash([]byte(loginData.Password), []byte(u.Password)) {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
				return
			}
		case *entity.Driver:
			role = "Driver"
			// Verify the password for Driver
			if !config.CheckPasswordHash([]byte(loginData.Password), []byte(u.Password)) {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
				return
			}
		case *entity.Passenger:
			role = "Passenger"
			// Verify the password for Passenger
			if !config.CheckPasswordHash([]byte(loginData.Password), []byte(u.Password)) {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
				return
			}
		default:
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
			return
		}
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect email or password"})
		return
	}

	// Set up JwtWrapper with key details for token generation
	jwtWrapper := services.JwtWrapper{
		SecretKey:       config.GetSecretKey(),
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	// Generate the token using JwtWrapper's GenerateToken method
	tokenString, err := jwtWrapper.GenerateToken(loginData.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	// Return the user's id, email, role, and token
	c.JSON(http.StatusOK, gin.H{
		"id":    getIDFromUser(user),
		"email": loginData.Email,
		"role":  role,
		"token": tokenString,
	})
}

// Helper function to extract the ID from the user
func getIDFromUser(user interface{}) uint {
	switch u := user.(type) {
	case *entity.Employee:
		return u.ID
	case *entity.Driver:
		return u.ID
	case *entity.Passenger:
		return u.ID
	default:
		return 0
	}
}
