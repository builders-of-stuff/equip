<script lang="ts">
  import { GameState, Item, ItemSlot } from '$lib/game';
  import EquipmentSlot from './equipment-slot.svelte';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();

  function handleEquipItem(item: Item) {
    gameState.equipItemFromInventory(item.id);
  }

  function handleUnequipItem(itemSlot: ItemSlot) {
    gameState.unequipItemToInventory(itemSlot);
  }
</script>

<div class="equipment-panel rounded-xl border border-gray-700 bg-gray-900 p-6">
  <h2 class="mb-4 text-xl font-bold text-white">Equipment</h2>

  <div class="grid grid-cols-3 gap-4">
    <!-- Top row: Helmet -->
    <div></div>
    <EquipmentSlot
      slotType={ItemSlot.HELMET}
      item={gameState.equipped.helmet}
      onDrop={handleEquipItem}
      onRemove={() => handleUnequipItem(ItemSlot.HELMET)}
    />
    <div></div>

    <!-- Middle row: Right Arm, Armor, Left Arm -->
    <EquipmentSlot
      slotType={ItemSlot.RIGHT_ARM}
      item={gameState.equipped.right_arm}
      onDrop={handleEquipItem}
      onRemove={() => handleUnequipItem(ItemSlot.RIGHT_ARM)}
    />
    <EquipmentSlot
      slotType={ItemSlot.ARMOR}
      item={gameState.equipped.armor}
      onDrop={handleEquipItem}
      onRemove={() => handleUnequipItem(ItemSlot.ARMOR)}
    />
    <EquipmentSlot
      slotType={ItemSlot.LEFT_ARM}
      item={gameState.equipped.left_arm}
      onDrop={handleEquipItem}
      onRemove={() => handleUnequipItem(ItemSlot.LEFT_ARM)}
    />

    <!-- Bottom row: Sword -->
    <div></div>
    <EquipmentSlot
      slotType={ItemSlot.LEGS}
      item={gameState.equipped.legs}
      onDrop={handleEquipItem}
      onRemove={() => handleUnequipItem(ItemSlot.LEGS)}
    />
    <div></div>
  </div>

  <!-- Player Stats -->
  <div class="mt-6 rounded-lg border border-gray-600 bg-gray-800 p-4">
    <h3 class="mb-2 text-lg font-semibold text-white">Stats</h3>
    <div class="grid grid-cols-2 gap-2 text-sm">
      <div class="text-red-400">⚔️ Attack: {gameState.totalStats.attack}</div>
      <div class="text-blue-400">🛡️ Defense: {gameState.totalStats.defense}</div>
      <div class="text-green-400">❤️ Health: {gameState.totalStats.health}</div>
      <div class="text-purple-400">💙 Mana: {gameState.totalStats.mana}</div>
    </div>
  </div>
</div>