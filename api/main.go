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

	// Auto migrate the models
	if err := config.DB.AutoMigrate(&models.Transaction{}, &models.ProjectConfig{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Initialize Fiber
	app := fiber.New()

	// CORS
	app.Use(func(c fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Method() == "OPTIONS" {
			return c.SendStatus(fiber.StatusNoContent)
		}
		return c.Next()
	})

	// Define routes
	app.Get("/transactions", handlers.GetAllTransactions)
	app.Post("/transactions", handlers.CreateTransaction)
	app.Get("/transactions/daily", handlers.GetDailyTransactions)
	app.Get("/transactions/summary", handlers.GetSummary)
	
	app.Get("/config/project", handlers.GetProjectConfig)
	app.Post("/config/project", handlers.UpdateProjectConfig)

	// Start the server on port 3000
	log.Fatal(app.Listen(":3000"))
}