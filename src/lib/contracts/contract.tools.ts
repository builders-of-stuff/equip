import { Transaction } from '@mysten/sui/transactions';
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { graphql } from '@mysten/sui/graphql/schemas/latest';
import { CONTRACT_FUNCTIONS, OBJECT_TYPES, PACKAGE_ID } from './constants.js';
import { walletAdapter } from '../wallet/index.js';
import { parseCharacterFromTxResponse, parseItemsFromTxResponse } from './utils.js';

const gqlClient = new SuiGraphQLClient({
  // alpha endpoints
  // url: 'https://sui-testnet.mystenlabs.com/graphql'

  // beta endpoints
  url: 'https://graphql.testnet.sui.io/graphql'
});

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

export interface MintResult {
  character: SuiCharacter | null;
  items: SuiItem[];
  executedTx: any;
}

/**
 * Mint a new character and starter items
 */
export const mintCharacterAndItems = async (): Promise<MintResult> => {
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

  // Create starter items - destructure the tuple of 9 items
  const [item1, item2, item3, item4, item5, item6, item7, item8, item9] = tx.moveCall({
    target: CONTRACT_FUNCTIONS.CREATE_STARTER_ITEMS,
    arguments: []
  });

  // Transfer character and items to user
  tx.transferObjects([character], walletAdapter.currentAccount.address);
  tx.transferObjects(
    [item1, item2, item3, item4, item5, item6, item7, item8, item9],
    walletAdapter.currentAccount.address
  );

  try {
    const { bytes, signature } = await walletAdapter.signTransaction(tx as any, {});

    const executedTx = await walletAdapter.executeTransaction({
      bytes,
      signature
    });

    console.log('Executed Transaction:', executedTx);

    // Parse character and items from transaction response
    const character = parseCharacterFromTxResponse(executedTx);
    const items = parseItemsFromTxResponse(executedTx);

    return {
      character,
      items,
      executedTx
    };
  } catch (e) {
    console.error('Failed to mint character and items:', e);
    throw e;
  }
};

/**
 * Fetch user's character from the blockchain
 */
export const fetchCharacter = async (
  walletAddress: string
): Promise<SuiCharacter | null> => {
  try {
    const query = graphql(`
      query GetCharacter($owner: SuiAddress!, $type: String!) {
        objects(first: 1, filter: { owner: $owner, type: $type }) {
          edges {
            node {
              address
              asMoveObject {
                contents {
                  json
                }
              }
            }
          }
        }
      }
    `);

    const result = await gqlClient.query({
      query,
      variables: {
        owner: walletAddress,
        type: OBJECT_TYPES.CHARACTER
      }
    });

    if (!result.data?.objects?.edges || result.data.objects.edges.length === 0) {
      return null;
    }

    // Get the first character (assuming one character per wallet)
    const characterNode = result.data.objects.edges[0].node;
    const moveObject = characterNode?.asMoveObject;
    const contents = moveObject?.contents;
    const json = contents?.json;

    if (!json || typeof json !== 'object') {
      return null;
    }

    const fields = json as any;
    const character: SuiCharacter = {
      objectId: characterNode.address,
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
export const fetchItems = async (walletAddress: string): Promise<SuiItem[]> => {
  try {
    const query = graphql(`
      query GetItems($owner: SuiAddress!, $type: String!) {
        objects(first: 50, filter: { owner: $owner, type: $type }) {
          edges {
            node {
              address
              asMoveObject {
                contents {
                  json
                }
              }
            }
          }
        }
      }
    `);

    const result = await gqlClient.query({
      query,
      variables: {
        owner: walletAddress,
        type: OBJECT_TYPES.ITEM
      }
    });

    if (!result.data?.objects?.edges) {
      return [];
    }

    const items: SuiItem[] = [];
    for (const edge of result.data.objects.edges) {
      try {
        const node = edge.node;
        const moveObject = node?.asMoveObject;
        const contents = moveObject?.contents;
        const json = contents?.json;

        if (json && typeof json === 'object') {
          const fields = json as any;

          items.push({
            objectId: node.address,
            type: parseInt(fields.type),
            slot: parseInt(fields.slot),
            stats: {
              attack: parseInt(fields.stats.attack),
              defense: parseInt(fields.stats.defense),
              health: parseInt(fields.stats.health),
              mana: parseInt(fields.stats.mana)
            }
          });
        }
      } catch (parseError) {
        console.warn('Failed to parse item from GraphQL response:', parseError);
        // Continue processing other items even if one fails
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
export const equipCharacter = async (characterId: string, itemIds: string[]) => {
  if (!walletAdapter?.currentAccount?.address) {
    throw new Error('Wallet not connected');
  }

  const tx = new Transaction();

  console.log('Equipping items:', itemIds, 'to character:', characterId);

  // Call equip_character function
  tx.moveCall({
    target: CONTRACT_FUNCTIONS.EQUIP_CHARACTER,
    arguments: [
      tx.object(`${characterId}`),
      tx.makeMoveVec({
        elements: itemIds.map((id: string) => tx.object(`${id}`))
      })
    ]
  });

  // Transfer returned items back to user
  // tx.transferObjects([returnItems], walletAdapter.currentAccount.address);

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
export const deleteCharacter = async (characterId: string) => {
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
 * Destroy items
 */
export const destroyItems = async (itemIds: string[]) => {
  if (!walletAdapter?.currentAccount?.address) {
    throw new Error('Wallet not connected');
  }

  if (itemIds.length === 0) {
    throw new Error('No items to destroy');
  }

  const tx = new Transaction();

  // Call destroy_items function
  tx.moveCall({
    target: CONTRACT_FUNCTIONS.DESTROY_ITEMS,
    arguments: [
      tx.makeMoveVec({
        elements: itemIds.map((id: string) => tx.object(id))
      })
    ]
  });

  try {
    const { bytes, signature } = await walletAdapter.signTransaction(tx as any, {});

    const executedTx = await walletAdapter.executeTransaction({
      bytes,
      signature
    });

    return executedTx;
  } catch (e) {
    console.error('Failed to destroy items:', e);
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
