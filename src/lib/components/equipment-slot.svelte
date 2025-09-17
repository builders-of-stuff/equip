<script lang="ts">
  import { Item, ItemSlot } from '$lib/game';
  import ItemCard from './item-card.svelte';

  interface Props {
    slotType: ItemSlot;
    item?: Item;
    onDrop: (item: Item) => void;
    onRemove: () => void;
  }

  let { slotType, item, onDrop, onRemove }: Props = $props();

  let dragOver = $state(false);

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;

    const itemData = event.dataTransfer?.getData('application/json');
    if (itemData) {
      const droppedItem = JSON.parse(itemData) as Item;
      if (droppedItem.slot === slotType) {
        onDrop(droppedItem);
      }
    }
  }

  function getSlotLabel(slot: ItemSlot): string {
    switch (slot) {
      case ItemSlot.HELMET: return 'Helmet';
      case ItemSlot.ARMOR: return 'Armor';
      case ItemSlot.SWORD: return 'Sword';
      case ItemSlot.RIGHT_ARM: return 'Right Arm';
      case ItemSlot.LEFT_ARM: return 'Left Arm';
      default: return slot;
    }
  }

  function getSlotIcon(slot: ItemSlot): string {
    switch (slot) {
      case ItemSlot.HELMET: return '🪖';
      case ItemSlot.ARMOR: return '🦺';
      case ItemSlot.SWORD: return '⚔️';
      case ItemSlot.RIGHT_ARM: return '🧤';
      case ItemSlot.LEFT_ARM: return '🛡️';
      default: return '❓';
    }
  }
</script>

<div
  class="equipment-slot relative min-h-24 min-w-24 rounded-lg border-2 border-dashed border-gray-600 bg-gray-800 p-2 transition-all duration-200 {dragOver ? 'border-blue-400 bg-blue-900/20' : ''}"
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
  role="button"
  tabindex="0"
>
  {#if item}
    <ItemCard
      {item}
      draggable={true}
      onclick={onRemove}
      class="cursor-pointer hover:scale-105"
    />
  {:else}
    <div class="flex h-full min-h-20 flex-col items-center justify-center text-gray-400">
      <div class="text-2xl">{getSlotIcon(slotType)}</div>
      <div class="text-xs font-medium">{getSlotLabel(slotType)}</div>
    </div>
  {/if}
</div>

<style>
  .equipment-slot {
    aspect-ratio: 1;
  }
</style>