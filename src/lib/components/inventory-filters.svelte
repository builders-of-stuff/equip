<script lang="ts">
  import { ItemSlot, ItemRarity } from '$lib/game';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
  } from '$lib/components/ui/dropdown-menu';
  import { ChevronDown } from 'lucide-svelte';

  interface Props {
    selectedSlot?: ItemSlot;
    selectedRarity?: ItemRarity;
    availableSlots: ItemSlot[];
    availableRarities: ItemRarity[];
    onSlotChange: (slot?: ItemSlot) => void;
    onRarityChange: (rarity?: ItemRarity) => void;
  }

  let {
    selectedSlot,
    selectedRarity,
    availableSlots,
    availableRarities,
    onSlotChange,
    onRarityChange
  }: Props = $props();

  function getSlotDisplayName(slot: ItemSlot): string {
    return slot.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  function getRarityDisplayName(rarity: ItemRarity): string {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  }
</script>

<div class="mb-4 flex flex-wrap gap-3">
  <!-- Type Filter -->
  <DropdownMenu>
    <DropdownMenuTrigger
      class="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
    >
      {selectedSlot ? getSlotDisplayName(selectedSlot) : 'All Slots'}
      <ChevronDown class="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-48">
      <DropdownMenuItem
        onclick={() => onSlotChange(undefined)}
        class={!selectedSlot ? 'bg-gray-700' : ''}
      >
        All Slots
      </DropdownMenuItem>
      {#each availableSlots as slot (slot)}
        <DropdownMenuItem
          onclick={() => onSlotChange(slot)}
          class={selectedSlot === slot ? 'bg-gray-700' : ''}
        >
          {getSlotDisplayName(slot)}
        </DropdownMenuItem>
      {/each}
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Rarity Filter -->
  <DropdownMenu>
    <DropdownMenuTrigger
      class="flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
    >
      {selectedRarity ? getRarityDisplayName(selectedRarity) : 'All Rarities'}
      <ChevronDown class="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-48">
      <DropdownMenuItem
        onclick={() => onRarityChange(undefined)}
        class={!selectedRarity ? 'bg-gray-700' : ''}
      >
        All Rarities
      </DropdownMenuItem>
      {#each availableRarities as rarity (rarity)}
        <DropdownMenuItem
          onclick={() => onRarityChange(rarity)}
          class={selectedRarity === rarity ? 'bg-gray-700' : ''}
        >
          <span class="flex items-center gap-2">
            {getRarityDisplayName(rarity)}
          </span>
        </DropdownMenuItem>
      {/each}
    </DropdownMenuContent>
  </DropdownMenu>
</div>