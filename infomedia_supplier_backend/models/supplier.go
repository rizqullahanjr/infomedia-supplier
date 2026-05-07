package models

import "time"

type Supplier struct {
	ID        uint              `gorm:"primaryKey" json:"id"`
	Name      string            `gorm:"unique" json:"name"`
	Nickname  string            `gorm:"unique" json:"nickname"`
	Code 	  string            `gorm:"unique" json:"code"`
	Status    string            `json:"status"`
	Addresses []SupplierAddress `gorm:"foreignKey:SupplierID" json:"addresses"`
	Contacts  []SupplierContact `gorm:"foreignKey:SupplierID" json:"contacts"`
	Groups    []SupplierGroup   `gorm:"foreignKey:SupplierID" json:"groups"`
	CreatedAt time.Time         `json:"created_at"`
	UpdatedAt time.Time         `json:"updated_at"`
}

type SupplierAddress struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	SupplierID uint   `json:"supplier_id"`
	Name       string `json:"name"`
	Address    string `json:"address"`
	IsMain     bool   `json:"is_main"`
}

type SupplierContact struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	SupplierID  uint   `json:"supplier_id"`
	Name        string `json:"name"`
	JobPosition string `json:"job_position"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	Mobile      string `json:"mobile"`
	IsMain      bool   `json:"is_main"`
}

type SupplierGroup struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	SupplierID uint   `json:"supplier_id"`
	GroupName  string `json:"group_name"`
	Value      string `json:"value"`
	IsActive   bool   `json:"is_active"`
}