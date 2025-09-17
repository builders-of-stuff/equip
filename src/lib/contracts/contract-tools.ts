import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, CONTRACT_FUNCTIONS, OBJECT_TYPES } from './constants.js';

export interface SuiItemStats {
  attack: number;
  defense: number;
  health: number;
  mana: number;
}

export interface SuiItem {
  objectId: string;
  type: number;
  slot: number;
  stats: SuiItemStats;
}

export interface SuiCharacter {
  objectId: string;
  helmet?: SuiItem;
  armor?: SuiItem;
  right_arm?: SuiItem;
  left_arm?: SuiItem;
  legs?: SuiItem;
}

/**
 * Mint a new character and starter items
 */
export const mintCharacterAndItems = async (walletAdapter: any) => {
  if (!walletAdapter?.currentAccount?.address) {
    throw new Error('Wallet not connected');
  }

  // Create transaction using @mysten/sui Transaction
  const tx = new Transaction();

  // Create character
  const [character] = tx.moveCall({
    target: CONTRACT_FUNCTIONS.CREATE_CHARACTER,
    arguments: []
  });

  // Create starter items
  const items = tx.moveCall({
    target: CONTRACT_FUNCTIONS.CREATE_STARTER_ITEMS,
    arguments: []
  });

  // Transfer character and items to user
  tx.transferObjects([character], walletAdapter.currentAccount.address);
  tx.transferObjects([items], walletAdapter.currentAccount.address);

  try {
    const { bytes, signature } = await walletAdapter.signTransaction(tx as any, {});

    const executedTx = await walletAdapter.executeTransaction({
      bytes,
      signature
    });

    return executedTx;
  } catch (e) {
    console.error('Failed to mint character and items:', e);
    throw e;
  }
};

/**
 * Fetch user's character from the blockchain
 */
export const fetchCharacter = async (
  suiClient: any,
  walletAddress: string
): Promise<SuiCharacter | null> => {
  try {
    const ownedObjects = await suiClient.getOwnedObjects({
      owner: walletAddress,
      filter: {
        StructType: OBJECT_TYPES.CHARACTER
      },
      options: {
        showContent: true,
        showDisplay: true,
        showType: true
      }
    });

    if (!ownedObjects.data || ownedObjects.data.length === 0) {
      return null;
    }

    // Get the first character (assuming one character per wallet)
    const characterObject = ownedObjects.data[0];
    const content = characterObject.data?.content as any;

    if (!content || content.dataType !== 'moveObject') {
      return null;
    }

    const fields = content.fields;
    const character: SuiCharacter = {
      objectId: characterObject.data!.objectId,
      helmet: fields.helmet ? parseItemFromOption(fields.helmet) : undefined,
      armor: fields.armor ? parseItemFromOption(fields.armor) : undefined,
      right_arm: fields.right_arm ? parseItemFromOption(fields.right_arm) : undefined,
      left_arm: fields.left_arm ? parseItemFromOption(fields.left_arm) : undefined,
      legs: fields.legs ? parseItemFromOption(fields.legs) : undefined
    };

    return character;
  } catch (e) {
    console.error('Failed to fetch character:', e);
    return null;
  }
};

/**
 * Fetch user's items from the blockchain
 */
export const fetchItems = async (
  suiClient: any,
  walletAddress: string
): Promise<SuiItem[]> => {
  try {
    const ownedObjects = await suiClient.getOwnedObjects({
      owner: walletAddress,
      filter: {
        StructType: OBJECT_TYPES.ITEM
      },
      options: {
        showContent: true,
        showDisplay: true,
        showType: true
      }
    });

    if (!ownedObjects.data) {
      return [];
    }

    const items: SuiItem[] = [];
    for (const object of ownedObjects.data) {
      const content = object.data?.content as any;
      if (content && content.dataType === 'moveObject') {
        const fields = content.fields;
        items.push({
          objectId: object.data!.objectId,
          type: parseInt(fields.type),
          slot: parseInt(fields.slot),
          stats: {
            attack: parseInt(fields.stats.fields.attack),
            defense: parseInt(fields.stats.fields.defense),
            health: parseInt(fields.stats.fields.health),
            mana: parseInt(fields.stats.fields.mana)
          }
        });
      }
    }

    return items;
  } catch (e) {
    console.error('Failed to fetch items:', e);
    return [];
  }
};

/**
 * Equip items to character
 */
export const equipCharacter = async (
  walletAdapter: any,
  characterId: string,
  itemIds: string[]
) => {
  if (!walletAdapter?.currentAccount?.address) {
    throw new Error('Wallet not connected');
  }

  const tx = new Transaction();

  // Call equip_character function
  const [returnItems] = tx.moveCall({
    target: CONTRACT_FUNCTIONS.EQUIP_CHARACTER,
    arguments: [
      tx.object(characterId),
      tx.makeMoveVec({
        elements: itemIds.map((id: string) => tx.object(id))
      })
    ]
  });

  // Transfer returned items back to user
  tx.transferObjects([returnItems], walletAdapter.currentAccount.address);

  try {
    const { bytes, signature } = await walletAdapter.signTransaction(tx as any, {});

    const executedTx = await walletAdapter.executeTransaction({
      bytes,
      signature
    });

    return executedTx;
  } catch (e) {
    console.error('Failed to equip character:', e);
    throw e;
  }
};

/**
 * Delete character
 */
export const deleteCharacter = async (walletAdapter: any, characterId: string) => {
  if (!walletAdapter?.currentAccount?.address) {
    throw new Error('Wallet not connected');
  }

  const tx = new Transaction();

  // Call delete_character function
  tx.moveCall({
    target: CONTRACT_FUNCTIONS.DELETE_CHARACTER,
    arguments: [tx.object(characterId)]
  });

  try {
    const { bytes, signature } = await walletAdapter.signTransaction(tx as any, {});

    const executedTx = await walletAdapter.executeTransaction({
      bytes,
      signature
    });

    return executedTx;
  } catch (e) {
    console.error('Failed to delete character:', e);
    throw e;
  }
};

/**
 * Helper function to parse item from Move Option type
 */
function parseItemFromOption(option: any): SuiItem | undefined {
  if (
    !option ||
    !option.fields ||
    !option.fields.vec ||
    option.fields.vec.length === 0
  ) {
    return undefined;
  }

  const item = option.fields.vec[0].fields;
  return {
    objectId: item.id.id,
    type: parseInt(item.type),
    slot: parseInt(item.slot),
    stats: {
      attack: parseInt(item.stats.fields.attack),
      defense: parseInt(item.stats.fields.defense),
      health: parseInt(item.stats.fields.health),
      mana: parseInt(item.stats.fields.mana)
    }
  };
}
