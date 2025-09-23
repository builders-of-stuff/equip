<script lang="ts">
  import { GameState } from '$lib/game';
  import Navbar from '$lib/components/navbar.svelte';
  import EquipmentPanel from '$lib/components/equipment-panel.svelte';
  import InventoryGrid from '$lib/components/inventory-grid.svelte';
  import EmptyCharacterState from '$lib/components/empty-character-state.svelte';
  import { walletAdapter } from '$lib/wallet';
  import { untrack } from 'svelte';

  const gameState = new GameState();
  let hasCheckedInitialData = $state(false);

  async function fetchAndLoadData(options: { setInitialDataFlag?: boolean } = {}) {
    if (!walletAdapter?.currentAccount?.address) return;

    try {
      await gameState.refreshCharacterData();

      if (options.setInitialDataFlag) {
        hasCheckedInitialData = true;
      }
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error);
    }
  }

  // Effect to fetch character and items when wallet connects or changes
  $effect(() => {
    if (
      !walletAdapter.isConnected ||
      !walletAdapter?.currentAccount?.address ||
      hasCheckedInitialData
    ) {
      return;
    }

    untrack(() => {
      fetchAndLoadData({ setInitialDataFlag: true });
    });
  });

  // Reset data when wallet disconnects
  $effect(() => {
    if (!walletAdapter.isConnected) {
      hasCheckedInitialData = false;
      gameState.clearAllData();
    }
  });

  async function handleDeleteCharacter() {
    try {
      await gameState.deleteCharacter();
    } catch (error) {
      console.error('Failed to delete character:', error);
      // TODO: Show error toast/notification
    }
  }
</script>

<svelte:head>
  <title>Equip Playground</title>
  <meta
    name="description"
    content="A simple RPG equipment playground with inventory and wallet integration"
  />
</svelte:head>

<div class="min-h-screen">
  <Navbar />

  <main class="container mx-auto p-6">
    {#if !gameState.hasCharacter && !gameState.isLoadingCharacter}
      <!-- Empty State - No Character -->
      <EmptyCharacterState {gameState} />
    {:else if gameState.isLoadingCharacter}
      <!-- Loading State -->
      <div class="flex min-h-[400px] items-center justify-center">
        <div class="text-center">
          <div
            class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-white"
          ></div>
          <p class="text-gray-400">Loading character data...</p>
        </div>
      </div>
    {:else}
      <!-- Main Game Interface -->
      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Equipment Panel -->
        <div class="order-2 lg:order-1">
          <EquipmentPanel {gameState} onDeleteCharacter={handleDeleteCharacter} />
        </div>

        <!-- Inventory Grid -->
        <div class="order-1 lg:order-2">
          <InventoryGrid {gameState} />
        </div>
      </div>
    {/if}

    <!-- Footer -->
    <footer class="mt-12 text-center text-sm text-gray-500">
      <p></p>
    </footer>
  </main>
</div>
