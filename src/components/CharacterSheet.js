import React from 'react';
import { calculateModifier } from '../utils/diceRolls';

function CharacterSheet({ character, onClose }) {
  const proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;

  const getSkillModifier = (ability) => {
    const modifier = calculateModifier(character[ability]);
    return modifier + proficiencyBonus;
  };

  const skills = [
    { name: 'Acrobatics', ability: 'dexterity' },
    { name: 'Animal Handling', ability: 'wisdom' },
    { name: 'Arcana', ability: 'intelligence' },
    { name: 'Athletics', ability: 'strength' },
    { name: 'Deception', ability: 'charisma' },
    { name: 'History', ability: 'intelligence' },
    { name: 'Insight', ability: 'wisdom' },
    { name: 'Intimidation', ability: 'charisma' },
    { name: 'Investigation', ability: 'intelligence' },
    { name: 'Medicine', ability: 'wisdom' },
    { name: 'Nature', ability: 'intelligence' },
    { name: 'Perception', ability: 'wisdom' },
    { name: 'Performance', ability: 'charisma' },
    { name: 'Persuasion', ability: 'charisma' },
    { name: 'Religion', ability: 'intelligence' },
    { name: 'Sleight of Hand', ability: 'dexterity' },
    { name: 'Stealth', ability: 'dexterity' },
    { name: 'Survival', ability: 'wisdom' }
  ];

  return (
    <div className="character-sheet-overlay">
      <div className="character-sheet-modal">
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="sheet-header">
          <h1 className="sheet-title">{character.name}</h1>
          <div className="sheet-subtitle">
            {character.race && <span>{character.race} </span>}
            Level {character.level} {character.class}
            {character.multiclass && character.multiclass.length > 0 && (
              <span> / {character.multiclass.map(c => `${c.name} ${c.level}`).join(' / ')}</span>
            )}
          </div>
        </div>

        <div className="sheet-content">
          {/* Core Stats */}
          <section className="sheet-section">
            <h2 className="section-title">Core Statistics</h2>
            <div className="core-stats-grid">
              <div className="stat-block">
                <div className="stat-label">HP</div>
                <div className="stat-value-large">{character.hp} / {character.maxHp}</div>
              </div>
              <div className="stat-block">
                <div className="stat-label">XP</div>
                <div className="stat-value-large">{character.xp} / {character.xpToNextLevel}</div>
              </div>
              <div className="stat-block">
                <div className="stat-label">Gold</div>
                <div className="stat-value-large">{character.gold}</div>
              </div>
              <div className="stat-block">
                <div className="stat-label">Proficiency</div>
                <div className="stat-value-large">+{proficiencyBonus}</div>
              </div>
            </div>
          </section>

          {/* Ability Scores */}
          <section className="sheet-section">
            <h2 className="section-title">Ability Scores</h2>
            <div className="abilities-grid">
              {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(ability => (
                <div key={ability} className="ability-block">
                  <div className="ability-name">{ability.substring(0, 3).toUpperCase()}</div>
                  <div className="ability-score">{character[ability]}</div>
                  <div className="ability-modifier">
                    {calculateModifier(character[ability]) >= 0 ? '+' : ''}
                    {calculateModifier(character[ability])}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="sheet-section">
            <h2 className="section-title">Skills</h2>
            <div className="skills-grid">
              {skills.map(skill => (
                <div key={skill.name} className="skill-item">
                  <div className="skill-name">{skill.name}</div>
                  <div className="skill-modifier">
                    +{getSkillModifier(skill.ability)}
                  </div>
                </div>
              ))}
            </div>
          </section>

           {/* Feats */}
          {character.feat && (
            <section className="sheet-section">
              <h2 className="section-title">Feats</h2>
              <div className="feat-display">
                <div className="feat-display-header">
                  <span className="feat-display-name">{character.feat.name}</span>
                </div>
                <div className="feat-display-description">{character.feat.description}</div>
                {character.feat.benefits && (
                  <div className="feat-display-benefits">
                    {character.feat.benefits.map((benefit, i) => (
                      <div key={i} className="feat-display-benefit">• {benefit}</div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Attacks & Spells */}
          <section className="sheet-section">
            <h2 className="section-title">Attacks & Abilities</h2>
            <div className="attacks-list">
              {character.attacks && character.attacks.length > 0 ? (
                character.attacks.map((attack, i) => (
                  <div key={i} className="attack-item">
                    <div className="attack-header">
                      <span className="attack-name">{attack.name}</span>
                      <span className="attack-type-badge">{attack.type}</span>
                    </div>
                    <div className="attack-damage">{attack.damage}</div>
                    <div className="attack-description">{attack.description}</div>
                    {attack.secondaryEffect && (
                      <div className="attack-effect">Effect: {attack.secondaryEffect}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">No attacks learned yet</div>
              )}
            </div>
          </section>

          {/* Inventory */}
          <section className="sheet-section">
            <h2 className="section-title">Inventory ({character.inventory?.length || 0} items)</h2>
            <div className="inventory-list">
              {character.inventory && character.inventory.length > 0 ? (
                character.inventory.map((item, i) => (
                  <div key={i} className="inventory-item">
                    <div className="item-header">
                      <span className="item-name">{item.name}</span>
                      <div className="item-meta">
                        {item.rarity && <span className={`item-rarity rarity-${item.rarity}`}>{item.rarity}</span>}
                        {item.price && <span className="item-value">{item.price}g</span>}
                      </div>
                    </div>
                    {item.description && (
                      <div className="item-description">{item.description}</div>
                    )}
                    <div className="item-details">
                      {item.type && <span className="item-type">Type: {item.type}</span>}
                      {item.effect && <span className="item-effect">Effect: {item.effect}</span>}
                      {item.usableInCombat && <span className="item-combat">⚔️ Combat Item</span>}
                    </div>
                    {item.damage && (
                      <div className="item-damage">Damage: {item.damage} ({item.damageType})</div>
                    )}
                    {item.ac && (
                      <div className="item-ac">AC: {item.ac}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">Inventory is empty</div>
              )}
            </div>
          </section>
        </div>

        <button className="sheet-close-button" onClick={onClose}>
          Close Character Sheet
        </button>
      </div>
    </div>
  );
}

export default CharacterSheet;