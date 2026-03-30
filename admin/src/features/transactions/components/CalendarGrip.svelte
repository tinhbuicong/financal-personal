<script lang="ts">
  import SummaryCardsWrapper from "./SummaryCardsWrapper.svelte";
  import { formatVND } from "../../../utils/money";
  import type { Transaction } from "../services/transaction.service";

  export let allTransactions: Transaction[] = [];
  export let openModal: (date: Date) => void;

  // Calendar State
  let currentDate = new Date();
  let calendarDays: {
    date: Date;
    isCurrentMonth: boolean;
    transactions: Transaction[];
    daySum: number;
    isToday: boolean;
  }[] = [];

  let monthlyIncome = 0;
  let monthlyOutcome = 0;

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

  function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Filter transactions for current month for summary
    monthlyIncome = 0;
    monthlyOutcome = 0;

    // Build grid
    const startOfMonth = new Date(year, month, 1);
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

  // Reactive updates
  $: {
    if (allTransactions || currentDate) {
      updateCalendar();
    }
  }
</script>

<SummaryCardsWrapper
  {prevMonth}
  {nextMonth}
  {monthNames}
  {currentDate}
  {monthlyOutcome}
/>

<section class="calendar-section">
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
          <div class="day-total {day.daySum >= 0 ? 'income-bg' : 'outcome-bg'}">
            {day.daySum >= 0 ? "+" : ""}
            {formatVND(day.daySum)}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</section>
