package config

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	host := "localhost"
	user := "postgres"
	password := "admin" // Postgreql password
	dbName := "supplier_db"
	port := "5432"

	defaultDSN := fmt.Sprintf("host=%s user=%s password=%s dbname=postgres port=%s sslmode=disable TimeZone=Asia/Jakarta", host, user, password, port)
	defaultDB, err := gorm.Open(postgres.Open(defaultDSN), &gorm.Config{})
	if err != nil {
		log.Fatal("Can't connect to PostgreSQL server:", err)
	}

	var exists bool
	checkSQL := fmt.Sprintf("SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = '%s');", dbName)
	defaultDB.Raw(checkSQL).Scan(&exists)

	if !exists {
		log.Println("No such database, creating...")

		sqlDB, _ := defaultDB.DB()
		createSQL := fmt.Sprintf("CREATE DATABASE %s;", dbName)
		_, err := sqlDB.Exec(createSQL)
		if err != nil {
			log.Fatal("Can't create database automatically:", err)
		}
		log.Println("Database successfully created!")
	}

	targetDSN := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta", host, user, password, dbName, port)
	database, err := gorm.Open(postgres.Open(targetDSN), &gorm.Config{})
	if err != nil {
		log.Fatal("Can't connect to target database:", err)
	}

	DB = database
	log.Println("Succesfully connected to database!")
}
