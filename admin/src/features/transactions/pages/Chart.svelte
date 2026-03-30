<script lang="ts">
  import { onMount } from "svelte";
  import {
    transactionService,
    type Transaction,
  } from "../services/transaction.service";
  import { formatVND } from "../../../utils/money";

  let chartData = $state<{ category: string; amount: number }[]>([]);
  let loading = $state(true);

  async function fetchData() {
    try {
      loading = true;
      const all = await transactionService.getTransactions();

      // Filter for current month
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();

      const currentMonthTransactions = all.filter((t: Transaction) => {
        const d = new Date(t.date);
        return (
          d.getMonth() === month &&
          d.getFullYear() === year &&
          t.type === "outcome"
        );
      });

      // Group by category
      const grouped = new Map<string, number>();
      currentMonthTransactions.forEach((t) => {
        const existing = grouped.get(t.category) || 0;
        grouped.set(t.category, existing + t.amount);
      });

      // Convert to array and sort by amount descending
      chartData = Array.from(grouped, ([category, amount]) => ({
        category,
        amount,
      })).sort((a, b) => b.amount - a.amount);
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  onMount(fetchData);

  let maxAmount = $derived(Math.max(...chartData.map((d) => d.amount), 0) || 1);
</script>

<div class="chart-container">
  <header class="calendar-header-controls">
    <h2>
      Thống kê chi tiêu theo hạng mục ({new Date().getMonth() +
        1}/{new Date().getFullYear()})
    </h2>
  </header>

  {#if loading}
    <div class="loading">Đang tải dữ liệu...</div>
  {:else if chartData.length === 0}
    <div class="empty-state">
      <p>Chưa có dữ liệu chi tiêu trong tháng này.</p>
    </div>
  {:else}
    <div class="chart-wrapper">
      <div class="bars">
        {#each chartData as item}
          <div class="bar-group">
            <div class="category-name">{item.category}</div>
            <div class="bar-container">
              <div
                class="bar"
                style="width: {(item.amount / maxAmount) * 100}%"
              >
                <span class="value">{formatVND(item.amount)}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .chart-container {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    min-height: 500px;
  }

  .chart-wrapper {
    margin-top: 2rem;
    width: 100%;
    border-left: 2px solid var(--border-color);
    padding-left: 1rem;
    overflow-y: auto;
    max-height: 600px;
  }

  /* Custom Scrollbar for chart */
  .chart-wrapper::-webkit-scrollbar {
    width: 6px;
  }
  .chart-wrapper::-webkit-scrollbar-track {
    background: transparent;
  }
  .chart-wrapper::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  .bars {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    padding: 1rem 0;
  }

  .bar-group {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }

  .category-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    width: 120px;
    text-align: right;
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bar-container {
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
    height: 32px;
    background: #f1f5f9;
    border-radius: 4px;
    padding-right: 60px; /* Space for the value at the end */
  }

  .bar {
    height: 100%;
    background: linear-gradient(to right, var(--outcome), #fca5a5);
    border-radius: 4px;
    position: relative;
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    min-width: 4px;
  }

  .bar:hover {
    filter: brightness(1.1);
    transform: scaleY(1.05);
  }

  .value {
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translate(100%, -50%);
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .loading,
  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    color: var(--text-secondary);
    font-weight: 500;
  }
</style>
