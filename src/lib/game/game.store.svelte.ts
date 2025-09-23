import { SvelteSet } from 'svelte/reactivity';
import { Item, ItemSlot, ItemRarity, type ItemStats } from './item.js';
import {
  SLOT_HELMET,
  SLOT_ARMOR,
  SLOT_LEGS,
  SLOT_RIGHT_ARM,
  SLOT_LEFT_ARM
} from './constants.js';
import type { SuiCharacter, SuiItem } from '../contracts/contract.tools.js';
import { suiItemToItem, suiItemsToItems } from '../contracts/utils.js';
import {
  mintCharacterAndItems,
  equipCharacter,
  deleteCharacter as deleteCharacterContract,
  destroyItems,
  fetchCharacter,
  fetchItems,
  type MintResult
} from '../contracts/contract.tools.js';
import { walletAdapter } from '../wallet/index.js';

export interface EquippedItems {
  helmet?: Item;
  armor?: Item;
  legs?: Item;
  right_arm?: Item;
  left_arm?: Item;
}

export class GameState {
  #equipped = $state<EquippedItems>({});
  #baseStats = $state<ItemStats>({
    attack: 10,
    defense: 10,
    health: 100,
    mana: 50
  });
  #items = $state<Item[]>([]);

  // Blockchain-related state
  #characterId = $state<string | null>(null);
  #isLoadingCharacter = $state<boolean>(false);
  #isLoadingItems = $state<boolean>(false);
  #isSavingChanges = $state<boolean>(false);
  #isMinting = $state<boolean>(false);
  #isDeleting = $state<boolean>(false);
  #isDeletingItems = $state<boolean>(false);
  #hasUnsavedChanges = $state<boolean>(false);

  constructor() {}

  get equipped(): EquippedItems {
    return this.#equipped;
  }

  get baseStats(): ItemStats {
    return this.#baseStats;
  }

  get totalStats(): ItemStats {
    const total = { ...this.#baseStats };

    Object.values(this.#equipped).forEach((item) => {
      if (item) {
        total.attack = (total.attack || 0) + (item.stats.attack || 0);
        total.defense = (total.defense || 0) + (item.stats.defense || 0);
        total.health = (total.health || 0) + (item.stats.health || 0);
        total.mana = (total.mana || 0) + (item.stats.mana || 0);
      }
    });

    return total;
  }

  get items(): Item[] {
    return this.#items;
  }

  get inventorySize(): number {
    return this.#items.length;
  }

  // Blockchain-related getters
  get characterId(): string | null {
    return this.#characterId;
  }

  get hasCharacter(): boolean {
    return this.#characterId !== null;
  }

  get isLoadingCharacter(): boolean {
    return this.#isLoadingCharacter;
  }

  get isLoadingItems(): boolean {
    return this.#isLoadingItems;
  }

  get isSavingChanges(): boolean {
    return this.#isSavingChanges;
  }

  get isMinting(): boolean {
    return this.#isMinting;
  }

  get isDeleting(): boolean {
    return this.#isDeleting;
  }

  get isDeletingItems(): boolean {
    return this.#isDeletingItems;
  }

  get hasUnsavedChanges(): boolean {
    return this.#hasUnsavedChanges;
  }

  get isLoading(): boolean {
    return (
      this.#isLoadingCharacter ||
      this.#isLoadingItems ||
      this.#isSavingChanges ||
      this.#isMinting ||
      this.#isDeleting ||
      this.#isDeletingItems
    );
  }

  equipItem(item: Item): Item | null {
    const slot = this.getSlotForItemSlot(item.slot);
    const previousItem = this.#equipped[slot];
    this.#equipped[slot] = item;
    return previousItem || null;
  }

  unequipItem(itemSlot: ItemSlot): Item | null {
    const slot = this.getSlotForItemSlot(itemSlot);
    const item = this.#equipped[slot];
    if (item) {
      this.#equipped[slot] = undefined;
      return item;
    }
    return null;
  }

  getEquippedItem(itemSlot: ItemSlot): Item | undefined {
    const slot = this.getSlotForItemSlot(itemSlot);
    return this.#equipped[slot];
  }

  addItem(item: Item): void {
    this.#items.push(item);
  }

  removeItem(itemId: string): Item | null {
    const index = this.#items.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      return this.#items.splice(index, 1)[0];
    }
    return null;
  }

  getItem(itemId: string): Item | undefined {
    return this.#items.find((item) => item.id === itemId);
  }

  hasItem(itemId: string): boolean {
    return this.#items.some((item) => item.id === itemId);
  }

  clearInventory(): void {
    this.#items.length = 0;
  }

  getFilteredItems(slotFilter?: ItemSlot, rarityFilter?: ItemRarity): Item[] {
    return this.#items.filter((item) => {
      const matchesSlot = !slotFilter || item.slot === slotFilter;
      const matchesRarity = !rarityFilter || item.rarity === rarityFilter;
      return matchesSlot && matchesRarity;
    });
  }

  getAvailableSlots(): ItemSlot[] {
    const slots = new SvelteSet(this.#items.map((item) => item.slot));
    return Array.from(slots);
  }

  getAvailableRarities(): ItemRarity[] {
    const rarities = new SvelteSet(this.#items.map((item) => item.rarity));
    return Array.from(rarities);
  }

  equipItemFromInventory(itemId: string): boolean {
    const item = this.getItem(itemId);
    if (!item) return false;

    const previousItem = this.equipItem(item);
    this.removeItem(itemId);

    if (previousItem) {
      this.addItem(previousItem);
    }

    this.#hasUnsavedChanges = true;

    return true;
  }

  unequipItemToInventory(itemSlot: ItemSlot): boolean {
    const item = this.unequipItem(itemSlot);
    if (!item) return false;

    this.addItem(item);

    this.#hasUnsavedChanges = true;

    return true;
  }

  private getSlotForItemSlot(itemSlot: ItemSlot): keyof EquippedItems {
    switch (itemSlot) {
      case ItemSlot.HELMET:
        return SLOT_HELMET as keyof EquippedItems;
      case ItemSlot.ARMOR:
        return SLOT_ARMOR as keyof EquippedItems;
      case ItemSlot.LEGS:
        return SLOT_LEGS as keyof EquippedItems;
      case ItemSlot.RIGHT_ARM:
        return SLOT_RIGHT_ARM as keyof EquippedItems;
      case ItemSlot.LEFT_ARM:
        return SLOT_LEFT_ARM as keyof EquippedItems;
      default:
        throw new Error(`Unknown item slot: ${itemSlot}`);
    }
  }

  // Blockchain-related methods

  /**
   * Load character data
   */
  loadCharacter(character: SuiCharacter | null): void {
    if (!character) {
      this.#characterId = null;
      this.#equipped = {};
      return;
    }

    this.#characterId = character.objectId;
    this.#equipped = {
      helmet: character.helmet ? suiItemToItem(character.helmet) : undefined,
      armor: character.armor ? suiItemToItem(character.armor) : undefined,
      right_arm: character.right_arm ? suiItemToItem(character.right_arm) : undefined,
      left_arm: character.left_arm ? suiItemToItem(character.left_arm) : undefined,
      legs: character.legs ? suiItemToItem(character.legs) : undefined
    };
    this.#hasUnsavedChanges = false;
  }

  /**
   * Load items
   */
  loadItems(items: SuiItem[]): void {
    this.#items = suiItemsToItems(items);
  }

  /**
   * Set loading states
   */
  setLoadingCharacter(loading: boolean): void {
    this.#isLoadingCharacter = loading;
  }

  setLoadingItems(loading: boolean): void {
    this.#isLoadingItems = loading;
  }

  setSavingChanges(saving: boolean): void {
    this.#isSavingChanges = saving;
  }

  setMinting(minting: boolean): void {
    this.#isMinting = minting;
  }

  setDeleting(deleting: boolean): void {
    this.#isDeleting = deleting;
  }

  setDeletingItems(deletingItems: boolean): void {
    this.#isDeletingItems = deletingItems;
  }

  /**
   * Mark changes as saved
   */
  markChangesSaved(): void {
    this.#hasUnsavedChanges = false;
  }

  /**
   * Get equipped items as array for blockchain operations
   */
  getEquippedItemIds(): string[] {
    const equippedIds: string[] = [];
    Object.values(this.#equipped).forEach((item) => {
      if (item) {
        equippedIds.push(item.id);
      }
    });
    return equippedIds;
  }

  /**
   * Clear all data (used when deleting character)
   */
  clearAllData(): void {
    this.#characterId = null;
    this.#equipped = {};
    this.#items = [];
    this.#hasUnsavedChanges = false;
  }

  /**
   * Mint a new character and starter items
   */
  async mintCharacterAndItems(): Promise<void> {
    if (!walletAdapter?.currentAccount?.address) {
      throw new Error('Wallet not connected');
    }

    this.setMinting(true);
    try {
      const result: MintResult = await mintCharacterAndItems();

      // console.log('Mint result:', result);

      // Use the already parsed character data (optimistic update)
      if (result.character && result.items) {
        this.loadCharacter(result.character);
        this.loadItems(result.items);
      }
    } finally {
      this.setMinting(false);
    }
  }

  /**
   * Save equipment changes to blockchain
   */
  async saveEquipmentChanges(): Promise<void> {
    if (!this.#characterId || !walletAdapter?.currentAccount?.address) {
      throw new Error('No character or wallet not connected');
    }

    this.setSavingChanges(true);
    try {
      const equippedItemIds = this.getEquippedItemIds();
      await equipCharacter(this.#characterId, equippedItemIds);

      this.markChangesSaved();

      // Refresh data to get updated state from blockchain
      await this.refreshCharacterData();
    } finally {
      this.setSavingChanges(false);
    }
  }

  /**
   * Delete character from blockchain
   */
  async deleteCharacter(): Promise<void> {
    if (!this.#characterId || !walletAdapter?.currentAccount?.address) {
      throw new Error('No character or wallet not connected');
    }

    this.setDeleting(true);
    try {
      await deleteCharacterContract(this.#characterId);
      this.clearAllData();
    } finally {
      this.setDeleting(false);
    }
  }

  /**
   * Delete all items in inventory
   */
  async deleteAllItems(): Promise<void> {
    if (!walletAdapter?.currentAccount?.address) {
      throw new Error('Wallet not connected');
    }

    if (this.#items.length === 0) {
      throw new Error('No items to delete');
    }

    const itemIds = this.#items.map((item) => item.id);

    this.setDeletingItems(true);
    try {
      await destroyItems(itemIds);

      // Clear inventory locally immediately after successful blockchain call
      this.clearInventory();
    } finally {
      this.setDeletingItems(false);
    }
  }

  /**
   * Refresh character and items data from blockchain
   */
  async refreshCharacterData(): Promise<void> {
    if (!walletAdapter?.currentAccount?.address) {
      return;
    }

    this.setLoadingCharacter(true);
    this.setLoadingItems(true);

    try {
      // Fetch character and items data from blockchain
      const character = await fetchCharacter(walletAdapter.currentAccount.address);
      const items = await fetchItems(walletAdapter.currentAccount.address);

      this.loadCharacter(character);
      this.loadItems(items);
    } finally {
      this.setLoadingCharacter(false);
      this.setLoadingItems(false);
    }
  }
}
