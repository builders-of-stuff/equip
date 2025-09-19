module equip::equip;

use sui::event;

const IRON_HELMET: u64 = 0;
const DRAGON_SCALE_HELMET: u64 = 1;
const LEATHER_ARMOR: u64 = 2;
const MYSTICAL_ROBES: u64 = 3;
const LEATHER_PANTS: u64 = 4;
const ENCHANTED_LEGGINGS: u64 = 5;
const IRON_GAUNTLETS: u64 = 6;
const SHIELD_OF_VALOR: u64 = 7;
const ARCANE_BRACERS: u64 = 8;

const SLOT_HELMET: u64 = 0;
const SLOT_ARMOR: u64 = 1;
const SLOT_RIGHT_ARM: u64 = 2;
const SLOT_LEFT_ARM: u64 = 3;
const SLOT_LEGS: u64 = 4;

public struct ItemStats has drop, store {
    attack: u64,
    defense: u64,
    health: u64,
    mana: u64,
}

public struct Item has key, store {
    id: object::UID,
    `type`: u64,
    slot: u64,
    stats: ItemStats,
}

public struct ItemCreatedEvent has copy, drop {
    item_id: object::ID,
    item_type: u64,
    slot: u64,
    attack: u64,
    defense: u64,
    health: u64,
    mana: u64,
    creator: address,
}

public struct Character has key, store {
    id: object::UID,
    helmet: option::Option<Item>,
    armor: option::Option<Item>,
    right_arm: option::Option<Item>,
    left_arm: option::Option<Item>,
    legs: option::Option<Item>,
}

public fun create_character(ctx: &mut TxContext): Character {
    let character = Character {
        id: object::new(ctx),
        helmet: option::none(),
        armor: option::none(),
        right_arm: option::none(),
        left_arm: option::none(),
        legs: option::none(),
    };

    character
}

public fun create_starter_items(
    ctx: &mut TxContext,
): (Item, Item, Item, Item, Item, Item, Item, Item, Item) {
    // Iron Helmet
    let iron_helmet = Item {
        id: object::new(ctx),
        `type`: IRON_HELMET,
        slot: SLOT_HELMET,
        stats: ItemStats {
            attack: 0,
            defense: 5,
            health: 10,
            mana: 0,
        },
    };
    event::emit(ItemCreatedEvent {
        item_id: object::id(&iron_helmet),
        item_type: IRON_HELMET,
        slot: SLOT_HELMET,
        attack: 0,
        defense: 5,
        health: 10,
        mana: 0,
        creator: tx_context::sender(ctx),
    });
    let dragon_scale_helmet = Item {
        id: object::new(ctx),
        `type`: DRAGON_SCALE_HELMET,
        slot: SLOT_HELMET,
        stats: ItemStats {
            attack: 0,
            defense: 15,
            health: 25,
            mana: 10,
        },
    };
    event::emit(ItemCreatedEvent {
        item_id: object::id(&dragon_scale_helmet),
        item_type: DRAGON_SCALE_HELMET,
        slot: SLOT_HELMET,
        attack: 0,
        defense: 15,
        health: 25,
        mana: 10,
        creator: tx_context::sender(ctx),
    });
    let leather_armor = Item {
        id: object::new(ctx),
        `type`: LEATHER_ARMOR,
        slot: SLOT_ARMOR,
        stats: ItemStats {
            attack: 0,
            defense: 8,
            health: 15,
            mana: 0,
        },
    };
    event::emit(ItemCreatedEvent {
        item_id: object::id(&leather_armor),
        item_type: LEATHER_ARMOR,
        slot: SLOT_ARMOR,
        attack: 0,
        defense: 8,
        health: 15,
        mana: 0,
        creator: tx_context::sender(ctx),
    });
    let mystical_robes = Item {
        id: object::new(ctx),
        `type`: MYSTICAL_ROBES,
        slot: SLOT_ARMOR,
        stats: ItemStats {
            attack: 0,
            defense: 12,
            health: 20,
            mana: 30,
        },
    };
    event::emit(ItemCreatedEvent {
        item_id: object::id(&mystical_robes),
        item_type: MYSTICAL_ROBES,
        slot: SLOT_ARMOR,
        attack: 0,
        defense: 12,
        health: 20,
        mana: 30,
        creator: tx_context::sender(ctx),
    });
    let leather_pants = Item {
        id: object::new(ctx),
        `type`: LEATHER_PANTS,
        slot: SLOT_LEGS,
        stats: ItemStats {
            attack: 0,
            defense: 8,
            health: 0,
            mana: 0,
        },
    };
    event::emit(ItemCreatedEvent {
        item_id: object::id(&leather_pants),
        item_type: LEATHER_PANTS,
        slot: SLOT_LEGS,
        attack: 0,
        defense: 8,
        health: 0,
        mana: 0,
        creator: tx_context::sender(ctx),
    });
    let enchanted_leggings = Item {
        id: object::new(ctx),
        `type`: ENCHANTED_LEGGINGS,
        slot: SLOT_LEGS,
        stats: ItemStats {
            attack: 0,
            defense: 25,
            health: 0,
            mana: 10,
        },
    };
    event::emit(ItemCreatedEvent {
        item_id: object::id(&enchanted_leggings),
        item_type: ENCHANTED_LEGGINGS,
        slot: SLOT_LEGS,
        attack: 0,
        defense: 25,
        health: 0,
        mana: 10,
        creator: tx_context::sender(ctx),
    });
    let iron_gauntlets = Item {
        id: object::new(ctx),
        `type`: IRON_GAUNTLETS,
        slot: SLOT_RIGHT_ARM,
        stats: ItemStats {
            attack: 5,
            defense: 3,
            health: 0,
            mana: 0,
        },
    };
    event::emit(ItemCreatedEvent {
        item_id: object::id(&iron_gauntlets),
        item_type: IRON_GAUNTLETS,
        slot: SLOT_RIGHT_ARM,
        attack: 5,
        defense: 3,
        health: 0,
        mana: 0,
        creator: tx_context::sender(ctx),
    });
    let shield_of_valor = Item {
        id: object::new(ctx),
        `type`: SHIELD_OF_VALOR,
        slot: SLOT_LEFT_ARM,
        stats: ItemStats {
            attack: 0,
            defense: 20,
            health: 15,
            mana: 0,
        },
    };
    event::emit(ItemCreatedEvent {
        item_id: object::id(&shield_of_valor),
        item_type: SHIELD_OF_VALOR,
        slot: SLOT_LEFT_ARM,
        attack: 0,
        defense: 20,
        health: 15,
        mana: 0,
        creator: tx_context::sender(ctx),
    });
    let arcane_bracers = Item {
        id: object::new(ctx),
        `type`: ARCANE_BRACERS,
        slot: SLOT_LEFT_ARM,
        stats: ItemStats {
            attack: 5,
            defense: 8,
            health: 0,
            mana: 25,
        },
    };
    event::emit(ItemCreatedEvent {
        item_id: object::id(&arcane_bracers),
        item_type: ARCANE_BRACERS,
        slot: SLOT_LEFT_ARM,
        attack: 5,
        defense: 8,
        health: 0,
        mana: 25,
        creator: tx_context::sender(ctx),
    });

    (
        iron_helmet,
        dragon_scale_helmet,
        leather_armor,
        mystical_robes,
        leather_pants,
        enchanted_leggings,
        iron_gauntlets,
        shield_of_valor,
        arcane_bracers,
    )
}

public fun delete_character(character: Character) {
    let Character { id, mut helmet, mut armor, mut right_arm, mut left_arm, mut legs } =
        character;

    // Delete equipped items if they exist
    if (option::is_some(&helmet)) {
        let item = option::extract(&mut helmet);
        let Item { id: item_id, `type`: _, slot: _, stats: _ } = item;
        object::delete(item_id);
    };
    option::destroy_none(helmet);

    if (option::is_some(&armor)) {
        let item = option::extract(&mut armor);
        let Item { id: item_id, `type`: _, slot: _, stats: _ } = item;
        object::delete(item_id);
    };
    option::destroy_none(armor);

    if (option::is_some(&right_arm)) {
        let item = option::extract(&mut right_arm);
        let Item { id: item_id, `type`: _, slot: _, stats: _ } = item;
        object::delete(item_id);
    };
    option::destroy_none(right_arm);

    if (option::is_some(&left_arm)) {
        let item = option::extract(&mut left_arm);
        let Item { id: item_id, `type`: _, slot: _, stats: _ } = item;
        object::delete(item_id);
    };
    option::destroy_none(left_arm);

    if (option::is_some(&legs)) {
        let item = option::extract(&mut legs);
        let Item { id: item_id, `type`: _, slot: _, stats: _ } = item;
        object::delete(item_id);
    };
    option::destroy_none(legs);

    object::delete(id);
}

public fun equip_character(
    character: &mut Character,
    mut items: vector<Item>,
    _ctx: &mut TxContext,
): vector<Item> {
    let mut return_items = vector::empty<Item>();

    // Unequip all currently equipped items and add them to return vector
    if (option::is_some(&character.helmet)) {
        let item = option::extract(&mut character.helmet);
        vector::push_back(&mut return_items, item);
    };

    if (option::is_some(&character.armor)) {
        let item = option::extract(&mut character.armor);
        vector::push_back(&mut return_items, item);
    };

    if (option::is_some(&character.right_arm)) {
        let item = option::extract(&mut character.right_arm);
        vector::push_back(&mut return_items, item);
    };

    if (option::is_some(&character.left_arm)) {
        let item = option::extract(&mut character.left_arm);
        vector::push_back(&mut return_items, item);
    };

    if (option::is_some(&character.legs)) {
        let item = option::extract(&mut character.legs);
        vector::push_back(&mut return_items, item);
    };

    // Iterate through the items vector and equip each item
    let mut i = 0;
    let length = vector::length(&items);

    while (i < length) {
        let item = vector::pop_back(&mut items);
        let slot = item.slot;

        if (slot == SLOT_HELMET) {
            // If helmet slot is already filled by a previous item in this batch, return the old one
            if (option::is_some(&character.helmet)) {
                let old_item = option::extract(&mut character.helmet);
                vector::push_back(&mut return_items, old_item);
            };
            option::fill(&mut character.helmet, item);
        } else if (slot == SLOT_ARMOR) {
            if (option::is_some(&character.armor)) {
                let old_item = option::extract(&mut character.armor);
                vector::push_back(&mut return_items, old_item);
            };
            option::fill(&mut character.armor, item);
        } else if (slot == SLOT_RIGHT_ARM) {
            if (option::is_some(&character.right_arm)) {
                let old_item = option::extract(&mut character.right_arm);
                vector::push_back(&mut return_items, old_item);
            };
            option::fill(&mut character.right_arm, item);
        } else if (slot == SLOT_LEFT_ARM) {
            if (option::is_some(&character.left_arm)) {
                let old_item = option::extract(&mut character.left_arm);
                vector::push_back(&mut return_items, old_item);
            };
            option::fill(&mut character.left_arm, item);
        } else if (slot == SLOT_LEGS) {
            if (option::is_some(&character.legs)) {
                let old_item = option::extract(&mut character.legs);
                vector::push_back(&mut return_items, old_item);
            };
            option::fill(&mut character.legs, item);
        } else {
            // Unknown slot, return the item
            vector::push_back(&mut return_items, item);
        };

        i = i + 1;
    };

    // Destroy the now-empty items vector
    vector::destroy_empty(items);

    return_items
}

public fun destroy_items(mut items: vector<Item>) {
    let length = vector::length(&items);
    let mut i = 0;

    while (i < length) {
        let item = vector::pop_back(&mut items);
        let Item { id, `type`: _, slot: _, stats: _ } = item;
        object::delete(id);
        i = i + 1;
    };

    vector::destroy_empty(items);
}
