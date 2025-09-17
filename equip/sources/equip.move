module equip::equip;

use std::string::String;
use sui::object::UID;

const SLOT_HELMET: u64 = 0;
const SLOT_ARMOR: u64 = 1;
const SLOT_RIGHT_ARM: u64 = 2;
const SLOT_LEFT_ARM: u64 = 3;

public struct ItemStats has store {
    attack: u64,
    defense: u64,
    health: u64,
    mana: u64,
}

public struct Item has key, store {
    id: UID,
    `type`: String,
    slot: String,
    stats: ItemStats,
}

public struct Character has key, store {
    id: UID,
    helmet: Option<Item>,
    armor: Option<Item>,
    right_arm: Option<Item>,
    left_arm: Option<Item>,
}
