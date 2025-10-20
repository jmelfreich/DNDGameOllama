// frontend/src/utils/gameState.js - PRODUCTION VERSION WITH FULL PERSISTENCE

const STORAGE_KEY = 'dnd-ollama-game-state';

export function saveGameState(gameState) {
  try {
    const serialized = JSON.stringify(gameState);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (err) {
    console.error('Error saving game state:', err);
    return false;
  }
}

export function loadGameState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return null;
    }
    const loaded = JSON.parse(serialized);
    
    if (!loaded.party && loaded.character) {
      loaded.party = [{
        ...loaded.character,
        isActive: true,
        isLeader: true
      }];
    }
    
    return loaded;
  } catch (err) {
    console.error('Error loading game state:', err);
    return null;
  }
}

export function clearGameState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('Error clearing game state:', err);
    return false;
  }
}

export function createNewGameState(campaign, character) {
  return {
    campaign,
    character: {
      ...character,
      equipment: character.equipment || {
        head: null,
        armor: null,
        gloves: null,
        feet: null,
        cape: null,
        r_hand: null,
        l_hand: null,
        ring1: null,
        ring2: null,
        earrings: null
      }
    },
    party: [{
      ...character,
      isActive: true,
      isLeader: true,
      equipment: character.equipment || {
        head: null,
        armor: null,
        gloves: null,
        feet: null,
        cape: null,
        r_hand: null,
        l_hand: null,
        ring1: null,
        ring2: null,
        earrings: null
      }
    }],
    currentLocation: campaign.startingLocation,
    activeQuests: [campaign.mainQuest],
    encounterType: 'normal',
    inCombat: false,
    currentNPC: null,
    currentEnemy: null,
    conversationHistory: [],
    turnCount: 0,
    contextSummary: null,
    gameStartTime: new Date().toISOString(),
    lastNarration: null,
    lastOptions: null,
    lastActionHistory: [],
    dialogSummary: null,
    battleSummary: null,
    battleContext: null
  };
}

export function updateCharacter(gameState, characterUpdates) {
  const updatedCharacter = {
    ...gameState.character,
    ...characterUpdates
  };
  
  const updatedParty = gameState.party.map(member =>
    member.isLeader ? updatedCharacter : member
  );

  return {
    ...gameState,
    character: updatedCharacter,
    party: updatedParty
  };
}

export function addToInventory(gameState, item) {
  const character = gameState.character;
  const inventory = [...(character.inventory || []), item];
  
  return updateCharacter(gameState, { inventory });
}

export function removeFromInventory(gameState, itemIndex) {
  const character = gameState.character;
  const newInventory = [...character.inventory];
  newInventory.splice(itemIndex, 1);
  
  return updateCharacter(gameState, { inventory: newInventory });
}

export function addGold(gameState, amount) {
  return updateCharacter(gameState, {
    gold: gameState.character.gold + amount
  });
}

export function addXP(gameState, amount) {
  const character = gameState.character;
  const newXP = character.xp + amount;
  const leveledUp = newXP >= character.xpToNextLevel;
  
  return {
    ...updateCharacter(gameState, { xp: newXP }),
    leveledUp
  };
}

export function equipItem(gameState, item, slot) {
  const character = gameState.character;
  const equipment = { ...character.equipment };
  const inventory = [...(character.inventory || [])];
  
  const oldItem = equipment[slot];
  if (oldItem) {
    inventory.push(oldItem);
  }
  
  equipment[slot] = item;
  
  const itemIndex = inventory.findIndex(i => 
    i.name === item.name && i.description === item.description
  );
  if (itemIndex !== -1) {
    inventory.splice(itemIndex, 1);
  }
  
  return updateCharacter(gameState, { equipment, inventory });
}

export function unequipItem(gameState, slot) {
  const character = gameState.character;
  const equipment = { ...character.equipment };
  const inventory = [...(character.inventory || [])];
  
  const item = equipment[slot];
  if (item) {
    inventory.push(item);
    equipment[slot] = null;
  }
  
  return updateCharacter(gameState, { equipment, inventory });
}

export function addPartyMember(gameState, member) {
  if (gameState.party.length >= 6) {
    return gameState;
  }
  
  const newParty = [...gameState.party, {
    ...member,
    isActive: false,
    isLeader: false
  }];
  
  return {
    ...gameState,
    party: newParty
  };
}

export function removePartyMember(gameState, memberIndex) {
  if (gameState.party.length === 1) {
    return gameState;
  }
  
  if (gameState.party[memberIndex].isLeader) {
    return gameState;
  }
  
  const newParty = gameState.party.filter((_, index) => index !== memberIndex);
  
  if (gameState.party[memberIndex].isActive && newParty.length > 0) {
    newParty[0].isActive = true;
  }
  
  return {
    ...gameState,
    party: newParty
  };
}

export function setActivePartyMember(gameState, memberIndex) {
  const newParty = gameState.party.map((member, index) => ({
    ...member,
    isActive: index === memberIndex
  }));
  
  return {
    ...gameState,
    party: newParty
  };
}

export function setPartyLeader(gameState, memberIndex) {
  const newParty = gameState.party.map((member, index) => ({
    ...member,
    isLeader: index === memberIndex
  }));
  
  return {
    ...gameState,
    character: newParty[memberIndex],
    party: newParty
  };
}

export function updatePartyMember(gameState, memberIndex, updates) {
  const newParty = [...gameState.party];
  newParty[memberIndex] = {
    ...newParty[memberIndex],
    ...updates
  };
  
  if (newParty[memberIndex].isLeader) {
    return {
      ...gameState,
      character: newParty[memberIndex],
      party: newParty
    };
  }
  
  return {
    ...gameState,
    party: newParty
  };
}

export function addToConversationHistory(gameState, message) {
  const conversationHistory = [...gameState.conversationHistory, message];
  
  if (conversationHistory.length > 50) {
    conversationHistory.splice(0, conversationHistory.length - 50);
  }
  
  return {
    ...gameState,
    conversationHistory
  };
}

export function clearDialogContext(gameState) {
  return {
    ...gameState,
    currentNPC: null,
    encounterType: 'normal'
  };
}

export function clearBattleContext(gameState) {
  return {
    ...gameState,
    currentEnemy: null,
    inCombat: false,
    encounterType: 'normal'
  };
}

export function transitionToBattle(gameState, enemy) {
  return {
    ...gameState,
    currentEnemy: enemy,
    inCombat: true,
    encounterType: 'battle'
  };
}

export function transitionToDialog(gameState, npc) {
  return {
    ...gameState,
    currentNPC: npc,
    encounterType: 'dialog'
  };
}

export function transitionToNormal(gameState, summary) {
  const conversationHistory = summary ? 
    [...gameState.conversationHistory, { role: 'system', content: summary }] :
    gameState.conversationHistory;
  
  return {
    ...gameState,
    encounterType: 'normal',
    currentNPC: null,
    currentEnemy: null,
    inCombat: false,
    conversationHistory
  };
}