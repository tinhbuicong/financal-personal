<script lang="ts">
  import { onMount } from "svelte";
  import Sidebar from "./lib/Sidebar.svelte";
  import Header from "./lib/Header.svelte";
  import Calendar from "./features/transactions/pages/Calendar.svelte";
  import Chart from "./features/transactions/pages/Chart.svelte";

  let currentPage = $state(window.location.hash || "#calendar");

  onMount(() => {
    const handleHashChange = () => {
      currentPage = window.location.hash || "#calendar";
    };
    window.addEventListener("hashchange", handleHashChange);

    // Initial redirect if hash is empty
    if (!window.location.hash) {
      window.location.hash = "#calendar";
    }

    return () => window.removeEventListener("hashchange", handleHashChange);
  });
</script>

<div class="app-layout">
  <Sidebar />
  <div class="content-wrapper">
    <Header />
    <main class="container">
      {#if currentPage === "#calendar"}
        <Calendar />
      {:else if currentPage === "#chart"}
        <Chart />
      {:else}
        <div class="not-found">
          <section class="calendar-header-controls">
            <h2>Trường hợp này chưa được phát triển</h2>
          </section>
          <a href="#calendar" class="nav-btn">Quay lại Calendar</a>
        </div>
      {/if}
    </main>
  </div>
</div>

<style>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    gap: 2rem;
  }
</style>
