# GoldAPI.io Request Statistics

Monitor your API usage totals for today, yesterday, and monthly cycles.

## Endpoint

**GET** `https://www.goldapi.io/api/stat`

## Authentication

Add your API key to the `x-access-token` header.

| Header           | Value                                         |
| :--------------- | :-------------------------------------------- |
| `x-access-token` | `goldapi-57e2cf20f4dd6abc215ac566e8c50406-io` |
| `Content-Type`   | `application/json`                            |

## Request Example

### cURL

```bash
curl -X GET 'https://www.goldapi.io/api/stat' \
  -H 'x-access-token: goldapi-57e2cf20f4dd6abc215ac566e8c50406-io' \
  -H 'Content-Type: application/json'
```

### JavaScript (Fetch)

```javascript
var myHeaders = new Headers();
myHeaders.append(
  "x-access-token",
  "goldapi-57e2cf20f4dd6abc215ac566e8c50406-io",
);
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

fetch("https://www.goldapi.io/api/stat", requestOptions)
  .then((response) => response.json())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

## API Output

The response provides usage statistics across different time frames.

```json
{
  "requests_today": 3,
  "requests_yesterday": 0,
  "requests_month": 3,
  "requests_last_month": 0
}
```

> [!NOTE]
> Usage limits depend on your current API plan. The default free plan typically allows 100 requests per month.
