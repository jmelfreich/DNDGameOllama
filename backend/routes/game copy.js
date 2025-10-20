// backend/routes/game.js - COMPLETE WITH SMART CONTEXT MANAGEMENT
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

// All D&D Skills
const DND_SKILLS = {
  'Athletics': 'strength',
  'Acrobatics': 'dexterity',
  'Sleight of Hand': 'dexterity',
  'Stealth': 'dexterity',
  'Arcana': 'intelligence',
  'History': 'intelligence',
  'Investigation': 'intelligence',
  'Nature': 'intelligence',
  'Religion': 'intelligence',
  'Animal Handling': 'wisdom',
  'Insight': 'wisdom',
  'Medicine': 'wisdom',
  'Perception': 'wisdom',
  'Survival': 'wisdom',
  'Deception': 'charisma',
  'Intimidation': 'charisma',
  'Performance': 'charisma',
  'Persuasion': 'charisma'
};

// SMART CONTEXT MANAGEMENT - Only send relevant act info
function getCampaignContext(campaign, gameState) {
  if (!campaign || !campaign.structure) {
    return '';
  }

  const currentAct = gameState.currentAct || 'opener';
  const actData = campaign.structure[currentAct];
  
  if (!actData) {
    return `CAMPAIGN: ${campaign.title}\n${campaign.description}`;
  }

  // Start with global campaign info
  let context = `=== CAMPAIGN: ${campaign.title} ===
Setting: ${campaign.setting}
Tone: ${campaign.tone}
Main Quest: ${campaign.mainQuest}

`;

  // Add summary of COMPLETED acts (so AI knows what happened before)
  const actOrder = ['opener', 'act1', 'bridge1', 'act2', 'bridge2', 'act3', 'finale'];
  const currentIndex = actOrder.indexOf(currentAct);
  
  if (currentIndex > 0) {
    context += `=== STORY SO FAR ===\n`;
    for (let i = 0; i < currentIndex; i++) {
      const pastActName = actOrder[i];
      const pastAct = campaign.structure[pastActName];
      const progress = gameState.actProgress?.[pastActName];
      
      if (pastAct) {
        context += `${pastAct.name}: ${pastAct.description}`;
        if (progress?.bossesDefeated?.length > 0) {
          context += ` (Defeated: ${progress.bossesDefeated.join(', ')})`;
        }
        context += `\n`;
      }
    }
    context += `\n`;
  }

  // Add FULL DETAILS of current act only
  context += `=== CURRENT ACT: ${actData.name} (${currentAct}) ===
${actData.description}
${actData.theme ? `Theme: ${actData.theme}` : ''}

LOCATIONS IN THIS ACT:`;

  if (actData.locations && actData.locations.length > 0) {
    actData.locations.forEach(loc => {
      context += `\n\n📍 ${loc.name} (${loc.type}, ${loc.size}):`;
      context += `\n   ${loc.description}`;
      
      if (loc.atmosphere) {
        context += `\n   Atmosphere: ${loc.atmosphere}`;
      }
      
      // Only include NPC details for current location or nearby
      const isCurrentOrNearby = 
        loc.name === gameState.currentLocation || 
        (gameState.visitedLocations && gameState.visitedLocations.includes(loc.name)) ||
        (loc.connectedTo && loc.connectedTo.includes(gameState.currentLocation));
      
      if (isCurrentOrNearby && loc.npcs) {
        const companions = loc.npcs.companions || [];
        const questGivers = loc.npcs.questGivers || [];
        const merchants = loc.npcs.merchants || [];
        const namedNPCs = loc.npcs.named || [];
        
        if (companions.length > 0) {
          context += `\n   🎭 Companions Available: ${companions.map(c => `${c.name} (${c.class} ${c.level})`).join(', ')}`;
        }
        if (questGivers.length > 0) {
          context += `\n   📜 Quest Givers: ${questGivers.map(q => q.name).join(', ')}`;
        }
        if (merchants.length > 0) {
          context += `\n   🛒 Merchants: ${merchants.map(m => `${m.name} (${m.merchantType})`).join(', ')}`;
        }
        if (namedNPCs.length > 5) {
          context += `\n   👥 Notable NPCs: ${namedNPCs.slice(0, 5).map(n => n.name).join(', ')} and ${namedNPCs.length - 5} others`;
        } else if (namedNPCs.length > 0) {
          context += `\n   👥 Notable NPCs: ${namedNPCs.map(n => n.name).join(', ')}`;
        }
      } else if (loc.npcs) {
        // For unvisited locations, just mention they have NPCs without full details
        const totalNPCs = 
          (loc.npcs.companions?.length || 0) + 
          (loc.npcs.questGivers?.length || 0) + 
          (loc.npcs.merchants?.length || 0) + 
          (loc.npcs.named?.length || 0);
        if (totalNPCs > 0) {
          context += `\n   👥 Population: ${totalNPCs}+ NPCs`;
        }
      }
      
      if (loc.enemies && loc.enemies.bosses && loc.enemies.bosses.length > 0) {
        context += `\n   ⚔️ Bosses: ${loc.enemies.bosses.map(b => b.name).join(', ')}`;
      }
      
      if (loc.connectedTo && loc.connectedTo.length > 0) {
        context += `\n   🗺️ Connects to: ${loc.connectedTo.join(', ')}`;
      }
    });
  }

  if (actData.objectives && actData.objectives.length > 0) {
    context += `\n\nCURRENT ACT OBJECTIVES:`;
    actData.objectives.forEach((obj, i) => {
      const completed = gameState.actProgress?.[currentAct]?.objectivesCompleted?.includes(obj);
      context += `\n${completed ? '✅' : '⬜'} ${i + 1}. ${obj}`;
    });
  }

  // Add teaser of NEXT act (just name and theme, no details)
  if (currentIndex < actOrder.length - 1) {
    const nextActName = actOrder[currentIndex + 1];
    const nextAct = campaign.structure[nextActName];
    if (nextAct) {
      context += `\n\n=== WHAT LIES AHEAD ===`;
      context += `\nNext: ${nextAct.name}`;
      if (nextAct.theme) {
        context += ` - ${nextAct.theme}`;
      }
      context += `\n(Details unknown until act is reached)`;
    }
  }

  // Add player progress
  if (gameState.visitedLocations && gameState.visitedLocations.length > 0) {
    context += `\n\n=== PLAYER PROGRESS ===`;
    context += `\nVisited Locations: ${gameState.visitedLocations.join(', ')}`;
  }

  if (gameState.defeatedBosses && gameState.defeatedBosses.length > 0) {
    context += `\nDefeated Bosses: ${gameState.defeatedBosses.join(', ')}`;
  }

  if (gameState.metNPCs && gameState.metNPCs.length > 0) {
    context += `\nMet NPCs: ${gameState.metNPCs.slice(-10).join(', ')}${gameState.metNPCs.length > 10 ? ' (and others)' : ''}`;
  }

  return context;
}

// V3: Post-process and fix dialog tree node references
function fixDialogTree(dialogTree) {
  const nodes = dialogTree.nodes;
  const nodeIds = Object.keys(nodes);
  let fixed = false;

  Object.entries(nodes).forEach(([nodeId, node]) => {
    if (!node.options) return;

    node.options.forEach((option, optIndex) => {
      if (option.type === 'talk' && !option.nextNodeId) {
        const targetNode = nodeIds.find(id => id !== nodeId);
        if (targetNode) {
          option.nextNodeId = targetNode;
          console.log(`🔧 Fixed talk option in ${nodeId}: added nextNodeId=${targetNode}`);
          fixed = true;
        }
      }

      if (option.type === 'skill_check') {
        if (!option.successNodeId) {
          const targetNode = nodeIds.find(id => id !== nodeId);
          if (targetNode) {
            option.successNodeId = targetNode;
            console.log(`🔧 Fixed skill_check in ${nodeId}: added successNodeId=${targetNode}`);
            fixed = true;
          }
        }
        if (!option.failureNodeId) {
          const targetNode = nodeIds.find(id => id !== nodeId);
          if (targetNode) {
            option.failureNodeId = targetNode;
            console.log(`🔧 Fixed skill_check in ${nodeId}: added failureNodeId=${targetNode}`);
            fixed = true;
          }
        }
      }

      if (option.nextNodeId && !nodes[option.nextNodeId]) {
        const newNodeId = `generated_${Date.now()}_${optIndex}`;
        nodes[newNodeId] = {
          id: newNodeId,
          npcText: "Let me think about that...",
          options: [],
          outcome: { type: 'continue' }
        };
        option.nextNodeId = newNodeId;
        console.log(`🔧 Created missing node ${newNodeId} for ${nodeId}`);
        fixed = true;
      }

      if (option.successNodeId && !nodes[option.successNodeId]) {
        const newNodeId = `generated_success_${Date.now()}_${optIndex}`;
        nodes[newNodeId] = {
          id: newNodeId,
          npcText: "That worked out well.",
          options: [],
          outcome: { type: 'continue' }
        };
        option.successNodeId = newNodeId;
        console.log(`🔧 Created missing success node ${newNodeId}`);
        fixed = true;
      }

      if (option.failureNodeId && !nodes[option.failureNodeId]) {
        const newNodeId = `generated_failure_${Date.now()}_${optIndex}`;
        nodes[newNodeId] = {
          id: newNodeId,
          npcText: "That didn't go as planned.",
          options: [],
          outcome: { type: 'continue' }
        };
        option.failureNodeId = newNodeId;
        console.log(`🔧 Created missing failure node ${newNodeId}`);
        fixed = true;
      }
    });
  });

  if (fixed) {
    console.log('✅ Dialog tree auto-fixed and validated');
  }

  return dialogTree;
}

function validateDialogTree(dialogTree) {
  const errors = [];
  
  if (!dialogTree || !dialogTree.nodes || !dialogTree.rootNodeId) {
    errors.push('Missing dialog tree structure');
    return { isValid: false, errors };
  }
  
  const nodes = dialogTree.nodes;
  const nodeIds = Object.keys(nodes);
  
  if (!nodes[dialogTree.rootNodeId]) {
    errors.push(`Root node ${dialogTree.rootNodeId} not found in nodes`);
  }
  
  Object.entries(nodes).forEach(([nodeId, node]) => {
    if (!node.options || !Array.isArray(node.options)) {
      errors.push(`Node ${nodeId} has no options array`);
      return;
    }
    
    node.options.forEach((option, index) => {
      if (option.type === 'talk' && !option.nextNodeId) {
        errors.push(`Node ${nodeId}, option ${index} (talk): missing nextNodeId`);
      }
      
      if (option.type === 'skill_check') {
        if (!option.successNodeId) {
          errors.push(`Node ${nodeId}, option ${index} (skill_check): missing successNodeId`);
        }
        if (!option.failureNodeId) {
          errors.push(`Node ${nodeId}, option ${index} (skill_check): missing failureNodeId`);
        }
      }
      
      if (option.nextNodeId && !nodes[option.nextNodeId]) {
        errors.push(`Node ${nodeId}, option ${index}: nextNodeId "${option.nextNodeId}" not found`);
      }
      if (option.successNodeId && !nodes[option.successNodeId]) {
        errors.push(`Node ${nodeId}, option ${index}: successNodeId "${option.successNodeId}" not found`);
      }
      if (option.failureNodeId && !nodes[option.failureNodeId]) {
        errors.push(`Node ${nodeId}, option ${index}: failureNodeId "${option.failureNodeId}" not found`);
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

router.get('/classes', (req, res) => {
  res.json(getAllClasses());
});

router.get('/races', (req, res) => {
  res.json(getAllRaces());
});

router.get('/races/:raceName', (req, res) => {
  const { raceName } = req.params;
  const raceData = getRaceData(raceName);
  if (raceData) {
    res.json(raceData);
  } else {
    res.status(404).json({ error: 'Race not found' });
  }
});

router.get('/feats', (req, res) => {
  res.json(getAllFeats());
});

router.get('/feats/level/:level', (req, res) => {
  const { level } = req.params;
  res.json(getFeatsForLevel(parseInt(level)));
});

router.get('/feats/:featName', (req, res) => {
  const { featName } = req.params;
  const featData = getFeatData(featName);
  if (featData) {
    res.json(featData);
  } else {
    res.status(404).json({ error: 'Feat not found' });
  }
});

router.get('/items', (req, res) => {
  res.json(getAllItems());
});

router.get('/items/category/:category', (req, res) => {
  const { category } = req.params;
  res.json(getItemsByCategory(category));
});

router.get('/items/combat', (req, res) => {
  res.json(getItemsUsableInCombat());
});

router.get('/items/starting/:className', (req, res) => {
  const { className } = req.params;
  res.json(getStartingItems(className));
});

router.get('/attacks/:className/:level', (req, res) => {
  const { className, level } = req.params;
  const attacks = getClassAttacks(className, parseInt(level));
  res.json(attacks);
});

router.post('/campaign/generate', async (req, res) => {
  try {
    const { campaignIdea } = req.body;
    
    console.log('🎬 Generating 3-act campaign structure...');
    
    const systemPrompt = `You are a master D&D Dungeon Master creating an epic 3-act campaign structure.

CAMPAIGN IDEA: ${campaignIdea}

Create a complete campaign following this EXACT structure:

**OPENER** (The Hook - 1-2 locations):
- Dramatic opening that hooks players immediately
- 1-2 small locations
- 1 starter boss or challenge
- 2-3 NPCs to meet
- Sets up the main conflict

**ACT 1** (Investigation & Setup - 7-10 locations):
- 7-10 diverse locations (mix of small, medium, large)
- 2-3 bosses
- 8-15 named NPCs including 2-4 potential companions
- Multiple questlines that build the story
- Players learn about the main threat

**BRIDGE 1** (Transition - 2-4 locations):
- Travel/transition zone
- 2-4 locations connecting Act 1 to Act 2
- 1 mini-boss
- 2-4 NPCs
- Raises the stakes

**ACT 2** (Escalation - 8-12 locations):
- 8-12 locations, larger and more dangerous
- 3-4 major bosses
- 10-20 named NPCs including 2-3 potential companions
- The main conflict intensifies
- Harder challenges and moral choices

**BRIDGE 2** (Preparation - 2-3 locations):
- Final preparation zone
- 2-3 locations
- 1 challenging mini-boss
- 2-3 NPCs offering final aid

**ACT 3** (Climax - 5-8 locations):
- 5-8 locations building to finale
- 2-3 major bosses
- 8-15 named NPCs including 1-2 potential companions
- Major city or hub with many NPCs
- Everything comes together

**FINALE** (Resolution - 1-2 locations):
- Epic final location
- Final boss fight
- Resolution of main quest

LOCATION REQUIREMENTS BY SIZE:
- **small** (cave, hut, shrine): 1-10 NPCs total
  - 0-1 companions, 0-1 quest givers, 0-1 merchants, 1-3 named NPCs, 0-5 background NPCs
- **medium** (village, inn, outpost): 30-60 NPCs total
  - 0-1 companions, 1-3 quest givers, 1-2 merchants, 8-15 named NPCs, 20-40 background NPCs
- **large** (town, fortress): 60-120 NPCs total
  - 0-2 companions, 3-6 quest givers, 3-5 merchants, 15-30 named NPCs, 40-80 background NPCs
- **major** (city, capital): 150-300+ NPCs total
  - 1-3 companions, 8-15 quest givers, 8-15 merchants, 40-80 named NPCs, 100-200 background NPCs
  - Must have 5-15 sublocations (specific buildings/districts)

NPC TYPES TO INCLUDE:
- **companions**: Recruitable party members with full stats, personality, personal quests
- **questGivers**: NPCs who provide quests or crucial information
- **merchants**: NPCs who buy/sell items
- **named**: Interactive NPCs with names and personalities
- **background**: Generic NPCs for atmosphere (just types like "Guard", "Citizen", "Merchant")

COMPANIONS MUST HAVE:
- Full D&D stats (all 6 ability scores)
- Class and starting level
- Personality and background
- Personal quest
- Recruitment condition (automatic, complete_quest, pay_gold, persuade, etc.)
- Starting equipment

BOSSES MUST HAVE:
- Name and description
- Location where they're found
- Motivation/backstory
- Level appropriate to the act
- Some bosses can be companions if recruitment condition is met!

Each location must have:
- Connected locations (create a map network)
- Appropriate enemies based on type
- Rich description and atmosphere
- Size-appropriate NPC population

Make this feel like an epic Baldur's Gate 3 style campaign!`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create a complete 3-act campaign for: ${campaignIdea}` }
      ],
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          setting: { type: 'string' },
          mainQuest: { type: 'string' },
          startingLocation: { type: 'string' },
          tone: { type: 'string' },
          structure: {
            type: 'object',
            properties: {
              opener: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  hook: { type: 'string' },
                  locations: {
                    type: 'array',
                    items: { $ref: '#/definitions/location' }
                  },
                  objectives: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: ['name', 'description', 'hook', 'locations', 'objectives']
              },
              act1: { $ref: '#/definitions/act' },
              bridge1: { $ref: '#/definitions/bridge' },
              act2: { $ref: '#/definitions/act' },
              bridge2: { $ref: '#/definitions/bridge' },
              act3: { $ref: '#/definitions/act' },
              finale: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  locations: {
                    type: 'array',
                    items: { $ref: '#/definitions/location' }
                  },
                  finalBoss: { $ref: '#/definitions/boss' },
                  objectives: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: ['name', 'description', 'locations', 'finalBoss', 'objectives']
              }
            },
            required: ['opener', 'act1', 'bridge1', 'act2', 'bridge2', 'act3', 'finale']
          }
        },
        required: ['title', 'description', 'setting', 'mainQuest', 'startingLocation', 'tone', 'structure'],
        definitions: {
          act: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              theme: { type: 'string' },
              locations: {
                type: 'array',
                items: { $ref: '#/definitions/location' }
              },
              objectives: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['name', 'description', 'theme', 'locations', 'objectives']
          },
          bridge: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              locations: {
                type: 'array',
                items: { $ref: '#/definitions/location' }
              },
              objectives: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['name', 'description', 'locations', 'objectives']
          },
          location: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { 
                type: 'string',
                enum: ['settlement', 'dungeon', 'wilderness', 'city', 'indoor', 'ruins', 'cave', 'fortress']
              },
              size: {
                type: 'string',
                enum: ['small', 'medium', 'large', 'major']
              },
              description: { type: 'string' },
              atmosphere: { type: 'string' },
              connectedTo: {
                type: 'array',
                items: { type: 'string' }
              },
              sublocations: {
                type: 'array',
                items: { $ref: '#/definitions/sublocation' }
              },
              npcs: {
                type: 'object',
                properties: {
                  companions: {
                    type: 'array',
                    items: { $ref: '#/definitions/companion' }
                  },
                  questGivers: {
                    type: 'array',
                    items: { $ref: '#/definitions/npc' }
                  },
                  merchants: {
                    type: 'array',
                    items: { $ref: '#/definitions/merchant' }
                  },
                  named: {
                    type: 'array',
                    items: { $ref: '#/definitions/namedNPC' }
                  },
                  background: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              },
              enemies: {
                type: 'object',
                properties: {
                  ambient: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  hostile: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  bosses: {
                    type: 'array',
                    items: { $ref: '#/definitions/boss' }
                  }
                }
              }
            },
            required: ['name', 'type', 'size', 'description', 'connectedTo', 'npcs', 'enemies']
          },
          sublocation: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string' },
              size: { type: 'string' },
              description: { type: 'string' },
              npcs: {
                type: 'object',
                properties: {
                  merchants: { type: 'array', items: { $ref: '#/definitions/merchant' } },
                  named: { type: 'array', items: { $ref: '#/definitions/namedNPC' } },
                  background: { type: 'array', items: { type: 'string' } }
                }
              }
            },
            required: ['name', 'type', 'description']
          },
          companion: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              race: { type: 'string' },
              class: { type: 'string' },
              level: { type: 'number' },
              personality: { type: 'string' },
              description: { type: 'string' },
              canRecruit: { type: 'boolean' },
              recruitmentCondition: { type: 'string' },
              personalQuest: { type: 'string' },
              role: { type: 'string' },
              stats: {
                type: 'object',
                properties: {
                  strength: { type: 'number' },
                  dexterity: { type: 'number' },
                  constitution: { type: 'number' },
                  intelligence: { type: 'number' },
                  wisdom: { type: 'number' },
                  charisma: { type: 'number' }
                },
                required: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
              }
            },
            required: ['name', 'race', 'class', 'level', 'personality', 'description', 'canRecruit', 'recruitmentCondition', 'stats']
          },
          npc: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              race: { type: 'string' },
              class: { type: 'string' },
              personality: { type: 'string' },
              role: { type: 'string' },
              quests: {
                type: 'array',
                items: { type: 'string' }
              },
              canTrade: { type: 'boolean' }
            },
            required: ['name', 'personality', 'role']
          },
          merchant: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              personality: { type: 'string' },
              merchantType: {
                type: 'string',
                enum: ['general', 'weapons', 'armor', 'magic', 'black_market', 'innkeeper', 'alchemist']
              },
              inventoryLevel: {
                type: 'string',
                enum: ['common', 'uncommon', 'rare', 'very_rare']
              },
              canTrade: { type: 'boolean' },
              role: { type: 'string' }
            },
            required: ['name', 'merchantType', 'canTrade']
          },
          namedNPC: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              role: { type: 'string' },
              personality: { type: 'string' }
            },
            required: ['name', 'role']
          },
          boss: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              level: { type: 'number' },
              location: { type: 'string' },
              motivation: { type: 'string' },
              isBoss: { type: 'boolean' },
              canRecruit: { type: 'boolean' },
              recruitmentCondition: { type: 'string' }
            },
            required: ['name', 'description', 'level', 'motivation']
          }
        }
      }
    });

    console.log('✅ Campaign structure generated successfully');
    console.log(`📍 Total locations: ${
      (response.structure.opener?.locations?.length || 0) +
      (response.structure.act1?.locations?.length || 0) +
      (response.structure.bridge1?.locations?.length || 0) +
      (response.structure.act2?.locations?.length || 0) +
      (response.structure.bridge2?.locations?.length || 0) +
      (response.structure.act3?.locations?.length || 0) +
      (response.structure.finale?.locations?.length || 0)
    }`);

    res.json(response);
  } catch (error) {
    console.error('Error generating campaign:', error);
    res.status(500).json({ error: 'Failed to generate campaign' });
  }
});

function buildGameContext(character, gameState, party) {
  let context = `CAMPAIGN: ${gameState.campaign?.title || 'Unknown'}
${gameState.campaign?.description || ''}

CURRENT SITUATION:
Location: ${gameState.currentLocation || 'Unknown'}
Turn: ${gameState.turnCount || 0}`;

  if (gameState.contextSummary) {
    context += `\nRecent Events: ${gameState.contextSummary}`;
  }

  if (gameState.dialogSummary) {
    context += `\nRecent Dialog: ${gameState.dialogSummary}`;
  }

  if (gameState.battleSummary) {
    context += `\nRecent Combat: ${gameState.battleSummary}`;
  }

  if (gameState.deadNPCs && gameState.deadNPCs.length > 0) {
    context += `\nDEAD NPCs: ${gameState.deadNPCs.join(', ')}`;
  }

  if (gameState.consequenceLog && gameState.consequenceLog.length > 0) {
    const recentConsequences = gameState.consequenceLog.slice(-3);
    context += `\nRECENT CONSEQUENCES:`;
    recentConsequences.forEach(log => {
      if (log.type === 'combat' && log.consequences) {
        context += `\n- Combat with ${log.enemy}: ${log.consequences.join('; ')}`;
      } else if (log.type === 'dialog' && log.consequences) {
        context += `\n- Dialog with ${log.npc}: ${log.consequences.join('; ')}`;
      }
    });
  }

  if (gameState.npcRelationships && Object.keys(gameState.npcRelationships).length > 0) {
    context += `\n\nNPC RELATIONSHIPS:`;
    Object.entries(gameState.npcRelationships).forEach(([npc, value]) => {
      const relationship = value >= 20 ? 'Friendly' : value >= 10 ? 'Warm' : value >= 0 ? 'Neutral' : value >= -10 ? 'Cold' : 'Hostile';
      context += `\n- ${npc}: ${relationship} (${value})`;
    });
  }

  if (gameState.activeQuests && gameState.activeQuests.length > 0) {
    context += `\nActive Quests: ${gameState.activeQuests.join(', ')}`;
  }

  if (party && party.length > 1) {
    context += `\n\nPARTY MEMBERS:`;
    party.forEach(member => {
      context += `\n- ${member.name} (${member.class} Level ${member.level}, HP: ${member.hp}/${member.maxHp})`;
      if (member.isActive) context += ' [ACTIVE]';
    });
  }

  context += `\n\nPLAYER CHARACTER:
Name: ${character.name}
Class: ${character.class}
Level: ${character.level}
HP: ${character.hp}/${character.maxHp}
Gold: ${character.gold || 0}`;

  return context;
}

function checkNPCStatus(npcName, gameState) {
  const isDead = gameState.deadNPCs && gameState.deadNPCs.some(
    deadNPC => deadNPC.toLowerCase() === npcName.toLowerCase()
  );
  
  const relationship = gameState.npcRelationships && gameState.npcRelationships[npcName] 
    ? gameState.npcRelationships[npcName] 
    : 0;

  return { isDead, relationship };
}

router.post('/play/action', async (req, res) => {
  try {
    const { character, gameState, conversationHistory, party } = req.body;
    
    const managedContext = contextManager.manageContext(conversationHistory, character, gameState);
    const gameContext = buildGameContext(character, gameState, party);
    const campaignContext = getCampaignContext(gameState.campaign, gameState);
    
    const systemPrompt = `You are a DND Dungeon Master running an immersive campaign.

${campaignContext}

${gameContext}

CRITICAL STATE MANAGEMENT RULES:
- Reevaluate game state EVERY turn based on player actions
- Return 'battle' if combat begins (player attacks, ambush, hostile creature)
- Return 'dialog' if player talks to/encounters an NPC
- Return 'shopping' if player enters a shop or merchant area
- Return 'normal' for exploration and non-combat situations
- Include npcInfo when transitioning to 'dialog' state
- NEVER allow dialog with dead NPCs - if a dead NPC is mentioned, acknowledge their death
- Reference NPC relationships and past consequences in your narration
- NPCs should react to player's past actions, especially if they killed someone or did something controversial

NPC AWARENESS RULES:
- NPCs know about major events like deaths, especially of important people
- NPCs' attitudes should reflect the player's reputation and past actions
- If the player killed a town guard, guards should be hostile
- If the player helped someone, their friends should be grateful
- Word spreads about the player's actions

CAMPAIGN INTEGRATION:
- Use NPCs, locations, and bosses from the current act
- Reference the act's objectives and themes
- Suggest locations the player can travel to based on connected locations
- When appropriate, introduce companions or quest givers from the campaign

AFTERMATH RULES (if user message mentions combat or dialog just ended):
- Describe the immediate aftermath vividly
- Show how the world reacts to what just happened
- If someone died, their body is there, others may react
- Guards may come running, bystanders may flee or gather
- The player is standing in the scene, what do they see?
- NPCs react emotionally and realistically
- Move the story forward logically from the event

RESPONSE GUIDELINES:
- Narrate vividly and stay true to the campaign setting
- Provide 3-5 meaningful action options
- Some options should require skill checks (use appropriate D&D skills)
- Options should be specific and actionable
- Stay consistent with established lore and previous events
- Reflect the consequences of player actions in the world`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        ...managedContext.messages
      ],
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
                skill: { 
                  type: 'string',
                  enum: Object.keys(DND_SKILLS)
                },
                dc: { type: 'number' },
                advantage: { type: 'boolean' },
                disadvantage: { type: 'boolean' }
              },
              required: ['id', 'text', 'requiresRoll']
            }
          },
          encounterType: { 
            type: 'string',
            enum: ['normal', 'battle', 'dialog', 'shopping', 'resting']
          },
          npcInfo: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              relationship: { type: 'string' },
              canTrade: { type: 'boolean' }
            }
          }
        },
        required: ['narration', 'options', 'encounterType']
      }
    });

    res.json({
      ...response,
      contextSummary: managedContext.summary,
      deadNPCs: gameState.deadNPCs || [],
      npcRelationships: gameState.npcRelationships || {},
      consequenceLog: gameState.consequenceLog || []
    });
  } catch (error) {
    console.error('Error in play action:', error);
    res.status(500).json({ error: 'Failed to process action' });
  }
});

router.post('/dialog/generate-tree', async (req, res) => {
  try {
    const { character, npc, gameState, party } = req.body;
    
    const npcStatus = checkNPCStatus(npc.name, gameState);
    
    if (npcStatus.isDead) {
      return res.status(400).json({ 
        error: 'NPC_DEAD',
        message: `${npc.name} is dead and cannot be spoken to.` 
      });
    }
    
    const gameContext = buildGameContext(character, gameState, party);
    const campaignContext = getCampaignContext(gameState.campaign, gameState);
    
    let characterContext = `PLAYER CHARACTER DETAILS:
Name: ${character.name}
Race: ${character.race || 'Unknown'}
Class: ${character.class}
Level: ${character.level}
Background: ${character.background || 'Adventurer'}
Personality: ${character.personality || 'Determined adventurer'}`;

    if (party && party.length > 1) {
      characterContext += `\n\nPARTY COMPOSITION:`;
      party.forEach(member => {
        characterContext += `\n- ${member.name}: ${member.race || ''} ${member.class} Level ${member.level}`;
        if (member.background) characterContext += ` (${member.background})`;
      });
    }
    
    const systemPrompt = `You are a DND Dungeon Master creating a dialog tree for an NPC conversation.

${campaignContext}

${gameContext}

${characterContext}

NPC INFORMATION:
Name: ${npc.name}
Description: ${npc.description || 'An interesting character'}
Relationship: ${npc.relationship || 'neutral'}
Relationship Value: ${npcStatus.relationship}
Can Trade: ${npc.canTrade ? 'Yes' : 'No'}

CAMPAIGN INTEGRATION:
- If this NPC is from the campaign structure, use their established personality and role
- Reference campaign objectives and quests in dialog options
- Stay consistent with the NPC's place in the story

CRITICAL INSTRUCTIONS FOR NODE IDs:
- Use SIMPLE sequential IDs: "node_1", "node_2", "node_3", etc.
- Start with "node_1" as rootNodeId
- Each new node gets the next number in sequence
- NEVER skip numbers in the sequence
- Example: If you create 10 nodes, use node_1 through node_10

DIALOG STRUCTURE:
- Create 10-15 nodes total
- Root node (node_1): NPC's greeting (address character by name if they know them)
- Nodes 2-12: Conversation branches with 3-5 options each
- Last 1-3 nodes: Terminal nodes (natural endings - quest given, deal made, etc.)

OPTION REQUIREMENTS (CRITICAL - MUST FOLLOW):
For 'talk' options:
- MUST have "nextNodeId" field
- nextNodeId MUST point to a node that exists in your tree
- Example: {"id": 1, "text": "Tell me more", "type": "talk", "requiresRoll": false, "nextNodeId": "node_3"}

For 'skill_check' options:
- MUST have both "successNodeId" and "failureNodeId"
- Both MUST point to nodes that exist in your tree
- Example: {"id": 2, "text": "Persuade them", "type": "skill_check", "requiresRoll": true, "skill": "Persuasion", "dc": 15, "successNodeId": "node_4", "failureNodeId": "node_5"}

DIALOG OPTION TYPES:
- 'talk': Normal conversation (needs nextNodeId)
- 'skill_check': Persuasion/Deception/Intimidation/Insight (needs successNodeId & failureNodeId)
- 'trade': Opens shop
- 'recruit': Recruit NPC (only if they're a companion from campaign)
- 'attack': Combat

IMPORTANT RULES:
- DO NOT include 'leave' options (handled by UI button)
- Most nodes should continue the conversation
- Only 1-3 nodes should be natural endings
- NPCs reference character's name, race, class, and party when relevant
- NPCs know about player's past actions and reputation
- Conversations should flow naturally through multiple exchanges

VERIFICATION CHECKLIST (do this before responding):
1. All node IDs follow sequential pattern (node_1, node_2, node_3...)
2. Every 'talk' option has a valid nextNodeId
3. Every 'skill_check' has valid successNodeId and failureNodeId
4. All referenced node IDs actually exist in your nodes object
5. No gaps in node numbering

EXAMPLE CORRECT STRUCTURE:
{
  "rootNodeId": "node_1",
  "nodes": {
    "node_1": {
      "id": "node_1",
      "npcText": "Greetings, ${character.name}.",
      "options": [
        {"id": 1, "text": "Hello", "type": "talk", "requiresRoll": false, "nextNodeId": "node_2"},
        {"id": 2, "text": "Convince them", "type": "skill_check", "requiresRoll": true, "skill": "Persuasion", "dc": 15, "successNodeId": "node_3", "failureNodeId": "node_4"}
      ]
    },
    "node_2": {...},
    "node_3": {...},
    "node_4": {...}
  }
}`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Create a dialog tree for ${character.name} (${character.race || ''} ${character.class}) speaking with ${npc.name}. Generate 10-15 nodes with proper sequential IDs starting from node_1.` 
        }
      ],
      schema: {
        type: 'object',
        properties: {
          rootNodeId: { type: 'string' },
          nodes: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                npcText: { type: 'string' },
                isTerminal: { type: 'boolean' },
                options: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      text: { type: 'string' },
                      type: {
                        type: 'string',
                        enum: ['talk', 'skill_check', 'trade', 'recruit', 'attack']
                      },
                      nextNodeId: { type: 'string' },
                      requiresRoll: { type: 'boolean' },
                      skill: { 
                        type: 'string',
                        enum: Object.keys(DND_SKILLS)
                      },
                      dc: { type: 'number' },
                      successNodeId: { type: 'string' },
                      failureNodeId: { type: 'string' },
                      advantage: { type: 'boolean' },
                      disadvantage: { type: 'boolean' }
                    },
                    required: ['id', 'text', 'type']
                  }
                },
                outcome: {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      enum: ['continue', 'start_combat', 'start_trade', 'join_party', 'give_quest', 'give_item']
                    },
                    relationshipChange: { type: 'number' },
                    questId: { type: 'string' },
                    itemName: { type: 'string' },
                    goldReward: { type: 'number' },
                    xpReward: { type: 'number' }
                  }
                }
              },
              required: ['id', 'npcText', 'options']
            }
          }
        },
        required: ['rootNodeId', 'nodes']
      }
    });

    const fixedTree = fixDialogTree(response);
    
    const validation = validateDialogTree(fixedTree);
    if (!validation.isValid) {
      console.warn('⚠️ Dialog tree still has issues after auto-fix:', validation.errors);
    }

    console.log(`✅ Dialog tree generated with ${Object.keys(fixedTree.nodes).length} nodes`);

    res.json(fixedTree);
  } catch (error) {
    console.error('Error generating dialog tree:', error);
    res.status(500).json({ error: 'Failed to generate dialog tree' });
  }
});

router.post('/dialog/expand-tree', async (req, res) => {
  try {
    const { character, npc, gameState, party, customInput, currentNodeId, dialogTree } = req.body;
    
    const gameContext = buildGameContext(character, gameState, party);
    const campaignContext = getCampaignContext(gameState.campaign, gameState);
    const currentNode = dialogTree?.nodes?.[currentNodeId];
    
    let characterContext = `CHARACTER: ${character.name} (${character.race || ''} ${character.class} Level ${character.level})`;
    if (party && party.length > 1) {
      characterContext += `\nParty: ${party.map(m => m.name).join(', ')}`;
    }
    
    const timestamp = Date.now();
    const newNodeId = `custom_${timestamp}`;
    
    const systemPrompt = `You are a DND Dungeon Master handling custom player input during NPC dialog.

${campaignContext}

${gameContext}

${characterContext}

NPC: ${npc.name}
${currentNode ? `Current Dialog: ${currentNode.npcText}` : ''}
Player's Input: "${customInput}"

Generate the NPC's response and 3-5 new dialog options.

CRITICAL NODE ID INSTRUCTIONS:
- For each 'talk' option: Use format "custom_${timestamp}_1", "custom_${timestamp}_2", etc.
- For 'skill_check' options: Use "custom_${timestamp}_success" and "custom_${timestamp}_failure"
- These node IDs don't need to exist yet - they'll be created when selected
- EVERY 'talk' option MUST have a "nextNodeId"
- EVERY 'skill_check' option MUST have both "successNodeId" and "failureNodeId"

EXAMPLE OPTIONS:
[
  {
    "id": 1,
    "text": "Ask about the quest",
    "type": "talk",
    "requiresRoll": false,
    "nextNodeId": "custom_${timestamp}_1"
  },
  {
    "id": 2,
    "text": "Try to persuade them",
    "type": "skill_check",
    "requiresRoll": true,
    "skill": "Persuasion",
    "dc": 15,
    "successNodeId": "custom_${timestamp}_success",
    "failureNodeId": "custom_${timestamp}_failure"
  }
]

IMPORTANT:
- DO NOT include 'leave' type options
- Create conversation options that continue the dialog naturally
- The NPC should stay in character
- React appropriately to what the player said/did
- Address the player by name if appropriate
- Reference party members if relevant`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Player (${character.name}) says/does: "${customInput}". How does ${npc.name} respond? Generate response and new options.` 
        }
      ],
      schema: {
        type: 'object',
        properties: {
          newNodeId: { type: 'string' },
          npcText: { type: 'string' },
          isTerminal: { type: 'boolean' },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                text: { type: 'string' },
                type: {
                  type: 'string',
                  enum: ['talk', 'skill_check', 'trade', 'recruit', 'attack']
                },
                nextNodeId: { type: 'string' },
                requiresRoll: { type: 'boolean' },
                skill: { 
                  type: 'string',
                  enum: Object.keys(DND_SKILLS)
                },
                dc: { type: 'number' },
                successNodeId: { type: 'string' },
                failureNodeId: { type: 'string' }
              },
              required: ['id', 'text', 'type']
            }
          },
          outcome: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['continue', 'start_combat', 'start_trade', 'join_party', 'give_quest', 'give_item']
              },
              relationshipChange: { type: 'number' }
            }
          }
        },
        required: ['newNodeId', 'npcText', 'options']
      }
    });

    response.newNodeId = response.newNodeId || newNodeId;

    console.log(`✅ Expanded tree with node: ${response.newNodeId}`);

    res.json(response);
  } catch (error) {
    console.error('Error expanding dialog tree:', error);
    res.status(500).json({ error: 'Failed to expand dialog tree' });
  }
});

router.post('/dialog/generate-summary', async (req, res) => {
  try {
    const { npcName, conversationLog, wasAbandoned, gameState } = req.body;
    
    const gameContext = buildGameContext(req.body.character, gameState, req.body.party);
    const campaignContext = getCampaignContext(gameState.campaign, gameState);
    
    const conversationText = conversationLog.map(entry => 
      `${entry.speaker}: ${entry.text}`
    ).join('\n');

    const systemPrompt = `You are a DND Dungeon Master creating a summary of a conversation that just ended.

${campaignContext}

${gameContext}

CONVERSATION:
${conversationText}

Was conversation abandoned by player? ${wasAbandoned ? 'Yes' : 'No'}

Create a concise summary (2-3 sentences) of what happened in the conversation.
Then list consequences:
- If player left abruptly, note potential relationship damage
- If agreements were made, note them
- If the NPC was insulted or helped, note it
- If important information was gained/lost

The summary will be shown to the player and used in future gameplay context.`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Summarize this conversation with ${npcName}.` }
      ],
      schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          consequences: {
            type: 'array',
            items: { type: 'string' }
          },
          relationshipChange: { type: 'number' }
        },
        required: ['summary', 'consequences', 'relationshipChange']
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Error generating dialog summary:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      summary: `You finished talking with ${req.body.npcName}.`,
      consequences: [],
      relationshipChange: 0
    });
  }
});

router.post('/combat/generate-summary', async (req, res) => {
  try {
    const { enemyName, battleLog, character, gameState } = req.body;
    
    const gameContext = buildGameContext(character, gameState, gameState.party);
    const campaignContext = getCampaignContext(gameState.campaign, gameState);
    
    const battleText = battleLog.slice(-10).join('\n');

    const systemPrompt = `You are a DND Dungeon Master creating a summary of combat that just concluded.

${campaignContext}

${gameContext}

BATTLE LOG (last 10 entries):
${battleText}

Enemy: ${enemyName}
Result: Victory (enemy defeated)

Create a concise summary (2-3 sentences) of the combat.
Then determine consequences:
- Was this enemy an important NPC? (guard, merchant, quest giver, named character, etc.)
- Will killing them have repercussions? (guards hostile, quest fails, etc.)
- Are there witnesses who will spread word of this?
- Does this affect the player's reputation?

IMPORTANT: Mark isNPCDeath as true if the enemy was:
- A named character with a title (Captain, Mayor, etc.)
- Someone with a proper name (not just "goblin" or "wolf")
- Someone who had dialog or story importance
- A guard, merchant, or other significant role

Mark isNPCDeath as false for:
- Generic creatures (goblin, wolf, bandit, etc.)
- Random enemies with no names
- Monsters without story significance`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Summarize this combat with ${enemyName}.` }
      ],
      schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          consequences: {
            type: 'array',
            items: { type: 'string' }
          },
          isNPCDeath: { type: 'boolean' }
        },
        required: ['summary', 'consequences', 'isNPCDeath']
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Error generating combat summary:', error);
    res.status(500).json({
      error: 'Failed to generate summary',
      summary: `You defeated ${req.body.enemyName} in combat.`,
      consequences: [],
      isNPCDeath: false
    });
  }
});

router.post('/dialog/process-outcome', async (req, res) => {
  try {
    const { character, npc, outcome, gameState, party } = req.body;
    
    let updatedCharacter = { ...character };
    let updatedParty = party ? [...party] : [character];
    let updatedGameState = { ...gameState };
    let message = '';

    switch (outcome.type) {
      case 'join_party':
        const newPartyMember = {
          name: npc.name,
          class: npc.class || 'Fighter',
          level: npc.level || character.level,
          hp: npc.hp || 20,
          maxHp: npc.maxHp || 20,
          strength: npc.strength || 10,
          dexterity: npc.dexterity || 10,
          constitution: npc.constitution || 10,
          intelligence: npc.intelligence || 10,
          wisdom: npc.wisdom || 10,
          charisma: npc.charisma || 10,
          inventory: npc.inventory || [],
          isNPC: true,
          isActive: false,
          relationship: 'companion'
        };
        
        updatedParty.push(newPartyMember);
        message = `${npc.name} has joined your party!`;
        break;

      case 'give_quest':
        if (!updatedGameState.activeQuests) {
          updatedGameState.activeQuests = [];
        }
        updatedGameState.activeQuests.push(outcome.questId || 'New Quest');
        message = 'New quest received!';
        break;

      case 'give_item':
        if (!updatedCharacter.inventory) {
          updatedCharacter.inventory = [];
        }
        updatedCharacter.inventory.push({
          name: outcome.itemName || 'Mystery Item',
          description: 'A gift from ' + npc.name
        });
        message = `Received ${outcome.itemName || 'an item'}!`;
        break;

      case 'start_combat':
        message = 'Combat initiated!';
        break;

      case 'start_trade':
        message = 'Trade opened!';
        break;

      case 'end_dialog':
        message = 'Conversation ended.';
        break;
    }

    if (outcome.goldReward) {
      updatedCharacter.gold = (updatedCharacter.gold || 0) + outcome.goldReward;
      message += ` (+${outcome.goldReward} gold)`;
    }

    if (outcome.xpReward) {
      updatedCharacter.xp = (updatedCharacter.xp || 0) + outcome.xpReward;
      message += ` (+${outcome.xpReward} XP)`;
    }

    if (outcome.relationshipChange) {
      if (!updatedGameState.npcRelationships) {
        updatedGameState.npcRelationships = {};
      }
      const currentValue = updatedGameState.npcRelationships[npc.name] || 0;
      updatedGameState.npcRelationships[npc.name] = currentValue + outcome.relationshipChange;
    }

    res.json({
      character: updatedCharacter,
      party: updatedParty,
      gameState: updatedGameState,
      message
    });
  } catch (error) {
    console.error('Error processing dialog outcome:', error);
    res.status(500).json({ error: 'Failed to process outcome' });
  }
});

router.post('/dialog/npc-to-enemy', async (req, res) => {
  try {
    const { npc, character, gameState } = req.body;
    
    const gameContext = buildGameContext(character, gameState, gameState.party);
    const campaignContext = getCampaignContext(gameState.campaign, gameState);
    
    const systemPrompt = `You are a DND Dungeon Master converting an NPC into a combat enemy.

${campaignContext}

${gameContext}

NPC: ${npc.name}
Description: ${npc.description}
Reason for Combat: Dialog turned hostile

Generate combat stats for this NPC as an enemy.
Base the difficulty on the character's level (${character.level}).
The NPC should be a challenging but fair opponent.
Include their motivations and combat tactics.
Include at least 2-3 attacks with proper damage dice notation (e.g., "1d8+2", "2d6+3").`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: `Generate combat stats for ${npc.name} as an enemy.` 
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
                type: { type: 'string' }
              },
              required: ['name', 'damage']
            }
          },
          xpReward: { type: 'number' }
        },
        required: ['name', 'description', 'level', 'hp', 'maxHp', 'ac', 'attacks']
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Error converting NPC to enemy:', error);
    res.status(500).json({ error: 'Failed to convert NPC to enemy' });
  }
});

router.post('/play/rest', async (req, res) => {
  try {
    const { character, restType, gameState, party } = req.body;
    
    const gameContext = buildGameContext(character, gameState, party);
    const campaignContext = getCampaignContext(gameState.campaign, gameState);
    
    const systemPrompt = `You are a DND Dungeon Master. The party is taking a ${restType} rest.

${campaignContext}

${gameContext}

REST RULES:
${restType === 'short' ? 
  'SHORT REST: 1 hour rest. Players can spend hit dice to recover HP. Limited resources refresh.' :
  'LONG REST: 8 hours sleep. Players recover all HP and spell slots. Describe the camp scene, any dreams, encounters, or character moments.'}

Narrate the rest period with interesting details and events.
After the rest, provide 2-3 options for what to do next.`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `The party begins their ${restType} rest.` }
      ],
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
                requiresRoll: { type: 'boolean' }
              },
              required: ['id', 'text', 'requiresRoll']
            }
          },
          encounterType: { 
            type: 'string',
            enum: ['normal', 'battle', 'dialog', 'shopping', 'resting']
          },
          encounterDuringRest: { type: 'boolean' },
          enemyInfo: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' }
            }
          }
        },
        required: ['narration', 'options', 'encounterType', 'encounterDuringRest']
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Error in rest action:', error);
    res.status(500).json({ error: 'Failed to process rest' });
  }
});

router.post('/battle/generate-enemy', async (req, res) => {
  try {
    const { character, location, difficulty, specificEnemy, context, gameState } = req.body;
    
    const fullGameState = gameState || {};
    const gameContext = buildGameContext(character, fullGameState, fullGameState.party);
    const campaignContext = getCampaignContext(fullGameState.campaign, fullGameState);
    
    let enemyContext = '';
    if (context?.battleContext) {
      enemyContext = `\nCombat Context: ${context.battleContext}`;
    }
    if (context?.narration) {
      enemyContext += `\nHow Combat Started: ${context.narration}`;
    }
    
    let dialogContext = '';
    if (fullGameState.dialogSummary) {
      dialogContext = `\n\nRECENT DIALOG: ${fullGameState.dialogSummary}`;
      dialogContext += '\nIf combat started from dialog, this enemy may be the NPC you were just talking to. Use their established personality, description, and role.';
    }
    
    const systemPrompt = `You are a DND Dungeon Master generating an enemy for combat.

${campaignContext}

${gameContext}${enemyContext}${dialogContext}

ENEMY REQUIREMENTS:
${specificEnemy ? `Enemy Name: ${specificEnemy}` : ''}
Location: ${location || 'unknown'}
Difficulty: ${difficulty || 'normal'}
Character Level: ${character.level}

CAMPAIGN INTEGRATION:
- If this enemy is a boss from the campaign structure, use their established details
- Match enemy types to the location's enemy list from the campaign
- Consider the current act's theme and difficulty

IMPORTANT RULES:
- If this enemy was established in previous dialog or narration, stay CONSISTENT with their description
- Use details from the combat context and recent dialog
- If the enemy is a named character (Captain, Mayor, etc.), give them a fitting personality
- Generate a challenging enemy appropriate for this character and situation
- The enemy should be ${difficulty === 'easy' ? 'slightly below' : difficulty === 'hard' ? 'above' : 'near'} the character's level
- Include tactical abilities and interesting combat mechanics
- Provide at least 2-3 different attacks with proper damage dice notation`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate the enemy for this combat encounter.' }
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
                type: { type: 'string' }
              },
              required: ['name', 'damage']
            }
          },
          xpReward: { type: 'number' }
        },
        required: ['name', 'description', 'level', 'hp', 'maxHp', 'ac', 'attacks']
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Error generating enemy:', error);
    res.status(500).json({ error: 'Failed to generate enemy' });
  }
});

router.post('/battle/action', async (req, res) => {
  try {
    const { character, enemy, action, conversationHistory, gameState } = req.body;
    
    const managedContext = contextManager.manageContext(conversationHistory, character, gameState);
    const gameContext = buildGameContext(character, gameState, gameState.party);
    const campaignContext = getCampaignContext(gameState.campaign, gameState);
    
    const systemPrompt = `You are a DND Dungeon Master. The player is in combat.

${campaignContext}

${gameContext}

COMBAT STATE:
Player: ${character.name} (HP: ${character.hp}/${character.maxHp}, Level: ${character.level})
Enemy: ${enemy.name} (HP: ${enemy.hp}/${enemy.maxHp}, AC: ${enemy.ac})
Player Action: ${JSON.stringify(action)}

Narrate the result of the player's action dramatically.
Calculate damage dealt to the enemy.
Determine if the battle ends (enemy defeated).
Award XP and loot if victorious.`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        ...managedContext.messages.slice(-10),
        { role: 'user', content: `I attack with ${action.name}` }
      ],
      schema: {
        type: 'object',
        properties: {
          narration: { type: 'string' },
          playerDamage: { type: 'number' },
          enemyDamage: { type: 'number' },
          battleEnd: { type: 'boolean' },
          victory: { type: 'boolean' },
          xpGained: { type: 'number' },
          goldGained: { type: 'number' },
          loot: {
            type: 'array',
            items: { type: 'string' }
          }
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

router.post('/battle/enemy-turn', async (req, res) => {
  try {
    const { character, enemy, party } = req.body;
    
    const attackRoll = Math.floor(Math.random() * 20) + 1 + (enemy.attackBonus || 0);
    const playerAC = 10 + Math.floor((character.dexterity - 10) / 2);
    
    let narration = '';
    let playerDamage = 0;
    let targetName = character.name;
    
    if (party && party.length > 1 && Math.random() > 0.5) {
      const target = party[Math.floor(Math.random() * party.length)];
      targetName = target.name;
    }
    
    if (attackRoll >= playerAC) {
      const damageMatch = enemy.damage.match(/(\d+)d(\d+)(\+\d+)?/);
      if (damageMatch) {
        const [, numDice, diceSize, bonus] = damageMatch;
        for (let i = 0; i < parseInt(numDice); i++) {
          playerDamage += Math.floor(Math.random() * parseInt(diceSize)) + 1;
        }
        if (bonus) {
          playerDamage += parseInt(bonus);
        }
      } else {
        playerDamage = Math.floor(Math.random() * 6) + 3;
      }
      
      narration = `${enemy.name} attacks ${targetName} and hits for ${playerDamage} damage!`;
    } else {
      narration = `${enemy.name} attacks ${targetName} but misses!`;
    }
    
    res.json({
      narration,
      playerDamage,
      attackRoll,
      targetName
    });
  } catch (error) {
    console.error('Error in enemy turn:', error);
    res.status(500).json({ error: 'Failed to process enemy turn' });
  }
});

router.post('/battle/use-item', async (req, res) => {
  try {
    const { character, enemy, item, conversationHistory, gameState } = req.body;
    
    const managedContext = contextManager.manageContext(conversationHistory, character, gameState);
    const gameContext = buildGameContext(character, gameState, gameState.party);
    const campaignContext = getCampaignContext(gameState.campaign, gameState);
    
    const systemPrompt = `You are a DND Dungeon Master. The player is using an item in combat.

${campaignContext}

${gameContext}

COMBAT STATE:
Player: ${character.name} (HP: ${character.hp}/${character.maxHp})
Enemy: ${enemy.name} (HP: ${enemy.hp}/${enemy.maxHp})
Item Used: ${item.name} - ${item.description}
${item.effect ? `Effect: ${item.effect}` : ''}

Narrate what happens when the player uses this item.
Determine healing for the player or damage to the enemy.
Most consumable items are used up after one use.`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        ...managedContext.messages.slice(-10),
        { role: 'user', content: `I use ${item.name}` }
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
      contextSummary: managedContext.summary
    });
  } catch (error) {
    console.error('Error using item in battle:', error);
    res.status(500).json({ error: 'Failed to use item' });
  }
});

router.post('/battle/talk', async (req, res) => {
  try {
    const { character, enemy, message, conversationHistory, gameState } = req.body;
    
    const managedContext = contextManager.manageContext(conversationHistory, character, gameState);
    const gameContext = buildGameContext(character, gameState, gameState.party);
    const campaignContext = getCampaignContext(gameState.campaign, gameState);
    
    const systemPrompt = `You are a DND Dungeon Master. The player is trying to talk during combat.

${campaignContext}

${gameContext}

COMBAT STATE:
Player: ${character.name} (HP: ${character.hp}/${character.maxHp})
Enemy: ${enemy.name} (HP: ${enemy.hp}/${enemy.maxHp})
Player Says: "${message}"

Determine if the enemy is willing to talk or negotiate.
Some enemies may be reasoned with, others will continue fighting.
If successful, this might end combat or lead to a dialog scene.`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        ...managedContext.messages.slice(-10),
        { role: 'user', content: message }
      ],
      schema: {
        type: 'object',
        properties: {
          npcResponse: { type: 'string' },
          willingToTalk: { type: 'boolean' },
          dialogOptions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                text: { type: 'string' },
                type: { type: 'string' },
                requiresRoll: { type: 'boolean' },
                skill: { 
                  type: 'string',
                  enum: Object.keys(DND_SKILLS)
                },
                dc: { type: 'number' }
              },
              required: ['id', 'text', 'type', 'requiresRoll']
            }
          }
        },
        required: ['npcResponse', 'willingToTalk']
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Error talking in battle:', error);
    res.status(500).json({ error: 'Failed to talk' });
  }
});

router.post('/shop/inventory', async (req, res) => {
  try {
    const { npc, character, gameState } = req.body;
    
    const gameContext = buildGameContext(character, gameState, gameState?.party);
    const campaignContext = getCampaignContext(gameState.campaign, gameState);
    
    const systemPrompt = `You are a DND Dungeon Master generating a merchant's inventory.

${campaignContext}

${gameContext}

MERCHANT INFO:
Name: ${npc.name}
Location: ${character.currentLocation || 'unknown'}
Character Level: ${character.level}

Generate 5-8 items appropriate for this merchant and the character's level.
Include weapons, armor, potions, and adventuring gear.
Price items appropriately based on rarity and character level.`;

    const response = await ollamaService.generateStructured({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate the merchant inventory.' }
      ],
      schema: {
        type: 'object',
        properties: {
          inventory: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                damage: { type: 'string' },
                armorClass: { type: 'number' },
                effect: { type: 'string' },
                equipSlot: { type: 'string' },
                usableInCombat: { type: 'boolean' }
              },
              required: ['name', 'description', 'price']
            }
          }
        },
        required: ['inventory']
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Error generating shop inventory:', error);
    res.status(500).json({ error: 'Failed to generate inventory' });
  }
});

router.post('/shop/buy', async (req, res) => {
  try {
    const { character, item } = req.body;
    
    if (character.gold < item.price) {
      return res.status(400).json({ error: 'Not enough gold' });
    }

    const updatedCharacter = {
      ...character,
      gold: character.gold - item.price,
      inventory: [...(character.inventory || []), item]
    };

    res.json({ character: updatedCharacter });
  } catch (error) {
    console.error('Error buying item:', error);
    res.status(500).json({ error: 'Failed to buy item' });
  }
});

router.post('/shop/sell', async (req, res) => {
  try {
    const { character, itemIndex } = req.body;
    
    const item = character.inventory[itemIndex];
    if (!item) {
      return res.status(400).json({ error: 'Item not found' });
    }

    const sellPrice = Math.floor((item.price || 10) * 0.5);
    const newInventory = [...character.inventory];
    newInventory.splice(itemIndex, 1);

    const updatedCharacter = {
      ...character,
      gold: character.gold + sellPrice,
      inventory: newInventory
    };

    res.json({ character: updatedCharacter });
  } catch (error) {
    console.error('Error selling item:', error);
    res.status(500).json({ error: 'Failed to sell item' });
  }
});

router.post('/items/generate', async (req, res) => {
  try {
    const { context, itemType, rarity } = req.body;
    
    const response = await ollamaService.generateStructured({
      messages: [
        {
          role: 'user',
          content: `Generate a unique D&D item.
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
          equipSlot: {
            type: 'string',
            enum: ['head', 'armor', 'gloves', 'feet', 'cape', 'r_hand', 'l_hand', 'both_hands', 'ring1', 'ring2', 'earrings', 'none']
          },
          properties: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['name', 'type', 'category', 'rarity', 'price', 'description', 'usableInCombat', 'equipSlot']
      }
    });

    response.id = Date.now();
    res.json(response);
  } catch (error) {
    console.error('Error generating item:', error);
    res.status(500).json({ error: 'Failed to generate item' });
  }
});

router.get('/ollama/status', async (req, res) => {
  try {
    const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    
    const response = await axios.get(`${ollamaUrl}/api/tags`, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    res.json({
      status: 'connected',
      models: response.data.models || [],
      url: ollamaUrl
    });
  } catch (error) {
    res.status(200).json({
      status: 'disconnected',
      error: error.message,
      errorCode: error.code,
      models: [],
      url: process.env.OLLAMA_URL || 'http://127.0.0.1:11434'
    });
  }
});

router.post('/ollama/test', async (req, res) => {
  try {
    const { model } = req.body;
    const testModel = model || 'qwen3:8b';
    
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

    res.json({
      status: 'success',
      response: response,
      model: testModel
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

module.exports = router;