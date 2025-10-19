// frontend/src/components/DiceRoller.js - FIXED
import React, { useState } from 'react';
import { calculateModifier } from '../utils/diceRolls';

function DiceRoller({ character, skill, dc, attackRoll = false, onComplete, onCancel }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [rollType, setRollType] = useState('normal');

  const getModifier = () => {
    if (attackRoll) {
      // For attack rolls, use strength or dexterity modifier (whichever is higher)
      const strMod = calculateModifier(character.strength);
      const dexMod = calculateModifier(character.dexterity);
      const proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;
      return Math.max(strMod, dexMod) + proficiencyBonus;
    }

    // If skill is not provided, return 0
    if (!skill) {
      return 0;
    }

    // For skill checks, use the appropriate ability modifier
    const abilityMap = {
      'strength': character.strength,
      'dexterity': character.dexterity,
      'constitution': character.constitution,
      'intelligence': character.intelligence,
      'wisdom': character.wisdom,
      'charisma': character.charisma,
      'athletics': character.strength,
      'acrobatics': character.dexterity,
      'sleight of hand': character.dexterity,
      'stealth': character.dexterity,
      'arcana': character.intelligence,
      'history': character.intelligence,
      'investigation': character.intelligence,
      'nature': character.intelligence,
      'religion': character.intelligence,
      'animal handling': character.wisdom,
      'insight': character.wisdom,
      'medicine': character.wisdom,
      'perception': character.wisdom,
      'survival': character.wisdom,
      'deception': character.charisma,
      'intimidation': character.charisma,
      'performance': character.charisma,
      'persuasion': character.charisma
    };

    const ability = abilityMap[skill.toLowerCase()] || character.strength;
    const proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;
    
    return calculateModifier(ability) + proficiencyBonus;
  };

  // Simple d20 roll function
  const rollD20 = () => {
    return Math.floor(Math.random() * 20) + 1;
  };

  const handleRoll = () => {
    setRolling(true);

    // Simulate dice roll animation
    let animationCount = 0;
    const animationInterval = setInterval(() => {
      setResult({
        roll: rollD20(),
        modifier: getModifier(),
        total: 0,
        success: false
      });

      animationCount++;
      if (animationCount >= 10) {
        clearInterval(animationInterval);
        performFinalRoll();
      }
    }, 100);
  };

  const performFinalRoll = () => {
    const modifier = getModifier();
    let roll;

    // For attack rolls in combat, always use normal roll (no player choice)
    // The DM/system determines advantage/disadvantage based on conditions
    if (attackRoll) {
      roll = rollD20();
    } else {
      // For skill checks outside combat, player can choose
      if (rollType === 'advantage') {
        const roll1 = rollD20();
        const roll2 = rollD20();
        roll = Math.max(roll1, roll2);
      } else if (rollType === 'disadvantage') {
        const roll1 = rollD20();
        const roll2 = rollD20();
        roll = Math.min(roll1, roll2);
      } else {
        roll = rollD20();
      }
    }

    const total = roll + modifier;
    const success = total >= dc;

    const finalResult = {
      roll,
      modifier,
      total,
      success,
      criticalHit: roll === 20,
      criticalMiss: roll === 1
    };

    setResult(finalResult);
    setRolling(false);
  };

  const handleComplete = () => {
    if (result && onComplete) {
      onComplete(result);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content dice-roller-modal">
        <button className="modal-close" onClick={onCancel}>×</button>

        <h2 className="modal-title">
          {attackRoll ? 'Attack Roll' : skill ? `${skill} Check` : 'Ability Check'}
        </h2>

        {dc && (
          <div className="dice-roller-dc">
            Target: {attackRoll ? `AC ${dc}` : `DC ${dc}`}
          </div>
        )}

        {/* Only show roll type selection for skill checks, not attack rolls */}
        {!attackRoll && !result && (
          <div className="roll-type-selector">
            <button
              className={`roll-type-button ${rollType === 'normal' ? 'active' : ''}`}
              onClick={() => setRollType('normal')}
            >
              Normal
            </button>
            <button
              className={`roll-type-button ${rollType === 'advantage' ? 'active' : ''}`}
              onClick={() => setRollType('advantage')}
            >
              Advantage
            </button>
            <button
              className={`roll-type-button ${rollType === 'disadvantage' ? 'active' : ''}`}
              onClick={() => setRollType('disadvantage')}
            >
              Disadvantage
            </button>
          </div>
        )}

        {/* Attack rolls always use normal (DM determines conditions) */}
        {attackRoll && !result && (
          <div className="dice-roller-info">
            Rolling attack with your modifier
          </div>
        )}

        <div className="dice-display">
          {result ? (
            <div className={`dice-result ${result.success ? 'success' : 'failure'}`}>
              <div className="dice-roll-value">
                {result.roll}
                {result.criticalHit && <span className="critical-badge">CRITICAL HIT!</span>}
                {result.criticalMiss && <span className="critical-badge miss">CRITICAL MISS!</span>}
              </div>
              {result.modifier !== 0 && (
                <div className="dice-modifier">
                  {result.modifier >= 0 ? '+' : ''}{result.modifier}
                </div>
              )}
              <div className="dice-total">= {result.total}</div>
              <div className={`dice-outcome ${result.success ? 'success' : 'failure'}`}>
                {result.criticalHit ? '🎯 Critical Success!' : 
                 result.criticalMiss ? '💥 Critical Failure!' :
                 result.success ? '✓ Success!' : '✗ Failure'}
              </div>
            </div>
          ) : (
            <div className="dice-placeholder">
              <div className="dice-icon">🎲</div>
              <div className="dice-text">Ready to roll d20</div>
            </div>
          )}
        </div>

        <div className="dice-roller-actions">
          {!result ? (
            <button
              className="primary-button"
              onClick={handleRoll}
              disabled={rolling}
            >
              {rolling ? 'Rolling...' : 'Roll Dice'}
            </button>
          ) : (
            <button
              className="primary-button"
              onClick={handleComplete}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiceRoller;