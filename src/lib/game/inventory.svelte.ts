import { Item, ItemType, ItemRarity } from './item.js';

export class Inventory {
  #items = $state<Item[]>([]);

  get items(): Item[] {
    return this.#items;
  }

  addItem(item: Item): void {
    this.#items.push(item);
  }

  removeItem(itemId: string): Item | null {
    const index = this.#items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      return this.#items.splice(index, 1)[0];
    }
    return null;
  }

  getItem(itemId: string): Item | undefined {
    return this.#items.find(item => item.id === itemId);
  }

  hasItem(itemId: string): boolean {
    return this.#items.some(item => item.id === itemId);
  }

  clear(): void {
    this.#items.length = 0;
  }

  get size(): number {
    return this.#items.length;
  }

  getFilteredItems(typeFilter?: ItemType, rarityFilter?: ItemRarity): Item[] {
    return this.#items.filter(item => {
      const matchesType = !typeFilter || item.type === typeFilter;
      const matchesRarity = !rarityFilter || item.rarity === rarityFilter;
      return matchesType && matchesRarity;
    });
  }

  getAvailableTypes(): ItemType[] {
    const types = new Set(this.#items.map(item => item.type));
    return Array.from(types);
  }

  getAvailableRarities(): ItemRarity[] {
    const rarities = new Set(this.#items.map(item => item.rarity));
    return Array.from(rarities);
  }
}