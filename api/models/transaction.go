package models

import (
	"time"
)

type Transaction struct {
	ID       uint      `gorm:"primaryKey" json:"id"`
	Amount   float64   `json:"amount"`
	Type     string    `json:"type"` // "income" or "outcome"
	Category string    `json:"category"`
	Note     string    `json:"note"`
	Date     time.Time `json:"date" gorm:"type:timestamp"`
}
