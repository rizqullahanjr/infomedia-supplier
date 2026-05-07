package controllers

import (
	"fmt"
	"net/http"

	"infomedia-supplier-backend/config"
	"infomedia-supplier-backend/models"

	"github.com/gin-gonic/gin"
)

type AddressInput struct {
	Name    string `json:"name" example:"Head Office"`
	Address string `json:"address" example:"Fatmawati Raya St, 123"`
	IsMain  bool   `json:"is_main" example:"true"`
}

type ContactInput struct {
	Name        string `json:"name" example:"Albert"`
	JobPosition string `json:"job_position" example:"CEO"`
	Email       string `json:"email" example:"einstein@gmail.com"`
	Phone       string `json:"phone" example:"021.123456"`
	Mobile      string `json:"mobile" example:"0811234567"`
	IsMain      bool   `json:"is_main" example:"true"`
}

type GroupInput struct {
	GroupName string `json:"group_name" example:"Industry"`
	Value     string `json:"value" example:"Manufacture"`
	IsActive  bool   `json:"is_active" example:"true"`
}

type CreateSupplierInput struct {
	Name      string         `json:"name" example:"PT Setroom Indonesia" binding:"required"`
	Nickname  string         `json:"nickname" example:"Setroom"`
	Addresses []AddressInput `json:"addresses"`
	Contacts  []ContactInput `json:"contacts"`
	Groups    []GroupInput   `json:"groups"`
}

type SuccessResponse struct {
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message" example:"Action completed successfully"`
	Status  string      `json:"status" example:"success"`
}

type CreateSupplierResponseData struct {
	ID   uint   `json:"id" example:"4"`
	Name string `json:"name" example:"PT Setroom Indonesia"`
}

type UpdateStatusInput struct {
	Status string `json:"status" binding:"required"`
}

type CreateSupplierSuccessResponse struct {
	Status  string                     `json:"status" example:"success"`
	Message string                     `json:"message" example:"Supplier created successfully"`
	Data    CreateSupplierResponseData `json:"data"`
}

type BadRequestResponse struct {
	Message string `json:"message" example:"Invalid JSON format or required field is missing"`
	Status  string `json:"status" example:"error"`
}

type ConflictResponse struct {
	Message string `json:"message" example:"Supplier with that Name or Nickname is already registered"`
	Status  string `json:"status" example:"error"`
}

// CreateSupplier godoc
// @Summary Create a New Supplier
// @Description Endpoint for storing new supplier data with address, contacts and groups.
// @Tags Suppliers
// @Accept json
// @Produce json
// @Param request body CreateSupplierInput true "Payload data supplier"
// @Success 201 {object} CreateSupplierSuccessResponse "Supplier created successfully"
// @Failure 400 {object} BadRequestResponse "Invalid JSON format or required field is missing"
// @Failure 409 {object} ConflictResponse "Duplicate data: Supplier with that Name or Nickname is already registered"
// @Router /suppliers [post]
func CreateSupplier(c *gin.Context) {
	var input CreateSupplierInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, BadRequestResponse{
			Status:  "error",
			Message: "Invalid JSON format or required field is missing: " + err.Error(),
		})
		return
	}

	var existingSupplier models.Supplier
	errCheck := config.DB.Where("name = ? OR nickname = ?", input.Name, input.Nickname).First(&existingSupplier).Error
	if errCheck == nil {
		c.JSON(http.StatusConflict, ConflictResponse{
			Status:  "error",
			Message: "Supplier with that Name or Nickname is already registered",
		})
		return
	}

	var totalExisting int64
	config.DB.Model(&models.Supplier{}).Count(&totalExisting)
	newCode := fmt.Sprintf("%d", 41000000+totalExisting+1)

	var addresses []models.SupplierAddress
	for _, addr := range input.Addresses {
		addresses = append(addresses, models.SupplierAddress{
			Name:    addr.Name,
			Address: addr.Address,
			IsMain:  addr.IsMain,
		})
	}

	var contacts []models.SupplierContact
	for _, contact := range input.Contacts {
		contacts = append(contacts, models.SupplierContact{
			Name:        contact.Name,
			JobPosition: contact.JobPosition,
			Email:       contact.Email,
			Phone:       contact.Phone,
			Mobile:      contact.Mobile,
			IsMain:      contact.IsMain,
		})
	}

	var groups []models.SupplierGroup
	for _, group := range input.Groups {
		groups = append(groups, models.SupplierGroup{
			GroupName: group.GroupName,
			Value:     group.Value,
			IsActive:  group.IsActive,
		})
	}

	supplier := models.Supplier{
		Name:      input.Name,
		Nickname:  input.Nickname,
		Code:      newCode,
		Status:    "In Progress",
		Addresses: addresses,
		Contacts:  contacts,
		Groups:    groups,
	}

	if err := config.DB.Create(&supplier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, BadRequestResponse{
			Status:  "error",
			Message: "Failed to save supplier data: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, SuccessResponse{
		Status:  "success",
		Message: "Supplier created successfully",
		Data:    supplier,
	})
}

// GetSuppliers godoc
// @Summary Get All Suppliers
// @Description Endpoint for fetching list all supplier data.
// @Tags Suppliers
// @Produce json
// @Success 200 {object} SuccessResponse
// @Router /suppliers [get]
func GetSuppliers(c *gin.Context) {
	var suppliers []models.Supplier

	if err := config.DB.Preload("Addresses").Preload("Contacts").Find(&suppliers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Failed to fetch suppliers: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   suppliers,
	})
}

// GetSupplierSummary godoc
// @Summary Get Supplier Summary Stats
// @Description Endpoint for fetching supplier summary statistics.
// @Tags Suppliers
// @Produce json
// @Success 200 {object} SuccessResponse
// @Router /suppliers/summary [get]
func GetSupplierSummary(c *gin.Context) {
	var totalSupplier int64
	var newSupplier int64
	var blockedSupplier int64

	config.DB.Model(&models.Supplier{}).Count(&totalSupplier)

	config.DB.Model(&models.Supplier{}).Where("status = ?", "In Progress").Count(&newSupplier)

	config.DB.Model(&models.Supplier{}).Where("status = ?", "Blocked").Count(&blockedSupplier)

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": gin.H{
			"total_supplier":   totalSupplier,
			"new_supplier":     newSupplier,
			"blocked_supplier": blockedSupplier,
			// Avg cost di-hardcode aja dulu dari frontend, atau di-return dummy dari sini
			"avg_cost": "Rp 320,3 Mn",
		},
	})
}

// UpdateSupplierStatus godoc
// @Summary Update Supplier Status
// @Description Endpoint for updating supplier status
// @Tags Suppliers
// @Accept json
// @Produce json
// @Param id path int true "Supplier ID"
// @Param request body UpdateStatusInput true "New Status (Active, In Progress, Blocked)"
// @Success 200 {object} SuccessResponse
// @Router /suppliers/{id}/status [patch]
func UpdateSupplierStatus(c *gin.Context) {
	id := c.Param("id")
	var input UpdateStatusInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, BadRequestResponse{
			Status:  "error",
			Message: "Invalid JSON format or required field is missing: " + err.Error(),
		})
		return
	}

	if input.Status != "Active" && input.Status != "In Progress" && input.Status != "Blocked" {
		c.JSON(http.StatusBadRequest, BadRequestResponse{
			Status:  "error",
			Message: "Status must be Active, In Progress, or Blocked",
		})
		return
	}

	if err := config.DB.Model(&models.Supplier{}).Where("id = ?", id).Update("status", input.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, BadRequestResponse{
			Status:  "error",
			Message: "Failed to update status: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{
		Status:  "success",
		Message: "Status updated successfully",
	})
}
