package models

import (
	"time"
)

type GoldPrice struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Price     float64   `gorm:"type:decimal(20,2)" json:"price"` // Close price
	Open      float64   `gorm:"type:decimal(20,2)" json:"open"`
	High      float64   `gorm:"type:decimal(20,2)" json:"high"`
	Low       float64   `gorm:"type:decimal(20,2)" json:"low"`
	PriceGram float64   `gorm:"type:decimal(20,2)" json:"price_gram"`
	Timestamp int64     `json:"timestamp"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
}

type SilverPrice struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Price     float64   `gorm:"type:decimal(20,2)" json:"price"` // Close price
	Open      float64   `gorm:"type:decimal(20,2)" json:"open"`
	High      float64   `gorm:"type:decimal(20,2)" json:"high"`
	Low       float64   `gorm:"type:decimal(20,2)" json:"low"`
	PriceGram float64   `gorm:"type:decimal(20,2)" json:"price_gram"`
	Timestamp int64     `json:"timestamp"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
}

type SJCPrice struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Buy       float64   `gorm:"type:decimal(20,2)" json:"buy"`
	Sell      float64   `gorm:"type:decimal(20,2)" json:"sell"`
	Timestamp int64     `json:"timestamp"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
}
