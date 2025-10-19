// D&D 5e Class definitions with multiclassing support

const classDefinitions = {
  Fighter: {
    name: 'Fighter',
    hitDie: 10,
    primaryAbility: ['strength', 'dexterity'],
    savingThrows: ['strength', 'constitution'],
    skills: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    skillChoices: 2,
    startingHP: 10,
    hpPerLevel: 6,
    subclasses: ['Champion', 'Battle Master', 'Eldritch Knight'],
    description: 'A master of martial combat, skilled with a variety of weapons and armor',
    features: {
      1: ['Fighting Style', 'Second Wind'],
      2: ['Action Surge'],
      3: ['Martial Archetype'],
      5: ['Extra Attack'],
      9: ['Indomitable'],
      11: ['Extra Attack (2)'],
      20: ['Extra Attack (3)']
    }
  },
  
  Wizard: {
    name: 'Wizard',
    hitDie: 6,
    primaryAbility: ['intelligence'],
    savingThrows: ['intelligence', 'wisdom'],
    skills: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    skillChoices: 2,
    startingHP: 6,
    hpPerLevel: 4,
    subclasses: ['School of Evocation', 'School of Abjuration', 'School of Divination'],
    description: 'A scholarly magic-user capable of manipulating the structures of reality',
    spellcaster: true,
    spellcastingAbility: 'intelligence',
    features: {
      1: ['Spellcasting', 'Arcane Recovery'],
      2: ['Arcane Tradition'],
      18: ['Spell Mastery'],
      20: ['Signature Spell']
    }
  },
  
  Rogue: {
    name: 'Rogue',
    hitDie: 8,
    primaryAbility: ['dexterity'],
    savingThrows: ['dexterity', 'intelligence'],
    skills: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
    skillChoices: 4,
    startingHP: 8,
    hpPerLevel: 5,
    subclasses: ['Thief', 'Assassin', 'Arcane Trickster'],
    description: 'A scoundrel who uses stealth and trickery to overcome obstacles and enemies',
    features: {
      1: ['Expertise', 'Sneak Attack', 'Thieves\' Cant'],
      2: ['Cunning Action'],
      3: ['Roguish Archetype'],
      5: ['Uncanny Dodge'],
      7: ['Evasion'],
      11: ['Reliable Talent'],
      20: ['Stroke of Luck']
    }
  },
  
  Cleric: {
    name: 'Cleric',
    hitDie: 8,
    primaryAbility: ['wisdom'],
    savingThrows: ['wisdom', 'charisma'],
    skills: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    skillChoices: 2,
    startingHP: 8,
    hpPerLevel: 5,
    subclasses: ['Life Domain', 'War Domain', 'Tempest Domain'],
    description: 'A priestly champion who wields divine magic in service of a higher power',
    spellcaster: true,
    spellcastingAbility: 'wisdom',
    features: {
      1: ['Spellcasting', 'Divine Domain'],
      2: ['Channel Divinity'],
      5: ['Destroy Undead'],
      10: ['Divine Intervention']
    }
  },
  
  Barbarian: {
    name: 'Barbarian',
    hitDie: 12,
    primaryAbility: ['strength'],
    savingThrows: ['strength', 'constitution'],
    skills: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
    skillChoices: 2,
    startingHP: 12,
    hpPerLevel: 7,
    subclasses: ['Path of the Berserker', 'Path of the Totem Warrior'],
    description: 'A fierce warrior of primitive background who can enter a battle rage',
    features: {
      1: ['Rage', 'Unarmored Defense'],
      2: ['Reckless Attack', 'Danger Sense'],
      3: ['Primal Path'],
      5: ['Extra Attack', 'Fast Movement'],
      7: ['Feral Instinct'],
      9: ['Brutal Critical'],
      20: ['Primal Champion']
    }
  },
  
  Ranger: {
    name: 'Ranger',
    hitDie: 10,
    primaryAbility: ['dexterity', 'wisdom'],
    savingThrows: ['strength', 'dexterity'],
    skills: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
    skillChoices: 3,
    startingHP: 10,
    hpPerLevel: 6,
    subclasses: ['Hunter', 'Beast Master'],
    description: 'A warrior who uses martial prowess and nature magic to combat threats',
    spellcaster: true,
    spellcastingAbility: 'wisdom',
    features: {
      1: ['Favored Enemy', 'Natural Explorer'],
      2: ['Fighting Style', 'Spellcasting'],
      3: ['Ranger Archetype'],
      5: ['Extra Attack'],
      14: ['Vanish'],
      20: ['Foe Slayer']
    }
  },
  
  Paladin: {
    name: 'Paladin',
    hitDie: 10,
    primaryAbility: ['strength', 'charisma'],
    savingThrows: ['wisdom', 'charisma'],
    skills: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
    skillChoices: 2,
    startingHP: 10,
    hpPerLevel: 6,
    subclasses: ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance'],
    description: 'A holy warrior bound to a sacred oath',
    spellcaster: true,
    spellcastingAbility: 'charisma',
    features: {
      1: ['Divine Sense', 'Lay on Hands'],
      2: ['Fighting Style', 'Spellcasting', 'Divine Smite'],
      3: ['Sacred Oath'],
      5: ['Extra Attack'],
      6: ['Aura of Protection'],
      20: ['Sacred Oath Feature']
    }
  },
  
  Warlock: {
    name: 'Warlock',
    hitDie: 8,
    primaryAbility: ['charisma'],
    savingThrows: ['wisdom', 'charisma'],
    skills: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
    skillChoices: 2,
    startingHP: 8,
    hpPerLevel: 5,
    subclasses: ['The Fiend', 'The Archfey', 'The Great Old One'],
    description: 'A wielder of magic derived from a bargain with an extraplanar entity',
    spellcaster: true,
    spellcastingAbility: 'charisma',
    features: {
      1: ['Otherworldly Patron', 'Pact Magic'],
      2: ['Eldritch Invocations'],
      3: ['Pact Boon'],
      11: ['Mystic Arcanum (6th level)'],
      20: ['Eldritch Master']
    }
  },
  
  Monk: {
    name: 'Monk',
    hitDie: 8,
    primaryAbility: ['dexterity', 'wisdom'],
    savingThrows: ['strength', 'dexterity'],
    skills: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    skillChoices: 2,
    startingHP: 8,
    hpPerLevel: 5,
    subclasses: ['Way of the Open Hand', 'Way of Shadow', 'Way of the Four Elements'],
    description: 'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection',
    features: {
      1: ['Unarmored Defense', 'Martial Arts'],
      2: ['Ki', 'Unarmored Movement'],
      3: ['Monastic Tradition'],
      5: ['Extra Attack', 'Stunning Strike'],
      7: ['Evasion', 'Stillness of Mind'],
      20: ['Perfect Self']
    }
  },
  
  Bard: {
    name: 'Bard',
    hitDie: 8,
    primaryAbility: ['charisma'],
    savingThrows: ['dexterity', 'charisma'],
    skills: 'any',
    skillChoices: 3,
    startingHP: 8,
    hpPerLevel: 5,
    subclasses: ['College of Lore', 'College of Valor'],
    description: 'An inspiring magician whose power echoes the music of creation',
    spellcaster: true,
    spellcastingAbility: 'charisma',
    features: {
      1: ['Spellcasting', 'Bardic Inspiration'],
      2: ['Jack of All Trades', 'Song of Rest'],
      3: ['Bard College', 'Expertise'],
      5: ['Font of Inspiration'],
      20: ['Superior Inspiration']
    }
  },
  
  Druid: {
    name: 'Druid',
    hitDie: 8,
    primaryAbility: ['wisdom'],
    savingThrows: ['intelligence', 'wisdom'],
    skills: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    skillChoices: 2,
    startingHP: 8,
    hpPerLevel: 5,
    subclasses: ['Circle of the Land', 'Circle of the Moon'],
    description: 'A priest of the Old Faith, wielding the powers of nature',
    spellcaster: true,
    spellcastingAbility: 'wisdom',
    features: {
      1: ['Druidic', 'Spellcasting'],
      2: ['Wild Shape', 'Druid Circle'],
      18: ['Timeless Body', 'Beast Spells'],
      20: ['Archdruid']
    }
  },
  
  Sorcerer: {
    name: 'Sorcerer',
    hitDie: 6,
    primaryAbility: ['charisma'],
    savingThrows: ['constitution', 'charisma'],
    skills: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    skillChoices: 2,
    startingHP: 6,
    hpPerLevel: 4,
    subclasses: ['Draconic Bloodline', 'Wild Magic'],
    description: 'A spellcaster who draws on inherent magic from a gift or bloodline',
    spellcaster: true,
    spellcastingAbility: 'charisma',
    features: {
      1: ['Spellcasting', 'Sorcerous Origin'],
      2: ['Font of Magic'],
      3: ['Metamagic'],
      20: ['Sorcerous Restoration']
    }
  }
};

// XP thresholds for each level
const xpTable = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000
};

function getClassData(className) {
  return classDefinitions[className];
}

function getAllClasses() {
  return Object.keys(classDefinitions);
}

function calculateHP(className, level, constitutionModifier) {
  const classData = classDefinitions[className];
  if (!classData) return 10;
  
  // Starting HP + (HP per level * (level - 1)) + (CON mod * level)
  return classData.startingHP + (classData.hpPerLevel * (level - 1)) + (constitutionModifier * level);
}

function getXPForLevel(level) {
  return xpTable[level] || 0;
}

function getXPToNextLevel(currentLevel) {
  return xpTable[currentLevel + 1] || xpTable[20];
}

function calculateProficiencyBonus(level) {
  if (level <= 4) return 2;
  if (level <= 8) return 3;
  if (level <= 12) return 4;
  if (level <= 16) return 5;
  return 6;
}

function getAbilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

module.exports = {
  classDefinitions,
  xpTable,
  getClassData,
  getAllClasses,
  calculateHP,
  getXPForLevel,
  getXPToNextLevel,
  calculateProficiencyBonus,
  getAbilityModifier
};