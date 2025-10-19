// backend/routes/game.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const ollamaService = require('../services/ollama');
const contextManager = require('../services/contextManager');
const { getAllClasses } = require('../data/classes');
const { getClassAttacks } = require('../data/attacks');
const { getAllRaces, getRaceData } = require('../data/races');
const { getAllItems, getItemById, getItemsByCategory, getItemsUsableInCombat, getStartingItems } = require('../data/items');
const { getAllFeats, getFeatData, getFeatsForLevel } = require('../data/feats');


// Get available classes
router.get('/classes', (req, res) => {
  res.json(getAllClasses());
});

// Get available races
router.get('/races', (req, res) => {
  res.json(getAllRaces());
});

// Get race data
router.get('/races/:raceName', (req, res) => {
  const { raceName } = req.params;
  const raceData = getRaceData(raceName);
  if (raceData) {
    res.json(raceData);
  } else {
    res.status(404).json({ error: 'Race not found' });
  }
});

// Get all items
router.get('/items', (req, res) => {
  res.json(getAllItems());
});

// Get items by category
router.get('/items/category/:category', (req, res) => {
  const { category } = req.params;
  res.json(getItemsByCategory(category));
});

// Get items usable in combat
router.get('/items/combat', (req, res) => {
  res.json(getItemsUsableInCombat());
});

// Get starting items for a class
router.get('/items/starting/:className', (req, res) => {
  const { className } = req.params;
  res.json(getStartingItems(className));
});

// Get attacks for class and level
router.get('/attacks/:className/:level', (req, res) => {
  const { className, level } = req.params;
  const attacks = getClassAttacks(className, parseInt(level));
  res.json(attacks);
});

// Generate campaign
router.post('/campaign/generate', async (req, res) => {
  try {
    const { campaignIdea } = req.body;
    
    const response = await ollamaService.generateStructured({
      messages: [
        {
          role: 'user',
          content: `Create a DND campaign based on this idea: ${campaignIdea}. Include a title, description, setting, main quest, and starting location.`
        }
      ],
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          setting: { type: 'string' },
          mainQuest: { type: 'string' },
          startingLocation: { type: 'string' },
          tone: { type: 'string' }
        },
        required: ['title', 'description', 'setting', 'mainQuest', 'startingLocation']
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Error generating campaign:', error);
    res.status(500).json({ error: 'Failed to generate campaign' });
  }
});

// Normal play action
router.post('/play/action', async (req, res) => {
  try {
    const { character, gameState, conversationHistory } = req.body;
    
    const managedContext = contextManager.manageContext(conversationHistory, character, gameState);
    
    const response = await ollamaService.generateStructured({
      messages: managedContext.messages,
      schema: {
        type: 'object',
        properties: {
          narration: { type: 'string' },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                text: { type: 'string' },
                requiresRoll: { type: 'boolean' },
                skill: { type: 'string' },
                dc: { type: 'number' }
              },
              required: ['id', 'text', 'requiresRoll']
            }
          },
          encounterType: { 
            type: 'string',
            enum: ['normal', 'battle', 'dialog', 'shopping']
          }
        },
        required: ['narration', 'options', 'encounterType']
      }
    });

    res.json({
      ...response,
      contextSummary: managedContext.summary
    });
  } catch (error) {
    console.error('Error in play action:', error);
    res.status(500).json({ error: 'Failed to process action' });
  }
});

// Battle action
router.post('/battle/action', async (req, res) => {
  try {
    const { character, enemy, action, conversationHistory, gameState } = req.body;
    
    const managedContext = contextManager.manageContext(conversationHistory, character, gameState);
    
    const systemPrompt = `You are a DND Dungeon Master. The player is in combat.
Player: ${character.name} (HP: ${character.hp}/${character.maxHp}, Level: ${character.level})
Enemy: ${enemy.name} (HP: ${enemy.hp}/${enemy.maxHp})
Player action: ${JSON.stringify(action)}`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        ...managedContext.messages.slice(-10)
      ],
      schema: {
        type: 'object',
        properties: {
          narration: { type: 'string' },
          playerDamage: { type: 'number' },
          enemyDamage: { type: 'number' },
          battleEnd: { type: 'boolean' },
          victory: { type: 'boolean' },
          xpGained: { type: 'number' }
        },
        required: ['narration', 'playerDamage', 'enemyDamage', 'battleEnd']
      }
    });

    res.json({
      ...response,
      contextSummary: managedContext.summary
    });
  } catch (error) {
    console.error('Error in battle action:', error);
    res.status(500).json({ error: 'Failed to process battle action' });
  }
});

// Use item in battle
router.post('/battle/use-item', async (req, res) => {
  try {
    const { character, enemy, item, conversationHistory, gameState } = req.body;
    
    const managedContext = contextManager.manageContext(conversationHistory, character, gameState);
    
    const systemPrompt = `You are a DND Dungeon Master. The player is in combat and using an item.
Player: ${character.name} (HP: ${character.hp}/${character.maxHp}, Level: ${character.level})
Enemy: ${enemy.name} (HP: ${enemy.hp}/${enemy.maxHp})
Item used: ${item.name} - ${item.description}
Effect: ${item.effect}`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        ...managedContext.messages.slice(-10)
      ],
      schema: {
        type: 'object',
        properties: {
          narration: { type: 'string' },
          playerDamage: { type: 'number' },
          enemyDamage: { type: 'number' },
          playerHealing: { type: 'number' },
          playerEffects: {
            type: 'array',
            items: { type: 'string' }
          },
          enemyEffects: {
            type: 'array',
            items: { type: 'string' }
          },
          battleEnd: { type: 'boolean' },
          victory: { type: 'boolean' },
          itemConsumed: { type: 'boolean' }
        },
        required: ['narration', 'playerDamage', 'enemyDamage', 'itemConsumed']
      }
    });

    res.json({
      ...response,
      item: item,
      contextSummary: managedContext.summary
    });
  } catch (error) {
    console.error('Error using item in battle:', error);
    res.status(500).json({ error: 'Failed to use item' });
  }
});

// Dialog action
router.post('/dialog/action', async (req, res) => {
  try {
    const { character, npc, conversationHistory, gameState } = req.body;
    
    const managedContext = contextManager.manageContext(conversationHistory, character, gameState);
    
    const response = await ollamaService.generateStructured({
      messages: managedContext.messages,
      schema: {
        type: 'object',
        properties: {
          npcResponse: { type: 'string' },
          dialogOptions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                text: { type: 'string' },
                type: { 
                  type: 'string',
                  enum: ['talk', 'buy', 'sell', 'leave', 'quest']
                },
                requiresRoll: { type: 'boolean' },
                skill: { type: 'string' },
                dc: { type: 'number' }
              },
              required: ['id', 'text', 'type', 'requiresRoll']
            }
          },
          relationshipChange: { type: 'number' }
        },
        required: ['npcResponse', 'dialogOptions']
      }
    });

    res.json({
      ...response,
      contextSummary: managedContext.summary
    });
  } catch (error) {
    console.error('Error in dialog action:', error);
    res.status(500).json({ error: 'Failed to process dialog' });
  }
});

// Generate enemy
router.post('/battle/generate-enemy', async (req, res) => {
  try {
    const { character, location, difficulty } = req.body;
    
    const response = await ollamaService.generateStructured({
      messages: [
        {
          role: 'user',
          content: `Generate a D&D enemy for a battle encounter. 
Character level: ${character.level}
Location: ${location}
Difficulty: ${difficulty || 'normal'}
The enemy should be balanced for this level.`
        }
      ],
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          level: { type: 'number' },
          hp: { type: 'number' },
          maxHp: { type: 'number' },
          ac: { type: 'number' },
          attacks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                damage: { type: 'string' },
                type: { type: 'string' },
                description: { type: 'string' }
              },
              required: ['name', 'damage', 'type']
            }
          },
          xpReward: { type: 'number' },
          lootTable: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['name', 'description', 'level', 'hp', 'maxHp', 'ac', 'attacks', 'xpReward']
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Error generating enemy:', error);
    res.status(500).json({ error: 'Failed to generate enemy' });
  }
});

// 🆕 AI ITEM GENERATION ENDPOINT
router.post('/items/generate', async (req, res) => {
  try {
    const { context, itemType, rarity } = req.body;
    
    const response = await ollamaService.generateStructured({
      messages: [
        {
          role: 'user',
          content: `Generate a unique D&D item based on the following context:
Context: ${context || 'general fantasy setting'}
Item Type: ${itemType || 'any'}
Rarity: ${rarity || 'common'}

Create an interesting and balanced item with unique properties.`
        }
      ],
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          type: { 
            type: 'string',
            enum: ['weapon', 'armor', 'potion', 'scroll', 'wondrous', 'tool', 'consumable']
          },
          category: { type: 'string' },
          rarity: {
            type: 'string',
            enum: ['common', 'uncommon', 'rare', 'very rare', 'legendary', 'artifact']
          },
          price: { type: 'number' },
          weight: { type: 'number' },
          description: { type: 'string' },
          effect: { type: 'string' },
          usableInCombat: { type: 'boolean' },
          damage: { type: 'string' },
          armorClass: { type: 'number' },
          properties: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['name', 'type', 'category', 'rarity', 'price', 'description', 'usableInCombat']
      }
    });

    // Assign a unique ID based on timestamp
    response.id = Date.now();

    res.json(response);
  } catch (error) {
    console.error('Error generating item:', error);
    res.status(500).json({ error: 'Failed to generate item' });
  }
});

// Check Ollama connection and list models
router.get('/ollama/status', async (req, res) => {
  try {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    
    console.log('🔍 Checking Ollama at:', ollamaUrl);
    
    const response = await axios.get(`${ollamaUrl}/api/tags`, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Ollama connected! Models found:', response.data.models?.length || 0);
    
    res.json({
      status: 'connected',
      models: response.data.models || [],
      url: ollamaUrl
    });
  } catch (error) {
    console.error('❌ Ollama connection failed:', error.message);
    
    res.status(200).json({
      status: 'disconnected',
      error: error.message,
      errorCode: error.code,
      models: [],
      url: process.env.OLLAMA_URL || 'http://127.0.0.1:11434'
    });
  }
});

// Test Ollama with a simple generation
router.post('/ollama/test', async (req, res) => {
  try {
    const { model } = req.body;
    const testModel = model || 'qwen3:8b';
    
    console.log('🧪 Testing model:', testModel);
    
    const response = await ollamaService.generateStructured({
      messages: [
        {
          role: 'user',
          content: 'Say "Hello, Ollama is working!" Return only valid JSON with a message field.'
        }
      ],
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        },
        required: ['message']
      },
      model: testModel
    });

    console.log('✅ Model test successful!');

    res.json({
      success: true,
      response: response
    });
  } catch (error) {
    console.error('❌ Model test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all feats
router.get('/feats', (req, res) => {
  res.json(getAllFeats());
});

// Get feat data
router.get('/feats/:featName', (req, res) => {
  const { featName } = req.params;
  const featData = getFeatData(featName);
  if (featData) {
    res.json(featData);
  } else {
    res.status(404).json({ error: 'Feat not found' });
  }
});

// Get feats for level
router.get('/feats/level/:level', (req, res) => {
  const { level } = req.params;
  const feats = getFeatsForLevel(parseInt(level));
  res.json(feats);
});

module.exports = router;