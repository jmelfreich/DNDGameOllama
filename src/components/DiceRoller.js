// frontend/src/components/DiceRoller.js - FIXED
import React, { useState } from 'react';

function DiceRoller({ character, skill, dc, attackRoll, attackModifier, attackName, onComplete, onCancel, advantage, disadvantage }) {
  const [rolling, setRolling] = useState(false);
  const [rollResult, setRollResult] = useState(null);

  // Calculate modifier based on skill
  const getModifier = () => {
    // *** FIX: Use attackModifier if provided (for attack rolls) ***
    if (attackRoll && attackModifier !== undefined) {
      return attackModifier;
    }

    if (attackRoll) {
      // Fallback for attack rolls without explicit modifier
      const dexModifier = Math.floor((character.dexterity - 10) / 2);
      const proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;
      return dexModifier + proficiencyBonus;
    }

    // Skill check modifiers
    const skillToAbility = {
      'Acrobatics': 'dexterity',
      'Animal Handling': 'wisdom',
      'Arcana': 'intelligence',
      'Athletics': 'strength',
      'Deception': 'charisma',
      'History': 'intelligence',
      'Insight': 'wisdom',
      'Intimidation': 'charisma',
      'Investigation': 'intelligence',
      'Medicine': 'wisdom',
      'Nature': 'intelligence',
      'Perception': 'wisdom',
      'Performance': 'charisma',
      'Persuasion': 'charisma',
      'Religion': 'intelligence',
      'Sleight of Hand': 'dexterity',
      'Stealth': 'dexterity',
      'Survival': 'wisdom'
    };

    const ability = skillToAbility[skill] || 'strength';
    const abilityScore = character[ability] || 10;
    const abilityModifier = Math.floor((abilityScore - 10) / 2);

    // Check if character is proficient in this skill
    const isProficient = character.skills?.some(s => s.name === skill && s.proficient);
    const proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;

    return abilityModifier + (isProficient ? proficiencyBonus : 0);
  };

  const rollDice = (sides) => {
    return Math.floor(Math.random() * sides) + 1;
  };

  const performRoll = () => {
    setRolling(true);

    setTimeout(() => {
      const modifier = getModifier();
      let roll1 = rollDice(20);
      let roll2 = null;
      let finalRoll = roll1;

      if (advantage && !disadvantage) {
        roll2 = rollDice(20);
        finalRoll = Math.max(roll1, roll2);
      } else if (disadvantage && !advantage) {
        roll2 = rollDice(20);
        finalRoll = Math.min(roll1, roll2);
      }

      const total = finalRoll + modifier;
      const success = total >= dc;

      const result = {
        roll: finalRoll,
        roll1: roll1,
        roll2: roll2,
        modifier: modifier,
        total: total,
        dc: dc,
        success: success,
        criticalHit: finalRoll === 20,
        criticalFailure: finalRoll === 1,
        advantage: advantage && !disadvantage,
        disadvantage: disadvantage && !advantage
      };

      setRollResult(result);
      setRolling(false);
    }, 1000);
  };

  const handleComplete = () => {
    if (rollResult) {
      onComplete(rollResult);
    }
  };

  return (
    <div className="dice-roller-overlay">
      <div className="dice-roller-modal">
        <button className="modal-close" onClick={onCancel}>×</button>
        
        <h2 className="modal-title">
          {attackRoll ? (attackName || 'Attack Roll') : `${skill} Check`}
        </h2>

        {dc && (
          <div className="dice-roller-dc">
            Target {attackRoll ? 'AC' : 'DC'}: <strong>{dc}</strong>
          </div>
        )}

        <div className="dice-info">
          <div className="modifier-display">
            +{getModifier()}
          </div>
          <div className="modifier-breakdown">
            {attackRoll ? 'Attack Bonus' : 'Skill Modifier'}
          </div>
        </div>

        {(advantage || disadvantage) && (
          <div className={`roll-condition ${advantage ? 'advantage' : 'disadvantage'}`}>
            {advantage && !disadvantage && '⬆️ ADVANTAGE (Roll 2d20, take higher)'}
            {disadvantage && !advantage && '⬇️ DISADVANTAGE (Roll 2d20, take lower)'}
          </div>
        )}

        {!rollResult && !rolling && (
          <div className="roll-options">
            <button
              className="roll-button primary-button"
              onClick={performRoll}
            >
              🎲 Roll the Dice
            </button>
          </div>
        )}

        {rolling && (
          <div className="dice-animation">
            <div className="dice-rolling">
              <div className="d20">🎲</div>
              <div className="rolling-text">Rolling...</div>
            </div>
          </div>
        )}

        {rollResult && (
          <div className="dice-result">
            <div className="dice-display">
              {rollResult.roll2 !== null ? (
                <div className="advantage-rolls">
                  <div className="roll-pair">
                    <span className={rollResult.roll === rollResult.roll1 ? 'selected' : 'not-selected'}>
                      🎲 {rollResult.roll1}
                    </span>
                    <span className={rollResult.roll === rollResult.roll2 ? 'selected' : 'not-selected'}>
                      🎲 {rollResult.roll2}
                    </span>
                  </div>
                  <div className="roll-label">
                    {rollResult.advantage ? 'Taking Higher' : 'Taking Lower'}: <strong>{rollResult.roll}</strong>
                  </div>
                </div>
              ) : (
                <div className="dice-roll-value">
                  {rollResult.roll}
                  {rollResult.criticalHit && <span className="critical-badge">CRIT!</span>}
                  {rollResult.criticalFailure && <span className="critical-badge miss">MISS!</span>}
                </div>
              )}
              
              {rollResult.modifier !== 0 && (
                <div className="dice-modifier">
                  {rollResult.modifier >= 0 ? '+' : ''}{rollResult.modifier}
                </div>
              )}
              
              <div className="dice-total">
                = {rollResult.total}
              </div>
            </div>

            <div className={`dice-outcome ${rollResult.success ? 'success' : 'failure'}`}>
              {rollResult.criticalHit && '🌟 CRITICAL SUCCESS!'}
              {rollResult.criticalFailure && '💀 CRITICAL FAILURE!'}
              {!rollResult.criticalHit && !rollResult.criticalFailure && (
                rollResult.success ? '✅ SUCCESS' : '❌ FAILURE'
              )}
            </div>

            <div className="dice-roller-actions">
              <button
                className="primary-button"
                onClick={handleComplete}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiceRoller;