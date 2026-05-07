package routes

import (
	"infomedia-supplier-backend/controllers"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.GET("/api/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong!"})
	})

	v1 := r.Group("/api/v1")
	{
		v1.GET("/suppliers/summary", controllers.GetSupplierSummary)
		
		v1.GET("/suppliers", controllers.GetSuppliers)
		
		v1.POST("/suppliers", controllers.CreateSupplier)

		v1.PATCH("/suppliers/:id/status", controllers.UpdateSupplierStatus)
	}
}