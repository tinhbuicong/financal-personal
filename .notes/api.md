# API Endpoints

## Base URL
Running locally on Port `:3000`. Internally marshaled via `/transactions` scope mapping.

### 1. Create Transaction
- **Method**: `POST`
- **Route**: `/transactions`
- **Body Context**: Expects raw JSON payload matching the `Transaction` entity.
- **Backend Flow (`handlers/transaction.go`)**: Binds Fiber context directly over to the Entity memory map model. Validates JSON logic natively then executes `config.DB.Create()` to Postgres.
- **Response**: `201 Created` returning the JSON object holding the generated Primary Key ID. Or errors via `400` context or `500` server breakdown.

### 2. Fetch Daily Transactions
- **Method**: `GET`
- **Route**: `/transactions/daily`
- **Logic**: Filters solely based on `startOfDay` and limit of `endOfDay`. It queries exclusively timestamp data using bounds `>= start AND < end`. 
- **Return Type**: Arrays of `Transaction` mappings strictly.

### 3. Fetch Summary Totals
- **Method**: `GET`
- **Route**: `/transactions/summary`
- **Logic**: Runs identical timestamp boundaries logic but processes internal memory aggregation arrays (loops `for` all bounds), filtering against `t.Type` == "income" vs "outcome", subsequently summarizing numbers sequentially.
- **Return Type**: Map formatted JSON. Ex: `{"total_income": 40.22, "total_outcome": 5.0}`.
