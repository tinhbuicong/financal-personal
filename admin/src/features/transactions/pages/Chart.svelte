<script lang="ts">
  import { onMount } from "svelte";
  import {
    transactionService,
    type Transaction,
  } from "../services/transaction.service";
  import {
    categoryService,
    type CategoryMapping,
  } from "../services/category.service";
  import { formatVND } from "../../../utils/money";
  import Chart from "chart.js/auto";

  let chartData = $state<{ category: string; amount: number }[]>([]);
  let yearlyData = $state<{ [category: string]: number[] }>({});
  let loading = $state(true);
  let canvas = $state<HTMLCanvasElement | null>(null);
  let chartInstance: Chart | null = null;

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#06b6d4",
  ];

  async function fetchData() {
    try {
      loading = true;
      const [all, mappings] = await Promise.all([
        transactionService.getTransactions(),
        categoryService.getMappings(),
      ]);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // 1. Process Monthly Bar Chart Data
      const currentMonthTransactions = all.filter((t: Transaction) => {
        const d = new Date(t.date);
        return (
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear &&
          t.type === "outcome"
        );
      });

      const grouped = new Map<string, number>();
      currentMonthTransactions.forEach((t) => {
        const mapping = mappings.find((m) => m.category_name === t.category);
        const displayName =
          mapping && mapping.group_name ? mapping.group_name : t.category;

        const existing = grouped.get(displayName) || 0;
        grouped.set(displayName, existing + t.amount);
      });

      chartData = Array.from(grouped, ([category, amount]) => ({
        category,
        amount,
      })).sort((a, b) => b.amount - a.amount);

      // 2. Process Yearly Line Chart Data
      const yearlySpending: { [category: string]: number[] } = {};
      const currentYearTransactions = all.filter((t: Transaction) => {
        const d = new Date(t.date);
        return d.getFullYear() === currentYear && t.type === "outcome";
      });

      currentYearTransactions.forEach((t) => {
        const d = new Date(t.date);
        const m = d.getMonth();

        const mapping = mappings.find((m) => m.category_name === t.category);
        const displayName =
          mapping && mapping.group_name ? mapping.group_name : t.category;

        if (!yearlySpending[displayName]) {
          yearlySpending[displayName] = new Array(12).fill(0);
        }
        yearlySpending[displayName][m] += t.amount;
      });

      yearlyData = yearlySpending;
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    if (canvas && Object.keys(yearlyData).length > 0) {
      initYearlyChart();
    }
    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  });

  function initYearlyChart() {
    if (!canvas) {
      console.warn("Canvas not available for Yearly Chart");
      return;
    }

    if (chartInstance) {
      chartInstance.destroy();
    }

    // Use JSON.parse/stringify to ensure deep plainness for Chart.js
    const rawData = JSON.parse(JSON.stringify(yearlyData));
    const categories = Object.keys(rawData);
    if (categories.length === 0) return;

    const datasets = categories.map((category, index) => ({
      label: category,
      data: rawData[category],
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + "33",
      tension: 0.3,
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 6,
    }));

    try {
      chartInstance = new Chart(canvas, {
        type: "line",
        data: {
          labels: months,
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
                padding: 15,
                font: { size: 11 },
              },
            },
            tooltip: {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              titleColor: "#334155",
              bodyColor: "#334155",
              borderColor: "#e2e8f0",
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label: (context) => {
                  const val = context.parsed.y;
                  return `${context.dataset.label}: ${formatVND(val || 0)}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "#f1f5f9",
              },
              ticks: {
                font: { size: 10 },
                callback: (value) => {
                  const num = Number(value);
                  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
                  if (num >= 1000) return (num / 1000).toFixed(0) + "k";
                  return num;
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: { size: 10 },
              },
            },
          },
        },
      });
    } catch (err) {
      console.error("Error creating Yearly Chart:", err);
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

  {#if !loading}
    <div class="divider"></div>

    <header class="calendar-header-controls">
      <h2>Xu hướng chi tiêu cả năm ({new Date().getFullYear()})</h2>
    </header>

    <div class="yearly-chart-wrapper">
      <canvas bind:this={canvas}></canvas>
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
    margin: 0 auto;
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
    gap: 1rem;
    width: 90%;
    padding: 0.5rem 0;
  }

  .bar-group {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  .category-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-primary);
    width: 100px;
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
    height: 20px;
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

  .divider {
    height: 1px;
    background: #e2e8f0;
    margin: 3rem 0;
  }

  .yearly-chart-wrapper {
    height: 400px;
    width: 100%;
    margin-top: 1rem;
  }
</style>
