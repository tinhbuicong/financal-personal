package handlers

import (
	"api/config"
	"api/models"
	"log"

	"github.com/gofiber/fiber/v3"
)

func GetAllCategoryMappings(c fiber.Ctx) error {
	var mappings []models.CategoryMapping
	if err := config.DB.Find(&mappings).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not fetch category mappings",
		})
	}
	return c.JSON(mappings)
}

func UpdateCategoryMapping(c fiber.Ctx) error {
	var mapping models.CategoryMapping
	if err := c.Bind().JSON(&mapping); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	if mapping.CategoryName == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Category name is required",
		})
	}

	var existing models.CategoryMapping
	err := config.DB.Where("category_name = ?", mapping.CategoryName).First(&existing).Error
	if err != nil {
		// Create new if not found
		if err := config.DB.Create(&mapping).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Could not create mapping",
			})
		}
	} else {
		// Update existing if found
		existing.GroupName = mapping.GroupName
		if err := config.DB.Save(&existing).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Could not update mapping",
			})
		}
		mapping = existing
	}

	return c.JSON(mapping)
}

func DeleteCategoryMapping(c fiber.Ctx) error {
	id := c.Params("id")
	log.Printf("Deleting category mapping with ID: %s", id)

	if err := config.DB.Delete(&models.CategoryMapping{}, id).Error; err != nil {
		log.Printf("Error deleting category mapping: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not delete mapping",
		})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
