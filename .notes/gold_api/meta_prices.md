# GoldAPI.io Metal Prices API

Retrieve real-time and historical spot prices for precious metals in various currencies.

## Endpoint
**GET** `https://www.goldapi.io/api/:symbol/:currency/:date?`

### URL Parameters
| Parameter | Description | Required | Format |
| :--- | :--- | :--- | :--- |
| `symbol` | Metal Symbol (e.g., XAU, XAG, XPT, XPD) | Yes | string |
| `currency` | ISO 4217 Currency Code (e.g., USD, EUR, VND) | Yes | string |
| `date` | Historical Date (optional) | No | `YYYYMMDD` |

**Metal Symbols:**
- `XAU`: Gold
- `XAG`: Silver
- `XPT`: Platinum
- `XPD`: Palladium

> [!TIP]
> To get the **Gold/Silver Ratio**, use `XAU` as the symbol and `XAG` as the currency code.

## Authentication
Add your API key to the `x-access-token` header.

| Header | Value |
| :--- | :--- |
| `x-access-token` | `goldapi-57e2cf20f4dd6abc215ac566e8c50406-io` |
| `Content-Type` | `application/json` |

## Request Examples

### Get Live Gold Price in USD (cURL)
```bash
curl -X GET 'https://www.goldapi.io/api/XAU/USD' \
  -H 'x-access-token: goldapi-57e2cf20f4dd6abc215ac566e8c50406-io' \
  -H 'Content-Type: application/json'
```

### Get Live Gold Price in USD (JavaScript)
```javascript
var myHeaders = new Headers();
myHeaders.append("x-access-token", "goldapi-57e2cf20f4dd6abc215ac566e8c50406-io");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://www.goldapi.io/api/XAU/USD", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

## API Output Structure
The API returns a comprehensive set of price data, including spot prices per Troy Ounce and calculated values per Gram for various purities.

```json
{
  "timestamp": 1777137890,
  "metal": "XAU",
  "currency": "USD",
  "exchange": "FOREXCOM",
  "symbol": "FOREXCOM:XAUUSD",
  "prev_close_price": 4693.025,
  "open_price": 4693.025,
  "low_price": 4658.09,
  "high_price": 4740.38,
  "open_time": 1776988800,
  "price": 4709.255,
  "ch": 16.23,
  "chp": 0.35,
  "ask": 4709.71,
  "bid": 4708.8,
  "price_gram_24k": 151.4061,
  "price_gram_22k": 138.7889,
  "price_gram_21k": 132.4803,
  "price_gram_20k": 126.1717,
  "price_gram_18k": 113.5545,
  "price_gram_16k": 100.9374,
  "price_gram_14k": 88.3202,
  "price_gram_10k": 63.0859
}
```

### Key Field Descriptions
- `price`: Current spot price per Troy Ounce.
- `price_gram_24k`: Calculated price per gram of 24k gold.
- `ch`: Change in price from previous close.
- `chp`: Percentage change from previous close.
- `timestamp`: Unix timestamp of the data.

> [!IMPORTANT]
> Metal prices are provided in **Troy Ounces** by default. Use `price_gram_Nk` fields for prices in grams at specific purities.
