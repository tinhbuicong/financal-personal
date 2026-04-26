package handlers

import (
	"api/config"
	"api/models"
	"api/services"
	"log"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v3"
)

// --- Gold Handlers ---

func GetLatestGoldPrice(c fiber.Ctx) error {
	var latest models.GoldPrice
	result := config.DB.Order("created_at desc").First(&latest)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "No gold data found. Please sync."})
	}
	return c.JSON(latest)
}

func SyncGoldPrice() error {
	log.Println("Syncing Gold history from Yahoo Finance...")
	points, err := services.FetchDayHistoryFromYahoo("GC=F")
	if err != nil {
		return err
	}

	for _, p := range points {
		var existing models.GoldPrice
		// Check if we already have this timestamp to avoid duplicates
		err := config.DB.Where("timestamp = ?", p.Timestamp).First(&existing).Error
		if err != nil { // If not found, create it
			priceGram := p.Close / 31.1034768
			newPrice := models.GoldPrice{
				Price:     p.Close,
				Open:      p.Open,
				High:      p.High,
				Low:       p.Low,
				PriceGram: priceGram,
				Timestamp: p.Timestamp,
				CreatedAt: time.Unix(p.Timestamp, 0),
			}
			config.DB.Create(&newPrice)
		}
	}
	return nil
}

func GetGoldPriceHistory(c fiber.Ctx) error {
	days, _ := strconv.Atoi(c.Query("days", "30"))
	cutoff := time.Now().AddDate(0, 0, -days)

	var history []models.GoldPrice
	config.DB.Where("created_at >= ?", cutoff).Order("created_at desc").Find(&history)
	return c.JSON(history)
}

// --- Silver Handlers ---

func GetLatestSilverPrice(c fiber.Ctx) error {
	var latest models.SilverPrice
	result := config.DB.Order("created_at desc").First(&latest)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "No silver data found. Please sync."})
	}
	return c.JSON(latest)
}

func SyncSilverPrice() error {
	log.Println("Syncing Silver history from Yahoo Finance...")
	points, err := services.FetchDayHistoryFromYahoo("SI=F")
	if err != nil {
		return err
	}

	for _, p := range points {
		var existing models.SilverPrice
		err := config.DB.Where("timestamp = ?", p.Timestamp).First(&existing).Error
		if err != nil {
			priceGram := p.Close / 31.1034768
			newPrice := models.SilverPrice{
				Price:     p.Close,
				Open:      p.Open,
				High:      p.High,
				Low:       p.Low,
				PriceGram: priceGram,
				Timestamp: p.Timestamp,
				CreatedAt: time.Unix(p.Timestamp, 0),
			}
			config.DB.Create(&newPrice)
		}
	}
	return nil
}

func GetSilverPriceHistory(c fiber.Ctx) error {
	days, _ := strconv.Atoi(c.Query("days", "30"))
	cutoff := time.Now().AddDate(0, 0, -days)

	var history []models.SilverPrice
	config.DB.Where("created_at >= ?", cutoff).Order("created_at desc").Find(&history)
	return c.JSON(history)
}

// --- SJC Handlers ---

func GetLatestSJCPrice(c fiber.Ctx) error {
	var latest models.SJCPrice
	result := config.DB.Order("created_at desc").First(&latest)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "No SJC data found. Please sync."})
	}
	return c.JSON(latest)
}

func SyncSJCPrice() error {
	log.Println("Syncing SJC Gold from GoldAPI...")
	// We use GoldAPI to get XAU in VND as a proxy for SJC
	data, err := services.FetchMetalPrice("XAU", "VND")
	if err != nil {
		return err
	}

	// Create a new record
	newPrice := models.SJCPrice{
		Buy:       data.Price * 0.98, // Mock buy price (2% spread)
		Sell:      data.Price,       // Mock sell price
		Timestamp: data.Timestamp,
		CreatedAt: time.Unix(data.Timestamp, 0),
	}
	config.DB.Create(&newPrice)
	return nil
}

func GetSJCPriceHistory(c fiber.Ctx) error {
	days, _ := strconv.Atoi(c.Query("days", "30"))
	cutoff := time.Now().AddDate(0, 0, -days)

	var history []models.SJCPrice
	config.DB.Where("created_at >= ?", cutoff).Order("created_at desc").Find(&history)
	return c.JSON(history)
}

func SyncAllMetals(c fiber.Ctx) error {
	errG := SyncGoldPrice()
	errS := SyncSilverPrice()
	errSJC := SyncSJCPrice()

	if errG != nil || errS != nil || errSJC != nil {
		return c.Status(500).JSON(fiber.Map{
			"gold_error":   errG,
			"silver_error": errS,
			"sjc_error":    errSJC,
		})
	}

	return c.JSON(fiber.Map{"status": "success", "message": "History synced successfully"})
}
