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
	if err := config.DB.AutoMigrate(
		&models.Transaction{},
		&models.ProjectConfig{},
		&models.CategoryMapping{},
		&models.GoldPrice{},
		&models.SilverPrice{},
		&models.SJCPrice{},
	); err != nil {
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
	api := app.Group("/api")

	// Test route
	api.Get("/ping", func(c fiber.Ctx) error {
		return c.SendString("pong")
	})

	// Transaction routes
	api.Get("/transactions", handlers.GetAllTransactions)
	api.Post("/transactions", handlers.CreateTransaction)
	api.Get("/transactions/daily", handlers.GetDailyTransactions)
	api.Get("/transactions/summary", handlers.GetSummary)

	// Config routes
	api.Get("/config/project", handlers.GetProjectConfig)
	api.Post("/config/project", handlers.UpdateProjectConfig)

	// Category mapping routes
	api.Get("/category-mappings", handlers.GetAllCategoryMappings)
	api.Put("/category-mappings", handlers.UpdateCategoryMapping)
	api.Delete("/category-mappings/:id", handlers.DeleteCategoryMapping)

	// Metal Prices routes
	log.Println("Registering /api/metals routes")
	api.Get("/gold/latest", handlers.GetLatestGoldPrice)
	api.Get("/gold/history", handlers.GetGoldPriceHistory)
	api.Get("/silver/latest", handlers.GetLatestSilverPrice)
	api.Get("/silver/history", handlers.GetSilverPriceHistory)
	api.Get("/sjc/latest", handlers.GetLatestSJCPrice)
	api.Get("/sjc/history", handlers.GetSJCPriceHistory)
	api.Post("/metals/sync", handlers.SyncAllMetals)

	// Start the server
	log.Fatal(app.Listen(":3000"))
}
