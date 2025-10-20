// backend/utils/contextManager.js - IMPROVED CONTEXT WINDOW MANAGEMENT
class ContextManager {
  constructor() {
    // With 256K token context window, we can keep A LOT of history
    // Keep up to 2000 messages (1000 turn pairs) before even considering summarization
    this.maxRecentMessages = 2000;
    
    // Only start summarizing when we exceed this threshold
    // At ~4 chars/token, this is roughly 200K+ tokens worth of messages
    this.summaryThreshold = 1800;
    
    // Target context window (in tokens) - Ollama with 256K context
    // Leave 56K tokens for system prompts, responses, and safety margin
    this.maxContextTokens = 200000;
  }

  /**
   * Estimates token count for messages
   * Rough approximation - actual tokenization varies by model
   */
  estimateTokens(messages) {
    let totalChars = 0;
    messages.forEach(msg => {
      if (msg.content) {
        totalChars += msg.content.length;
      }
    });
    // Rough estimate: ~4 characters per token
    return Math.ceil(totalChars / 4);
  }

  /**
   * Main context management function
   */
  manageContext(conversationHistory, character, gameState) {
    if (!conversationHistory || conversationHistory.length === 0) {
      return {
        messages: [],
        summary: null,
        stats: {
          totalMessages: 0,
          keptMessages: 0,
          estimatedTokens: 0
        }
      };
    }

    let messages = [...conversationHistory];
    let summary = gameState?.contextSummary || null;
    
    const estimatedTokens = this.estimateTokens(messages);
    
    // Only summarize if we're approaching context limits
    if (messages.length > this.summaryThreshold || estimatedTokens > this.maxContextTokens * 0.7) {
      console.log(`📊 Context management triggered: ${messages.length} messages, ~${estimatedTokens} tokens`);
      
      // Keep the most recent messages
      const messagesToKeep = Math.min(this.maxRecentMessages, messages.length);
      const oldMessages = messages.slice(0, messages.length - messagesToKeep);
      messages = messages.slice(-messagesToKeep);
      
      // Create comprehensive summary of old messages
      if (oldMessages.length > 0) {
        summary = this.createComprehensiveSummary(oldMessages, character, gameState, summary);
        console.log(`📝 Created summary from ${oldMessages.length} old messages, keeping ${messages.length} recent`);
      }
    }

    // Build final message array
    const finalMessages = [];
    
    if (summary) {
      finalMessages.push({
        role: 'system',
        content: `COMPREHENSIVE CONTEXT SUMMARY:\n${summary}`
      });
    }

    // Add recent encounter summaries
    if (gameState?.dialogSummary) {
      finalMessages.push({
        role: 'system',
        content: `Recent Dialog Outcome: ${gameState.dialogSummary}`
      });
    }

    if (gameState?.battleSummary) {
      finalMessages.push({
        role: 'system',
        content: `Recent Combat Outcome: ${gameState.battleSummary}`
      });
    }

    finalMessages.push(...messages);

    const finalTokens = this.estimateTokens(finalMessages);

    return {
      messages: finalMessages,
      summary,
      stats: {
        totalMessages: conversationHistory.length,
        keptMessages: messages.length,
        estimatedTokens: finalTokens,
        hadSummary: !!summary
      }
    };
  }

  /**
   * Creates a comprehensive, structured summary
   */
  createComprehensiveSummary(messages, character, gameState, existingSummary) {
    const summaryData = {
      characterInfo: {
        name: character.name,
        class: character.class,
        level: character.level,
        currentHP: character.hp,
        maxHP: character.maxHp
      },
      locations: new Set(),
      npcsEncountered: new Map(),
      combatOutcomes: [],
      questProgress: [],
      significantEvents: [],
      itemsAcquired: [],
      choicesMade: []
    };

    // Preserve prior context if it exists
    if (existingSummary) {
      summaryData.priorContext = existingSummary.split('\n').slice(0, 3).join(' ');
    }

    // Parse messages to extract key information
    messages.forEach((msg, index) => {
      if (msg.role === 'user') {
        const content = msg.content;
        
        // Extract player actions
        if (content.includes('I ')) {
          const action = content.substring(content.indexOf('I '), Math.min(content.length, content.indexOf('I ') + 150));
          
          // Categorize actions
          if (content.toLowerCase().includes('attack') || content.toLowerCase().includes('fight')) {
            summaryData.combatOutcomes.push({ action, turn: index });
          } else if (content.toLowerCase().includes('talk') || content.toLowerCase().includes('speak')) {
            summaryData.choicesMade.push({ action: 'Conversed', detail: action, turn: index });
          } else {
            summaryData.choicesMade.push({ action, turn: index });
          }
        }
      } else if (msg.role === 'assistant') {
        try {
          const data = typeof msg.content === 'string' ? JSON.parse(msg.content) : msg.content;
          
          if (data.narration) {
            const narration = data.narration;
            
            // Extract locations
            const locationMatch = narration.match(/(?:arrive|enter|reach|in|at|to)\s+(?:the\s+)?([A-Z][a-zA-Z\s]+)/);
            if (locationMatch) {
              summaryData.locations.add(locationMatch[1].trim());
            }
            
            // Extract NPC interactions
            const npcMatch = narration.match(/(?:meet|encounter|speak with|talk to|see)\s+([A-Z][a-z]+)/);
            if (npcMatch) {
              const npcName = npcMatch[1];
              if (!summaryData.npcsEncountered.has(npcName)) {
                summaryData.npcsEncountered.set(npcName, { interactions: 0, relationship: 'neutral' });
              }
              summaryData.npcsEncountered.get(npcName).interactions++;
            }
            
            // Capture significant events
            if (narration.toLowerCase().includes('die') || narration.toLowerCase().includes('dead') || 
                narration.toLowerCase().includes('kill') || narration.toLowerCase().includes('defeat')) {
              summaryData.significantEvents.push({ 
                event: 'Combat Victory/Death', 
                detail: narration.substring(0, 200), 
                turn: index 
              });
            } else if (narration.toLowerCase().includes('quest') || narration.toLowerCase().includes('mission')) {
              summaryData.questProgress.push(narration.substring(0, 150));
            } else if (narration.toLowerCase().includes('find') || narration.toLowerCase().includes('discover')) {
              summaryData.significantEvents.push({ 
                event: 'Discovery', 
                detail: narration.substring(0, 150), 
                turn: index 
              });
            }
          }

          // Extract NPC info
          if (data.npcInfo) {
            const npcName = data.npcInfo.name;
            if (!summaryData.npcsEncountered.has(npcName)) {
              summaryData.npcsEncountered.set(npcName, {
                interactions: 1,
                relationship: data.npcInfo.relationship || 'neutral',
                description: data.npcInfo.description
              });
            }
          }
        } catch (e) {
          // Extract from raw text if parsing fails
          if (typeof msg.content === 'string') {
            const snippet = msg.content.substring(0, 100);
            if (snippet.trim()) {
              summaryData.significantEvents.push({ event: snippet, turn: index });
            }
          }
        }
      }
    });

    // Pull definitive information from gameState
    if (gameState) {
      if (gameState.currentLocation) {
        summaryData.locations.add(gameState.currentLocation);
      }
      
      if (gameState.activeQuests) {
        summaryData.questProgress.push(...gameState.activeQuests);
      }
      
      if (gameState.npcRelationships) {
        Object.entries(gameState.npcRelationships).forEach(([npc, value]) => {
          if (!summaryData.npcsEncountered.has(npc)) {
            summaryData.npcsEncountered.set(npc, { interactions: 0, relationship: 'neutral' });
          }
          const relationship = value >= 20 ? 'Friendly' : value >= 10 ? 'Warm' : 
                              value >= 0 ? 'Neutral' : value >= -10 ? 'Cold' : 'Hostile';
          summaryData.npcsEncountered.get(npc).relationship = relationship;
        });
      }
      
      if (gameState.deadNPCs && gameState.deadNPCs.length > 0) {
        gameState.deadNPCs.forEach(npc => {
          summaryData.significantEvents.push({ 
            event: `NPC Death: ${npc}`, 
            detail: `${npc} was killed`,
            turn: 'past' 
          });
        });
      }
    }

    // Build comprehensive summary
    let summary = `=== ADVENTURE SUMMARY ===\n`;
    
    if (summaryData.priorContext) {
      summary += `Earlier Context: ${summaryData.priorContext}\n\n`;
    }
    
    summary += `CHARACTER: ${summaryData.characterInfo.name}, Level ${summaryData.characterInfo.level} ${summaryData.characterInfo.class}\n`;
    summary += `Status: ${summaryData.characterInfo.currentHP}/${summaryData.characterInfo.maxHP} HP\n\n`;
    
    if (summaryData.locations.size > 0) {
      summary += `LOCATIONS VISITED: ${Array.from(summaryData.locations).join(', ')}\n\n`;
    }
    
    if (summaryData.npcsEncountered.size > 0) {
      summary += `NPCs ENCOUNTERED:\n`;
      summaryData.npcsEncountered.forEach((info, name) => {
        summary += `- ${name}: ${info.relationship} (${info.interactions} interactions)`;
        if (info.description) {
          summary += ` - ${info.description.substring(0, 80)}`;
        }
        summary += `\n`;
      });
      summary += `\n`;
    }
    
    if (summaryData.significantEvents.length > 0) {
      summary += `SIGNIFICANT EVENTS:\n`;
      // Keep most recent 10 significant events
      summaryData.significantEvents.slice(-10).forEach(event => {
        summary += `- ${event.event}${event.detail ? ': ' + event.detail : ''}\n`;
      });
      summary += `\n`;
    }
    
    if (summaryData.questProgress.length > 0) {
      summary += `QUEST PROGRESS:\n`;
      [...new Set(summaryData.questProgress)].forEach(quest => {
        summary += `- ${quest}\n`;
      });
      summary += `\n`;
    }
    
    if (summaryData.combatOutcomes.length > 0) {
      summary += `COMBAT HISTORY: ${summaryData.combatOutcomes.length} battles fought\n\n`;
    }
    
    if (summaryData.choicesMade.length > 0) {
      summary += `KEY CHOICES (most recent):\n`;
      summaryData.choicesMade.slice(-5).forEach(choice => {
        summary += `- ${choice.detail || choice.action}\n`;
      });
    }
    
    return summary.trim();
  }

  addToHistory(conversationHistory, message) {
    return [...conversationHistory, message];
  }

  clearHistory() {
    return [];
  }
}

module.exports = new ContextManager();