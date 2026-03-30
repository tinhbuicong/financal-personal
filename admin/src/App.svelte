<script lang="ts">
  import Sidebar from "./lib/Sidebar.svelte";
  import Header from "./lib/Header.svelte";
  import Calendar from "./features/transactions/index.svelte";
</script>

<div class="app-layout">
  <Sidebar />
  <div class="content-wrapper">
    <Header />
    <main class="container">
      <Calendar />
    </main>
  </div>
</div>
