package main

import (
	"log"

	"api/config"
	"api/handlers"
	"api/models"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
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
	if err := config.DB.AutoMigrate(&models.Transaction{}, &models.ProjectConfig{}, &models.CategoryMapping{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Initialize Fiber
	app := fiber.New()

	// CORS - Must be placed before any routes
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		AllowCredentials: false,
	}))

	// Define routes
	app.Get("/api/transactions", handlers.GetAllTransactions)
	app.Post("/api/transactions", handlers.CreateTransaction)
	app.Get("/api/transactions/daily", handlers.GetDailyTransactions)
	app.Get("/api/transactions/summary", handlers.GetSummary)

	app.Get("/api/config/project", handlers.GetProjectConfig)
	app.Post("/api/config/project", handlers.UpdateProjectConfig)

	app.Get("/api/category-mappings", handlers.GetAllCategoryMappings)
	app.Put("/api/category-mappings", handlers.UpdateCategoryMapping)
	// Use ID for reliable deletion
	app.Delete("/api/category-mappings/:id", handlers.DeleteCategoryMapping)

	// Start the server on all interfaces to avoid IPv4/IPv6 mismatches
	log.Fatal(app.Listen("0.0.0.0:3000"))
}
