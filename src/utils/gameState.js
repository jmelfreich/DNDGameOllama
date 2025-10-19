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
    return JSON.parse(serialized);
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
    character,
    currentLocation: campaign.startingLocation,
    activeQuests: [campaign.mainQuest],
    encounterType: 'normal',
    inCombat: false,
    currentNPC: null,
    currentEnemy: null,
    conversationHistory: [],
    turnCount: 0,
    contextSummary: null,
    gameStartTime: new Date().toISOString()
  };
}

export function updateCharacter(gameState, characterUpdates) {
  return {
    ...gameState,
    character: {
      ...gameState.character,
      ...characterUpdates
    }
  };
}

export function addToInventory(gameState, item) {
  return {
    ...gameState,
    character: {
      ...gameState.character,
      inventory: [...(gameState.character.inventory || []), item]
    }
  };
}

export function removeFromInventory(gameState, itemIndex) {
  const newInventory = [...gameState.character.inventory];
  newInventory.splice(itemIndex, 1);
  
  return {
    ...gameState,
    character: {
      ...gameState.character,
      inventory: newInventory
    }
  };
}

export function addGold(gameState, amount) {
  return {
    ...gameState,
    character: {
      ...gameState.character,
      gold: gameState.character.gold + amount
    }
  };
}

export function addXP(gameState, amount) {
  const newXP = gameState.character.xp + amount;
  const leveledUp = newXP >= gameState.character.xpToNextLevel;
  
  return {
    ...gameState,
    character: {
      ...gameState.character,
      xp: newXP
    },
    leveledUp
  };
}