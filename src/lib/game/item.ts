export enum ItemType {
  HELMET = 'helmet',
  ARMOR = 'armor',
  SWORD = 'sword',
  RIGHT_ARM = 'right_arm',
  LEFT_ARM = 'left_arm'
}

export enum ItemRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export interface ItemStats {
  attack?: number;
  defense?: number;
  health?: number;
  mana?: number;
}

export class Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  stats: ItemStats;
  icon: string;
  description: string;

  constructor(
    id: string,
    name: string,
    type: ItemType,
    rarity: ItemRarity,
    stats: ItemStats,
    icon: string,
    description: string
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.rarity = rarity;
    this.stats = stats;
    this.icon = icon;
    this.description = description;
  }

  get rarityColor(): string {
    switch (this.rarity) {
      case ItemRarity.COMMON:
        return 'text-gray-400';
      case ItemRarity.UNCOMMON:
        return 'text-green-400';
      case ItemRarity.RARE:
        return 'text-blue-400';
      case ItemRarity.EPIC:
        return 'text-purple-400';
      case ItemRarity.LEGENDARY:
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  }

  get rarityBorder(): string {
    switch (this.rarity) {
      case ItemRarity.COMMON:
        return 'border-gray-400';
      case ItemRarity.UNCOMMON:
        return 'border-green-400';
      case ItemRarity.RARE:
        return 'border-blue-400';
      case ItemRarity.EPIC:
        return 'border-purple-400';
      case ItemRarity.LEGENDARY:
        return 'border-orange-400';
      default:
        return 'border-gray-400';
    }
  }
}