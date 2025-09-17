<script lang="ts">
  import type { GameState } from '$lib/game';
  import {
    ConnectButton,
    testnetWalletAdapter as walletAdapter
  } from '@builders-of-stuff/svelte-sui-wallet-adapter';

  interface Props {
    gameState: GameState;
  }

  let { gameState }: Props = $props();
</script>

<nav class="border-b border-gray-700 bg-gray-900 px-6 py-4">
  <div class="flex items-center justify-between">
    <!-- Logo and Title -->
    <div class="flex items-center space-x-3">
      <div class="text-2xl">⚔️</div>
      <div>
        <h1 class="text-xl font-bold text-white">Equip Playground</h1>
        <p class="text-xs text-gray-400">RPG Equipment Simulator</p>
      </div>
    </div>

    <!-- Wallet Connection -->
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <ConnectButton {walletAdapter} />
      </div>
    </div>
  </div>
</nav>
