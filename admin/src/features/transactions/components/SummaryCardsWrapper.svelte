<script>
  import { formatVND } from "../../../utils/money";

  export let prevMonth;
  export let nextMonth;
  export let monthNames;
  export let currentDate;
  export let monthlyOutcome;
</script>

<div class="summary-cards-wrapper">
  <section class="summary-cards">
    <div class="card">
      <h3>Chi tiêu (Tháng này)</h3>
      <div class="amount outcome">{formatVND(monthlyOutcome)}</div>
    </div>
  </section>

  <!-- New Mini Nav Navigation for Calendar tucked under summary cards -->
  <div class="calendar-mini-nav">
    <button class="mini-nav-btn" onclick={prevMonth} title="Trước">
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    <div class="current-month-display">
      {monthNames[currentDate.getMonth()]}
      {currentDate.getFullYear()}
    </div>

    <button class="mini-nav-btn" onclick={nextMonth} title="Sau">
      <svg
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  </div>
</div>
