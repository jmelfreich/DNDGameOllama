import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { calculateModifier } from '../utils/diceRolls';

function LevelUp({ character, onComplete }) {
  const [newLevel, setNewLevel] = useState(character.level + 1);
  const [hpIncrease, setHpIncrease] = useState(0);
  const [statIncreases, setStatIncreases] = useState({});
  const [newAttacks, setNewAttacks] = useState([]);
  const [selectedStats, setSelectedStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const hitDiceMap = {
    'Fighter': 10,
    'Barbarian': 12,
    'Ranger': 10,
    'Paladin': 10,
    'Monk': 8,
    'Rogue': 8,
    'Cleric': 8,
    'Druid': 8,
    'Bard': 8,
    'Warlock': 8,
    'Wizard': 6,
    'Sorcerer': 6
  };

  useEffect(() => {
    initializeLevelUp();
  }, []);

  const initializeLevelUp = async () => {
    setLoading(true);

    // Calculate HP increase
    const hitDie = hitDiceMap[character.class] || 8;
    const conMod = calculateModifier(character.constitution);
    const hpGain = Math.floor(hitDie / 2 + 1) + conMod;
    setHpIncrease(hpGain);

    // Load new attacks
    try {
      const response = await api.get(`/api/game/attacks/${character.class}/${newLevel}`);
      const allAttacks = response.data;
      
      // Filter out attacks character already has
      const existingAttackNames = character.attacks.map(a => a.name);
      const newlyUnlocked = allAttacks.filter(a => !existingAttackNames.includes(a.name));
      
      setNewAttacks(newlyUnlocked);
    } catch (err) {
      console.error('Error loading attacks:', err);
    }

    setLoading(false);
  };

  const canIncreaseStats = () => {
    // Every 4 levels (4, 8, 12, 16, 20)
    return newLevel % 4 === 0;
  };

  const handleStatIncrease = (stat) => {
    if (selectedStats.length >= 2) {
      return;
    }

    if (selectedStats.includes(stat)) {
      setSelectedStats(selectedStats.filter(s => s !== stat));
      setStatIncreases({
        ...statIncreases,
        [stat]: (statIncreases[stat] || 0) - 1
      });
    } else {
      setSelectedStats([...selectedStats, stat]);
      setStatIncreases({
        ...statIncreases,
        [stat]: (statIncreases[stat] || 0) + 1
      });
    }
  };

  const handleConfirm = () => {
    if (canIncreaseStats() && selectedStats.length < 2) {
      alert('Please select 2 ability score increases');
      return;
    }

    const updatedCharacter = {
      ...character,
      level: newLevel,
      hp: character.hp + hpIncrease,
      maxHp: character.maxHp + hpIncrease,
      xp: character.xp - character.xpToNextLevel,
      xpToNextLevel: calculateXPToNextLevel(newLevel),
      attacks: [...character.attacks, ...newAttacks]
    };

    // Apply stat increases
    Object.keys(statIncreases).forEach(stat => {
      updatedCharacter[stat] = Math.min(20, character[stat] + statIncreases[stat]);
    });

    onComplete(updatedCharacter);
  };

  const calculateXPToNextLevel = (level) => {
    const xpTable = {
      2: 300, 3: 900, 4: 2700, 5: 6500, 6: 14000,
      7: 23000, 8: 34000, 9: 48000, 10: 64000,
      11: 85000, 12: 100000, 13: 120000, 14: 140000,
      15: 165000, 16: 195000, 17: 225000, 18: 265000,
      19: 305000, 20: 355000
    };
    return xpTable[level + 1] || xpTable[20];
  };

  if (loading) {
    return (
      <div className="level-up-overlay">
        <div className="level-up-modal">
          <div className="loading-text">Calculating level up...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="level-up-overlay">
      <div className="level-up-modal">
        <div className="level-up-header">
          <h1 className="level-up-title">LEVEL UP!</h1>
          <div className="level-display">
            <span className="old-level">{character.level}</span>
            <span className="level-arrow">→</span>
            <span className="new-level">{newLevel}</span>
          </div>
        </div>

        <div className="level-up-content">
          {/* HP Increase */}
          <section className="level-section">
            <h2 className="section-title">Hit Points</h2>
            <div className="hp-increase-display">
              <div className="hp-change">
                <span className="hp-old">{character.maxHp}</span>
                <span className="hp-arrow">→</span>
                <span className="hp-new">{character.maxHp + hpIncrease}</span>
              </div>
              <div className="hp-gain">+{hpIncrease} HP</div>
            </div>
          </section>

          {/* Ability Score Increases */}
          {canIncreaseStats() && (
            <section className="level-section">
              <h2 className="section-title">Ability Score Increase</h2>
              <div className="asi-description">
                Choose 2 ability scores to increase by 1
              </div>
              <div className="asi-remaining">
                {2 - selectedStats.length} increases remaining
              </div>
              <div className="abilities-grid">
                {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(ability => (
                  <button
                    key={ability}
                    className={`asi-button ${selectedStats.includes(ability) ? 'selected' : ''}`}
                    onClick={() => handleStatIncrease(ability)}
                    disabled={!selectedStats.includes(ability) && selectedStats.length >= 2}
                  >
                    <div className="asi-name">{ability.substring(0, 3).toUpperCase()}</div>
                    <div className="asi-value">
                      {character[ability]}
                      {statIncreases[ability] > 0 && (
                        <span className="asi-increase"> → {character[ability] + statIncreases[ability]}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* New Attacks/Abilities */}
          {newAttacks.length > 0 && (
            <section className="level-section">
              <h2 className="section-title">New Abilities Unlocked</h2>
              <div className="new-attacks-list">
                {newAttacks.map((attack, i) => (
                  <div key={i} className="new-attack-item">
                    <div className="attack-header">
                      <span className="attack-name">{attack.name}</span>
                      <span className={`attack-type ${attack.type}`}>{attack.type}</span>
                    </div>
                    <div className="attack-damage">{attack.damage}</div>
                    <div className="attack-description">{attack.description}</div>
                    {attack.secondaryEffect && (
                      <div className="attack-effect">Effect: {attack.secondaryEffect}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <button
          className="level-up-confirm"
          onClick={handleConfirm}
          disabled={canIncreaseStats() && selectedStats.length < 2}
        >
          Confirm Level Up
        </button>
      </div>
    </div>
  );
}

export default LevelUp;