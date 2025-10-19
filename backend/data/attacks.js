// Comprehensive attack and spell database for all D&D 5e classes
// Levels 1-20 with multiclassing support

const classAttacks = {
  Fighter: {
    1: [
      {
        name: 'Basic Attack',
        type: 'physical',
        damage: '1d8+STR',
        description: 'A standard melee weapon attack',
        secondaryEffect: null
      },
      {
        name: 'Second Wind',
        type: 'ability',
        damage: '1d10+level',
        description: 'Regain hit points as a bonus action',
        secondaryEffect: 'heal'
      }
    ],
    2: [
      {
        name: 'Action Surge Strike',
        type: 'physical',
        damage: '2d8+STR',
        description: 'Make an additional attack this turn',
        secondaryEffect: null
      }
    ],
    3: [
      {
        name: 'Improved Strike',
        type: 'physical',
        damage: '1d10+STR',
        description: 'Enhanced weapon attack with better damage',
        secondaryEffect: null
      },
      {
        name: 'Battle Master: Trip Attack',
        type: 'physical',
        damage: '1d10+STR+1d8',
        description: 'Attack that can knock target prone',
        secondaryEffect: 'prone_chance'
      }
    ],
    5: [
      {
        name: 'Extra Attack',
        type: 'physical',
        damage: '2d8+STR',
        description: 'Make two attacks in one action',
        secondaryEffect: null
      }
    ],
    7: [
      {
        name: 'Devastating Strike',
        type: 'physical',
        damage: '2d10+STR',
        description: 'Powerful attack with increased damage',
        secondaryEffect: null
      }
    ],
    9: [
      {
        name: 'Indomitable Strike',
        type: 'physical',
        damage: '2d12+STR',
        description: 'Can reroll a failed save',
        secondaryEffect: 'reroll_save'
      }
    ],
    11: [
      {
        name: 'Triple Strike',
        type: 'physical',
        damage: '3d8+STR',
        description: 'Make three attacks in one action',
        secondaryEffect: null
      }
    ],
    15: [
      {
        name: 'Master Strike',
        type: 'physical',
        damage: '3d10+STR',
        description: 'Expert combat technique',
        secondaryEffect: null
      }
    ],
    20: [
      {
        name: 'Legendary Strike',
        type: 'physical',
        damage: '4d12+STR',
        description: 'Ultimate physical attack',
        secondaryEffect: 'critical'
      }
    ]
  },
  
  Wizard: {
    1: [
      {
        name: 'Magic Missile',
        type: 'magic',
        damage: '3d4+3',
        description: 'Three darts of magical force that never miss',
        secondaryEffect: 'auto_hit'
      },
      {
        name: 'Burning Hands',
        type: 'magic',
        damage: '3d6',
        description: 'Cone of fire',
        secondaryEffect: 'area'
      },
      {
        name: 'Ray of Frost',
        type: 'magic',
        damage: '1d8',
        description: 'Ray of cold energy',
        secondaryEffect: 'slow'
      }
    ],
    2: [
      {
        name: 'Scorching Ray',
        type: 'magic',
        damage: '6d6',
        description: 'Three rays of fire',
        secondaryEffect: null
      }
    ],
    3: [
      {
        name: 'Fireball',
        type: 'magic',
        damage: '8d6',
        description: 'Explosive sphere of flame',
        secondaryEffect: 'area'
      },
      {
        name: 'Lightning Bolt',
        type: 'magic',
        damage: '8d6',
        description: 'Line of lightning',
        secondaryEffect: 'area'
      }
    ],
    5: [
      {
        name: 'Cone of Cold',
        type: 'magic',
        damage: '8d8',
        description: 'Blast of freezing cold',
        secondaryEffect: 'freeze_chance'
      },
      {
        name: 'Cloudkill',
        type: 'magic',
        damage: '5d8',
        description: 'Poisonous cloud',
        secondaryEffect: 'poison_dot'
      }
    ],
    7: [
      {
        name: 'Chain Lightning',
        type: 'magic',
        damage: '10d8',
        description: 'Lightning that jumps between targets',
        secondaryEffect: 'chain'
      },
      {
        name: 'Disintegrate',
        type: 'magic',
        damage: '10d6+40',
        description: 'Reduce target to dust',
        secondaryEffect: 'instant_kill_low_hp'
      }
    ],
    9: [
      {
        name: 'Meteor Swarm',
        type: 'magic',
        damage: '40d6',
        description: 'Four meteors crash down',
        secondaryEffect: 'massive_area'
      },
      {
        name: 'Power Word Kill',
        type: 'magic',
        damage: 'instant',
        description: 'Kill creature with 100hp or less',
        secondaryEffect: 'instant_kill'
      }
    ],
    11: [
      {
        name: 'Delayed Blast Fireball',
        type: 'magic',
        damage: '12d6',
        description: 'Fireball that grows more powerful',
        secondaryEffect: 'delayed_damage'
      }
    ],
    13: [
      {
        name: 'Prismatic Spray',
        type: 'magic',
        damage: '10d6',
        description: 'Random magical effects',
        secondaryEffect: 'random_effect'
      }
    ],
    17: [
      {
        name: 'Wish',
        type: 'magic',
        damage: 'variable',
        description: 'Reality-altering magic',
        secondaryEffect: 'ultimate'
      }
    ]
  },
  
  Rogue: {
    1: [
      {
        name: 'Sneak Attack',
        type: 'physical',
        damage: '1d6+DEX+1d6',
        description: 'Extra damage when you have advantage',
        secondaryEffect: 'advantage_bonus'
      },
      {
        name: 'Backstab',
        type: 'physical',
        damage: '1d8+DEX',
        description: 'Strike from shadows',
        secondaryEffect: null
      }
    ],
    3: [
      {
        name: 'Improved Sneak Attack',
        type: 'physical',
        damage: '1d6+DEX+2d6',
        description: 'Enhanced sneak attack',
        secondaryEffect: 'advantage_bonus'
      },
      {
        name: 'Assassinate',
        type: 'physical',
        damage: '2d8+DEX',
        description: 'Critical hit on surprised enemies',
        secondaryEffect: 'surprise_crit'
      }
    ],
    5: [
      {
        name: 'Advanced Sneak Attack',
        type: 'physical',
        damage: '1d6+DEX+3d6',
        description: 'More deadly sneak attack',
        secondaryEffect: 'advantage_bonus'
      },
      {
        name: 'Uncanny Dodge',
        type: 'ability',
        damage: '0',
        description: 'Halve damage from an attack',
        secondaryEffect: 'defensive'
      }
    ],
    7: [
      {
        name: 'Master Sneak Attack',
        type: 'physical',
        damage: '1d6+DEX+4d6',
        description: 'Expert sneak attack',
        secondaryEffect: 'advantage_bonus'
      },
      {
        name: 'Evasion Strike',
        type: 'physical',
        damage: '2d8+DEX',
        description: 'Attack while evading',
        secondaryEffect: 'dodge_bonus'
      }
    ],
    9: [
      {
        name: 'Supreme Sneak Attack',
        type: 'physical',
        damage: '1d6+DEX+5d6',
        description: 'Devastating sneak attack',
        secondaryEffect: 'advantage_bonus'
      }
    ],
    11: [
      {
        name: 'Legendary Sneak Attack',
        type: 'physical',
        damage: '1d6+DEX+6d6',
        description: 'Legendary precision',
        secondaryEffect: 'advantage_bonus'
      }
    ],
    13: [
      {
        name: 'Death Strike',
        type: 'physical',
        damage: '3d10+DEX+7d6',
        description: 'Potentially lethal strike',
        secondaryEffect: 'double_damage_save'
      }
    ],
    17: [
      {
        name: 'Ultimate Sneak Attack',
        type: 'physical',
        damage: '1d6+DEX+9d6',
        description: 'Peak assassination technique',
        secondaryEffect: 'advantage_bonus'
      }
    ],
    20: [
      {
        name: 'Perfect Strike',
        type: 'physical',
        damage: '1d6+DEX+10d6',
        description: 'Flawless execution',
        secondaryEffect: 'critical'
      }
    ]
  },
  
  Cleric: {
    1: [
      {
        name: 'Sacred Flame',
        type: 'magic',
        damage: '1d8',
        description: 'Radiant damage that ignores cover',
        secondaryEffect: 'ignores_armor'
      },
      {
        name: 'Cure Wounds',
        type: 'magic',
        damage: '1d8+WIS',
        description: 'Heal an ally',
        secondaryEffect: 'heal'
      },
      {
        name: 'Guiding Bolt',
        type: 'magic',
        damage: '4d6',
        description: 'Attack that grants advantage',
        secondaryEffect: 'grant_advantage'
      }
    ],
    3: [
      {
        name: 'Spiritual Weapon',
        type: 'magic',
        damage: '1d8+WIS',
        description: 'Create a floating weapon',
        secondaryEffect: 'bonus_action'
      },
      {
        name: 'Prayer of Healing',
        type: 'magic',
        damage: '2d8+WIS',
        description: 'Heal multiple allies',
        secondaryEffect: 'heal_multi'
      }
    ],
    5: [
      {
        name: 'Spirit Guardians',
        type: 'magic',
        damage: '3d8',
        description: 'Spectral guardians damage nearby enemies',
        secondaryEffect: 'aura_damage'
      },
      {
        name: 'Revivify',
        type: 'magic',
        damage: '0',
        description: 'Bring an ally back to life',
        secondaryEffect: 'resurrect'
      }
    ],
    7: [
      {
        name: 'Divine Strike',
        type: 'physical',
        damage: '2d8+WIS+1d8',
        description: 'Weapon attack with divine energy',
        secondaryEffect: 'radiant_bonus'
      },
      {
        name: 'Guardian of Faith',
        type: 'magic',
        damage: '20d8',
        description: 'Spectral guardian protects an area',
        secondaryEffect: 'zone_control'
      }
    ],
    9: [
      {
        name: 'Flame Strike',
        type: 'magic',
        damage: '8d6',
        description: 'Column of divine fire',
        secondaryEffect: 'area'
      },
      {
        name: 'Mass Cure Wounds',
        type: 'magic',
        damage: '3d8+WIS',
        description: 'Heal all nearby allies',
        secondaryEffect: 'heal_party'
      }
    ],
    11: [
      {
        name: 'Blade Barrier',
        type: 'magic',
        damage: '6d10',
        description: 'Wall of whirling blades',
        secondaryEffect: 'wall'
      }
    ],
    13: [
      {
        name: 'Divine Word',
        type: 'magic',
        damage: 'special',
        description: 'Powerful word that can banish or kill',
        secondaryEffect: 'banish'
      }
    ],
    17: [
      {
        name: 'Holy Aura',
        type: 'magic',
        damage: '0',
        description: 'Powerful protective aura',
        secondaryEffect: 'party_buff'
      }
    ],
    20: [
      {
        name: 'Divine Intervention',
        type: 'magic',
        damage: 'variable',
        description: 'Call upon your deity directly',
        secondaryEffect: 'ultimate'
      }
    ]
  },
  
  Barbarian: {
    1: [
      {
        name: 'Rage Strike',
        type: 'physical',
        damage: '1d12+STR+2',
        description: 'Powerful attack while raging',
        secondaryEffect: 'rage_bonus'
      },
      {
        name: 'Reckless Attack',
        type: 'physical',
        damage: '1d12+STR',
        description: 'Attack with advantage but enemies get advantage against you',
        secondaryEffect: 'reckless'
      }
    ],
    2: [
      {
        name: 'Danger Sense Strike',
        type: 'physical',
        damage: '1d12+STR',
        description: 'Attack with enhanced reflexes',
        secondaryEffect: 'dex_save_bonus'
      }
    ],
    3: [
      {
        name: 'Primal Strike',
        type: 'physical',
        damage: '2d12+STR+2',
        description: 'Unleash primal fury',
        secondaryEffect: 'rage_bonus'
      },
      {
        name: 'Totem Warrior: Bear Strike',
        type: 'physical',
        damage: '2d10+STR',
        description: 'Attack with bear-like strength',
        secondaryEffect: 'resistance'
      }
    ],
    5: [
      {
        name: 'Furious Strike',
        type: 'physical',
        damage: '2d12+STR+2',
        description: 'Extra attack while raging',
        secondaryEffect: 'extra_attack'
      },
      {
        name: 'Fast Movement Strike',
        type: 'physical',
        damage: '2d8+STR',
        description: 'Quick charging attack',
        secondaryEffect: 'mobility'
      }
    ],
    7: [
      {
        name: 'Feral Instinct Strike',
        type: 'physical',
        damage: '3d10+STR+2',
        description: 'Instinctive powerful attack',
        secondaryEffect: 'initiative_bonus'
      }
    ],
    9: [
      {
        name: 'Brutal Critical',
        type: 'physical',
        damage: '3d12+STR+1d12',
        description: 'Enhanced critical hits',
        secondaryEffect: 'improved_crit'
      },
      {
        name: 'Intimidating Strike',
        type: 'physical',
        damage: '2d12+STR',
        description: 'Attack that may frighten',
        secondaryEffect: 'frighten'
      }
    ],
    11: [
      {
        name: 'Relentless Strike',
        type: 'physical',
        damage: '3d12+STR+3',
        description: 'Unstoppable attack',
        secondaryEffect: 'cant_be_stopped'
      }
    ],
    13: [
      {
        name: 'Devastating Critical',
        type: 'physical',
        damage: '4d12+STR+2d12',
        description: 'Extremely deadly critical',
        secondaryEffect: 'brutal_crit'
      }
    ],
    15: [
      {
        name: 'Persistent Rage Strike',
        type: 'physical',
        damage: '4d12+STR+3',
        description: 'Attack that extends rage',
        secondaryEffect: 'extend_rage'
      }
    ],
    17: [
      {
        name: 'Supreme Critical',
        type: 'physical',
        damage: '5d12+STR+3d12',
        description: 'Ultimate critical damage',
        secondaryEffect: 'supreme_crit'
      }
    ],
    20: [
      {
        name: 'Primal Champion Strike',
        type: 'physical',
        damage: '6d12+STR+4',
        description: 'Peak of barbarian power',
        secondaryEffect: 'stat_boost'
      }
    ]
  },
  
  Ranger: {
    1: [
      {
        name: 'Hunter\'s Mark Shot',
        type: 'physical',
        damage: '1d8+DEX+1d6',
        description: 'Mark your prey for extra damage',
        secondaryEffect: 'mark'
      },
      {
        name: 'Longbow Shot',
        type: 'physical',
        damage: '1d8+DEX',
        description: 'Standard ranged attack',
        secondaryEffect: null
      }
    ],
    2: [
      {
        name: 'Hail of Thorns',
        type: 'physical',
        damage: '1d8+DEX+1d10',
        description: 'Arrow explodes into thorns',
        secondaryEffect: 'area_small'
      }
    ],
    3: [
      {
        name: 'Lightning Arrow',
        type: 'magic',
        damage: '4d8',
        description: 'Arrow becomes lightning',
        secondaryEffect: 'area_line'
      },
      {
        name: 'Hunter: Colossus Slayer',
        type: 'physical',
        damage: '1d8+DEX+1d8',
        description: 'Extra damage to wounded enemies',
        secondaryEffect: 'execute'
      }
    ],
    5: [
      {
        name: 'Conjure Barrage',
        type: 'physical',
        damage: '3d8',
        description: 'Fire multiple projectiles',
        secondaryEffect: 'cone'
      },
      {
        name: 'Extra Attack Shot',
        type: 'physical',
        damage: '2d8+DEX',
        description: 'Fire two arrows',
        secondaryEffect: null
      }
    ],
    7: [
      {
        name: 'Steel Wind Strike',
        type: 'magic',
        damage: '6d10',
        description: 'Strike multiple enemies instantly',
        secondaryEffect: 'multi_target'
      }
    ],
    9: [
      {
        name: 'Swift Quiver',
        type: 'physical',
        damage: '4d8+DEX',
        description: 'Make two extra attacks',
        secondaryEffect: 'bonus_attacks'
      },
      {
        name: 'Conjure Volley',
        type: 'physical',
        damage: '8d8',
        description: 'Rain of projectiles',
        secondaryEffect: 'massive_area'
      }
    ],
    11: [
      {
        name: 'Whirlwind Attack',
        type: 'physical',
        damage: '3d8+DEX',
        description: 'Attack all nearby enemies',
        secondaryEffect: 'all_nearby'
      }
    ],
    13: [
      {
        name: 'Seeker Arrow',
        type: 'physical',
        damage: '4d8+DEX',
        description: 'Arrow that never misses',
        secondaryEffect: 'auto_hit'
      }
    ],
    17: [
      {
        name: 'Arrow Storm',
        type: 'physical',
        damage: '10d8',
        description: 'Devastating barrage',
        secondaryEffect: 'ultimate_area'
      }
    ],
    20: [
      {
        name: 'Foe Slayer',
        type: 'physical',
        damage: '5d8+DEX+WIS',
        description: 'Perfect shot against your favored enemy',
        secondaryEffect: 'favored_bonus'
      }
    ]
  },
  
  Paladin: {
    1: [
      {
        name: 'Divine Smite',
        type: 'magic',
        damage: '1d8+STR+2d8',
        description: 'Strike with divine power',
        secondaryEffect: 'radiant'
      },
      {
        name: 'Lay on Hands',
        type: 'magic',
        damage: '0',
        description: 'Heal yourself or an ally',
        secondaryEffect: 'heal'
      }
    ],
    2: [
      {
        name: 'Thunderous Smite',
        type: 'magic',
        damage: '1d8+STR+2d6',
        description: 'Smite that can knock prone',
        secondaryEffect: 'knockback'
      },
      {
        name: 'Wrathful Smite',
        type: 'magic',
        damage: '1d8+STR+1d6',
        description: 'Smite that frightens',
        secondaryEffect: 'frighten'
      }
    ],
    3: [
      {
        name: 'Improved Divine Smite',
        type: 'magic',
        damage: '1d8+STR+3d8',
        description: 'Enhanced divine power',
        secondaryEffect: 'radiant'
      },
      {
        name: 'Aura of Protection Strike',
        type: 'physical',
        damage: '2d8+STR',
        description: 'Attack while protecting allies',
        secondaryEffect: 'aura_buff'
      }
    ],
    5: [
      {
        name: 'Banishing Smite',
        type: 'magic',
        damage: '5d10',
        description: 'Smite that can banish',
        secondaryEffect: 'banish_chance'
      },
      {
        name: 'Extra Attack Smite',
        type: 'magic',
        damage: '2d8+STR+2d8',
        description: 'Two attacks with divine power',
        secondaryEffect: 'radiant'
      }
    ],
    7: [
      {
        name: 'Aura Strike',
        type: 'magic',
        damage: '2d8+STR+2d8',
        description: 'Attack with protective aura',
        secondaryEffect: 'party_defense'
      }
    ],
    9: [
      {
        name: 'Destructive Wave',
        type: 'magic',
        damage: '5d6',
        description: 'Wave of divine energy',
        secondaryEffect: 'area_knockdown'
      }
    ],
    11: [
      {
        name: 'Radiant Soul Strike',
        type: 'magic',
        damage: '3d8+STR+3d8+CHA',
        description: 'Ultimate divine smite',
        secondaryEffect: 'radiant_massive'
      }
    ],
    13: [
      {
        name: 'Holy Weapon',
        type: 'magic',
        damage: '3d8+STR+2d8',
        description: 'Weapon glows with holy light',
        secondaryEffect: 'blind_nearby'
      }
    ],
    17: [
      {
        name: 'Avenging Angel Strike',
        type: 'magic',
        damage: '4d8+STR+4d8',
        description: 'Strike with angelic fury',
        secondaryEffect: 'frighten_area'
      }
    ],
    20: [
      {
        name: 'Divine Champion',
        type: 'magic',
        damage: '5d8+STR+5d8',
        description: 'Peak of divine power',
        secondaryEffect: 'ultimate_smite'
      }
    ]
  },
  
  Warlock: {
    1: [
      {
        name: 'Eldritch Blast',
        type: 'magic',
        damage: '1d10',
        description: 'Beam of crackling energy',
        secondaryEffect: null
      },
      {
        name: 'Hex',
        type: 'magic',
        damage: '1d6',
        description: 'Curse an enemy for extra damage',
        secondaryEffect: 'curse'
      },
      {
        name: 'Arms of Hadar',
        type: 'magic',
        damage: '2d6',
        description: 'Tendrils of dark energy',
        secondaryEffect: 'area_small'
      }
    ],
    2: [
      {
        name: 'Agonizing Blast',
        type: 'magic',
        damage: '1d10+CHA',
        description: 'Enhanced eldritch blast',
        secondaryEffect: null
      }
    ],
    3: [
      {
        name: 'Hunger of Hadar',
        type: 'magic',
        damage: '2d6',
        description: 'Summon void that damages over time',
        secondaryEffect: 'area_dot'
      },
      {
        name: 'Vampiric Touch',
        type: 'magic',
        damage: '3d6',
        description: 'Drain life from target',
        secondaryEffect: 'lifesteal'
      }
    ],
    5: [
      {
        name: 'Synaptic Static',
        type: 'magic',
        damage: '8d6',
        description: 'Psychic explosion',
        secondaryEffect: 'confuse'
      },
      {
        name: 'Shadow of Moil',
        type: 'magic',
        damage: '2d8',
        description: 'Shroud yourself in shadow',
        secondaryEffect: 'defensive_damage'
      }
    ],
    7: [
      {
        name: 'Crown of Stars',
        type: 'magic',
        damage: '4d12',
        description: 'Hurl stars at enemies',
        secondaryEffect: 'multi_use'
      },
      {
        name: 'Forcecage',
        type: 'magic',
        damage: '0',
        description: 'Trap enemy in force',
        secondaryEffect: 'immobilize'
      }
    ],
    9: [
      {
        name: 'Power Word Pain',
        type: 'magic',
        damage: '0',
        description: 'Inflict extreme pain',
        secondaryEffect: 'debilitate'
      },
      {
        name: 'Maddening Darkness',
        type: 'magic',
        damage: '8d8',
        description: 'Darkness that drives insane',
        secondaryEffect: 'madness'
      }
    ],
    11: [
      {
        name: 'Psychic Scream',
        type: 'magic',
        damage: '14d6',
        description: 'Devastating psychic attack',
        secondaryEffect: 'stun_chance'
      }
    ],
    13: [
      {
        name: 'Reality Break',
        type: 'magic',
        damage: '10d12',
        description: 'Shatter reality around target',
        secondaryEffect: 'random_chaos'
      }
    ],
    17: [
      {
        name: 'Blade of Disaster',
        type: 'magic',
        damage: '4d12',
        description: 'Summon a blade that crits easily',
        secondaryEffect: 'crit_easy'
      }
    ],
    20: [
      {
        name: 'Mystic Arcanum',
        type: 'magic',
        damage: 'variable',
        description: 'Ultimate warlock spell',
        secondaryEffect: 'ultimate'
      }
    ]
  },
  
  Monk: {
    1: [
      {
        name: 'Flurry of Blows',
        type: 'physical',
        damage: '4d6+DEX',
        description: 'Rapid series of strikes',
        secondaryEffect: 'multi_hit'
      },
      {
        name: 'Martial Arts Strike',
        type: 'physical',
        damage: '1d6+DEX',
        description: 'Unarmed strike',
        secondaryEffect: null
      }
    ],
    2: [
      {
        name: 'Ki Strike',
        type: 'physical',
        damage: '1d6+DEX',
        description: 'Chi-empowered attack',
        secondaryEffect: 'magical'
      },
      {
        name: 'Patient Defense Counter',
        type: 'physical',
        damage: '2d6+DEX',
        description: 'Defensive strike',
        secondaryEffect: 'dodge_bonus'
      }
    ],
    3: [
      {
        name: 'Open Hand Technique',
        type: 'physical',
        damage: '2d6+DEX',
        description: 'Strike that can knockdown',
        secondaryEffect: 'knockdown'
      },
      {
        name: 'Shadow Step Strike',
        type: 'physical',
        damage: '2d6+DEX',
        description: 'Teleport and strike',
        secondaryEffect: 'teleport_strike'
      }
    ],
    5: [
      {
        name: 'Stunning Strike',
        type: 'physical',
        damage: '2d8+DEX',
        description: 'Strike that can stun',
        secondaryEffect: 'stun'
      },
      {
        name: 'Extra Attack Flurry',
        type: 'physical',
        damage: '6d6+DEX',
        description: 'More attacks per turn',
        secondaryEffect: 'extra_attacks'
      }
    ],
    7: [
      {
        name: 'Stillness of Mind Strike',
        type: 'physical',
        damage: '2d8+DEX',
        description: 'Focused attack',
        secondaryEffect: 'charm_immune'
      },
      {
        name: 'Evasion Strike',
        type: 'physical',
        damage: '3d8+DEX',
        description: 'Attack while evading',
        secondaryEffect: 'no_damage_on_save'
      }
    ],
    9: [
      {
        name: 'Unarmored Movement Strike',
        type: 'physical',
        damage: '3d8+DEX',
        description: 'Swift attack',
        secondaryEffect: 'wall_run'
      }
    ],
    11: [
      {
        name: 'Quivering Palm',
        type: 'physical',
        damage: '10d10',
        description: 'Delayed deadly strike',
        secondaryEffect: 'delayed_death'
      }
    ],
    13: [
      {
        name: 'Diamond Soul Strike',
        type: 'physical',
        damage: '4d8+DEX',
        description: 'Perfected technique',
        secondaryEffect: 'save_reroll'
      }
    ],
    17: [
      {
        name: 'Empty Body Strike',
        type: 'physical',
        damage: '5d8+DEX',
        description: 'Strike while invisible',
        secondaryEffect: 'invisibility'
      }
    ],
    20: [
      {
        name: 'Perfect Self',
        type: 'physical',
        damage: '6d10+DEX',
        description: 'Ultimate monk technique',
        secondaryEffect: 'perfect'
      }
    ]
  },
  
  Bard: {
    1: [
      {
        name: 'Vicious Mockery',
        type: 'magic',
        damage: '1d4',
        description: 'Insult that damages and debuffs',
        secondaryEffect: 'disadvantage'
      },
      {
        name: 'Thunderwave',
        type: 'magic',
        damage: '2d8',
        description: 'Wave of thunder',
        secondaryEffect: 'pushback'
      },
      {
        name: 'Healing Word',
        type: 'magic',
        damage: '1d4+CHA',
        description: 'Quick healing spell',
        secondaryEffect: 'heal'
      }
    ],
    2: [
      {
        name: 'Heat Metal',
        type: 'magic',
        damage: '2d8',
        description: 'Make metal searing hot',
        secondaryEffect: 'dot'
      },
      {
        name: 'Shatter',
        type: 'magic',
        damage: '3d8',
        description: 'Sonic explosion',
        secondaryEffect: 'area'
      }
    ],
    3: [
      {
        name: 'Hypnotic Pattern',
        type: 'magic',
        damage: '0',
        description: 'Mesmerize enemies',
        secondaryEffect: 'charm_area'
      },
      {
        name: 'Fear Song',
        type: 'magic',
        damage: '0',
        description: 'Terrify enemies',
        secondaryEffect: 'fear'
      }
    ],
    5: [
      {
        name: 'Greater Invisibility',
        type: 'magic',
        damage: '0',
        description: 'Turn invisible while attacking',
        secondaryEffect: 'invisibility_combat'
      },
      {
        name: 'Confusion',
        type: 'magic',
        damage: '0',
        description: 'Confuse enemies',
        secondaryEffect: 'confuse_area'
      }
    ],
    7: [
      {
        name: 'Forcecage Song',
        type: 'magic',
        damage: '0',
        description: 'Trap enemies',
        secondaryEffect: 'cage'
      }
    ],
    9: [
      {
        name: 'Power Word Heal',
        type: 'magic',
        damage: '0',
        description: 'Fully heal an ally',
        secondaryEffect: 'full_heal'
      },
      {
        name: 'Dominate Monster',
        type: 'magic',
        damage: '0',
        description: 'Control an enemy',
        secondaryEffect: 'dominate'
      }
    ],
    11: [
      {
        name: 'Otto\'s Irresistible Dance',
        type: 'magic',
        damage: '0',
        description: 'Force enemy to dance',
        secondaryEffect: 'incapacitate'
      }
    ],
    13: [
      {
        name: 'Power Word Stun',
        type: 'magic',
        damage: '0',
        description: 'Stun an enemy',
        secondaryEffect: 'stun_powerful'
      }
    ],
    17: [
      {
        name: 'True Polymorph',
        type: 'magic',
        damage: 'variable',
        description: 'Transform anything',
        secondaryEffect: 'transform'
      }
    ],
    20: [
      {
        name: 'Superior Inspiration',
        type: 'magic',
        damage: '0',
        description: 'Ultimate bardic magic',
        secondaryEffect: 'ultimate_buff'
      }
    ]
  },
  
  Druid: {
    1: [
      {
        name: 'Produce Flame',
        type: 'magic',
        damage: '1d8',
        description: 'Hurl flame at enemy',
        secondaryEffect: null
      },
      {
        name: 'Entangle',
        type: 'magic',
        damage: '0',
        description: 'Restrain with plants',
        secondaryEffect: 'restrain'
      },
      {
        name: 'Wild Shape Strike',
        type: 'physical',
        damage: '1d8+WIS',
        description: 'Attack in animal form',
        secondaryEffect: 'shape_shift'
      }
    ],
    2: [
      {
        name: 'Moonbeam',
        type: 'magic',
        damage: '2d10',
        description: 'Beam of silvery light',
        secondaryEffect: 'area_move'
      },
      {
        name: 'Flaming Sphere',
        type: 'magic',
        damage: '2d6',
        description: 'Rolling ball of fire',
        secondaryEffect: 'mobile_area'
      }
    ],
    3: [
      {
        name: 'Call Lightning',
        type: 'magic',
        damage: '3d10',
        description: 'Strike with lightning',
        secondaryEffect: 'repeat_use'
      },
      {
        name: 'Conjure Animals',
        type: 'magic',
        damage: '2d8',
        description: 'Summon beasts to fight',
        secondaryEffect: 'summon'
      }
    ],
    5: [
      {
        name: 'Insect Plague',
        type: 'magic',
        damage: '4d10',
        description: 'Swarm of insects',
        secondaryEffect: 'area_dot'
      },
      {
        name: 'Conjure Elemental',
        type: 'magic',
        damage: '3d8',
        description: 'Summon an elemental',
        secondaryEffect: 'summon_powerful'
      }
    ],
    7: [
      {
        name: 'Fire Storm',
        type: 'magic',
        damage: '7d10',
        description: 'Roaring flames',
        secondaryEffect: 'massive_area'
      },
      {
        name: 'Whirlwind',
        type: 'magic',
        damage: '10d6',
        description: 'Violent whirlwind',
        secondaryEffect: 'pull_in'
      }
    ],
    9: [
      {
        name: 'Storm of Vengeance',
        type: 'magic',
        damage: '2d6',
        description: 'Massive storm',
        secondaryEffect: 'multi_turn_massive'
      },
      {
        name: 'Shapechange',
        type: 'magic',
        damage: 'variable',
        description: 'Become a powerful creature',
        secondaryEffect: 'ultimate_shift'
      }
    ],
    11: [
      {
        name: 'Sunburst',
        type: 'magic',
        damage: '12d6',
        description: 'Brilliant radiance',
        secondaryEffect: 'blind'
      }
    ],
    13: [
      {
        name: 'Tsunami',
        type: 'magic',
        damage: '30d10',
        description: 'Massive wave',
        secondaryEffect: 'knockdown_area'
      }
    ],
    17: [
      {
        name: 'True Resurrection',
        type: 'magic',
        damage: '0',
        description: 'Bring back the dead',
        secondaryEffect: 'resurrect_full'
      }
    ],
    20: [
      {
        name: 'Archdruid',
        type: 'magic',
        damage: 'variable',
        description: 'Peak druidic power',
        secondaryEffect: 'unlimited_wild_shape'
      }
    ]
  },
  
  Sorcerer: {
    1: [
      {
        name: 'Chaos Bolt',
        type: 'magic',
        damage: '2d8+1d6',
        description: 'Chaotic elemental damage',
        secondaryEffect: 'chain_maybe'
      },
      {
        name: 'Chromatic Orb',
        type: 'magic',
        damage: '3d8',
        description: 'Sphere of elemental energy',
        secondaryEffect: 'element_choice'
      }
    ],
    2: [
      {
        name: 'Twinned Spell Strike',
        type: 'magic',
        damage: '3d8',
        description: 'Hit two targets',
        secondaryEffect: 'twin'
      }
    ],
    3: [
      {
        name: 'Empowered Fireball',
        type: 'magic',
        damage: '10d6',
        description: 'Enhanced fireball',
        secondaryEffect: 'reroll_damage'
      },
      {
        name: 'Quickened Lightning Bolt',
        type: 'magic',
        damage: '8d6',
        description: 'Fast-cast lightning',
        secondaryEffect: 'bonus_action'
      }
    ],
    5: [
      {
        name: 'Cone of Cold',
        type: 'magic',
        damage: '8d8',
        description: 'Freezing cone',
        secondaryEffect: 'slow'
      }
    ],
    7: [
      {
        name: 'Chain Lightning',
        type: 'magic',
        damage: '10d8',
        description: 'Lightning that chains',
        secondaryEffect: 'multi_target'
      }
    ],
    9: [
      {
        name: 'Meteor Swarm',
        type: 'magic',
        damage: '40d6',
        description: 'Multiple meteors',
        secondaryEffect: 'multi_area'
      }
    ],
    11: [
      {
        name: 'Sunburst',
        type: 'magic',
        damage: '12d6',
        description: 'Radiant explosion',
        secondaryEffect: 'blind_area'
      }
    ],
    13: [
      {
        name: 'Storm Sphere',
        type: 'magic',
        damage: '4d6',
        description: 'Sphere of storms',
        secondaryEffect: 'persistent_area'
      }
    ],
    17: [
      {
        name: 'Wish',
        type: 'magic',
        damage: 'variable',
        description: 'Reality-altering spell',
        secondaryEffect: 'ultimate'
      }
    ],
    20: [
      {
        name: 'Sorcerous Restoration',
        type: 'magic',
        damage: 'variable',
        description: 'Peak sorcerer power',
        secondaryEffect: 'ultimate_power'
      }
    ]
  }
};

function getClassAttacks(className, level) {
  const classData = classAttacks[className];
  if (!classData) return [];
  
  // Get all attacks up to the current level
  const attacks = [];
  for (const attackLevel in classData) {
    if (parseInt(attackLevel) <= level) {
      attacks.push(...classData[attackLevel]);
    }
  }
  
  return attacks;
}

function getAllClasses() {
  return Object.keys(classAttacks);
}

function getMulticlassAttacks(classes) {
  // classes is an array of {name, level}
  const allAttacks = [];
  
  classes.forEach(cls => {
    const attacks = getClassAttacks(cls.name, cls.level);
    allAttacks.push(...attacks.map(atk => ({
      ...atk,
      sourceClass: cls.name
    })));
  });
  
  return allAttacks;
}

module.exports = {
  classAttacks,
  getClassAttacks,
  getAllClasses,
  getMulticlassAttacks
};
