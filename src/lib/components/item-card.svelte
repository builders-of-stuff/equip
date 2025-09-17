<script lang="ts">
  import type { Item } from '$lib/game';
  import { cn } from '$lib/utils';

  interface Props {
    item: Item;
    draggable?: boolean;
    onclick?: () => void;
    class?: string;
  }

  let { item, draggable = false, onclick, class: className }: Props = $props();

  function handleDragStart(event: DragEvent) {
    if (draggable && event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify(item));
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  function handleClick() {
    if (onclick) {
      onclick();
    }
  }

  function getStatText(item: Item): string {
    const stats = [];
    if (item.stats.attack) stats.push(`ATK: ${item.stats.attack}`);
    if (item.stats.defense) stats.push(`DEF: ${item.stats.defense}`);
    if (item.stats.health) stats.push(`HP: ${item.stats.health}`);
    if (item.stats.mana) stats.push(`MP: ${item.stats.mana}`);
    return stats.join(' | ');
  }
</script>

<div
  class={cn(
    'item-card rounded-lg border-2 bg-gray-900 p-4 transition-all duration-200',
    item.rarityBorder,
    draggable ? 'cursor-grab active:cursor-grabbing' : '',
    onclick ? 'hover:bg-gray-700' : '',
    className
  )}
  draggable={draggable}
  ondragstart={handleDragStart}
  onclick={handleClick}
  onkeydown={(e) => e.key === 'Enter' && handleClick()}
  role={onclick ? 'button' : undefined}
  tabindex={onclick ? 0 : undefined}
>
  <div class="flex flex-col items-center space-y-3">
    <div class="text-2xl">{item.icon}</div>
    <div class="text-center">
      <div class="text-sm font-bold text-white">{item.name}</div>
      <div class="text-xs {item.rarityColor} font-medium capitalize">{item.rarity}</div>
      {#if getStatText(item)}
        <div class="mt-2 text-xs text-gray-300">{getStatText(item)}</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .item-card {
    min-height: 140px;
  }
</style>