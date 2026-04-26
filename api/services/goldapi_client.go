package services

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

type GoldAPIResponse struct {
	Timestamp    int64   `json:"timestamp"`
	Metal        string  `json:"metal"`
	Currency     string  `json:"currency"`
	Price        float64 `json:"price"`
	PriceGram24k float64 `json:"price_gram_24k"` // Used for Gold
	PriceGram    float64 `json:"price_gram"`     // Sometimes returned for other metals
}

func FetchMetalPrice(symbol, currency string) (*GoldAPIResponse, error) {
	apiKey := os.Getenv("GOLD_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GOLD_API_KEY not found in environment")
	}

	url := fmt.Sprintf("https://www.goldapi.io/api/%s/%s", symbol, currency)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("x-access-token", apiKey)
	req.Header.Add("Content-Type", "application/json")

	client := &http.Client{
		Timeout: 10 * time.Second,
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("GoldAPI returned status: %s", resp.Status)
	}

	bodyBytes, _ := io.ReadAll(resp.Body)
	log.Printf("GoldAPI raw response: %s", string(bodyBytes))

	var result GoldAPIResponse
	if err := json.Unmarshal(bodyBytes, &result); err != nil {
		return nil, err
	}

	return &result, nil
}
