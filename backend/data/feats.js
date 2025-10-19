// backend/data/feats.js
const feats = {
  'Alert': {
    name: 'Alert',
    description: 'Always on the lookout for danger, you gain the following benefits:',
    benefits: [
      'You gain a +5 bonus to initiative',
      'You can\'t be surprised while you are conscious',
      'Other creatures don\'t gain advantage on attack rolls against you as a result of being unseen by you'
    ],
    prerequisites: null
  },
  
  'Athlete': {
    name: 'Athlete',
    description: 'You have undergone extensive physical training to gain the following benefits:',
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20',
      'When you are prone, standing up uses only 5 feet of your movement',
      'Climbing doesn\'t cost you extra movement',
      'You can make a running long jump or a running high jump after moving only 5 feet on foot'
    ],
    prerequisites: null,
    abilityScoreIncrease: { choice: ['strength', 'dexterity'], amount: 1 }
  },
  
  'Defensive Duelist': {
    name: 'Defensive Duelist',
    description: 'When wielding a finesse weapon, you can use your reaction to add your proficiency bonus to your AC for one attack.',
    benefits: [
      'When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing the attack to miss you'
    ],
    prerequisites: 'Dexterity 13 or higher'
  },
  
  'Dual Wielder': {
    name: 'Dual Wielder',
    description: 'You master fighting with two weapons, gaining the following benefits:',
    benefits: [
      'You gain a +1 bonus to AC while you are wielding a separate melee weapon in each hand',
      'You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren\'t light',
      'You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one'
    ],
    prerequisites: null
  },
  
  'Dungeon Delver': {
    name: 'Dungeon Delver',
    description: 'Alert to the hidden traps and secret doors found in many dungeons, you gain the following benefits:',
    benefits: [
      'You have advantage on Perception and Investigation checks made to detect the presence of secret doors',
      'You have advantage on saving throws made to avoid or resist traps',
      'You have resistance to the damage dealt by traps',
      'Traveling at a fast pace doesn\'t impose the normal -5 penalty on your passive Perception score'
    ],
    prerequisites: null
  },
  
  'Durable': {
    name: 'Durable',
    description: 'Hardy and resilient, you gain the following benefits:',
    benefits: [
      'Increase your Constitution score by 1, to a maximum of 20',
      'When you roll Hit Dice to regain hit points, the minimum number of hit points you regain from the roll equals twice your Constitution modifier (minimum of 2)'
    ],
    prerequisites: null,
    abilityScoreIncrease: { constitution: 1 }
  },
  
  'Great Weapon Master': {
    name: 'Great Weapon Master',
    description: 'You\'ve learned to put the weight of a weapon to your advantage. You gain the following benefits:',
    benefits: [
      'On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action',
      'Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack\'s damage'
    ],
    prerequisites: null
  },
  
  'Heavily Armored': {
    name: 'Heavily Armored',
    description: 'You have trained to master the use of heavy armor, gaining the following benefits:',
    benefits: [
      'Increase your Strength score by 1, to a maximum of 20',
      'You gain proficiency with heavy armor'
    ],
    prerequisites: 'Proficiency with medium armor',
    abilityScoreIncrease: { strength: 1 }
  },
  
  'Lucky': {
    name: 'Lucky',
    description: 'You have inexplicable luck that seems to kick in at just the right moment.',
    benefits: [
      'You have 3 luck points. Whenever you make an attack roll, an ability check, or a saving throw, you can spend one luck point to roll an additional d20',
      'You can choose to spend one of your luck points after you roll the die, but before the outcome is determined',
      'You choose which of the d20s is used for the attack roll, ability check, or saving throw',
      'You can also spend one luck point when an attack roll is made against you. Roll a d20 and then choose whether the attack uses the attacker\'s roll or yours',
      'You regain your expended luck points when you finish a long rest'
    ],
    prerequisites: null
  },
  
  'Mage Slayer': {
    name: 'Mage Slayer',
    description: 'You have practiced techniques in melee combat against spellcasters, gaining the following benefits:',
    benefits: [
      'When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature',
      'When you damage a creature that is concentrating on a spell, that creature has disadvantage on the saving throw it makes to maintain its concentration',
      'You have advantage on saving throws against spells cast by creatures within 5 feet of you'
    ],
    prerequisites: null
  },
  
  'Magic Initiate': {
    name: 'Magic Initiate',
    description: 'Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class\'s spell list.',
    benefits: [
      'You learn two cantrips of your choice from a chosen class\'s spell list',
      'You learn one 1st-level spell of your choice from that same list',
      'You can cast this spell once per long rest',
      'Your spellcasting ability for these spells depends on the class you chose: Charisma for bard, sorcerer, or warlock; Wisdom for cleric or druid; Intelligence for wizard'
    ],
    prerequisites: null
  },
  
  'Mobile': {
    name: 'Mobile',
    description: 'You are exceptionally speedy and agile. You gain the following benefits:',
    benefits: [
      'Your speed increases by 10 feet',
      'When you use the Dash action, difficult terrain doesn\'t cost you extra movement on that turn',
      'When you make a melee attack against a creature, you don\'t provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not'
    ],
    prerequisites: null
  },
  
  'Observant': {
    name: 'Observant',
    description: 'Quick to notice details of your environment, you gain the following benefits:',
    benefits: [
      'Increase your Intelligence or Wisdom score by 1, to a maximum of 20',
      'If you can see a creature\'s mouth while it is speaking a language you understand, you can interpret what it\'s saying by reading its lips',
      'You have a +5 bonus to your passive Perception and passive Investigation scores'
    ],
    prerequisites: null,
    abilityScoreIncrease: { choice: ['intelligence', 'wisdom'], amount: 1 }
  },
  
  'Resilient': {
    name: 'Resilient',
    description: 'Choose one ability score. You gain the following benefits:',
    benefits: [
      'Increase the chosen ability score by 1, to a maximum of 20',
      'You gain proficiency in saving throws using the chosen ability'
    ],
    prerequisites: null,
    abilityScoreIncrease: { choice: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'], amount: 1 }
  },
  
  'Savage Attacker': {
    name: 'Savage Attacker',
    description: 'Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon\'s damage dice and use either total.',
    benefits: [
      'Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon\'s damage dice and use either total'
    ],
    prerequisites: null
  },
  
  'Sentinel': {
    name: 'Sentinel',
    description: 'You have mastered techniques to take advantage of every drop in any enemy\'s guard, gaining the following benefits:',
    benefits: [
      'When you hit a creature with an opportunity attack, the creature\'s speed becomes 0 for the rest of the turn',
      'Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach',
      'When a creature makes an attack against a target other than you (and that target doesn\'t have this feat), you can use your reaction to make a melee weapon attack against the attacking creature'
    ],
    prerequisites: null
  },
  
  'Sharpshooter': {
    name: 'Sharpshooter',
    description: 'You have mastered ranged weapons and can make shots that others find impossible. You gain the following benefits:',
    benefits: [
      'Attacking at long range doesn\'t impose disadvantage on your ranged weapon attack rolls',
      'Your ranged weapon attacks ignore half cover and three-quarters cover',
      'Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack\'s damage'
    ],
    prerequisites: null
  },
  
  'Skilled': {
    name: 'Skilled',
    description: 'You gain proficiency in any combination of three skills or tools of your choice.',
    benefits: [
      'You gain proficiency in any combination of three skills or tools of your choice'
    ],
    prerequisites: null
  },
  
  'Tavern Brawler': {
    name: 'Tavern Brawler',
    description: 'Accustomed to rough-and-tumble fighting using whatever weapons happen to be at hand, you gain the following benefits:',
    benefits: [
      'Increase your Strength or Constitution score by 1, to a maximum of 20',
      'You are proficient with improvised weapons',
      'Your unarmed strike uses a d4 for damage',
      'When you hit a creature with an unarmed strike or an improvised weapon on your turn, you can use a bonus action to attempt to grapple the target'
    ],
    prerequisites: null,
    abilityScoreIncrease: { choice: ['strength', 'constitution'], amount: 1 }
  },
  
  'Tough': {
    name: 'Tough',
    description: 'Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.',
    benefits: [
      'Your hit point maximum increases by an amount equal to twice your level',
      'Whenever you gain a level, your hit point maximum increases by an additional 2 hit points'
    ],
    prerequisites: null
  },
  
  'War Caster': {
    name: 'War Caster',
    description: 'You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits:',
    benefits: [
      'You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage',
      'You can perform the somatic components of spells even when you have weapons or a shield in one or both hands',
      'When a hostile creature\'s movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack. The spell must have a casting time of 1 action and must target only that creature'
    ],
    prerequisites: 'The ability to cast at least one spell'
  },
  
  'Weapon Master': {
    name: 'Weapon Master',
    description: 'You have practiced extensively with a variety of weapons, gaining the following benefits:',
    benefits: [
      'Increase your Strength or Dexterity score by 1, to a maximum of 20',
      'You gain proficiency with four weapons of your choice. Each one must be a simple or a martial weapon'
    ],
    prerequisites: null,
    abilityScoreIncrease: { choice: ['strength', 'dexterity'], amount: 1 }
  }
};

function getAllFeats() {
  return Object.keys(feats);
}

function getFeatData(featName) {
  return feats[featName];
}

function getFeatsForLevel(level) {
  // At level 1, only certain feats are typically available
  // Most feats are available, but some have prerequisites
  if (level === 1) {
    return Object.keys(feats).filter(featName => {
      const feat = feats[featName];
      // Filter out feats with strict prerequisites for level 1
      if (feat.prerequisites && feat.prerequisites.includes('Proficiency')) {
        return false;
      }
      if (feat.prerequisites && feat.prerequisites.includes('ability to cast')) {
        return false;
      }
      return true;
    });
  }
  
  return Object.keys(feats);
}

module.exports = {
  feats,
  getAllFeats,
  getFeatData,
  getFeatsForLevel
};