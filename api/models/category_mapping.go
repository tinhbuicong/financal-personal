package models

type CategoryMapping struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	CategoryName string `gorm:"uniqueIndex" json:"category_name"`
	GroupName    string `json:"group_name"`
}
