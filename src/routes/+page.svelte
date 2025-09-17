<script lang="ts">
  import { GameState } from '$lib/game';
  import Navbar from '$lib/components/navbar.svelte';
  import EquipmentPanel from '$lib/components/equipment-panel.svelte';
  import InventoryGrid from '$lib/components/inventory-grid.svelte';

  const gameState = new GameState();
</script>

<svelte:head>
  <title>Equip Playground - RPG Equipment Simulator</title>
  <meta name="description" content="A simple RPG equipment playground with inventory and wallet integration" />
</svelte:head>

<div class="min-h-screen">
  <Navbar {gameState} />

  <main class="container mx-auto p-6">
    <div class="mb-6 text-center">
      <h1 class="mb-2 text-3xl font-bold text-white">Equip Your Character</h1>
      <p class="text-gray-400">Drag and drop items to equip them, or click to auto-equip</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Equipment Panel -->
      <div class="order-2 lg:order-1">
        <EquipmentPanel {gameState} />
      </div>

      <!-- Inventory Grid -->
      <div class="order-1 lg:order-2">
        <InventoryGrid {gameState} />
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-12 text-center text-sm text-gray-500">
      <p>🎮 RPG Equipment Playground - Built with SvelteKit & TailwindCSS</p>
      <p class="mt-1">All blockchain interactions are stubbed for demo purposes</p>
    </footer>
  </main>
</div>
