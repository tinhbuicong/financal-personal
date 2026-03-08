package models

type ProjectConfig struct {
	ID                    uint    `gorm:"primaryKey" json:"id"`
	ExpectedDailyRevenue float64 `json:"expected_daily_revenue"`
}
