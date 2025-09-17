import { Item, ItemType, type ItemStats } from './item.js';

export interface EquippedItems {
  helmet?: Item;
  armor?: Item;
  sword?: Item;
  right_arm?: Item;
  left_arm?: Item;
}

export class Player {
  #equipped = $state<EquippedItems>({});
  #baseStats = $state<ItemStats>({
    attack: 10,
    defense: 10,
    health: 100,
    mana: 50
  });

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
}