package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type YahooFinanceResponse struct {
	Chart struct {
		Result []struct {
			Meta struct {
				Currency           string  `json:"currency"`
				Symbol             string  `json:"symbol"`
				RegularMarketPrice float64 `json:"regularMarketPrice"`
				RegularMarketTime  int64   `json:"regularMarketTime"`
			} `json:"meta"`
			Timestamp []int64 `json:"timestamp"`
			Indicators struct {
				Quote []struct {
					Open  []float64 `json:"open"`
					High  []float64 `json:"high"`
					Low   []float64 `json:"low"`
					Close []float64 `json:"close"`
				} `json:"quote"`
			} `json:"indicators"`
		} `json:"result"`
		Error interface{} `json:"error"`
	} `json:"chart"`
}

type MetalPoint struct {
	Timestamp int64
	Open      float64
	High      float64
	Low       float64
	Close     float64
}

// FetchPriceFromYahoo returns only the latest price
func FetchPriceFromYahoo(symbol string) (float64, int64, error) {
	url := fmt.Sprintf("https://query1.finance.yahoo.com/v8/finance/chart/%s?interval=1m&range=1d", symbol)
	
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return 0, 0, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return 0, 0, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var yfResp YahooFinanceResponse
	if err := json.Unmarshal(body, &yfResp); err != nil {
		return 0, 0, err
	}

	if len(yfResp.Chart.Result) == 0 {
		return 0, 0, fmt.Errorf("no results")
	}

	result := yfResp.Chart.Result[0]
	return result.Meta.RegularMarketPrice, result.Meta.RegularMarketTime, nil
}

// FetchDayHistoryFromYahoo returns all OHLC points for the last 24h
func FetchDayHistoryFromYahoo(symbol string) ([]MetalPoint, error) {
	url := fmt.Sprintf("https://query1.finance.yahoo.com/v8/finance/chart/%s?interval=15m&range=1d", symbol)
	
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var yfResp YahooFinanceResponse
	if err := json.Unmarshal(body, &yfResp); err != nil {
		return nil, err
	}

	if len(yfResp.Chart.Result) == 0 {
		return nil, fmt.Errorf("no results")
	}

	result := yfResp.Chart.Result[0]
	var points []MetalPoint
	q := result.Indicators.Quote[0]

	for i, ts := range result.Timestamp {
		if i < len(q.Close) && i < len(q.Open) && i < len(q.High) && i < len(q.Low) {
			if q.Close[i] > 0 && q.Open[i] > 0 {
				points = append(points, MetalPoint{
					Timestamp: ts,
					Open:      q.Open[i],
					High:      q.High[i],
					Low:       q.Low[i],
					Close:     q.Close[i],
				})
			}
		}
	}

	return points, nil
}
