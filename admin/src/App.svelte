<script lang="ts">
  import { onMount } from "svelte";
  import Sidebar from "./lib/Sidebar.svelte";
  import Header from "./lib/Header.svelte";

  interface Transaction {
    id: number;
    amount: number;
    type: string;
    category: string;
    note: string;
    date: string;
  }

  let allTransactions: Transaction[] = [];
  let transactions: Transaction[] = []; // Current month filtered
  let loading = true;
  let submitting = false;

  let amount = "";
  let type = "outcome";
  let category = "";
  let note = "";
  let formDate = new Date().toISOString().slice(0, 10); // format: YYYY-MM-DD

  let showModal = false;
  let showProjectionModal = false;
  let projectionConfig = { expected_daily_revenue: 0 };

  async function fetchProjection() {
    try {
      const res = await fetch("/config/project");
      if (res.ok) projectionConfig = await res.json();
    } catch (e) {
      console.error(e);
    }
  }

  async function updateProjection() {
    try {
      await fetch("/config/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectionConfig),
      });
      showProjectionModal = false;
    } catch (e) {
      console.error(e);
    }
  }

  function openModal(date: Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    formDate = `${yyyy}-${mm}-${dd}`;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  // Calendar State
  let currentDate = new Date();

  let calendarDays: {
    date: Date;
    isCurrentMonth: boolean;
    transactions: Transaction[];
    daySum: number;
  }[] = [];

  let monthlyIncome = 0;
  let monthlyOutcome = 0;

  async function fetchData() {
    try {
      loading = true;
      const res = await fetch("/transactions");
      if (res.ok) {
        allTransactions = await res.json();
      }
      updateCalendar();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      loading = false;
    }
  }

  function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Filter transactions for current month for summary
    monthlyIncome = 0;
    monthlyOutcome = 0;

    // Build grid
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    // Find what day of the week the month starts on (0 = Sunday, 1 = Monday, etc)
    const startDayOfWeek = startOfMonth.getDay();

    // Calculate the start date of the calendar grid (could be from previous month)
    const startDate = new Date(year, month, 1 - startDayOfWeek);

    // The grid is 6 rows of 7 days = 42 days total
    const days = [];

    for (let i = 0; i < 42; i++) {
      const iterDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + i,
      );
      const isCurrentMonth = iterDate.getMonth() === month;

      const dayTransactions = allTransactions.filter((t) => {
        const tDate = new Date(t.date);
        return (
          tDate.getFullYear() === iterDate.getFullYear() &&
          tDate.getMonth() === iterDate.getMonth() &&
          tDate.getDate() === iterDate.getDate()
        );
      });

      let daySum = 0;
      dayTransactions.forEach((t) => {
        if (t.type === "income") {
          daySum += t.amount;
          if (isCurrentMonth) monthlyIncome += t.amount;
        } else {
          daySum -= t.amount;
          if (isCurrentMonth) monthlyOutcome += t.amount;
        }
      });

      const isToday = iterDate.toDateString() === new Date().toDateString();

      days.push({
        date: iterDate,
        isCurrentMonth,
        isToday,
        transactions: dayTransactions,
        daySum,
      });
    }

    calendarDays = days;
  }

  onMount(() => {
    fetchData();
    fetchProjection();
  });

  async function submitTransaction(e: Event) {
    e.preventDefault();
    if (!amount || !category) return;

    submitting = true;
    try {
      const response = await fetch("/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          type,
          category,
          note,
          date: new Date(formDate).toISOString(),
        }),
      });

      if (response.ok) {
        amount = "";
        category = "";
        note = "";
        type = "outcome";
        showModal = false;
        await fetchData(); // Refresh
      }
    } catch (error) {
      console.error("Failed to submit transaction", error);
    } finally {
      submitting = false;
    }
  }

  function prevMonth() {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    updateCalendar();
  }

  function nextMonth() {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );
    updateCalendar();
  }

  const monthNames = [
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

  function formatVND(val: number) {
    return (val * 1000).toLocaleString("vi-VN") + " VND";
  }
</script>

<div class="app-layout">
  <Sidebar />
  <div class="content-wrapper">
    <Header />
    <main class="container">
      <div class="calendar-header-controls">
        <button class="nav-btn" onclick={prevMonth}>&larr; Trước</button>
        <div class="month-title-group">
          <h2>
            {monthNames[currentDate.getMonth()]}
            {currentDate.getFullYear()}
          </h2>
          <button
            class="projection-trigger-btn"
            onclick={() => (showProjectionModal = true)}
          >
            📈 Dự tính
          </button>
        </div>
        <button class="nav-btn" onclick={nextMonth}>Sau &rarr;</button>
      </div>

      <section class="summary-cards">
        <div class="card">
          <h3>Thu nhập (Tháng này)</h3>
          <div class="amount income">{formatVND(monthlyIncome)}</div>
        </div>

        <div class="card">
          <h3>Chi tiêu (Tháng này)</h3>
          <div class="amount outcome">{formatVND(monthlyOutcome)}</div>
        </div>

        <div class="card">
          <h3>Dự kiến ngày mai</h3>
          <div class="amount balance">
            {formatVND(projectionConfig.expected_daily_revenue)}
          </div>
        </div>
      </section>

      <div class="main-content">
        <section class="calendar-section">
          <h2 class="section-header">Lịch</h2>

          <div class="calendar-grid">
            <div class="day-name">CN</div>
            <div class="day-name">T2</div>
            <div class="day-name">T3</div>
            <div class="day-name">T4</div>
            <div class="day-name">T5</div>
            <div class="day-name">T6</div>
            <div class="day-name">T7</div>

            {#each calendarDays as day}
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="calendar-day {day.isCurrentMonth
                  ? 'current-month'
                  : 'other-month'} {day.isToday ? 'is-today' : ''} clickable"
                onclick={() => openModal(day.date)}
              >
                <div class="day-number">{day.date.getDate()}</div>
                <div class="day-events">
                  {#each day.transactions as t}
                    <div class="event-item">
                      <div
                        class="event-desc"
                        title={t.note ? t.category + ": " + t.note : t.category}
                      >
                        {t.category}
                      </div>
                      <div
                        class="event-amount {t.type === 'income'
                          ? 'income-text'
                          : 'outcome-text'}"
                      >
                        {t.type === "income" ? "+" : "-"}{(
                          t.amount * 1000
                        ).toLocaleString("vi-VN")}đ
                      </div>
                    </div>
                  {/each}
                </div>
                {#if day.transactions.length > 0}
                  <div
                    class="day-total {day.daySum >= 0
                      ? 'income-bg'
                      : 'outcome-bg'}"
                  >
                    {day.daySum >= 0 ? "+" : ""}
                    {formatVND(day.daySum)}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </section>

        {#if showModal}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="modal-overlay" onclick={closeModal}>
            <div class="modal-content" onclick={(e) => e.stopPropagation()}>
              <div class="modal-header">
                <h2 class="section-header">Thêm giao dịch</h2>
                <button
                  type="button"
                  class="close-btn"
                  aria-label="Close"
                  onclick={closeModal}>&times;</button
                >
              </div>
              <div class="card form-card">
                <form onsubmit={submitTransaction}>
                  <div class="form-group">
                    <label for="type">Loại giao dịch</label>
                    <select id="type" bind:value={type}>
                      <option value="outcome">Chi phí</option>
                      <option value="income">Thu nhập</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="amount">Số tiền (x000VND)</label>
                    <input
                      type="number"
                      id="amount"
                      step="1"
                      min="0"
                      bind:value={amount}
                      required
                      placeholder="0"
                    />
                  </div>

                  <div class="form-group">
                    <label for="category">Danh mục</label>
                    <input
                      type="text"
                      id="category"
                      bind:value={category}
                      required
                      placeholder="VD: Ăn uống, Lương..."
                    />
                  </div>

                  <div class="form-group">
                    <label for="date">Ngày</label>
                    <input
                      type="date"
                      id="date"
                      bind:value={formDate}
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="note">Ghi chú</label>
                    <textarea
                      id="note"
                      bind:value={note}
                      rows="2"
                      placeholder="Chi tiết thêm..."
                    ></textarea>
                  </div>

                  <button type="submit" disabled={submitting}>
                    {submitting ? "Đang lưu..." : "Lưu giao dịch"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        {/if}

        {#if showProjectionModal}
          <div
            class="modal-overlay"
            onclick={() => (showProjectionModal = false)}
          >
            <div class="modal-content" onclick={(e) => e.stopPropagation()}>
              <div class="modal-header">
                <h2 class="section-header">Cấu hình Dự tính</h2>
                <button
                  type="button"
                  class="close-btn"
                  onclick={() => (showProjectionModal = false)}>&times;</button
                >
              </div>
              <div class="card form-card">
                <div class="form-group">
                  <label for="expected"
                    >Doanh thu dự kiến hằng ngày (x000VND)</label
                  >
                  <input
                    type="number"
                    id="expected"
                    bind:value={projectionConfig.expected_daily_revenue}
                    placeholder="1000"
                  />
                </div>
                <p class="projection-hint">
                  Hệ thống sẽ dùng con số này để hiển thị mục tiêu/dự tính cho
                  các ngày tiếp theo.
                </p>
                <button
                  type="button"
                  class="save-config-btn"
                  onclick={updateProjection}
                >
                  Lưu cấu hình
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </main>
  </div>
</div>
