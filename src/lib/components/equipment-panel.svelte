<script lang="ts">
  import { GameState, Item, ItemSlot } from '$lib/game';
  import EquipmentSlot from './equipment-slot.svelte';
  import { Button } from './ui/button/index.js';
  import { testnetWalletAdapter as walletAdapter } from '@builders-of-stuff/svelte-sui-wallet-adapter';
  import { equipCharacter } from '$lib/contracts/contract-tools.js';
  import { Loader2, Save, Trash } from 'lucide-svelte';

  interface Props {
    gameState: GameState;
    onDeleteCharacter?: () => void;
  }

  let { gameState, onDeleteCharacter }: Props = $props();

  function handleEquipItem(item: Item) {
    gameState.equipItemFromInventory(item.id);
  }

  function handleUnequipItem(itemSlot: ItemSlot) {
    gameState.unequipItemToInventory(itemSlot);
  }

  async function handleSaveChanges() {
    if (!gameState.characterId || !walletAdapter?.currentAccount?.address) {
      return;
    }

    try {
      gameState.setSavingChanges(true);

      const equippedItemIds = gameState.getEquippedItemIds();
      await equipCharacter(walletAdapter, gameState.characterId, equippedItemIds);

      gameState.markChangesSaved();
    } catch (error) {
      console.error('Failed to save changes:', error);
      // TODO: Show error toast/notification
    } finally {
      gameState.setSavingChanges(false);
    }
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

  <!-- Blockchain Actions -->
  {#if gameState.hasCharacter}
    <div class="mt-6 space-y-3">
      <!-- Save Changes Button -->
      <Button
        onclick={handleSaveChanges}
        disabled={!gameState.hasUnsavedChanges || gameState.isSavingChanges}
        class="w-full"
        variant={gameState.hasUnsavedChanges ? 'default' : 'secondary'}
      >
        {#if gameState.isSavingChanges}
          <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          Saving Changes...
        {:else}
          <Save class="mr-2 h-4 w-4" />
          {gameState.hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
        {/if}
      </Button>

      <!-- Delete Character Button -->
      {#if onDeleteCharacter}
        <Button
          onclick={onDeleteCharacter}
          disabled={gameState.isDeleting || gameState.isSavingChanges}
          variant="destructive"
          class="w-full"
        >
          {#if gameState.isDeleting}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
            Deleting...
          {:else}
            <Trash class="mr-2 h-4 w-4" />
            Delete Character
          {/if}
        </Button>
      {/if}
    </div>
  {/if}
</div>
