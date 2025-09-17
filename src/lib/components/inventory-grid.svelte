<script lang="ts">
  import type { GameState } from '$lib/game';
  import { ItemType, ItemRarity } from '$lib/game';
  import ItemCard from './item-card.svelte';
  import InventoryFilters from './inventory-filters.svelte';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  let selectedType = $state<ItemType | undefined>(undefined);
  let selectedRarity = $state<ItemRarity | undefined>(undefined);

  let filteredItems = $derived(
    gameState.getFilteredItems(selectedType, selectedRarity)
  );

  let availableTypes = $derived(gameState.getAvailableTypes());
  let availableRarities = $derived(gameState.getAvailableRarities());

  function handleItemClick(itemId: string) {
    gameState.equipItemFromInventory(itemId);
  }

  function handleTypeChange(type?: ItemType) {
    selectedType = type;
  }

  function handleRarityChange(rarity?: ItemRarity) {
    selectedRarity = rarity;
  }
</script>

<div class="inventory-grid rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-6 lg:p-8">
  <h2 class="mb-4 text-xl font-bold text-white">Inventory</h2>

  {#if gameState.inventorySize > 0}
    <InventoryFilters
      {selectedType}
      {selectedRarity}
      {availableTypes}
      {availableRarities}
      onTypeChange={handleTypeChange}
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