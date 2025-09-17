<script lang="ts">
  import { ItemType, ItemRarity } from '$lib/game';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
  } from '$lib/components/ui/dropdown-menu';
  import { ChevronDown } from 'lucide-svelte';

  interface Props {
    selectedType?: ItemType;
    selectedRarity?: ItemRarity;
    availableTypes: ItemType[];
    availableRarities: ItemRarity[];
    onTypeChange: (type?: ItemType) => void;
    onRarityChange: (rarity?: ItemRarity) => void;
  }

  let {
    selectedType,
    selectedRarity,
    availableTypes,
    availableRarities,
    onTypeChange,
    onRarityChange
  }: Props = $props();

  function getTypeDisplayName(type: ItemType): string {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
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
      {selectedType ? getTypeDisplayName(selectedType) : 'All Types'}
      <ChevronDown class="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-48">
      <DropdownMenuItem
        onclick={() => onTypeChange(undefined)}
        class={!selectedType ? 'bg-gray-700' : ''}
      >
        All Types
      </DropdownMenuItem>
      {#each availableTypes as type (type)}
        <DropdownMenuItem
          onclick={() => onTypeChange(type)}
          class={selectedType === type ? 'bg-gray-700' : ''}
        >
          {getTypeDisplayName(type)}
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