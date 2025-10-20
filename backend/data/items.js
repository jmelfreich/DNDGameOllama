// D&D 5e Items Database - COMPLETE WITH equipSlot FOR PRODUCTION

const items = {
  // HEALING POTIONS
  healing: [
    {
      id: 1,
      name: 'Potion of Healing',
      type: 'consumable',
      category: 'healing',
      price: 50,
      rarity: 'common',
      effect: 'heal',
      value: '2d4+2',
      description: 'Restores 2d4+2 hit points when consumed',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 2,
      name: 'Potion of Greater Healing',
      type: 'consumable',
      category: 'healing',
      price: 150,
      rarity: 'uncommon',
      effect: 'heal',
      value: '4d4+4',
      description: 'Restores 4d4+4 hit points when consumed',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 3,
      name: 'Potion of Superior Healing',
      type: 'consumable',
      category: 'healing',
      price: 500,
      rarity: 'rare',
      effect: 'heal',
      value: '8d4+8',
      description: 'Restores 8d4+8 hit points when consumed',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 4,
      name: 'Potion of Supreme Healing',
      type: 'consumable',
      category: 'healing',
      price: 2000,
      rarity: 'very rare',
      effect: 'heal',
      value: '10d4+20',
      description: 'Restores 10d4+20 hit points when consumed',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 5,
      name: 'Healer\'s Kit',
      type: 'tool',
      category: 'healing',
      price: 5,
      rarity: 'common',
      effect: 'stabilize',
      uses: 10,
      description: 'Has 10 uses. Can stabilize a dying creature',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 6,
      name: 'Potion of Vitality',
      type: 'consumable',
      category: 'healing',
      price: 1000,
      rarity: 'very rare',
      effect: 'cure_exhaustion',
      value: '4d4+4',
      description: 'Removes exhaustion and cures diseases, restores 4d4+4 HP',
      usableInCombat: true,
      equipSlot: 'none'
    }
  ],

  // SIMPLE MELEE WEAPONS
  simpleWeapons: [
    {
      id: 100,
      name: 'Club',
      type: 'weapon',
      category: 'simple_melee',
      price: 0.1,
      weight: 2,
      damage: '1d4',
      damageType: 'bludgeoning',
      properties: ['Light'],
      description: 'A simple wooden club',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 101,
      name: 'Dagger',
      type: 'weapon',
      category: 'simple_melee',
      price: 2,
      weight: 1,
      damage: '1d4',
      damageType: 'piercing',
      properties: ['Finesse', 'Light', 'Thrown (20/60)'],
      description: 'A simple blade, can be thrown',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 102,
      name: 'Greatclub',
      type: 'weapon',
      category: 'simple_melee',
      price: 0.2,
      weight: 10,
      damage: '1d8',
      damageType: 'bludgeoning',
      properties: ['Two-Handed'],
      description: 'A large wooden club',
      usableInCombat: false,
      equipSlot: 'both_hands'
    },
    {
      id: 103,
      name: 'Handaxe',
      type: 'weapon',
      category: 'simple_melee',
      price: 5,
      weight: 2,
      damage: '1d6',
      damageType: 'slashing',
      properties: ['Light', 'Thrown (20/60)'],
      description: 'A light axe that can be thrown',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 104,
      name: 'Javelin',
      type: 'weapon',
      category: 'simple_melee',
      price: 0.5,
      weight: 2,
      damage: '1d6',
      damageType: 'piercing',
      properties: ['Thrown (30/120)'],
      description: 'A throwing spear',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 105,
      name: 'Light Hammer',
      type: 'weapon',
      category: 'simple_melee',
      price: 2,
      weight: 2,
      damage: '1d4',
      damageType: 'bludgeoning',
      properties: ['Light', 'Thrown (20/60)'],
      description: 'A small hammer',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 106,
      name: 'Mace',
      type: 'weapon',
      category: 'simple_melee',
      price: 5,
      weight: 4,
      damage: '1d6',
      damageType: 'bludgeoning',
      description: 'A heavy club with a metal head',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 107,
      name: 'Quarterstaff',
      type: 'weapon',
      category: 'simple_melee',
      price: 0.2,
      weight: 4,
      damage: '1d6',
      damageType: 'bludgeoning',
      properties: ['Versatile (1d8)'],
      description: 'A simple wooden staff',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 108,
      name: 'Sickle',
      type: 'weapon',
      category: 'simple_melee',
      price: 1,
      weight: 2,
      damage: '1d4',
      damageType: 'slashing',
      properties: ['Light'],
      description: 'A farming implement used as a weapon',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 109,
      name: 'Spear',
      type: 'weapon',
      category: 'simple_melee',
      price: 1,
      weight: 3,
      damage: '1d6',
      damageType: 'piercing',
      properties: ['Thrown (20/60)', 'Versatile (1d8)'],
      description: 'A long pole weapon',
      usableInCombat: false,
      equipSlot: 'r_hand'
    }
  ],

  // SIMPLE RANGED WEAPONS
  simpleRangedWeapons: [
    {
      id: 150,
      name: 'Light Crossbow',
      type: 'weapon',
      category: 'simple_ranged',
      price: 25,
      weight: 5,
      damage: '1d8',
      damageType: 'piercing',
      properties: ['Ammunition (80/320)', 'Loading', 'Two-Handed'],
      description: 'A simple crossbow',
      usableInCombat: false,
      equipSlot: 'both_hands'
    },
    {
      id: 151,
      name: 'Dart',
      type: 'weapon',
      category: 'simple_ranged',
      price: 0.05,
      weight: 0.25,
      damage: '1d4',
      damageType: 'piercing',
      properties: ['Finesse', 'Thrown (20/60)'],
      description: 'A small throwing dart',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 152,
      name: 'Shortbow',
      type: 'weapon',
      category: 'simple_ranged',
      price: 25,
      weight: 2,
      damage: '1d6',
      damageType: 'piercing',
      properties: ['Ammunition (80/320)', 'Two-Handed'],
      description: 'A simple bow',
      usableInCombat: false,
      equipSlot: 'both_hands'
    },
    {
      id: 153,
      name: 'Sling',
      type: 'weapon',
      category: 'simple_ranged',
      price: 0.1,
      weight: 0,
      damage: '1d4',
      damageType: 'bludgeoning',
      properties: ['Ammunition (30/120)'],
      description: 'A simple sling',
      usableInCombat: false,
      equipSlot: 'r_hand'
    }
  ],

  // MARTIAL MELEE WEAPONS
  martialWeapons: [
    {
      id: 200,
      name: 'Battleaxe',
      type: 'weapon',
      category: 'martial_melee',
      price: 10,
      weight: 4,
      damage: '1d8',
      damageType: 'slashing',
      properties: ['Versatile (1d10)'],
      description: 'A one-handed axe',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 201,
      name: 'Flail',
      type: 'weapon',
      category: 'martial_melee',
      price: 10,
      weight: 2,
      damage: '1d8',
      damageType: 'bludgeoning',
      description: 'A spiked ball on a chain',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 202,
      name: 'Glaive',
      type: 'weapon',
      category: 'martial_melee',
      price: 20,
      weight: 6,
      damage: '1d10',
      damageType: 'slashing',
      properties: ['Heavy', 'Reach', 'Two-Handed'],
      description: 'A pole weapon with a blade',
      usableInCombat: false,
      equipSlot: 'both_hands'
    },
    {
      id: 203,
      name: 'Greataxe',
      type: 'weapon',
      category: 'martial_melee',
      price: 30,
      weight: 7,
      damage: '1d12',
      damageType: 'slashing',
      properties: ['Heavy', 'Two-Handed'],
      description: 'A massive two-handed axe',
      usableInCombat: false,
      equipSlot: 'both_hands'
    },
    {
      id: 204,
      name: 'Greatsword',
      type: 'weapon',
      category: 'martial_melee',
      price: 50,
      weight: 6,
      damage: '2d6',
      damageType: 'slashing',
      properties: ['Heavy', 'Two-Handed'],
      description: 'A massive two-handed sword',
      usableInCombat: false,
      equipSlot: 'both_hands'
    },
    {
      id: 205,
      name: 'Halberd',
      type: 'weapon',
      category: 'martial_melee',
      price: 20,
      weight: 6,
      damage: '1d10',
      damageType: 'slashing',
      properties: ['Heavy', 'Reach', 'Two-Handed'],
      description: 'A pole weapon with an axe blade',
      usableInCombat: false,
      equipSlot: 'both_hands'
    },
    {
      id: 206,
      name: 'Lance',
      type: 'weapon',
      category: 'martial_melee',
      price: 10,
      weight: 6,
      damage: '1d12',
      damageType: 'piercing',
      properties: ['Reach', 'Special'],
      description: 'A cavalry weapon',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 207,
      name: 'Longsword',
      type: 'weapon',
      category: 'martial_melee',
      price: 15,
      weight: 3,
      damage: '1d8',
      damageType: 'slashing',
      properties: ['Versatile (1d10)'],
      description: 'A versatile one-handed sword',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 208,
      name: 'Maul',
      type: 'weapon',
      category: 'martial_melee',
      price: 10,
      weight: 10,
      damage: '2d6',
      damageType: 'bludgeoning',
      properties: ['Heavy', 'Two-Handed'],
      description: 'A massive two-handed hammer',
      usableInCombat: false,
      equipSlot: 'both_hands'
    },
    {
      id: 209,
      name: 'Morningstar',
      type: 'weapon',
      category: 'martial_melee',
      price: 15,
      weight: 4,
      damage: '1d8',
      damageType: 'piercing',
      description: 'A spiked mace',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 210,
      name: 'Pike',
      type: 'weapon',
      category: 'martial_melee',
      price: 5,
      weight: 18,
      damage: '1d10',
      damageType: 'piercing',
      properties: ['Heavy', 'Reach', 'Two-Handed'],
      description: 'A long spear',
      usableInCombat: false,
      equipSlot: 'both_hands'
    },
    {
      id: 211,
      name: 'Rapier',
      type: 'weapon',
      category: 'martial_melee',
      price: 25,
      weight: 2,
      damage: '1d8',
      damageType: 'piercing',
      properties: ['Finesse'],
      description: 'A slender thrusting sword',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 212,
      name: 'Scimitar',
      type: 'weapon',
      category: 'martial_melee',
      price: 25,
      weight: 3,
      damage: '1d6',
      damageType: 'slashing',
      properties: ['Finesse', 'Light'],
      description: 'A curved blade',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 213,
      name: 'Shortsword',
      type: 'weapon',
      category: 'martial_melee',
      price: 10,
      weight: 2,
      damage: '1d6',
      damageType: 'piercing',
      properties: ['Finesse', 'Light'],
      description: 'A short blade',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 214,
      name: 'Trident',
      type: 'weapon',
      category: 'martial_melee',
      price: 5,
      weight: 4,
      damage: '1d6',
      damageType: 'piercing',
      properties: ['Thrown (20/60)', 'Versatile (1d8)'],
      description: 'A three-pronged spear',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 215,
      name: 'War Pick',
      type: 'weapon',
      category: 'martial_melee',
      price: 5,
      weight: 2,
      damage: '1d8',
      damageType: 'piercing',
      description: 'A pick designed for war',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 216,
      name: 'Warhammer',
      type: 'weapon',
      category: 'martial_melee',
      price: 15,
      weight: 2,
      damage: '1d8',
      damageType: 'bludgeoning',
      properties: ['Versatile (1d10)'],
      description: 'A one-handed war hammer',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 217,
      name: 'Whip',
      type: 'weapon',
      category: 'martial_melee',
      price: 2,
      weight: 3,
      damage: '1d4',
      damageType: 'slashing',
      properties: ['Finesse', 'Reach'],
      description: 'A flexible leather whip',
      usableInCombat: false,
      equipSlot: 'r_hand'
    }
  ],

  // MARTIAL RANGED WEAPONS
  martialRangedWeapons: [
    {
      id: 250,
      name: 'Blowgun',
      type: 'weapon',
      category: 'martial_ranged',
      price: 10,
      weight: 1,
      damage: '1',
      damageType: 'piercing',
      properties: ['Ammunition (25/100)', 'Loading'],
      description: 'A tube for shooting darts',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 251,
      name: 'Hand Crossbow',
      type: 'weapon',
      category: 'martial_ranged',
      price: 75,
      weight: 3,
      damage: '1d6',
      damageType: 'piercing',
      properties: ['Ammunition (30/120)', 'Light', 'Loading'],
      description: 'A small one-handed crossbow',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 252,
      name: 'Heavy Crossbow',
      type: 'weapon',
      category: 'martial_ranged',
      price: 50,
      weight: 18,
      damage: '1d10',
      damageType: 'piercing',
      properties: ['Ammunition (100/400)', 'Heavy', 'Loading', 'Two-Handed'],
      description: 'A powerful crossbow',
      usableInCombat: false,
      equipSlot: 'both_hands'
    },
    {
      id: 253,
      name: 'Longbow',
      type: 'weapon',
      category: 'martial_ranged',
      price: 50,
      weight: 2,
      damage: '1d8',
      damageType: 'piercing',
      properties: ['Ammunition (150/600)', 'Heavy', 'Two-Handed'],
      description: 'A powerful ranged weapon',
      usableInCombat: false,
      equipSlot: 'both_hands'
    },
    {
      id: 254,
      name: 'Net',
      type: 'weapon',
      category: 'martial_ranged',
      price: 1,
      weight: 3,
      damage: '0',
      damageType: 'none',
      properties: ['Special', 'Thrown (5/15)'],
      description: 'Used to restrain creatures',
      usableInCombat: false,
      equipSlot: 'r_hand'
    }
  ],
  
  // LIGHT ARMOR
  lightArmor: [
    {
      id: 300,
      name: 'Padded Armor',
      type: 'armor',
      category: 'light',
      price: 5,
      weight: 8,
      ac: 11,
      stealthDisadvantage: true,
      description: 'Padded armor consists of quilted layers of cloth and batting',
      usableInCombat: false,
      equipSlot: 'armor'
    },
    {
      id: 301,
      name: 'Leather Armor',
      type: 'armor',
      category: 'light',
      price: 10,
      weight: 10,
      ac: 11,
      description: 'Leather armor is made from hardened leather',
      usableInCombat: false,
      equipSlot: 'armor'
    },
    {
      id: 302,
      name: 'Studded Leather Armor',
      type: 'armor',
      category: 'light',
      price: 45,
      weight: 13,
      ac: 12,
      description: 'Made from tough but flexible leather, reinforced with close-set rivets or spikes',
      usableInCombat: false,
      equipSlot: 'armor'
    }
  ],

  // MEDIUM ARMOR
  mediumArmor: [
    {
      id: 310,
      name: 'Hide Armor',
      type: 'armor',
      category: 'medium',
      price: 10,
      weight: 12,
      ac: 12,
      maxDexBonus: 2,
      description: 'Crude armor made from thick furs and pelts',
      usableInCombat: false,
      equipSlot: 'armor'
    },
    {
      id: 311,
      name: 'Chain Shirt',
      type: 'armor',
      category: 'medium',
      price: 50,
      weight: 20,
      ac: 13,
      maxDexBonus: 2,
      description: 'Made of interlocking metal rings',
      usableInCombat: false,
      equipSlot: 'armor'
    },
    {
      id: 312,
      name: 'Scale Mail',
      type: 'armor',
      category: 'medium',
      price: 50,
      weight: 45,
      ac: 14,
      maxDexBonus: 2,
      stealthDisadvantage: true,
      description: 'Consists of a coat and leggings of leather covered with overlapping pieces of metal',
      usableInCombat: false,
      equipSlot: 'armor'
    },
    {
      id: 313,
      name: 'Breastplate',
      type: 'armor',
      category: 'medium',
      price: 400,
      weight: 20,
      ac: 14,
      maxDexBonus: 2,
      description: 'Fitted metal chest piece worn with supple leather',
      usableInCombat: false,
      equipSlot: 'armor'
    },
    {
      id: 314,
      name: 'Half Plate',
      type: 'armor',
      category: 'medium',
      price: 750,
      weight: 40,
      ac: 15,
      maxDexBonus: 2,
      stealthDisadvantage: true,
      description: 'Consists of shaped metal plates that cover most of the body',
      usableInCombat: false,
      equipSlot: 'armor'
    }
  ],

  // HEAVY ARMOR
  heavyArmor: [
    {
      id: 320,
      name: 'Ring Mail',
      type: 'armor',
      category: 'heavy',
      price: 30,
      weight: 40,
      ac: 14,
      stealthDisadvantage: true,
      description: 'Leather armor with heavy rings sewn into it',
      usableInCombat: false,
      equipSlot: 'armor'
    },
    {
      id: 321,
      name: 'Chain Mail',
      type: 'armor',
      category: 'heavy',
      price: 75,
      weight: 55,
      ac: 16,
      strengthRequired: 13,
      stealthDisadvantage: true,
      description: 'Made of interlocking metal rings, includes a layer of quilted fabric',
      usableInCombat: false,
      equipSlot: 'armor'
    },
    {
      id: 322,
      name: 'Splint Armor',
      type: 'armor',
      category: 'heavy',
      price: 200,
      weight: 60,
      ac: 17,
      strengthRequired: 15,
      stealthDisadvantage: true,
      description: 'Made of narrow vertical strips of metal riveted to a backing of leather',
      usableInCombat: false,
      equipSlot: 'armor'
    },
    {
      id: 323,
      name: 'Plate Armor',
      type: 'armor',
      category: 'heavy',
      price: 1500,
      weight: 65,
      ac: 18,
      strengthRequired: 15,
      stealthDisadvantage: true,
      description: 'Consists of shaped, interlocking metal plates to cover the entire body',
      usableInCombat: false,
      equipSlot: 'armor'
    }
  ],

  // SHIELDS
  shields: [
    {
      id: 330,
      name: 'Shield',
      type: 'armor',
      category: 'shield',
      price: 10,
      weight: 6,
      ac: 2,
      description: 'Made from wood or metal, increases AC by 2',
      usableInCombat: false,
      equipSlot: 'l_hand'
    }
  ],

  // AMMUNITION
  ammunition: [
    {
      id: 400,
      name: 'Arrows (20)',
      type: 'ammunition',
      category: 'ammunition',
      price: 1,
      weight: 1,
      description: 'Ammunition for bows',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 401,
      name: 'Blowgun Needles (50)',
      type: 'ammunition',
      category: 'ammunition',
      price: 1,
      weight: 1,
      description: 'Ammunition for blowguns',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 402,
      name: 'Crossbow Bolts (20)',
      type: 'ammunition',
      category: 'ammunition',
      price: 1,
      weight: 1.5,
      description: 'Ammunition for crossbows',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 403,
      name: 'Sling Bullets (20)',
      type: 'ammunition',
      category: 'ammunition',
      price: 0.04,
      weight: 1.5,
      description: 'Ammunition for slings',
      usableInCombat: false,
      equipSlot: 'none'
    }
  ],

  // ADVENTURING GEAR
  adventuringGear: [
    {
      id: 500,
      name: 'Backpack',
      type: 'gear',
      category: 'adventuring',
      price: 2,
      weight: 5,
      capacity: '1 cubic foot/30 pounds',
      description: 'A leather pack carried on the back',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 501,
      name: 'Bedroll',
      type: 'gear',
      category: 'adventuring',
      price: 1,
      weight: 7,
      description: 'For sleeping in the wilderness',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 502,
      name: 'Rope, Hempen (50 feet)',
      type: 'gear',
      category: 'adventuring',
      price: 1,
      weight: 10,
      description: 'Hemp rope with 2 hit points and can be burst with a DC 17 Strength check',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 503,
      name: 'Rope, Silk (50 feet)',
      type: 'gear',
      category: 'adventuring',
      price: 10,
      weight: 5,
      description: 'Silk rope with 2 hit points and can be burst with a DC 17 Strength check',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 504,
      name: 'Torch',
      type: 'gear',
      category: 'adventuring',
      price: 0.01,
      weight: 1,
      description: 'Provides bright light in a 20-foot radius for 1 hour',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 505,
      name: 'Lantern, Bullseye',
      type: 'gear',
      category: 'adventuring',
      price: 10,
      weight: 2,
      description: 'Casts bright light in a 60-foot cone and dim light for an additional 60 feet',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 506,
      name: 'Lantern, Hooded',
      type: 'gear',
      category: 'adventuring',
      price: 5,
      weight: 2,
      description: 'Casts bright light in a 30-foot radius and dim light for an additional 30 feet',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 507,
      name: 'Oil (flask)',
      type: 'gear',
      category: 'adventuring',
      price: 0.1,
      weight: 1,
      description: 'Can be thrown as a splash weapon or used in lamps',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 508,
      name: 'Tinderbox',
      type: 'gear',
      category: 'adventuring',
      price: 0.5,
      weight: 1,
      description: 'Used to start fires',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 509,
      name: 'Waterskin',
      type: 'gear',
      category: 'adventuring',
      price: 0.2,
      weight: 5,
      capacity: '4 pints',
      description: 'Holds liquid',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 510,
      name: 'Rations (1 day)',
      type: 'consumable',
      category: 'adventuring',
      price: 0.5,
      weight: 2,
      description: 'Dry foods suitable for extended travel',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 511,
      name: 'Crowbar',
      type: 'gear',
      category: 'adventuring',
      price: 2,
      weight: 5,
      description: 'Grants advantage on Strength checks where leverage can be applied',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 512,
      name: 'Grappling Hook',
      type: 'gear',
      category: 'adventuring',
      price: 2,
      weight: 4,
      description: 'For climbing and securing rope',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 513,
      name: 'Hammer',
      type: 'gear',
      category: 'adventuring',
      price: 1,
      weight: 3,
      description: 'For driving pitons and other tasks',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 514,
      name: 'Piton',
      type: 'gear',
      category: 'adventuring',
      price: 0.05,
      weight: 0.25,
      description: 'Used for climbing',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 515,
      name: 'Tent, Two-person',
      type: 'gear',
      category: 'adventuring',
      price: 2,
      weight: 20,
      description: 'Simple shelter for two people',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 516,
      name: 'Blanket',
      type: 'gear',
      category: 'adventuring',
      price: 0.5,
      weight: 3,
      description: 'A wool blanket',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 517,
      name: 'Chalk (1 piece)',
      type: 'gear',
      category: 'adventuring',
      price: 0.01,
      weight: 0,
      description: 'For marking',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 518,
      name: 'Chest',
      type: 'gear',
      category: 'adventuring',
      price: 5,
      weight: 25,
      capacity: '12 cubic feet/300 pounds',
      description: 'For storage',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 519,
      name: 'Mirror, Steel',
      type: 'gear',
      category: 'adventuring',
      price: 5,
      weight: 0.5,
      description: 'Useful for looking around corners',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 520,
      name: 'Chain (10 feet)',
      type: 'gear',
      category: 'adventuring',
      price: 5,
      weight: 10,
      description: 'Has 10 hit points, can be burst with DC 20 Strength check',
      usableInCombat: false,
      equipSlot: 'none'
    }
  ],

  // TOOLS
  tools: [
    {
      id: 600,
      name: 'Thieves\' Tools',
      type: 'tool',
      category: 'tools',
      price: 25,
      weight: 1,
      description: 'For picking locks and disarming traps',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 601,
      name: 'Disguise Kit',
      type: 'tool',
      category: 'tools',
      price: 25,
      weight: 3,
      description: 'For creating disguises',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 602,
      name: 'Forgery Kit',
      type: 'tool',
      category: 'tools',
      price: 15,
      weight: 5,
      description: 'For creating fake documents',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 603,
      name: 'Herbalism Kit',
      type: 'tool',
      category: 'tools',
      price: 5,
      weight: 3,
      description: 'For identifying and using herbs',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 604,
      name: 'Navigator\'s Tools',
      type: 'tool',
      category: 'tools',
      price: 25,
      weight: 2,
      description: 'For navigation at sea',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 605,
      name: 'Poisoner\'s Kit',
      type: 'tool',
      category: 'tools',
      price: 50,
      weight: 2,
      description: 'For creating and identifying poisons',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 606,
      name: 'Alchemist\'s Supplies',
      type: 'tool',
      category: 'tools',
      price: 50,
      weight: 8,
      description: 'For creating alchemical items',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 607,
      name: 'Brewer\'s Supplies',
      type: 'tool',
      category: 'tools',
      price: 20,
      weight: 9,
      description: 'For brewing beer and ale',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 608,
      name: 'Calligrapher\'s Supplies',
      type: 'tool',
      category: 'tools',
      price: 10,
      weight: 5,
      description: 'For writing and drawing',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 609,
      name: 'Carpenter\'s Tools',
      type: 'tool',
      category: 'tools',
      price: 8,
      weight: 6,
      description: 'For woodworking',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 610,
      name: 'Cook\'s Utensils',
      type: 'tool',
      category: 'tools',
      price: 1,
      weight: 8,
      description: 'For cooking',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 611,
      name: 'Smith\'s Tools',
      type: 'tool',
      category: 'tools',
      price: 20,
      weight: 8,
      description: 'For smithing',
      usableInCombat: false,
      equipSlot: 'none'
    }
  ],

  // COMBAT CONSUMABLES
  combatConsumables: [
    {
      id: 700,
      name: 'Alchemist\'s Fire (flask)',
      type: 'consumable',
      category: 'combat',
      price: 50,
      weight: 1,
      effect: 'damage',
      value: '1d4',
      damageType: 'fire',
      description: 'Deals 1d4 fire damage on hit, ignites target for ongoing damage',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 701,
      name: 'Acid (vial)',
      type: 'consumable',
      category: 'combat',
      price: 25,
      weight: 1,
      effect: 'damage',
      value: '2d6',
      damageType: 'acid',
      description: 'Deals 2d6 acid damage',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 702,
      name: 'Holy Water (flask)',
      type: 'consumable',
      category: 'combat',
      price: 25,
      weight: 1,
      effect: 'damage',
      value: '2d6',
      damageType: 'radiant',
      description: 'Deals 2d6 radiant damage to undead and fiends',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 703,
      name: 'Poison, Basic (vial)',
      type: 'consumable',
      category: 'combat',
      price: 100,
      weight: 0,
      effect: 'damage',
      value: '1d4',
      damageType: 'poison',
      description: 'Can be applied to weapons, deals 1d4 poison damage',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 704,
      name: 'Antitoxin (vial)',
      type: 'consumable',
      category: 'combat',
      price: 50,
      weight: 0,
      effect: 'cure_poison',
      description: 'Grants advantage against poison for 1 hour',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 705,
      name: 'Caltrops (bag of 20)',
      type: 'consumable',
      category: 'combat',
      price: 1,
      weight: 2,
      effect: 'area_denial',
      value: '1d4',
      description: 'Covers 5-foot square, deals 1d4 piercing damage and reduces speed',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 706,
      name: 'Ball Bearings (bag of 1000)',
      type: 'consumable',
      category: 'combat',
      price: 1,
      weight: 2,
      effect: 'area_denial',
      description: 'Covers 10-foot square, creatures must succeed on DC 10 Dex save or fall prone',
      usableInCombat: true,
      equipSlot: 'none'
    }
  ],

  // BUFF/UTILITY POTIONS
  potions: [
    {
      id: 800,
      name: 'Potion of Climbing',
      type: 'consumable',
      category: 'potion',
      price: 100,
      rarity: 'common',
      weight: 0.5,
      effect: 'buff_climbing',
      description: 'Gain climbing speed equal to walking speed for 1 hour',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 801,
      name: 'Potion of Animal Friendship',
      type: 'consumable',
      category: 'potion',
      price: 100,
      rarity: 'common',
      weight: 0.5,
      effect: 'charm_beast',
      description: 'Can cast Animal Friendship for 1 hour',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 802,
      name: 'Potion of Fire Breath',
      type: 'consumable',
      category: 'potion',
      price: 150,
      rarity: 'uncommon',
      weight: 0.5,
      effect: 'fire_breath',
      value: '4d6',
      damageType: 'fire',
      description: 'After drinking, can exhale fire three times (4d6 damage, DC 13 Dex save)',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 803,
      name: 'Potion of Giant Strength (Hill)',
      type: 'consumable',
      category: 'potion',
      price: 500,
      rarity: 'uncommon',
      weight: 0.5,
      effect: 'buff_strength',
      value: '21',
      description: 'Strength becomes 21 for 1 hour',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 804,
      name: 'Potion of Giant Strength (Stone/Frost)',
      type: 'consumable',
      category: 'potion',
      price: 1000,
      rarity: 'rare',
      weight: 0.5,
      effect: 'buff_strength',
      value: '23',
      description: 'Strength becomes 23 for 1 hour',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 805,
      name: 'Potion of Giant Strength (Fire)',
      type: 'consumable',
      category: 'potion',
      price: 2000,
      rarity: 'rare',
      weight: 0.5,
      effect: 'buff_strength',
      value: '25',
      description: 'Strength becomes 25 for 1 hour',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 806,
      name: 'Potion of Giant Strength (Cloud)',
      type: 'consumable',
      category: 'potion',
      price: 5000,
      rarity: 'very rare',
      weight: 0.5,
      effect: 'buff_strength',
      value: '27',
      description: 'Strength becomes 27 for 1 hour',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 807,
      name: 'Potion of Giant Strength (Storm)',
      type: 'consumable',
      category: 'potion',
      price: 10000,
      rarity: 'legendary',
      weight: 0.5,
      effect: 'buff_strength',
      value: '29',
      description: 'Strength becomes 29 for 1 hour',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 808,
      name: 'Potion of Growth',
      type: 'consumable',
      category: 'potion',
      price: 300,
      rarity: 'uncommon',
      weight: 0.5,
      effect: 'enlarge',
      description: 'As if under the Enlarge effect for 1d4 hours',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 809,
      name: 'Potion of Diminution',
      type: 'consumable',
      category: 'potion',
      price: 300,
      rarity: 'rare',
      weight: 0.5,
      effect: 'reduce',
      description: 'As if under the Reduce effect for 1d4 hours',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 810,
      name: 'Potion of Gaseous Form',
      type: 'consumable',
      category: 'potion',
      price: 300,
      rarity: 'rare',
      weight: 0.5,
      effect: 'gaseous_form',
      description: 'Transform into a misty cloud for 1 hour',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 811,
      name: 'Potion of Heroism',
      type: 'consumable',
      category: 'potion',
      price: 200,
      rarity: 'rare',
      weight: 0.5,
      effect: 'buff_temp_hp',
      value: '10',
      description: 'Gain 10 temporary HP and advantage on attack rolls for 1 hour',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 812,
      name: 'Potion of Invisibility',
      type: 'consumable',
      category: 'potion',
      price: 300,
      rarity: 'very rare',
      weight: 0.5,
      effect: 'buff_invisibility',
      description: 'Become invisible for 1 hour or until you attack or cast a spell',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 813,
      name: 'Potion of Mind Reading',
      type: 'consumable',
      category: 'potion',
      price: 300,
      rarity: 'rare',
      weight: 0.5,
      effect: 'detect_thoughts',
      description: 'Can cast Detect Thoughts at will for 10 minutes',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 814,
      name: 'Potion of Poison',
      type: 'consumable',
      category: 'potion',
      price: 100,
      rarity: 'uncommon',
      weight: 0.5,
      effect: 'damage',
      value: '3d6',
      damageType: 'poison',
      description: 'Take 3d6 poison damage and possibly become poisoned',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 815,
      name: 'Potion of Resistance',
      type: 'consumable',
      category: 'potion',
      price: 300,
      rarity: 'uncommon',
      weight: 0.5,
      effect: 'buff_resistance',
      description: 'Gain resistance to one damage type for 1 hour',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 816,
      name: 'Potion of Speed',
      type: 'consumable',
      category: 'potion',
      price: 400,
      rarity: 'very rare',
      weight: 0.5,
      effect: 'buff_speed',
      description: 'Gain effects of Haste spell for 1 minute',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 817,
      name: 'Potion of Water Breathing',
      type: 'consumable',
      category: 'potion',
      price: 200,
      rarity: 'uncommon',
      weight: 0.5,
      effect: 'water_breathing',
      description: 'Can breathe underwater for 1 hour',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 818,
      name: 'Potion of Flying',
      type: 'consumable',
      category: 'potion',
      price: 500,
      rarity: 'very rare',
      weight: 0.5,
      effect: 'flying',
      description: 'Gain flying speed of 60 feet for 1 hour',
      usableInCombat: true,
      equipSlot: 'none'
    }
  ],

  // SCROLLS AND MAGIC ITEMS
  scrollsAndMagic: [
    {
      id: 900,
      name: 'Spell Scroll (Cantrip)',
      type: 'consumable',
      category: 'scroll',
      price: 50,
      rarity: 'common',
      weight: 0,
      effect: 'spell',
      description: 'Contains a cantrip, can be cast once',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 901,
      name: 'Spell Scroll (1st Level)',
      type: 'consumable',
      category: 'scroll',
      price: 100,
      rarity: 'common',
      weight: 0,
      effect: 'spell',
      description: 'Contains a 1st-level spell, can be cast once',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 902,
      name: 'Spell Scroll (2nd Level)',
      type: 'consumable',
      category: 'scroll',
      price: 200,
      rarity: 'uncommon',
      weight: 0,
      effect: 'spell',
      description: 'Contains a 2nd-level spell, can be cast once',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 903,
      name: 'Spell Scroll (3rd Level)',
      type: 'consumable',
      category: 'scroll',
      price: 400,
      rarity: 'uncommon',
      weight: 0,
      effect: 'spell',
      description: 'Contains a 3rd-level spell, can be cast once',
      usableInCombat: true,
      equipSlot: 'none'
    },
    {
      id: 904,
      name: 'Wand of Magic Missiles',
      type: 'magic_item',
      category: 'wand',
      price: 1000,
      rarity: 'uncommon',
      weight: 1,
      effect: 'magic_missile',
      value: '3d4+3',
      charges: 7,
      description: '7 charges, cast Magic Missile (3 missiles, 1d4+1 each)',
      usableInCombat: true,
      equipSlot: 'r_hand'
    },
    {
      id: 905,
      name: 'Wand of Web',
      type: 'magic_item',
      category: 'wand',
      price: 1500,
      rarity: 'uncommon',
      weight: 1,
      effect: 'web',
      charges: 7,
      description: '7 charges, cast Web spell',
      usableInCombat: true,
      equipSlot: 'r_hand'
    },
    {
      id: 906,
      name: '+1 Weapon',
      type: 'magic_item',
      category: 'weapon',
      price: 1000,
      rarity: 'uncommon',
      bonus: 1,
      description: 'Any weapon with +1 to attack and damage rolls',
      usableInCombat: false,
      equipSlot: 'r_hand'
    },
    {
      id: 907,
      name: '+1 Armor',
      type: 'magic_item',
      category: 'armor',
      price: 1500,
      rarity: 'rare',
      bonus: 1,
      description: 'Any armor with +1 to AC',
      usableInCombat: false,
      equipSlot: 'armor'
    },
    {
      id: 908,
      name: 'Bag of Holding',
      type: 'magic_item',
      category: 'wondrous',
      price: 4000,
      rarity: 'uncommon',
      weight: 15,
      capacity: '500 pounds/64 cubic feet',
      description: 'Extradimensional storage',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 909,
      name: 'Rope of Climbing',
      type: 'magic_item',
      category: 'wondrous',
      price: 2000,
      rarity: 'uncommon',
      weight: 3,
      description: '60-foot rope that animates on command',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 910,
      name: 'Boots of Elvenkind',
      type: 'magic_item',
      category: 'wondrous',
      price: 2500,
      rarity: 'uncommon',
      description: 'Advantage on Stealth checks to move silently',
      usableInCombat: false,
      equipSlot: 'feet'
    },
    {
      id: 911,
      name: 'Cloak of Elvenkind',
      type: 'magic_item',
      category: 'wondrous',
      price: 5000,
      rarity: 'uncommon',
      description: 'Advantage on Stealth checks to hide',
      usableInCombat: false,
      equipSlot: 'cape'
    },
    {
      id: 912,
      name: 'Gloves of Missile Snaring',
      type: 'magic_item',
      category: 'wondrous',
      price: 3000,
      rarity: 'uncommon',
      description: 'Can catch projectiles',
      usableInCombat: false,
      equipSlot: 'gloves'
    },
    {
      id: 913,
      name: 'Ring of Protection',
      type: 'magic_item',
      category: 'ring',
      price: 3500,
      rarity: 'rare',
      bonus: 1,
      description: '+1 to AC and saving throws',
      usableInCombat: false,
      equipSlot: 'ring1'
    },
    {
      id: 914,
      name: 'Amulet of Health',
      type: 'magic_item',
      category: 'wondrous',
      price: 8000,
      rarity: 'rare',
      description: 'Constitution becomes 19',
      usableInCombat: false,
      equipSlot: 'earrings'
    }
  ],

  // FOOD AND DRINK
  foodAndDrink: [
    {
      id: 1000,
      name: 'Ale (gallon)',
      type: 'consumable',
      category: 'food',
      price: 0.2,
      weight: 1,
      description: 'Common ale',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 1001,
      name: 'Wine, Common (pitcher)',
      type: 'consumable',
      category: 'food',
      price: 0.2,
      weight: 6,
      description: 'Common wine',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 1002,
      name: 'Wine, Fine (bottle)',
      type: 'consumable',
      category: 'food',
      price: 10,
      weight: 1.5,
      description: 'Fine wine',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 1003,
      name: 'Meal, Squalid',
      type: 'consumable',
      category: 'food',
      price: 0.03,
      weight: 0.5,
      description: 'Poor quality meal',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 1004,
      name: 'Meal, Modest',
      type: 'consumable',
      category: 'food',
      price: 0.3,
      weight: 0.5,
      description: 'Decent meal',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 1005,
      name: 'Meal, Comfortable',
      type: 'consumable',
      category: 'food',
      price: 0.5,
      weight: 0.5,
      description: 'Good meal',
      usableInCombat: false,
      equipSlot: 'none'
    },
    {
      id: 1006,
      name: 'Meal, Wealthy',
      type: 'consumable',
      category: 'food',
      price: 2,
      weight: 0.5,
      description: 'Excellent meal',
      usableInCombat: false,
      equipSlot: 'none'
    }
  ]
};

// HELPER FUNCTIONS
function getAllItems() {
  const allItems = [];
  for (const category in items) {
    allItems.push(...items[category]);
  }
  return allItems;
}

function getItemById(id) {
  const allItems = getAllItems();
  return allItems.find(item => item.id === id);
}

function getItemsByCategory(category) {
  return items[category] || [];
}

function getItemsUsableInCombat() {
  return getAllItems().filter(item => item.usableInCombat);
}

function getItemsByPriceRange(minPrice, maxPrice) {
  return getAllItems().filter(item => item.price >= minPrice && item.price <= maxPrice);
}

function getItemsByRarity(rarity) {
  return getAllItems().filter(item => item.rarity === rarity);
}

function getWeapons() {
  return [
    ...items.simpleWeapons,
    ...items.simpleRangedWeapons,
    ...items.martialWeapons,
    ...items.martialRangedWeapons
  ];
}

function getArmor() {
  return [
    ...items.lightArmor,
    ...items.mediumArmor,
    ...items.heavyArmor,
    ...items.shields
  ];
}

function getStartingItems(characterClass) {
  // Starting inventory based on class - clone items with unique IDs
  const cloneItem = (item) => {
    if (!item) return null;
    return { ...item, id: Date.now() + Math.random() };
  };

  const startingInventories = {
    'Fighter': [
      cloneItem(getItemById(207)), // Longsword
      cloneItem(getItemById(330)), // Shield
      cloneItem(getItemById(321)), // Chain Mail
      cloneItem(getItemById(1)),   // Potion of Healing
      cloneItem(getItemById(500)), // Backpack
      cloneItem(getItemById(510))  // Rations
    ],
    'Wizard': [
      cloneItem(getItemById(107)), // Quarterstaff
      cloneItem(getItemById(901)), // Spell Scroll (1st Level)
      cloneItem(getItemById(1)),   // Potion of Healing
      cloneItem(getItemById(500)), // Backpack
      cloneItem(getItemById(510)), // Rations
      cloneItem(getItemById(608))  // Calligrapher's Supplies
    ],
    'Rogue': [
      cloneItem(getItemById(213)), // Shortsword
      cloneItem(getItemById(101)), // Dagger
      cloneItem(getItemById(302)), // Studded Leather
      cloneItem(getItemById(600)), // Thieves' Tools
      cloneItem(getItemById(1)),   // Potion of Healing
      cloneItem(getItemById(500))  // Backpack
    ],
    'Cleric': [
      cloneItem(getItemById(106)), // Mace
      cloneItem(getItemById(330)), // Shield
      cloneItem(getItemById(311)), // Chain Shirt
      cloneItem(getItemById(702)), // Holy Water
      cloneItem(getItemById(2)),   // Potion of Greater Healing
      cloneItem(getItemById(500))  // Backpack
    ],
    'Barbarian': [
      cloneItem(getItemById(204)), // Greatsword
      cloneItem(getItemById(103)), // Handaxe
      cloneItem(getItemById(103)), // Handaxe (second)
      cloneItem(getItemById(1)),   // Potion of Healing
      cloneItem(getItemById(500)), // Backpack
      cloneItem(getItemById(104))  // Javelin
    ],
    'Ranger': [
      cloneItem(getItemById(253)), // Longbow
      cloneItem(getItemById(400)), // Arrows
      cloneItem(getItemById(213)), // Shortsword
      cloneItem(getItemById(302)), // Studded Leather
      cloneItem(getItemById(1)),   // Potion of Healing
      cloneItem(getItemById(500))  // Backpack
    ],
    'Paladin': [
      cloneItem(getItemById(207)), // Longsword
      cloneItem(getItemById(330)), // Shield
      cloneItem(getItemById(321)), // Chain Mail
      cloneItem(getItemById(702)), // Holy Water
      cloneItem(getItemById(2)),   // Potion of Greater Healing
      cloneItem(getItemById(500))  // Backpack
    ],
    'Warlock': [
      cloneItem(getItemById(101)), // Dagger
      cloneItem(getItemById(301)), // Leather Armor
      cloneItem(getItemById(1)),   // Potion of Healing
      cloneItem(getItemById(800)), // Potion of Climbing
      cloneItem(getItemById(500))  // Backpack
    ],
    'Monk': [
      cloneItem(getItemById(107)), // Quarterstaff
      cloneItem(getItemById(151)), // Dart (x10)
      cloneItem(getItemById(1)),   // Potion of Healing
      cloneItem(getItemById(500)), // Backpack
      cloneItem(getItemById(502))  // Rope
    ],
    'Bard': [
      cloneItem(getItemById(211)), // Rapier
      cloneItem(getItemById(101)), // Dagger
      cloneItem(getItemById(301)), // Leather Armor
      cloneItem(getItemById(1)),   // Potion of Healing
      cloneItem(getItemById(500))  // Backpack
    ],
    'Druid': [
      cloneItem(getItemById(107)), // Quarterstaff
      cloneItem(getItemById(310)), // Hide Armor
      cloneItem(getItemById(2)),   // Potion of Greater Healing
      cloneItem(getItemById(603)), // Herbalism Kit
      cloneItem(getItemById(500))  // Backpack
    ],
    'Sorcerer': [
      cloneItem(getItemById(101)), // Dagger
      cloneItem(getItemById(1)),   // Potion of Healing
      cloneItem(getItemById(802)), // Potion of Fire Breath
      cloneItem(getItemById(500)), // Backpack
      cloneItem(getItemById(901))  // Spell Scroll (1st Level)
    ]
  };

  return (startingInventories[characterClass] || [cloneItem(getItemById(1)), cloneItem(getItemById(500))]).filter(item => item !== null);
}

module.exports = {
  items,
  getAllItems,
  getItemById,
  getItemsByCategory,
  getItemsUsableInCombat,
  getItemsByPriceRange,
  getItemsByRarity,
  getWeapons,
  getArmor,
  getStartingItems
};