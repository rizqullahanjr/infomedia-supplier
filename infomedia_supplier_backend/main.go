package main

import (
	"infomedia-supplier-backend/config"
	_ "infomedia-supplier-backend/docs"
	"infomedia-supplier-backend/models"
	"infomedia-supplier-backend/routes"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// @title Supplier Management API
// @version 1.0
// @description API Contract for Supplier Management
// @host localhost:8080
// @BasePath /api/v1

func main() {
	config.ConnectDatabase()

	config.DB.AutoMigrate(
		&models.Supplier{},
		&models.SupplierAddress{},
		&models.SupplierContact{},
		&models.SupplierGroup{},
	)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"http://localhost:3000"},
    AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:           12 * time.Hour,
}))
	
	routes.SetupRoutes(r)

	r.Run(":8080")
}