<script lang="ts">
  import { onMount } from "svelte";
  import {
    categoryService,
    type CategoryMapping,
  } from "../services/category.service";
  import { transactionService } from "../services/transaction.service";

  let mappings = $state<CategoryMapping[]>([]);
  let transactions = $state<any[]>([]);
  let categoriesInUse = $state<string[]>([]);
  let loading = $state(true);
  let saving = $state(false);

  // Selector state
  let activeAddGroup = $state<string | null>(null);

  // Grouped data derived from mappings and categoriesInUse
  let groupedData = $derived.by(() => {
    const groups: Record<string, { name: string; id: number }[]> = {};
    const unassigned: string[] = [];

    categoriesInUse.forEach((cat) => {
      const mapping = mappings.find((m) => m.category_name === cat);
      if (mapping && mapping.group_name) {
        if (!groups[mapping.group_name]) {
          groups[mapping.group_name] = [];
        }
        groups[mapping.group_name].push({ name: cat, id: mapping.id! });
      } else {
        unassigned.push(cat);
      }
    });

    return { groups, unassigned };
  });

  async function loadData() {
    try {
      loading = true;
      const [allMappings, allTransactions] = await Promise.all([
        categoryService.getMappings(),
        transactionService.getTransactions(),
      ]);

      mappings = allMappings;
      transactions = allTransactions;

      const uniqueCats = Array.from(
        new Set(transactions.map((t) => t.category)),
      ).sort();
      categoriesInUse = uniqueCats;
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  onMount(loadData);

  async function removeFromGroup(id: number) {
    try {
      await categoryService.deleteMapping(id);
      mappings = await categoryService.getMappings();
    } catch (e) {
      console.error(e);
    }
  }

  async function addToGroup(categoryName: string, groupName: string) {
    try {
      await categoryService.updateMapping({
        category_name: categoryName,
        group_name: groupName,
      });
      mappings = await categoryService.getMappings();
      activeAddGroup = null; // Close selector
    } catch (e) {
      console.error(e);
    }
  }

  async function renameGroup(oldGroupName: string, newGroupName: string) {
    const catsInGroup = groupedData.groups[oldGroupName];
    if (
      !catsInGroup ||
      newGroupName.trim() === "" ||
      oldGroupName === newGroupName
    )
      return;

    try {
      await Promise.all(
        catsInGroup.map((cat) =>
          categoryService.updateMapping({
            category_name: cat.name,
            group_name: newGroupName,
          }),
        ),
      );
      const updatedMappings = await categoryService.getMappings();
      mappings = updatedMappings;
    } catch (e) {
      console.error(e);
    }
  }
</script>

<div class="category-groups-container">
  <header class="calendar-header-controls">
    <h2>Quản lý Nhóm Hạng mục</h2>
    <p class="description">
      Phân loại các hạng mục chi tiêu theo nhóm để xem biểu đồ thống kê tập
      trung hơn.
    </p>
  </header>

  {#if loading}
    <div class="loading">Đang tải dữ liệu...</div>
  {:else}
    <div class="mapping-table-wrapper">
      <table class="mapping-table">
        <thead>
          <tr>
            <th class="group-col">Nhóm hiển thị</th>
            <th class="category-col">Các hạng mục thuộc nhóm</th>
          </tr>
        </thead>
        <tbody>
          <!-- Unassigned row section (Special style) -->
          {#if groupedData.unassigned.length > 0}
            <tr class="unassigned-row">
              <td class="group-cell">
                <div class="unassigned-header">
                  <span class="unassigned-label">Chưa phân nhóm</span>
                  <span class="count-badge"
                    >{groupedData.unassigned.length}</span
                  >
                </div>
              </td>
              <td class="category-cell">
                <div class="tag-list">
                  {#each groupedData.unassigned as cat}
                    <div class="pure-tag shadow-sm">
                      {cat}
                    </div>
                  {/each}
                </div>
              </td>
            </tr>
          {/if}

          <!-- Grouped rows -->
          {#each Object.entries(groupedData.groups) as [groupName, cats]}
            <tr>
              <td class="group-cell">
                <input
                  type="text"
                  value={groupName}
                  class="group-input"
                  onchange={(e) =>
                    renameGroup(groupName, e.currentTarget.value)}
                  placeholder="Tên nhóm..."
                />
              </td>
              <td class="category-cell">
                <div class="tag-list">
                  {#each cats as cat}
                    <div class="interactive-tag">
                      <span class="tag-label">{cat.name}</span>
                      <button
                        class="remove-icon"
                        onclick={() => removeFromGroup(cat.id)}
                        title="Xóa khỏi nhóm"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3"
                        >
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  {/each}

                  <!-- Add to this group button -->
                  <div class="add-action-wrapper">
                    <button
                      class="add-tag-btn"
                      onclick={() =>
                        (activeAddGroup =
                          activeAddGroup === groupName ? null : groupName)}
                      title="Thêm hạng mục vào nhóm này"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Thêm
                    </button>

                    {#if activeAddGroup === groupName}
                      <div class="assign-selector shadow-lg">
                        <div class="selector-header">
                          Chọn hạng mục để thêm:
                        </div>
                        <div class="selector-list">
                          {#each groupedData.unassigned as unCat}
                            <button
                              class="selector-item"
                              onclick={() => addToGroup(unCat, groupName)}
                            >
                              {unCat}
                            </button>
                          {:else}
                            <div class="selector-empty">
                              Không còn hạng mục chưa phân nhóm
                            </div>
                          {/each}
                        </div>
                      </div>
                    {/if}
                  </div>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .category-groups-container {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    min-height: 600px;
  }

  .mapping-table-wrapper {
    margin-top: 2rem;
    border: 1px solid #eef2f6;
    border-radius: 12px;
    overflow: visible; /* Important for dropdown visibility */
  }

  .mapping-table {
    width: 100%;
    border-collapse: collapse;
  }

  .mapping-table th {
    background: #fcfdfe;
    padding: 1.25rem 1rem;
    text-align: left;
    font-size: 0.9rem;
    font-weight: 800;
    color: #1e293b;
    border-bottom: 2px solid #f1f5f9;
  }

  .group-col {
    width: 280px;
  }

  .mapping-table td {
    padding: 1.5rem 1rem;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: top;
  }

  .unassigned-row {
    background: #fffefb;
  }

  .unassigned-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .unassigned-label {
    font-weight: 800;
    color: #92400e;
    font-size: 0.875rem;
  }

  .count-badge {
    background: #fef3c7;
    color: #92400e;
    padding: 0.1rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .group-input {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 2px solid #f1f5f9;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.95rem;
    color: #f97316;
    transition: all 0.2s;
  }

  .group-input:focus {
    border-color: #f97316;
    outline: none;
    box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
  }

  .pure-tag {
    background: #f8fafc;
    color: #64748b;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid #e2e8f0;
  }

  .interactive-tag {
    position: relative;
    background: #eff6ff;
    color: #1e40af;
    padding: 0.5rem 1rem;
    padding-right: 2.2rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 700;
    border: 1px solid #dbeafe;
    transition: all 0.2s;
    user-select: none;
  }

  .interactive-tag:hover {
    background: #dbeafe;
    transform: translateY(-1px);
  }

  .remove-icon {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    background: #3b82f6;
    color: white;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    opacity: 0;
    transition: all 0.2s;
  }

  .interactive-tag:hover .remove-icon {
    opacity: 1;
  }

  .add-action-wrapper {
    position: relative;
  }

  .add-tag-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: white;
    color: #64748b;
    border: 2px dashed #e2e8f0;
    padding: 0.4rem 1rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .add-tag-btn:hover {
    border-color: #f97316;
    color: #f97316;
    background: #fff7ed;
  }

  .assign-selector {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    background: white;
    width: 280px;
    max-height: 300px;
    overflow-y: auto;
    border-radius: 12px;
    border: 1px solid #eef2f6;
    z-index: 50;
    padding: 0.5rem;
  }

  .selector-header {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .selector-item {
    width: 100%;
    text-align: left;
    padding: 0.6rem 0.75rem;
    border: none;
    background: transparent;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #334155;
    cursor: pointer;
  }

  .selector-item:hover {
    background: #f8fafc;
    color: #f97316;
  }

  .selector-empty {
    padding: 1.5rem 1rem;
    text-align: center;
    color: #94a3b8;
    font-size: 0.8rem;
    font-style: italic;
  }

  .description {
    margin-top: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    color: var(--text-secondary);
    font-weight: 600;
  }
</style>
