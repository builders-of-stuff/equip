import { Player } from './player.svelte.js';
import { Inventory } from './inventory.svelte.js';
import { Item, ItemType, ItemRarity } from './item.js';

export class GameState {
  player = new Player();
  inventory = new Inventory();

  constructor() {
    this.initializeStarterItems();
  }


  equipItemFromInventory(itemId: string): boolean {
    const item = this.inventory.getItem(itemId);
    if (!item) return false;

    const previousItem = this.player.equipItem(item);
    this.inventory.removeItem(itemId);

    if (previousItem) {
      this.inventory.addItem(previousItem);
    }

    return true;
  }

  unequipItemToInventory(itemType: ItemType): boolean {
    const item = this.player.unequipItem(itemType);
    if (!item) return false;

    this.inventory.addItem(item);
    return true;
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

    starterItems.forEach(item => this.inventory.addItem(item));
  }
}