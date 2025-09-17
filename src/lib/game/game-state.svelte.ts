import { SvelteSet } from 'svelte/reactivity';
import { Item, ItemType, ItemRarity, type ItemStats } from './item.js';
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
    const slot = this.getSlotForItemType(item.type);
    const previousItem = this.#equipped[slot];
    this.#equipped[slot] = item;
    return previousItem || null;
  }

  unequipItem(itemType: ItemType): Item | null {
    const slot = this.getSlotForItemType(itemType);
    const item = this.#equipped[slot];
    if (item) {
      this.#equipped[slot] = undefined;
      return item;
    }
    return null;
  }

  getEquippedItem(itemType: ItemType): Item | undefined {
    const slot = this.getSlotForItemType(itemType);
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

  getFilteredItems(typeFilter?: ItemType, rarityFilter?: ItemRarity): Item[] {
    return this.#items.filter((item) => {
      const matchesType = !typeFilter || item.type === typeFilter;
      const matchesRarity = !rarityFilter || item.rarity === rarityFilter;
      return matchesType && matchesRarity;
    });
  }

  getAvailableTypes(): ItemType[] {
    const types = new SvelteSet(this.#items.map((item) => item.type));
    return Array.from(types);
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

  unequipItemToInventory(itemType: ItemType): boolean {
    const item = this.unequipItem(itemType);
    if (!item) return false;

    this.addItem(item);
    return true;
  }

  private getSlotForItemType(itemType: ItemType): keyof EquippedItems {
    switch (itemType) {
      case ItemType.HELMET:
        return SLOT_HELMET as keyof EquippedItems;
      case ItemType.ARMOR:
        return SLOT_ARMOR as keyof EquippedItems;
      case ItemType.LEGS:
        return SLOT_LEGS as keyof EquippedItems;
      case ItemType.RIGHT_ARM:
        return SLOT_RIGHT_ARM as keyof EquippedItems;
      case ItemType.LEFT_ARM:
        return SLOT_LEFT_ARM as keyof EquippedItems;
      default:
        throw new Error(`Unknown item type: ${itemType}`);
    }
  }

  private initializeStarterItems(): void {
    const starterItems = [
      new Item(
        ID_HELMET_1,
        ITEM_IRON_HELMET,
        ItemType.HELMET,
        ItemRarity.COMMON,
        { defense: 5, health: 10 },
        '🪖',
        'A basic iron helmet that provides decent protection.'
      ),
      new Item(
        ID_HELMET_2,
        ITEM_DRAGON_SCALE_HELMET,
        ItemType.HELMET,
        ItemRarity.EPIC,
        { defense: 15, health: 25, mana: 10 },
        '👑',
        'A magnificent helmet crafted from dragon scales.'
      ),
      new Item(
        ID_ARMOR_1,
        ITEM_LEATHER_ARMOR,
        ItemType.ARMOR,
        ItemRarity.COMMON,
        { defense: 8, health: 15 },
        '🦺',
        'Simple leather armor for basic protection.'
      ),
      new Item(
        ID_ARMOR_2,
        ITEM_MYSTICAL_ROBES,
        ItemType.ARMOR,
        ItemRarity.RARE,
        { defense: 12, health: 20, mana: 30 },
        '👘',
        'Enchanted robes that enhance magical abilities.'
      ),
      new Item(
        ID_LEGS_1,
        ITEM_LEATHER_PANTS,
        ItemType.LEGS,
        ItemRarity.COMMON,
        { defense: 8 },
        '👖',
        'Sturdy leather pants for protection.'
      ),
      new Item(
        ID_LEGS_2,
        ITEM_ENCHANTED_LEGGINGS,
        ItemType.LEGS,
        ItemRarity.LEGENDARY,
        { defense: 25, mana: 10 },
        '✨',
        'Mystical leggings imbued with arcane power.'
      ),
      new Item(
        ID_RIGHT_ARM_1,
        ITEM_IRON_GAUNTLETS,
        ItemType.RIGHT_ARM,
        ItemRarity.UNCOMMON,
        { attack: 5, defense: 3 },
        '🧤',
        'Sturdy iron gauntlets for protection and power.'
      ),
      new Item(
        ID_LEFT_ARM_1,
        ITEM_SHIELD_OF_VALOR,
        ItemType.LEFT_ARM,
        ItemRarity.RARE,
        { defense: 20, health: 15 },
        '🛡️',
        'A noble shield blessed with protective magic.'
      ),
      new Item(
        ID_LEFT_ARM_2,
        ITEM_ARCANE_BRACERS,
        ItemType.LEFT_ARM,
        ItemRarity.EPIC,
        { defense: 8, mana: 25, attack: 5 },
        '💎',
        'Magical bracers that amplify spellcasting abilities.'
      )
    ];

    starterItems.forEach(item => this.addItem(item));
  }
}