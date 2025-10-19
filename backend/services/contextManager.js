async function summarizeContext(messages) {
  const ollamaService = require('./ollama');
  
  // Create a summary of the conversation
  const conversationText = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');

  const summary = await ollamaService.generateStructured({
    messages: [
      {
        role: 'user',
        content: `Summarize this DND game session, including key events, NPCs met, items obtained, quests, and current objectives:\n\n${conversationText}`
      }
    ],
    schema: {
      type: 'object',
      properties: {
        keyEvents: {
          type: 'array',
          items: { type: 'string' }
        },
        npcsMet: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              relationship: { type: 'string' }
            }
          }
        },
        itemsObtained: {
          type: 'array',
          items: { type: 'string' }
        },
        activeQuests: {
          type: 'array',
          items: { type: 'string' }
        },
        currentObjective: { type: 'string' },
        currentLocation: { type: 'string' }
      },
      required: ['keyEvents', 'currentObjective', 'currentLocation']
    }
  });

  return summary;
}

function manageContext(conversationHistory, character, gameState) {
  const MAX_TURNS = 250;
  
  // If we're approaching the limit, summarize
  if (conversationHistory.length >= MAX_TURNS) {
    // This would be async in real implementation
    const summary = gameState.contextSummary || 'Game in progress';
    
    // Keep only recent messages
    const recentMessages = conversationHistory.slice(-20);
    
    // Create system message with character and summary
    const systemMessage = {
      role: 'system',
      content: `You are a DND Dungeon Master.

CHARACTER:
Name: ${character.name}
Class: ${character.class} (Level ${character.level})
HP: ${character.hp}/${character.maxHp}
Stats: STR ${character.strength}, DEX ${character.dexterity}, CON ${character.constitution}, INT ${character.intelligence}, WIS ${character.wisdom}, CHA ${character.charisma}
Gold: ${character.gold}
XP: ${character.xp}/${character.xpToNextLevel}

STORY SUMMARY:
${JSON.stringify(summary, null, 2)}

CURRENT SITUATION:
Location: ${gameState.currentLocation}
Active Quests: ${gameState.activeQuests?.join(', ') || 'None'}

Continue the adventure from here, maintaining consistency with the story so far.`
    };
    
    return {
      messages: [systemMessage, ...recentMessages],
      summary: summary
    };
  }
  
  // Normal operation - full history
  const systemMessage = {
    role: 'system',
    content: `You are a DND Dungeon Master.

CHARACTER:
Name: ${character.name}
Class: ${character.class} (Level ${character.level})
HP: ${character.hp}/${character.maxHp}
Stats: STR ${character.strength}, DEX ${character.dexterity}, CON ${character.constitution}, INT ${character.intelligence}, WIS ${character.wisdom}, CHA ${character.charisma}
Gold: ${character.gold}
XP: ${character.xp}/${character.xpToNextLevel}

Location: ${gameState.currentLocation}
Active Quests: ${gameState.activeQuests?.join(', ') || 'None'}`
  };
  
  return {
    messages: [systemMessage, ...conversationHistory],
    summary: null
  };
}

module.exports = {
  summarizeContext,
  manageContext
};