package handlers

import (
	"time"

	"api/config"
	"api/models"

	"github.com/gofiber/fiber/v3"
)

func CreateTransaction(c fiber.Ctx) error {
	var transaction models.Transaction

	if err := c.Bind().JSON(&transaction); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	if err := config.DB.Create(&transaction).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not create transaction",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(transaction)
}

func GetDailyTransactions(c fiber.Ctx) error {
	var transactions []models.Transaction

	now := time.Now()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	endOfDay := startOfDay.Add(24 * time.Hour)

	if err := config.DB.Where("date >= ? AND date < ?", startOfDay, endOfDay).Find(&transactions).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not fetch transactions",
		})
	}

	return c.JSON(transactions)
}

func GetSummary(c fiber.Ctx) error {
	var transactions []models.Transaction

	now := time.Now()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	endOfDay := startOfDay.Add(24 * time.Hour)

	if err := config.DB.Where("date >= ? AND date < ?", startOfDay, endOfDay).Find(&transactions).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not fetch transactions",
		})
	}

	var totalIncome, totalOutcome float64
	for _, t := range transactions {
		if t.Type == "income" {
			totalIncome += t.Amount
		} else if t.Type == "outcome" {
			totalOutcome += t.Amount
		}
	}

	return c.JSON(fiber.Map{
		"total_income":  totalIncome,
		"total_outcome": totalOutcome,
	})
}

func GetAllTransactions(c fiber.Ctx) error {
	var transactions []models.Transaction

	if err := config.DB.Order("date desc").Find(&transactions).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not fetch transactions",
		})
	}

	return c.JSON(transactions)
}

func GetProjectConfig(c fiber.Ctx) error {
	var configData models.ProjectConfig
	if err := config.DB.First(&configData).Error; err != nil {
		// If not found, create a default one
		configData = models.ProjectConfig{ExpectedDailyRevenue: 0}
		config.DB.Create(&configData)
	}
	return c.JSON(configData)
}

func UpdateProjectConfig(c fiber.Ctx) error {
	var configData models.ProjectConfig
	if err := c.Bind().JSON(&configData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	var existing models.ProjectConfig
	if err := config.DB.First(&existing).Error; err != nil {
		config.DB.Create(&configData)
	} else {
		config.DB.Model(&existing).Update("expected_daily_revenue", configData.ExpectedDailyRevenue)
	}

	return c.JSON(configData)
}
