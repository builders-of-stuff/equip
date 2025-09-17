<script lang="ts">
  import { Button } from './ui/button/index.js';
  import { testnetWalletAdapter as walletAdapter } from '@builders-of-stuff/svelte-sui-wallet-adapter';
  import { mintCharacterAndItems } from '$lib/contracts/contract-tools.js';
  import { Loader2, Plus, Sword } from 'lucide-svelte';
  import type { GameState } from '$lib/game';

  interface Props {
    gameState: GameState;
    onMintSuccess?: () => void;
  }

  let { gameState, onMintSuccess }: Props = $props();

  async function handleMintCharacter() {
    if (!walletAdapter?.currentAccount?.address) {
      return;
    }

    try {
      gameState.setMinting(true);

      const response = await mintCharacterAndItems(walletAdapter);

      // TODO: Parse response to get character and item IDs
      console.log('Mint response:', response);

      // Trigger refetch of character data
      if (onMintSuccess) {
        onMintSuccess();
      }
    } catch (error) {
      console.error('Failed to mint character:', error);
      // TODO: Show error toast/notification
    } finally {
      gameState.setMinting(false);
    }
  }
</script>

<div
  class="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-700 bg-gray-900 p-8"
>
  <div class="text-center">
    <!-- Icon -->
    <div class="mb-6 flex justify-center">
      <div class="rounded-full bg-gray-800 p-6">
        <Sword class="h-12 w-12 text-gray-400" />
      </div>
    </div>

    <!-- Title and Description -->
    <h2 class="mb-2 text-2xl font-bold text-white">No Character Found</h2>
    <p class="mb-6 text-gray-400">
      {#if !walletAdapter.isConnected}
        Connect your wallet to start your adventure
      {:else}
        Create your first character and begin your journey
      {/if}
    </p>

    <!-- Action Button -->
    {#if walletAdapter.isConnected}
      <Button
        onclick={handleMintCharacter}
        disabled={gameState.isMinting}
        size="lg"
        class="min-w-[200px]"
      >
        {#if gameState.isMinting}
          <Loader2 class="mr-2 h-5 w-5 animate-spin" />
          Creating Character...
        {:else}
          <Plus class="mr-2 h-5 w-5" />
          Create Character & Items
        {/if}
      </Button>

      <p class="mt-4 text-xs text-gray-500">
        This will create a new character and starter items on the Sui blockchain
      </p>
    {:else}
      <p class="text-sm text-gray-500">
        Connect your wallet using the button in the top right corner
      </p>
    {/if}
  </div>
</div>
