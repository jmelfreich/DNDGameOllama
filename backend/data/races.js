// D&D 5e Races - Comprehensive List

const races = {
  // Core Races
  'Human': {
    name: 'Human',
    subraces: ['Standard', 'Variant'],
    abilityScoreIncrease: {
      strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Extra Language', 'Versatile'],
    description: 'Humans are the most adaptable and ambitious people among the common races.'
  },
  
  'Human (Variant)': {
    name: 'Human (Variant)',
    abilityScoreIncrease: {
      // Player chooses two different abilities to increase by 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Skills: Choose one skill proficiency', 'Feat: Choose one feat'],
    description: 'Variant humans trade general ability increases for a feat and skill.'
  },

  // Elves
  'High Elf': {
    name: 'High Elf',
    parentRace: 'Elf',
    abilityScoreIncrease: {
      dexterity: 2,
      intelligence: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision', 'Keen Senses', 'Fey Ancestry', 'Trance', 'Elf Weapon Training', 'Cantrip', 'Extra Language'],
    description: 'High elves have a keen mind and master the basics of magic.'
  },

  'Wood Elf': {
    name: 'Wood Elf',
    parentRace: 'Elf',
    abilityScoreIncrease: {
      dexterity: 2,
      wisdom: 1
    },
    size: 'Medium',
    speed: 35,
    traits: ['Darkvision', 'Keen Senses', 'Fey Ancestry', 'Trance', 'Elf Weapon Training', 'Fleet of Foot', 'Mask of the Wild'],
    description: 'Wood elves are swift and stealthy, at home in the wilderness.'
  },

  'Dark Elf (Drow)': {
    name: 'Dark Elf (Drow)',
    parentRace: 'Elf',
    abilityScoreIncrease: {
      dexterity: 2,
      charisma: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Superior Darkvision', 'Keen Senses', 'Fey Ancestry', 'Trance', 'Sunlight Sensitivity', 'Drow Magic', 'Drow Weapon Training'],
    description: 'Drow are cursed to live in the Underdark, following the dark goddess Lolth.'
  },

  // Dwarves
  'Mountain Dwarf': {
    name: 'Mountain Dwarf',
    parentRace: 'Dwarf',
    abilityScoreIncrease: {
      constitution: 2,
      strength: 2
    },
    size: 'Medium',
    speed: 25,
    traits: ['Darkvision', 'Dwarven Resilience', 'Dwarven Combat Training', 'Tool Proficiency', 'Stonecunning', 'Dwarven Armor Training'],
    description: 'Mountain dwarves are strong and hardy, accustomed to difficult life in rugged terrain.'
  },

  'Hill Dwarf': {
    name: 'Hill Dwarf',
    parentRace: 'Dwarf',
    abilityScoreIncrease: {
      constitution: 2,
      wisdom: 1
    },
    size: 'Medium',
    speed: 25,
    traits: ['Darkvision', 'Dwarven Resilience', 'Dwarven Combat Training', 'Tool Proficiency', 'Stonecunning', 'Dwarven Toughness'],
    description: 'Hill dwarves have keen senses and deep intuition, and remarkable resilience.'
  },

  // Halflings
  'Lightfoot Halfling': {
    name: 'Lightfoot Halfling',
    parentRace: 'Halfling',
    abilityScoreIncrease: {
      dexterity: 2,
      charisma: 1
    },
    size: 'Small',
    speed: 25,
    traits: ['Lucky', 'Brave', 'Halfling Nimbleness', 'Naturally Stealthy'],
    description: 'Lightfoot halflings can easily hide, using other people as cover.'
  },

  'Stout Halfling': {
    name: 'Stout Halfling',
    parentRace: 'Halfling',
    abilityScoreIncrease: {
      dexterity: 2,
      constitution: 1
    },
    size: 'Small',
    speed: 25,
    traits: ['Lucky', 'Brave', 'Halfling Nimbleness', 'Stout Resilience'],
    description: 'Stout halflings are hardier than average and have some resistance to poison.'
  },

  // Dragonborn
  'Dragonborn': {
    name: 'Dragonborn',
    abilityScoreIncrease: {
      strength: 2,
      charisma: 1
    },
    size: 'Medium',
    speed: 30,
    draconicAncestry: ['Black', 'Blue', 'Brass', 'Bronze', 'Copper', 'Gold', 'Green', 'Red', 'Silver', 'White'],
    traits: ['Draconic Ancestry', 'Breath Weapon', 'Damage Resistance'],
    description: 'Dragonborn look like dragons in humanoid form, lacking wings and tail.'
  },

  // Gnomes
  'Forest Gnome': {
    name: 'Forest Gnome',
    parentRace: 'Gnome',
    abilityScoreIncrease: {
      intelligence: 2,
      dexterity: 1
    },
    size: 'Small',
    speed: 25,
    traits: ['Darkvision', 'Gnome Cunning', 'Natural Illusionist', 'Speak with Small Beasts'],
    description: 'Forest gnomes have a natural knack for illusion and inherent quickness.'
  },

  'Rock Gnome': {
    name: 'Rock Gnome',
    parentRace: 'Gnome',
    abilityScoreIncrease: {
      intelligence: 2,
      constitution: 1
    },
    size: 'Small',
    speed: 25,
    traits: ['Darkvision', 'Gnome Cunning', 'Artificer\'s Lore', 'Tinker'],
    description: 'Rock gnomes are natural inventors and engineers.'
  },

  // Half-Elves
  'Half-Elf': {
    name: 'Half-Elf',
    abilityScoreIncrease: {
      charisma: 2
      // Plus two other ability scores of choice increase by 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision', 'Fey Ancestry', 'Skill Versatility'],
    description: 'Half-elves combine the best qualities of elves and humans.'
  },

  // Half-Orcs
  'Half-Orc': {
    name: 'Half-Orc',
    abilityScoreIncrease: {
      strength: 2,
      constitution: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision', 'Menacing', 'Relentless Endurance', 'Savage Attacks'],
    description: 'Half-orcs inherit a tendency toward chaos and ferocity from their orc heritage.'
  },

  // Tieflings
  'Tiefling': {
    name: 'Tiefling',
    abilityScoreIncrease: {
      intelligence: 1,
      charisma: 2
    },
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision', 'Hellish Resistance', 'Infernal Legacy'],
    description: 'Tieflings are derived from human bloodlines touched by infernal powers.'
  },

  // Additional Races
  'Aasimar': {
    name: 'Aasimar',
    abilityScoreIncrease: {
      charisma: 2
    },
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision', 'Celestial Resistance', 'Healing Hands', 'Light Bearer'],
    description: 'Aasimar bear the light of the heavens in their souls.'
  },

  'Goliath': {
    name: 'Goliath',
    abilityScoreIncrease: {
      strength: 2,
      constitution: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Natural Athlete', 'Stone\'s Endurance', 'Powerful Build', 'Mountain Born'],
    description: 'Goliaths are massive nomads who compete for survival in the highest mountains.'
  },

  'Firbolg': {
    name: 'Firbolg',
    abilityScoreIncrease: {
      wisdom: 2,
      strength: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Firbolg Magic', 'Hidden Step', 'Powerful Build', 'Speech of Beast and Leaf'],
    description: 'Firbolgs are forest guardians who prefer to live in harmony with nature.'
  },

  'Kenku': {
    name: 'Kenku',
    abilityScoreIncrease: {
      dexterity: 2,
      wisdom: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Expert Forgery', 'Kenku Training', 'Mimicry'],
    description: 'Kenku are cursed with flightlessness and can only speak by mimicking sounds.'
  },

  'Tabaxi': {
    name: 'Tabaxi',
    abilityScoreIncrease: {
      dexterity: 2,
      charisma: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Feline Agility', 'Cat\'s Claws', 'Cat\'s Talent', 'Darkvision'],
    description: 'Tabaxi are curious wanderers with feline features.'
  },

  'Triton': {
    name: 'Triton',
    abilityScoreIncrease: {
      strength: 1,
      constitution: 1,
      charisma: 1
    },
    size: 'Medium',
    speed: 30,
    swimSpeed: 30,
    traits: ['Amphibious', 'Control Air and Water', 'Emissary of the Sea', 'Guardians of the Depths'],
    description: 'Tritons guard the ocean depths, building small settlements beside deep trenches.'
  },

  'Aarakocra': {
    name: 'Aarakocra',
    abilityScoreIncrease: {
      dexterity: 2,
      wisdom: 1
    },
    size: 'Medium',
    speed: 25,
    flySpeed: 50,
    traits: ['Flight', 'Talons'],
    description: 'Aarakocra are bird-like humanoids who soar through the skies.'
  },

  'Genasi (Fire)': {
    name: 'Fire Genasi',
    parentRace: 'Genasi',
    abilityScoreIncrease: {
      constitution: 2,
      intelligence: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision', 'Fire Resistance', 'Reach to the Blaze'],
    description: 'Fire genasi are hot-blooded and quick to anger, inheriting elemental fire.'
  },

  'Genasi (Water)': {
    name: 'Water Genasi',
    parentRace: 'Genasi',
    abilityScoreIncrease: {
      constitution: 2,
      wisdom: 1
    },
    size: 'Medium',
    speed: 30,
    swimSpeed: 30,
    traits: ['Acid Resistance', 'Amphibious', 'Swim', 'Call to the Wave'],
    description: 'Water genasi are patient and independent, comfortable with solitude.'
  },

  'Genasi (Earth)': {
    name: 'Earth Genasi',
    parentRace: 'Genasi',
    abilityScoreIncrease: {
      constitution: 2,
      strength: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Earth Walk', 'Merge with Stone'],
    description: 'Earth genasi are strong and solid, drawn to mountains and caverns.'
  },

  'Genasi (Air)': {
    name: 'Air Genasi',
    parentRace: 'Genasi',
    abilityScoreIncrease: {
      constitution: 2,
      dexterity: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Unending Breath', 'Mingle with the Wind'],
    description: 'Air genasi are fast and free-spirited, embodying many of the traits of their elemental ancestor.'
  },

  'Bugbear': {
    name: 'Bugbear',
    abilityScoreIncrease: {
      strength: 2,
      dexterity: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision', 'Long-Limbed', 'Powerful Build', 'Sneaky', 'Surprise Attack'],
    description: 'Bugbears are born for battle and mayhem.'
  },

  'Goblin': {
    name: 'Goblin',
    abilityScoreIncrease: {
      dexterity: 2,
      constitution: 1
    },
    size: 'Small',
    speed: 30,
    traits: ['Darkvision', 'Fury of the Small', 'Nimble Escape'],
    description: 'Goblins are small, quick, and live in dark places.'
  },

  'Hobgoblin': {
    name: 'Hobgoblin',
    abilityScoreIncrease: {
      constitution: 2,
      intelligence: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision', 'Martial Training', 'Saving Face'],
    description: 'Hobgoblins are disciplined warriors who value martial excellence.'
  },

  'Kobold': {
    name: 'Kobold',
    abilityScoreIncrease: {
      dexterity: 2,
      strength: -2
    },
    size: 'Small',
    speed: 30,
    traits: ['Darkvision', 'Grovel, Cower, and Beg', 'Pack Tactics', 'Sunlight Sensitivity'],
    description: 'Kobolds are craven reptilian humanoids that worship dragons.'
  },

  'Orc': {
    name: 'Orc',
    abilityScoreIncrease: {
      strength: 2,
      constitution: 1,
      intelligence: -2
    },
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision', 'Aggressive', 'Menacing', 'Powerful Build'],
    description: 'Orcs are savage raiders who value strength above all.'
  },

  'Yuan-ti Pureblood': {
    name: 'Yuan-ti Pureblood',
    abilityScoreIncrease: {
      charisma: 2,
      intelligence: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Darkvision', 'Innate Spellcasting', 'Magic Resistance', 'Poison Immunity'],
    description: 'Yuan-ti purebloods are the most human-seeming of the yuan-ti.'
  },

  'Tortle': {
    name: 'Tortle',
    abilityScoreIncrease: {
      strength: 2,
      wisdom: 1
    },
    size: 'Medium',
    speed: 30,
    traits: ['Claws', 'Hold Breath', 'Natural Armor', 'Shell Defense', 'Survival Instinct'],
    description: 'Tortles are turtle-like humanoids who make their homes along tropical coasts.'
  },

  'Lizardfolk': {
    name: 'Lizardfolk',
    abilityScoreIncrease: {
      constitution: 2,
      wisdom: 1
    },
    size: 'Medium',
    speed: 30,
    swimSpeed: 30,
    traits: ['Bite', 'Cunning Artisan', 'Hold Breath', 'Hunter\'s Lore', 'Natural Armor', 'Hungry Jaws'],
    description: 'Lizardfolk are pragmatic and alien in their thinking.'
  }
};

function getAllRaces() {
  return Object.keys(races);
}

function getRaceData(raceName) {
  return races[raceName];
}

module.exports = {
  races,
  getAllRaces,
  getRaceData
};