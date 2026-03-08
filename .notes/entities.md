# Entities & Objects

## 1. Transaction

This is the core object mapping a financial exchange in the tracker.

### Go / GORM Model (`api/models/transaction.go`)

```go
type Transaction struct {
	ID       uint      `gorm:"primaryKey" json:"id"`
	Amount   float64   `json:"amount"`
	Type     string    `json:"type"` // "income" or "outcome"
	Category string    `json:"category"`
	Note     string    `json:"note"`
	Date     time.Time `json:"date" gorm:"type:timestamp"`
}
```

### Contextual Fields
- `ID`: Auto-generated unique identifier by PostgreSQL.
- `Amount`: Floating point value mapped to an input number field on the frontend.
- `Type`: A strict string holding entirely `"income"` or `"outcome"`. This field decides the frontend coloring logic (Emerald Green for income vs Red for outcome) and the summary math computations on the backend API.
- `Category`: User-generated category string (ex: "Groceries", "Salary") for filtering potential.
- `Note`: Optional descriptive notes describing the object transfer context.
- `Date`: Hardcoded to map directly as POSTGRES datatype `timestamp`. Serializes completely up-to the second boundaries via ISO string formats from the UI layer.

### Svelte / TypeScript Interface (`admin/src/App.svelte`)

Ensures typing sanity entirely when parsing requests from Go APIs:

```typescript
interface Transaction {
  id: number;
  amount: number;
  type: string;
  category: string;
  note: string;
  date: string;
}
```

## 2. Summary

A virtual object only representing dynamic computations.

### Structure mapping from Go to Frontend:
```typescript
interface Summary {
  total_income: number;
  total_outcome: number;
}
```
