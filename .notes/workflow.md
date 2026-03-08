# Local Workflow & Next Steps

## ⚙️ How to Run Locally

### 1. Boot up PostgreSQL Database
Start your docker-compose file:
```bash
docker-compose up -d db
```

### 2. Run the Go Fiber API
Run the backend in the `api` folder:
```bash
cd api
go mod tidy
go run main.go
```
*Make sure your `.env` is initialized inside `api`.*

### 3. Run the Svelte Admin Board
From the `admin` folder run the development server via Vite:
```bash
cd admin
npm install
npm run dev
```

---

## 📌 To-Do / Next Features
*Potential roadmap for the Financial Tracker*

1. **Analytical Features**: Add charts (like Chart.js/ApexCharts) on the Svelte Admin Board to visualize spending over the month.
2. **Filtering & Pagination**: Broaden the endpoints to support paginated transaction searches based on categories and custom date intervals instead of just "daily".
3. **Authentication**: Provide a basic secure lock (JWT/Session over Fiber) over the API endpoints before exposing it remotely.
4. **Validation Logic**: Integrate Fiber/Go Validator to properly reject faulty payloads before they hit GORM.
