package main

import (
	"log"

	"api/config"
	"api/handlers"
	"api/models"

	"github.com/gofiber/fiber/v3"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or error loading it, using system environment variables")
	}

	// Connect to database
	config.ConnectDB()

	// Auto migrate the Transaction model
	if err := config.DB.AutoMigrate(&models.Transaction{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Initialize Fiber
	app := fiber.New()

	// Define routes
	app.Post("/transactions", handlers.CreateTransaction)
	app.Get("/transactions/daily", handlers.GetDailyTransactions)
	app.Get("/transactions/summary", handlers.GetSummary)

	// Start the server on port 3000
	log.Fatal(app.Listen(":3000"))
}