// backend/data/feats.js - Level 1 Feats for Character Creation
const FEATS = {
  'Alert': {
    name: 'Alert',
    level: 1,
    description: 'Always on the lookout for danger',
    benefits: [
      '+5 bonus to initiative',
      'Cannot be surprised while conscious',
      'Hidden enemies do not gain advantage on attacks against you'
    ]
  },
  'Athlete': {
    name: 'Athlete',
    level: 1,
    description: 'You have undergone extensive physical training',
    benefits: [
      'Increase Strength or Dexterity by 1',
      'When prone, standing up uses only 5 feet of movement',
      'Climbing does not cost extra movement',
      'Running jumps require only 5 feet running start instead of 10'
    ],
    abilityScoreIncrease: {
      choice: ['strength', 'dexterity'],
      amount: 1
    }
  },
  'Durable': {
    name: 'Durable',
    level: 1,
    description: 'Hardy and resilient',
    benefits: [
      'Increase Constitution by 1',
      'When you roll Hit Dice to regain HP, minimum you regain equals 2x your Constitution modifier'
    ],
    abilityScoreIncrease: {
      constitution: 1
    }
  },
  'Keen Mind': {
    name: 'Keen Mind',
    level: 1,
    description: 'You have a mind that can track time, direction, and detail',
    benefits: [
      'Increase Intelligence by 1',
      'Always know which way is north',
      'Always know hours until next sunrise/sunset',
      'Can accurately recall anything seen or heard within the past month'
    ],
    abilityScoreIncrease: {
      intelligence: 1
    }
  },
  'Lucky': {
    name: 'Lucky',
    level: 1,
    description: 'You have inexplicable luck',
    benefits: [
      'You have 3 luck points',
      'Spend one luck point to roll an additional d20 when making an attack roll, ability check, or saving throw',
      'Can also spend luck point when an attack is made against you',
      'Luck points recharge on long rest'
    ]
  },
  'Magic Initiate': {
    name: 'Magic Initiate',
    level: 1,
    description: 'You have learned some basic magic',
    benefits: [
      'Learn two cantrips from a class spell list',
      'Learn one 1st-level spell from same list',
      'Can cast the 1st-level spell once per long rest'
    ]
  },
  'Observant': {
    name: 'Observant',
    level: 1,
    description: 'Quick to notice details',
    benefits: [
      'Increase Intelligence or Wisdom by 1',
      '+5 to passive Perception and Investigation',
      'Can read lips if you can see creature speaking'
    ],
    abilityScoreIncrease: {
      choice: ['intelligence', 'wisdom'],
      amount: 1
    }
  },
  'Resilient': {
    name: 'Resilient',
    level: 1,
    description: 'You have developed resilience',
    benefits: [
      'Increase one ability score by 1',
      'Gain proficiency in saving throws using the chosen ability'
    ],
    abilityScoreIncrease: {
      choice: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'],
      amount: 1
    }
  },
  'Skilled': {
    name: 'Skilled',
    level: 1,
    description: 'You have trained extensively',
    benefits: [
      'Gain proficiency in any combination of three skills or tools'
    ]
  },
  'Tavern Brawler': {
    name: 'Tavern Brawler',
    level: 1,
    description: 'Accustomed to rough-and-tumble fighting',
    benefits: [
      'Increase Strength or Constitution by 1',
      'Proficient with improvised weapons',
      'Unarmed strike uses d4 for damage',
      'When you hit with unarmed or improvised weapon, can grapple as bonus action'
    ],
    abilityScoreIncrease: {
      choice: ['strength', 'constitution'],
      amount: 1
    }
  },
  'Tough': {
    name: 'Tough',
    level: 1,
    description: 'You have remarkable stamina',
    benefits: [
      'HP maximum increases by 2 per level (including level 1)',
      'Gain +2 HP whenever you gain a level'
    ]
  },
  'War Caster': {
    name: 'War Caster',
    level: 1,
    description: 'You have practiced casting spells in combat',
    benefits: [
      'Advantage on Constitution saves to maintain concentration on spells',
      'Can perform somatic components even with weapons or shield',
      'Can cast spell as opportunity attack instead of melee'
    ],
    prerequisite: 'Ability to cast at least one spell'
  }
};

function getAllFeats() {
  return Object.values(FEATS);
}

function getFeatData(featName) {
  return FEATS[featName] || null;
}

function getFeatsForLevel(level) {
  return Object.values(FEATS).filter(feat => feat.level <= level);
}

module.exports = {
  FEATS,
  getAllFeats,
  getFeatData,
  getFeatsForLevel
};