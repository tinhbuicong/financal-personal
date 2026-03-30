<script lang="ts">
  import { transactionService } from "../services/transaction.service";

  export let showModal = false;
  export let closeModal: () => void;
  export let refreshData: () => void = () => {};
  let amount = "";
  let type: "income" | "outcome" = "outcome";
  let category = "";
  let note = "";

  export let formDate = new Date().toISOString().slice(0, 10);
  let submitting = false;

  async function submitTransaction(e: SubmitEvent) {
    e.preventDefault();
    if (!amount || !category) return;

    submitting = true;
    try {
      await transactionService.createTransaction({
        amount: parseFloat(amount),
        type,
        category,
        note,
        date: new Date(formDate).toISOString(),
      });

      amount = "";
      category = "";
      note = "";
      type = "outcome";
      showModal = false;
      refreshData();
    } catch (error) {
      console.error("Failed to submit transaction", error);
    } finally {
      submitting = false;
    }
  }
</script>

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
            <input type="date" id="date" bind:value={formDate} required />
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
