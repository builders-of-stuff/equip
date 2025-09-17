import { SvelteSet } from 'svelte/reactivity';
import { Item, ItemType, ItemRarity, type ItemStats } from './item.js';

export interface EquippedItems {
  helmet?: Item;
  armor?: Item;
  sword?: Item;
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
        return 'helmet';
      case ItemType.ARMOR:
        return 'armor';
      case ItemType.SWORD:
        return 'sword';
      case ItemType.RIGHT_ARM:
        return 'right_arm';
      case ItemType.LEFT_ARM:
        return 'left_arm';
      default:
        throw new Error(`Unknown item type: ${itemType}`);
    }
  }

  private initializeStarterItems(): void {
    const starterItems = [
      new Item(
        'helmet_1',
        'Iron Helmet',
        ItemType.HELMET,
        ItemRarity.COMMON,
        { defense: 5, health: 10 },
        '🪖',
        'A basic iron helmet that provides decent protection.'
      ),
      new Item(
        'helmet_2',
        'Dragon Scale Helmet',
        ItemType.HELMET,
        ItemRarity.EPIC,
        { defense: 15, health: 25, mana: 10 },
        '👑',
        'A magnificent helmet crafted from dragon scales.'
      ),
      new Item(
        'armor_1',
        'Leather Armor',
        ItemType.ARMOR,
        ItemRarity.COMMON,
        { defense: 8, health: 15 },
        '🦺',
        'Simple leather armor for basic protection.'
      ),
      new Item(
        'armor_2',
        'Mystical Robes',
        ItemType.ARMOR,
        ItemRarity.RARE,
        { defense: 12, health: 20, mana: 30 },
        '👘',
        'Enchanted robes that enhance magical abilities.'
      ),
      new Item(
        'sword_1',
        'Iron Sword',
        ItemType.SWORD,
        ItemRarity.COMMON,
        { attack: 15 },
        '⚔️',
        'A reliable iron sword for combat.'
      ),
      new Item(
        'sword_2',
        'Flame Blade',
        ItemType.SWORD,
        ItemRarity.LEGENDARY,
        { attack: 35, mana: 15 },
        '🔥',
        'A legendary sword wreathed in eternal flames.'
      ),
      new Item(
        'right_arm_1',
        'Iron Gauntlets',
        ItemType.RIGHT_ARM,
        ItemRarity.UNCOMMON,
        { attack: 5, defense: 3 },
        '🧤',
        'Sturdy iron gauntlets for protection and power.'
      ),
      new Item(
        'left_arm_1',
        'Shield of Valor',
        ItemType.LEFT_ARM,
        ItemRarity.RARE,
        { defense: 20, health: 15 },
        '🛡️',
        'A noble shield blessed with protective magic.'
      ),
      new Item(
        'left_arm_2',
        'Arcane Bracers',
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