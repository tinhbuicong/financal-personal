<script lang="ts">
  import { onMount } from "svelte";
  import Sidebar from "./lib/Sidebar.svelte";
  import Header from "./lib/Header.svelte";
  import Calendar from "./features/transactions/pages/Calendar.svelte";
  import Chart from "./features/transactions/pages/Chart.svelte";
  import CategoryGroups from "./features/transactions/pages/CategoryGroups.svelte";

  let currentPage = $state(window.location.pathname === "/" ? "/calendar" : window.location.pathname);

  onMount(() => {
    const handleNavigation = () => {
      currentPage = window.location.pathname === "/" ? "/calendar" : window.location.pathname;
    };
    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("navigate", handleNavigation);

    // Initial redirect if path is root
    if (window.location.pathname === "/") {
      history.replaceState(null, "", "/calendar");
      currentPage = "/calendar";
    } else if (window.location.hash) {
      // Migrate from hash if present
      const path = window.location.hash.substring(1);
      history.replaceState(null, "", `/${path}`);
      currentPage = `/${path}`;
    }

    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("navigate", handleNavigation);
    };
  });
</script>

<div class="app-layout">
  <Sidebar />
  <div class="content-wrapper">
    <Header />
    <main class="container">
      {#if currentPage === "/calendar"}
        <Calendar />
      {:else if currentPage === "/chart"}
        <Chart />
      {:else if currentPage === "/category-groups"}
        <CategoryGroups />
      {:else}
        <div class="not-found">
          <section class="calendar-header-controls">
            <h2>Trường hợp này chưa được phát triển</h2>
          </section>
          <a
            href="/calendar"
            class="nav-btn"
            onclick={(e) => {
              e.preventDefault();
              history.pushState(null, "", "/calendar");
              window.dispatchEvent(new Event("navigate"));
            }}>Quay lại Calendar</a
          >
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
