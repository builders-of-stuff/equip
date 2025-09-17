import { SvelteSet } from 'svelte/reactivity';
import { Item, ItemSlot, ItemRarity, type ItemStats } from './item.js';
import {
  SLOT_HELMET,
  SLOT_ARMOR,
  SLOT_LEGS,
  SLOT_RIGHT_ARM,
  SLOT_LEFT_ARM,
  ID_HELMET_1,
  ID_HELMET_2,
  ID_ARMOR_1,
  ID_ARMOR_2,
  ID_LEGS_1,
  ID_LEGS_2,
  ID_RIGHT_ARM_1,
  ID_LEFT_ARM_1,
  ID_LEFT_ARM_2,
  ITEM_IRON_HELMET,
  ITEM_DRAGON_SCALE_HELMET,
  ITEM_LEATHER_ARMOR,
  ITEM_MYSTICAL_ROBES,
  ITEM_LEATHER_PANTS,
  ITEM_ENCHANTED_LEGGINGS,
  ITEM_IRON_GAUNTLETS,
  ITEM_SHIELD_OF_VALOR,
  ITEM_ARCANE_BRACERS
} from './constants.js';

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

  constructor() {
    this.initializeStarterItems();
  }

  get equipped(): EquippedItems {
    return this.#equipped;
  }

  get baseStats(): ItemStats {
    return this.#baseStats;
  }

  get totalStats(): ItemStats {
    const total = { ...this.#baseStats };

    Object.values(this.#equipped).forEach(item => {
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

    return true;
  }

  unequipItemToInventory(itemSlot: ItemSlot): boolean {
    const item = this.unequipItem(itemSlot);
    if (!item) return false;

    this.addItem(item);
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

  private initializeStarterItems(): void {
    const starterItems = [
      new Item(
        ID_HELMET_1,
        ITEM_IRON_HELMET,
        ItemSlot.HELMET,
        ItemRarity.COMMON,
        { defense: 5, health: 10 },
        '🪖',
        'A basic iron helmet that provides decent protection.'
      ),
      new Item(
        ID_HELMET_2,
        ITEM_DRAGON_SCALE_HELMET,
        ItemSlot.HELMET,
        ItemRarity.EPIC,
        { defense: 15, health: 25, mana: 10 },
        '👑',
        'A magnificent helmet crafted from dragon scales.'
      ),
      new Item(
        ID_ARMOR_1,
        ITEM_LEATHER_ARMOR,
        ItemSlot.ARMOR,
        ItemRarity.COMMON,
        { defense: 8, health: 15 },
        '🦺',
        'Simple leather armor for basic protection.'
      ),
      new Item(
        ID_ARMOR_2,
        ITEM_MYSTICAL_ROBES,
        ItemSlot.ARMOR,
        ItemRarity.RARE,
        { defense: 12, health: 20, mana: 30 },
        '👘',
        'Enchanted robes that enhance magical abilities.'
      ),
      new Item(
        ID_LEGS_1,
        ITEM_LEATHER_PANTS,
        ItemSlot.LEGS,
        ItemRarity.COMMON,
        { defense: 8 },
        '👖',
        'Sturdy leather pants for protection.'
      ),
      new Item(
        ID_LEGS_2,
        ITEM_ENCHANTED_LEGGINGS,
        ItemSlot.LEGS,
        ItemRarity.LEGENDARY,
        { defense: 25, mana: 10 },
        '✨',
        'Mystical leggings imbued with arcane power.'
      ),
      new Item(
        ID_RIGHT_ARM_1,
        ITEM_IRON_GAUNTLETS,
        ItemSlot.RIGHT_ARM,
        ItemRarity.UNCOMMON,
        { attack: 5, defense: 3 },
        '🧤',
        'Sturdy iron gauntlets for protection and power.'
      ),
      new Item(
        ID_LEFT_ARM_1,
        ITEM_SHIELD_OF_VALOR,
        ItemSlot.LEFT_ARM,
        ItemRarity.RARE,
        { defense: 20, health: 15 },
        '🛡️',
        'A noble shield blessed with protective magic.'
      ),
      new Item(
        ID_LEFT_ARM_2,
        ITEM_ARCANE_BRACERS,
        ItemSlot.LEFT_ARM,
        ItemRarity.EPIC,
        { defense: 8, mana: 25, attack: 5 },
        '💎',
        'Magical bracers that amplify spellcasting abilities.'
      )
    ];

    starterItems.forEach(item => this.addItem(item));
  }
}