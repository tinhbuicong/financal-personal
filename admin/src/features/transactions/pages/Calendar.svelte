<script lang="ts">
  import { onMount } from "svelte";
  import {
    transactionService,
    type Transaction,
  } from "../services/transaction.service";

  import CalendarGrip from "../components/CalendarGrip.svelte";
  import TransactionModal from "../modal/TransactionModal.svelte";

  let allTransactions: Transaction[] = [];
  let loading = true;
  let formDate = new Date().toISOString().slice(0, 10); // format: YYYY-MM-DD

  let showModal = false;

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

  async function fetchData() {
    try {
      loading = true;
      allTransactions = await transactionService.getTransactions();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchData();
  });
</script>

<div class="main-content">
  {#if !loading}
    <CalendarGrip {allTransactions} {openModal} />
  {:else}
    <div class="loading">Đang tải dữ liệu...</div>
  {/if}

  <TransactionModal
    {showModal}
    {closeModal}
    bind:formDate
    refreshData={() => {
      fetchData();
    }}
  />
</div>
