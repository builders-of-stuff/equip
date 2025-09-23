import { Item, ItemSlot, ItemRarity, type ItemStats } from '$lib/game/item.js';
import type { SuiItem, SuiCharacter } from './contract.tools.js';
import {
  ITEM_TYPE_MAP,
  IRON_HELMET,
  DRAGON_SCALE_HELMET,
  LEATHER_ARMOR,
  MYSTICAL_ROBES,
  LEATHER_PANTS,
  ENCHANTED_LEGGINGS,
  IRON_GAUNTLETS,
  SHIELD_OF_VALOR,
  ARCANE_BRACERS,
  SLOT_HELMET,
  SLOT_ARMOR,
  SLOT_LEGS,
  SLOT_RIGHT_ARM,
  SLOT_LEFT_ARM,
  OBJECT_TYPES,
  EVENT_TYPES
} from './constants.js';

// Item icons mapping
const ITEM_ICONS = {
  [IRON_HELMET]: '🪖',
  [DRAGON_SCALE_HELMET]: '👑',
  [LEATHER_ARMOR]: '🦺',
  [MYSTICAL_ROBES]: '👘',
  [LEATHER_PANTS]: '👖',
  [ENCHANTED_LEGGINGS]: '✨',
  [IRON_GAUNTLETS]: '🧤',
  [SHIELD_OF_VALOR]: '🛡️',
  [ARCANE_BRACERS]: '💎'
} as const;

// Item descriptions mapping
const ITEM_DESCRIPTIONS = {
  [IRON_HELMET]: 'A basic iron helmet that provides decent protection.',
  [DRAGON_SCALE_HELMET]: 'A magnificent helmet crafted from dragon scales.',
  [LEATHER_ARMOR]: 'Simple leather armor for basic protection.',
  [MYSTICAL_ROBES]: 'Enchanted robes that enhance magical abilities.',
  [LEATHER_PANTS]: 'Sturdy leather pants for protection.',
  [ENCHANTED_LEGGINGS]: 'Mystical leggings imbued with arcane power.',
  [IRON_GAUNTLETS]: 'Sturdy iron gauntlets for protection and power.',
  [SHIELD_OF_VALOR]: 'A noble shield blessed with protective magic.',
  [ARCANE_BRACERS]: 'Magical bracers that amplify spellcasting abilities.'
} as const;

// Item rarity mapping based on type
const ITEM_RARITY_MAP = {
  [IRON_HELMET]: ItemRarity.COMMON,
  [DRAGON_SCALE_HELMET]: ItemRarity.EPIC,
  [LEATHER_ARMOR]: ItemRarity.COMMON,
  [MYSTICAL_ROBES]: ItemRarity.RARE,
  [LEATHER_PANTS]: ItemRarity.COMMON,
  [ENCHANTED_LEGGINGS]: ItemRarity.LEGENDARY,
  [IRON_GAUNTLETS]: ItemRarity.UNCOMMON,
  [SHIELD_OF_VALOR]: ItemRarity.RARE,
  [ARCANE_BRACERS]: ItemRarity.EPIC
} as const;

/**
 * Convert Sui slot number to ItemSlot enum
 */
export function suiSlotToItemSlot(slot: number): ItemSlot {
  switch (slot) {
    case SLOT_HELMET:
      return ItemSlot.HELMET;
    case SLOT_ARMOR:
      return ItemSlot.ARMOR;
    case SLOT_LEGS:
      return ItemSlot.LEGS;
    case SLOT_RIGHT_ARM:
      return ItemSlot.RIGHT_ARM;
    case SLOT_LEFT_ARM:
      return ItemSlot.LEFT_ARM;
    default:
      throw new Error(`Unknown slot: ${slot}`);
  }
}

/**
 * Convert ItemSlot enum to Sui slot number
 */
export function itemSlotToSuiSlot(slot: ItemSlot): number {
  switch (slot) {
    case ItemSlot.HELMET:
      return SLOT_HELMET;
    case ItemSlot.ARMOR:
      return SLOT_ARMOR;
    case ItemSlot.LEGS:
      return SLOT_LEGS;
    case ItemSlot.RIGHT_ARM:
      return SLOT_RIGHT_ARM;
    case ItemSlot.LEFT_ARM:
      return SLOT_LEFT_ARM;
    default:
      throw new Error(`Unknown item slot: ${slot}`);
  }
}

/**
 * Convert SuiItem to frontend Item
 */
export function suiItemToItem(suiItem: SuiItem): Item {
  const itemSlot = suiSlotToItemSlot(suiItem.slot);
  const name = ITEM_TYPE_MAP[suiItem.type as keyof typeof ITEM_TYPE_MAP];
  const icon = ITEM_ICONS[suiItem.type as keyof typeof ITEM_ICONS];
  const description = ITEM_DESCRIPTIONS[suiItem.type as keyof typeof ITEM_DESCRIPTIONS];
  const rarity = ITEM_RARITY_MAP[suiItem.type as keyof typeof ITEM_RARITY_MAP];

  const stats: ItemStats = {
    attack: suiItem.stats.attack || 0,
    defense: suiItem.stats.defense || 0,
    health: suiItem.stats.health || 0,
    mana: suiItem.stats.mana || 0
  };

  return new Item(suiItem.objectId, name, itemSlot, rarity, stats, icon, description);
}

/**
 * Convert array of SuiItems to frontend Items
 */
export function suiItemsToItems(suiItems: SuiItem[]): Item[] {
  return suiItems.map(suiItemToItem);
}

/**
 * Parse character data from transaction response
 */
export function parseCharacterFromTxResponse(executedTx: any): SuiCharacter | null {
  try {
    // Look for created Character object in objectChanges
    const characterChange = executedTx.objectChanges?.find(
      (change: any) =>
        change.type === 'created' && change.objectType === OBJECT_TYPES.CHARACTER
    );

    if (!characterChange) {
      console.warn('No character found in transaction response');
      return null;
    }

    // Return a basic character object with just the ID
    // Equipment will be empty since it's a newly created character
    return {
      objectId: characterChange.objectId,
      helmet: undefined,
      armor: undefined,
      right_arm: undefined,
      left_arm: undefined,
      legs: undefined
    };
  } catch (error) {
    console.error('Failed to parse character from transaction response:', error);
    return null;
  }
}

// const executedTx = {
//   ...,
//   events: [
//     {
//       ...,
//       parsedJson: {
//         attack: "0",
//         health: "10",
//         slot: "0",
//         item_id: "0x592...e4",
//         ...
//       },
//       type: "0x33...::equip::ItemCreatedEvent"
//     }
//   ]
// }

/**
 * Parse items data from transaction response
 */
export function parseItemsFromTxResponse(executedTx: any): SuiItem[] {
  try {
    const items: SuiItem[] = [];
    const events = executedTx.events || [];

    for (const event of events) {
      // Check if this is an ItemCreatedEvent
      if (event.type === EVENT_TYPES.ITEM_CREATED_EVENT && event.parsedJson) {
        const json = event.parsedJson;

        // Validate that all required fields are present
        if (
          json.item_id &&
          typeof json.item_type === 'string' &&
          typeof json.slot === 'string' &&
          typeof json.attack === 'string' &&
          typeof json.defense === 'string' &&
          typeof json.health === 'string' &&
          typeof json.mana === 'string'
        ) {
          items.push({
            objectId: json.item_id,
            type: parseInt(json.item_type),
            slot: parseInt(json.slot),
            stats: {
              attack: parseInt(json.attack),
              defense: parseInt(json.defense),
              health: parseInt(json.health),
              mana: parseInt(json.mana)
            }
          });
        }
      }
    }

    return items;
  } catch (error) {
    console.error('Failed to parse items from transaction response:', error);
    return [];
  }
}
