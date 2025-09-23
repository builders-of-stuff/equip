<script lang="ts">
  import type { GameState } from '$lib/game';
  import { ItemSlot, ItemRarity } from '$lib/game';
  import ItemCard from './item-card.svelte';
  import InventoryFilters from './inventory-filters.svelte';
  import { Button } from './ui/button/index.js';
  import { Loader2, Trash } from 'lucide-svelte';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  let selectedSlot = $state<ItemSlot | undefined>(undefined);
  let selectedRarity = $state<ItemRarity | undefined>(undefined);
  let showDeleteConfirmation = $state<boolean>(false);

  let filteredItems = $derived(
    gameState.getFilteredItems(selectedSlot, selectedRarity)
  );

  let availableSlots = $derived(gameState.getAvailableSlots());
  let availableRarities = $derived(gameState.getAvailableRarities());

  function handleItemClick(itemId: string) {
    gameState.equipItemFromInventory(itemId);
  }

  function handleSlotChange(slot?: ItemSlot) {
    selectedSlot = slot;
  }

  function handleRarityChange(rarity?: ItemRarity) {
    selectedRarity = rarity;
  }

  function handleDeleteAllItems() {
    showDeleteConfirmation = true;
  }

  async function confirmDeleteAllItems() {
    try {
      await gameState.deleteAllItems();
      showDeleteConfirmation = false;
    } catch (error) {
      console.error('Failed to delete all items:', error);
    }
  }

  function cancelDeleteAllItems() {
    showDeleteConfirmation = false;
  }
</script>

<div class="inventory-grid rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-6 lg:p-8">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-xl font-bold text-white">Inventory</h2>
    {#if gameState.inventorySize > 0}
      <Button
        onclick={handleDeleteAllItems}
        disabled={gameState.isDeletingItems || gameState.isLoading}
        variant="destructive"
        size="sm"
      >
        {#if gameState.isDeletingItems}
          <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          Deleting...
        {:else}
          <Trash class="mr-2 h-4 w-4" />
          Delete All
        {/if}
      </Button>
    {/if}
  </div>

  {#if gameState.inventorySize > 0}
    <InventoryFilters
      selectedSlot={selectedSlot}
      {selectedRarity}
      availableSlots={availableSlots}
      {availableRarities}
      onSlotChange={handleSlotChange}
      onRarityChange={handleRarityChange}
    />
  {/if}

  {#if gameState.inventorySize === 0}
    <div class="flex h-32 items-center justify-center text-gray-400">
      <div class="text-center">
        <div class="text-4xl">📦</div>
        <div class="mt-2 text-sm">Your inventory is empty</div>
      </div>
    </div>
  {:else}
    {#if filteredItems.length === 0}
      <div class="flex h-32 items-center justify-center text-gray-400">
        <div class="text-center">
          <div class="text-4xl">🔍</div>
          <div class="mt-2 text-sm">No items match your filters</div>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {#each filteredItems as item (item.id)}
        <ItemCard
          {item}
          draggable={true}
          onclick={() => handleItemClick(item.id)}
          class="hover:scale-105"
        />
        {/each}
      </div>
    {/if}
  {/if}

  <div class="mt-6 text-xs text-gray-400">
    <div>💡 Tip: Click an item to equip it, or drag it to an equipment slot</div>
    <div class="mt-1">
      Items: {filteredItems.length}{gameState.inventorySize !== filteredItems.length ? ` of ${gameState.inventorySize}` : ''}
    </div>
  </div>
</div>

<!-- Delete Confirmation Dialog -->
{#if showDeleteConfirmation}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md mx-4">
      <h3 class="text-lg font-bold text-white mb-4">Delete All Items</h3>
      <p class="text-gray-300 mb-6">
        Are you sure you want to delete all {gameState.inventorySize} items from your inventory?
        This action cannot be undone and all items will be permanently destroyed.
      </p>
      <div class="flex gap-3 justify-end">
        <Button
          onclick={cancelDeleteAllItems}
          variant="outline"
          disabled={gameState.isDeletingItems}
        >
          Cancel
        </Button>
        <Button
          onclick={confirmDeleteAllItems}
          variant="destructive"
          disabled={gameState.isDeletingItems}
        >
          {#if gameState.isDeletingItems}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
            Deleting...
          {:else}
            <Trash class="mr-2 h-4 w-4" />
            Delete All Items
          {/if}
        </Button>
      </div>
    </div>
  </div>
{/if}