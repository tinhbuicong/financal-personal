# GoldAPI.io Service Status

Check the health and availability of the GoldAPI.io service.

## Endpoint

**GET** `https://www.goldapi.io/api/status`

## Authentication

Add your API key to the `x-access-token` header.

| Header           | Value                                         |
| :--------------- | :-------------------------------------------- |
| `x-access-token` | `goldapi-57e2cf20f4dd6abc215ac566e8c50406-io` |
| `Content-Type`   | `application/json`                            |

## Request Example

### cURL

```bash
curl -X GET 'https://www.goldapi.io/api/status' \
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

fetch("https://www.goldapi.io/api/status", requestOptions)
  .then((response) => response.json())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

## API Output

A successful response returns a JSON object with `result: true`. Any other response indicates the service may be down or experiencing issues.

```json
{
  "result": true
}
```
