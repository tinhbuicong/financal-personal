<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Transaction {
    id: number;
    amount: number;
    type: string;
    category: string;
    note: string;
    date: string;
  }
  
  interface Summary {
    total_income: number;
    total_outcome: number;
  }

  let transactions: Transaction[] = [];
  let summary: Summary = { total_income: 0, total_outcome: 0 };
  let loading = true;
  let submitting = false;

  // Form State
  let amount = '';
  let type = 'outcome';
  let category = '';
  let note = '';
  let date = new Date().toISOString().slice(0, 16); // format: YYYY-MM-DDThh:mm

  async function fetchData() {
    try {
      loading = true;
      const [transRes, sumRes] = await Promise.all([
        fetch('/transactions/daily'),
        fetch('/transactions/summary')
      ]);
      
      if (transRes.ok) transactions = await transRes.json();
      if (sumRes.ok) summary = await sumRes.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchData();
  });

  async function submitTransaction(e: Event) {
    e.preventDefault();
    if (!amount || !category) return;
    
    submitting = true;
    try {
      const response = await fetch('/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          type,
          category,
          note,
          date: new Date(date).toISOString()
        })
      });

      if (response.ok) {
        // Reset form
        amount = '';
        category = '';
        note = '';
        type = 'outcome';
        await fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Failed to submit transaction", error);
    } finally {
      submitting = false;
    }
  }
</script>

<main class="container">
  <header>
    <h1>Financial Tracker Admin</h1>
  </header>

  <section class="summary-cards">
    <div class="card">
      <h3>Income Today</h3>
      <div class="amount income">${summary.total_income.toFixed(2)}</div>
    </div>
    
    <div class="card">
      <h3>Outcome Today</h3>
      <div class="amount outcome">${summary.total_outcome.toFixed(2)}</div>
    </div>

    <div class="card">
      <h3>Balance</h3>
      <div class="amount balance">${(summary.total_income - summary.total_outcome).toFixed(2)}</div>
    </div>
  </section>

  <div class="grid-layout">
    <section>
      <h2 class="section-header">Add Transaction</h2>
      <div class="card">
        <form onsubmit={submitTransaction}>
          
          <div class="form-group">
            <label for="type">Type</label>
            <select id="type" bind:value={type}>
              <option value="outcome">Outcome</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div class="form-group">
            <label for="amount">Amount ($)</label>
            <input type="number" id="amount" step="0.01" min="0" bind:value={amount} required placeholder="0.00" />
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <input type="text" id="category" bind:value={category} required placeholder="Groceries, Salary, etc." />
          </div>

          <div class="form-group">
            <label for="date">Date & Time</label>
            <input type="datetime-local" id="date" bind:value={date} required />
          </div>

          <div class="form-group">
            <label for="note">Note (optional)</label>
            <textarea id="note" bind:value={note} rows="2" placeholder="Write a short note..."></textarea>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </section>

    <section>
      <h2 class="section-header">Today's Transactions</h2>
      
      {#if loading}
        <div class="empty-state">Loading transactions...</div>
      {:else if !transactions || transactions.length === 0}
        <div class="empty-state">No transactions recorded for today.</div>
      {:else}
        <div class="transaction-list">
          {#each transactions as r}
            <div class="transaction-item">
              <div class="t-info">
                <span class="t-category">{r.category}</span>
                {#if r.note}
                  <span class="t-note">{r.note}</span>
                {/if}
              </div>
              <div class="t-amount {r.type}">
                {r.amount.toFixed(2)}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>

  </div>
</main>
