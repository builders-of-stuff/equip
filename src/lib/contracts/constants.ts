// Testnet
export const PACKAGE_ID =
  '0x33ee8b74ecddeb8d7227c8d22b08794b88ac7e7cac6f08841d824cee6a6fe1d0';
export const UPGRADE_CAP =
  '0x1dc9bbe7a71088fd3011127a98234a77a5bc8f20e591c1014f48de7c5a50754e';

// Item Type Constants (matching Move contract)
export const IRON_HELMET = 0;
export const DRAGON_SCALE_HELMET = 1;
export const LEATHER_ARMOR = 2;
export const MYSTICAL_ROBES = 3;
export const LEATHER_PANTS = 4;
export const ENCHANTED_LEGGINGS = 5;
export const IRON_GAUNTLETS = 6;
export const SHIELD_OF_VALOR = 7;
export const ARCANE_BRACERS = 8;

// Slot Constants (matching Move contract)
export const SLOT_HELMET = 0;
export const SLOT_ARMOR = 1;
export const SLOT_RIGHT_ARM = 2;
export const SLOT_LEFT_ARM = 3;
export const SLOT_LEGS = 4;

// Contract Function Names
export const CONTRACT_FUNCTIONS = {
  CREATE_CHARACTER: `${PACKAGE_ID}::equip::create_character`,
  CREATE_STARTER_ITEMS: `${PACKAGE_ID}::equip::create_starter_items`,
  EQUIP_CHARACTER: `${PACKAGE_ID}::equip::equip_character`,
  DELETE_CHARACTER: `${PACKAGE_ID}::equip::delete_character`
} as const;

// Object Types
export const OBJECT_TYPES = {
  CHARACTER: `${PACKAGE_ID}::equip::Character`,
  ITEM: `${PACKAGE_ID}::equip::Item`
} as const;

// Item type to frontend mapping
export const ITEM_TYPE_MAP = {
  [IRON_HELMET]: 'Iron Helmet',
  [DRAGON_SCALE_HELMET]: 'Dragon Scale Helmet',
  [LEATHER_ARMOR]: 'Leather Armor',
  [MYSTICAL_ROBES]: 'Mystical Robes',
  [LEATHER_PANTS]: 'Leather Pants',
  [ENCHANTED_LEGGINGS]: 'Enchanted Leggings',
  [IRON_GAUNTLETS]: 'Iron Gauntlets',
  [SHIELD_OF_VALOR]: 'Shield of Valor',
  [ARCANE_BRACERS]: 'Arcane Bracers'
} as const;

// Slot to frontend mapping
export const SLOT_MAP = {
  [SLOT_HELMET]: 'helmet',
  [SLOT_ARMOR]: 'armor',
  [SLOT_RIGHT_ARM]: 'right_arm',
  [SLOT_LEFT_ARM]: 'left_arm',
  [SLOT_LEGS]: 'legs'
} as const;
