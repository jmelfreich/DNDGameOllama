// frontend/src/pages/CharacterCreation.js - COMPLETE PRODUCTION VERSION - FIXED
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function CharacterCreation({ updateGameState, gameState }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [classes, setClasses] = useState([]);
  const [races, setRaces] = useState([]);
  const [character, setCharacter] = useState({
    name: '',
    race: '',
    class: '',
    level: 1,
    xp: 0,
    xpToNextLevel: 300,
    hp: 0,
    maxHp: 0,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    gold: 100,
    attacks: [],
    inventory: [],
    multiclass: [],
    skills: [],
    equipment: {
      head: null,
      armor: null,
      gloves: null,
      feet: null,
      cape: null,
      r_hand: null,
      l_hand: null,
      ring1: null,
      ring2: null,
      earrings: null
    }
  });

  const [pointsRemaining, setPointsRemaining] = useState(27);
  const [selectedRaceData, setSelectedRaceData] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableFeats, setAvailableFeats] = useState([]);
  const [selectedFeat, setSelectedFeat] = useState(null);
  const [selectedFeatData, setSelectedFeatData] = useState(null);
  const [startingItems, setStartingItems] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState({});

  // All skills mapped to abilities
  const allSkills = {
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

  // Class skill lists
  const classSkills = {
    'Fighter': ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
    'Wizard': ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'],
    'Rogue': ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
    'Cleric': ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
    'Ranger': ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
    'Paladin': ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
    'Barbarian': ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
    'Bard': Object.keys(allSkills),
    'Druid': ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    'Monk': ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    'Sorcerer': ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    'Warlock': ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion']
  };

  const classSkillCount = {
    'Fighter': 2, 'Wizard': 2, 'Rogue': 4, 'Cleric': 2, 'Ranger': 3,
    'Paladin': 2, 'Barbarian': 2, 'Bard': 3, 'Druid': 2, 'Monk': 2,
    'Sorcerer': 2, 'Warlock': 2
  };

  useEffect(() => {
    if (!gameState?.campaign) {
      navigate('/campaign');
      return;
    }

    // Load classes and races (they come as arrays of strings)
    api.get('/api/game/classes')
      .then(response => {
        console.log('Classes loaded:', response.data);
        setClasses(response.data);
      })
      .catch(err => console.error('Error loading classes:', err));

    api.get('/api/game/races')
      .then(response => {
        console.log('Races loaded:', response.data);
        setRaces(response.data);
      })
      .catch(err => console.error('Error loading races:', err));
  }, [gameState, navigate]);

  const handleNameChange = (e) => {
    setCharacter({ ...character, name: e.target.value });
  };

  const handleRaceSelect = async (raceName) => {
    setCharacter({ ...character, race: raceName });
    
    try {
      const response = await api.get(`/api/game/races/${raceName}`);
      console.log('Race data loaded:', response.data);
      setSelectedRaceData(response.data);
      
      if (raceName === 'Variant Human') {
        const featsResponse = await api.get('/api/game/feats/level/1');
        setAvailableFeats(featsResponse.data);
      } else {
        setAvailableFeats([]);
        setSelectedFeat(null);
      }
    } catch (err) {
      console.error('Error loading race data:', err);
    }
  };

  const handleClassSelect = async (className) => {
    setCharacter({ ...character, class: className });
    
    const skills = classSkills[className] || Object.keys(allSkills);
    setAvailableSkills(skills);
    setSelectedSkills([]);
    
    try {
      const response = await api.get(`/api/game/attacks/${className}/1`);
      setCharacter(prev => ({ ...prev, attacks: response.data }));

      // Load starting items
      const itemsResponse = await api.get(`/api/game/items/starting/${className}`);
      console.log('Starting items loaded:', itemsResponse.data);
      setStartingItems(itemsResponse.data || []);
    } catch (err) {
      console.error('Error loading class data:', err);
    }
  };

  const handleSkillToggle = (skill) => {
    const requiredSkills = classSkillCount[character.class] || 2;
    
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else if (selectedSkills.length < requiredSkills) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleFeatSelect = async (featName) => {
    setSelectedFeat(featName);
    
    try {
      const response = await api.get(`/api/game/feats/${featName}`);
      setSelectedFeatData(response.data);
    } catch (err) {
      console.error('Error loading feat data:', err);
    }
  };

  const getAbilityCost = (currentValue, newValue) => {
    const costs = {
      8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
    };
    
    if (newValue > currentValue) {
      let cost = 0;
      for (let i = currentValue; i < newValue; i++) {
        cost += (costs[i + 1] - costs[i]);
      }
      return cost;
    } else {
      let refund = 0;
      for (let i = newValue; i < currentValue; i++) {
        refund += (costs[i + 1] - costs[i]);
      }
      return -refund;
    }
  };

  const handleAbilityChange = (ability, newValue) => {
    const currentValue = character[ability];
    const cost = getAbilityCost(currentValue, newValue);
    
    if (pointsRemaining - cost < 0) return;
    if (newValue < 8 || newValue > 15) return;
    
    setCharacter({ ...character, [ability]: newValue });
    setPointsRemaining(pointsRemaining - cost);
  };

  const handleEquipItem = (item, slot) => {
    const newSelectedEquipment = { ...selectedEquipment };
    
    if (item.equipSlot === 'both_hands') {
      newSelectedEquipment.r_hand = item;
      newSelectedEquipment.l_hand = null;
    } else {
      newSelectedEquipment[slot] = item;
    }
    
    setSelectedEquipment(newSelectedEquipment);
  };

  const handleUnequipItem = (slot) => {
    const newSelectedEquipment = { ...selectedEquipment };
    newSelectedEquipment[slot] = null;
    setSelectedEquipment(newSelectedEquipment);
  };

  const calculateFinalStats = () => {
    const finalChar = { ...character };
    
    // Apply racial bonuses
    if (selectedRaceData && selectedRaceData.abilityScoreIncrease) {
      Object.keys(selectedRaceData.abilityScoreIncrease).forEach(ability => {
        if (finalChar[ability] !== undefined) {
          finalChar[ability] += selectedRaceData.abilityScoreIncrease[ability];
        }
      });
    }

    // Apply feat ability score increases
    if (selectedFeatData && selectedFeatData.abilityScoreIncrease) {
      const { abilityScoreIncrease } = selectedFeatData;
      if (abilityScoreIncrease.choice) {
        const ability = abilityScoreIncrease.choice[0];
        finalChar[ability] += abilityScoreIncrease.amount;
      } else {
        Object.keys(abilityScoreIncrease).forEach(ability => {
          if (finalChar[ability] !== undefined) {
            finalChar[ability] += abilityScoreIncrease[ability];
          }
        });
      }
    }

    // Calculate HP
    const hitDiceMap = {
      'Fighter': 10, 'Barbarian': 12, 'Ranger': 10, 'Paladin': 10,
      'Monk': 8, 'Rogue': 8, 'Cleric': 8, 'Druid': 8,
      'Bard': 8, 'Warlock': 8, 'Wizard': 6, 'Sorcerer': 6
    };
    
    const hitDie = hitDiceMap[character.class] || 8;
    const conModifier = Math.floor((finalChar.constitution - 10) / 2);
    finalChar.maxHp = hitDie + conModifier;
    finalChar.hp = finalChar.maxHp;
    
    // Apply Tough feat
    if (selectedFeat === 'Tough') {
      finalChar.maxHp += 2;
      finalChar.hp = finalChar.maxHp;
    }
    
    // Add selected skills
    finalChar.skills = selectedSkills.map(skill => ({
      name: skill,
      ability: allSkills[skill],
      proficient: true
    }));
    
    // Add selected feat
    if (selectedFeat) {
      finalChar.feat = {
        name: selectedFeat,
        description: selectedFeatData?.description,
        benefits: selectedFeatData?.benefits
      };
    }

    // Add starting inventory and equipped items
    const equippedItems = Object.values(selectedEquipment).filter(item => item !== null);
    const unequippedItems = startingItems.filter(item => 
      !equippedItems.some(eItem => eItem.id === item.id)
    );
    
    finalChar.inventory = [...equippedItems, ...unequippedItems];
    finalChar.equipment = { ...character.equipment, ...selectedEquipment };

    return finalChar;
  };

  const handleComplete = () => {
    const finalChar = calculateFinalStats();
    
    console.log('Final character:', finalChar);
    
    updateGameState({
      ...gameState,
      character: finalChar,
      party: [{
        ...finalChar,
        isActive: true,
        isLeader: true
      }],
      currentLocation: gameState.campaign.startingLocation,
      encounterType: 'normal',
      conversationHistory: [],
      activeQuests: [gameState.campaign.mainQuest],
      turnCount: 0
    });

    navigate('/play');
  };

  const getTotalSteps = () => {
    let steps = 5; // Name, Race, Class, Abilities, Skills
    if (character.race === 'Variant Human') {
      steps += 1; // Feat selection
    }
    if (startingItems.length > 0) {
      steps += 1; // Equipment selection
    }
    return steps;
  };

  const handleNext = () => {
    if (step === 1 && !character.name) {
      alert('Please enter a character name');
      return;
    }
    if (step === 2 && !character.race) {
      alert('Please select a race');
      return;
    }
    if (step === 3 && !character.class) {
      alert('Please select a class');
      return;
    }
    if (step === 4 && pointsRemaining > 0) {
      alert(`You have ${pointsRemaining} ability points remaining`);
      return;
    }
    
    const currentStepNumber = step;
    const skillsStepNumber = getTotalSteps() - (startingItems.length > 0 ? 1 : 0);
    
    if (currentStepNumber === skillsStepNumber) {
      const requiredSkills = classSkillCount[character.class] || 2;
      if (selectedSkills.length < requiredSkills) {
        alert(`Please select ${requiredSkills} skills`);
        return;
      }
    }
    
    if (character.race === 'Variant Human' && step === 5 && !selectedFeat) {
      alert('Please select a feat');
      return;
    }
    
    if (step < getTotalSteps()) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="form-step">
          <h2 className="step-title">What is your character's name?</h2>
          <input
            type="text"
            className="name-input"
            value={character.name}
            onChange={handleNameChange}
            placeholder="Enter character name..."
            autoFocus
          />
          <div className="campaign-reminder">
            <strong>Campaign:</strong> {gameState.campaign.title}
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="form-step">
          <h2 className="step-title">Choose your race</h2>
          <div className="race-grid">
            {races.map((race, index) => (
              <div
                key={index}
                className={`race-card ${character.race === race ? 'selected' : ''}`}
                onClick={() => handleRaceSelect(race)}
              >
                <h3>{race}</h3>
                {character.race === race && selectedRaceData && (
                  <div className="race-bonuses">
                    <p className="race-description">{selectedRaceData.description}</p>
                    {selectedRaceData.abilityScoreIncrease && (
                      <div>
                        <strong>Ability Bonuses:</strong>
                        <div>
                          {Object.entries(selectedRaceData.abilityScoreIncrease).map(([ability, bonus]) => (
                            <span key={ability} className="bonus-tag">
                              {ability.toUpperCase().slice(0, 3)} +{bonus}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="form-step">
          <h2 className="step-title">Choose your class</h2>
          <div className="class-grid">
            {classes.map((cls, index) => (
              <div
                key={index}
                className={`class-card ${character.class === cls ? 'selected' : ''}`}
                onClick={() => handleClassSelect(cls)}
              >
                <h3>{cls}</h3>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="form-step">
          <h2 className="step-title">Assign Ability Scores</h2>
          <div className="points-remaining">
            Points Remaining: <strong>{pointsRemaining}</strong>
          </div>
          <div className="point-buy-info">
            Point Buy System (8-15 range, 27 points total)
          </div>
          <div className="abilities-grid">
            {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map((ability) => {
              const baseValue = character[ability];
              const racialBonus = selectedRaceData?.abilityScoreIncrease?.[ability] || 0;
              const finalValue = baseValue + racialBonus;

              return (
                <div key={ability} className="ability-adjuster">
                  <label>{ability.charAt(0).toUpperCase() + ability.slice(1)}</label>
                  <div className="ability-controls">
                    <button onClick={() => handleAbilityChange(ability, baseValue - 1)} disabled={baseValue <= 8}>
                      −
                    </button>
                    <div className="ability-display">
                      <div className="base-value">{baseValue}</div>
                      {racialBonus > 0 && <div className="racial-bonus">+{racialBonus}</div>}
                      <div className="final-value">= {finalValue}</div>
                      <div className="modifier">
                        ({Math.floor((finalValue - 10) / 2) >= 0 ? '+' : ''}
                        {Math.floor((finalValue - 10) / 2)})
                      </div>
                    </div>
                    <button onClick={() => handleAbilityChange(ability, baseValue + 1)} disabled={baseValue >= 15}>
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (step === 5 && character.race !== 'Variant Human') {
      return renderSkillSelection();
    }

    if (step === 5 && character.race === 'Variant Human') {
      return (
        <div className="form-step">
          <h2 className="step-title">Choose Your Feat</h2>
          <p className="feat-description">As a Variant Human, you get to choose one feat at level 1.</p>
          <div className="feats-grid">
            {availableFeats.map((feat) => (
              <div
                key={feat.name}
                className={`feat-card ${selectedFeat === feat.name ? 'selected' : ''}`}
                onClick={() => handleFeatSelect(feat.name)}
              >
                <h3>{feat.name}</h3>
                <p className="feat-desc">{feat.description}</p>
                {feat.benefits && (
                  <ul className="feat-benefits">
                    {feat.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if ((step === 6 && character.race === 'Variant Human') || (step === 5 && character.race !== 'Variant Human')) {
      return renderSkillSelection();
    }

    const equipmentStep = getTotalSteps();
    if (step === equipmentStep && startingItems.length > 0) {
      return (
        <div className="form-step">
          <h2 className="step-title">Equip Your Starting Gear</h2>
          <p className="equipment-description">Choose which items to equip. You can change this later.</p>
          
          <div className="starting-equipment-layout">
            <div className="equipment-slots-column">
              <h3>Equipment Slots</h3>
              {Object.entries({
                r_hand: 'Right Hand',
                l_hand: 'Left Hand',
                armor: 'Armor',
                head: 'Head'
              }).map(([slot, label]) => (
                <div key={slot} className="equip-slot-preview">
                  <div className="slot-label">{label}</div>
                  {selectedEquipment[slot] ? (
                    <div className="equipped-item-preview">
                      <span>{selectedEquipment[slot].name}</span>
                      <button
                        className="unequip-btn"
                        onClick={() => handleUnequipItem(slot)}
                      >
                        ✖
                      </button>
                    </div>
                  ) : (
                    <div className="empty-slot-preview">Empty</div>
                  )}
                </div>
              ))}
            </div>

            <div className="available-items-column">
              <h3>Available Items</h3>
              <div className="items-list">
                {startingItems.map((item, index) => {
                  const isEquipped = Object.values(selectedEquipment).some(eItem => eItem?.id === item.id);
                  
                  return (
                    <div key={index} className={`item-card ${isEquipped ? 'equipped' : ''}`}>
                      <div className="item-header">
                        <strong>{item.name}</strong>
                        {isEquipped && <span className="equipped-badge">✓ Equipped</span>}
                      </div>
                      <p className="item-desc">{item.description}</p>
                      {item.damage && <div className="item-stat">Damage: {item.damage}</div>}
                      {item.armorClass && <div className="item-stat">AC: {item.armorClass}</div>}
                      
                      {!isEquipped && item.equipSlot && item.equipSlot !== 'none' && (
                        <div className="equip-buttons">
                          {item.equipSlot === 'both_hands' ? (
                            <button
                              className="equip-btn"
                              onClick={() => handleEquipItem(item, 'r_hand')}
                            >
                              Equip (Both Hands)
                            </button>
                          ) : (
                            <button
                              className="equip-btn"
                              onClick={() => handleEquipItem(item, item.equipSlot)}
                            >
                              Equip to {item.equipSlot.replace('_', ' ')}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSkillSelection = () => {
    const requiredSkills = classSkillCount[character.class] || 2;
    
    return (
      <div className="form-step">
        <h2 className="step-title">Choose Your Skills</h2>
        <p className="skills-description">
          Select {requiredSkills} skill proficiencies for your {character.class}.
        </p>
        <div className="skills-counter">
          Selected: {selectedSkills.length} / {requiredSkills}
        </div>
        <div className="skills-grid">
          {availableSkills.map((skill) => (
            <div
              key={skill}
              className={`skill-card ${selectedSkills.includes(skill) ? 'selected' : ''} ${
                selectedSkills.length >= requiredSkills && !selectedSkills.includes(skill) ? 'disabled' : ''
              }`}
              onClick={() => handleSkillToggle(skill)}
            >
              <h4>{skill}</h4>
              <p className="skill-ability">({allSkills[skill].toUpperCase().slice(0, 3)})</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="character-creation-container">
      <div className="creation-header">
        <h1>Create Your Character</h1>
        <div className="step-indicator">
          Step {step} of {getTotalSteps()}
        </div>
      </div>

      <div className="creation-content">
        {renderStepContent()}
      </div>

      <div className="creation-navigation">
        <button
          className="nav-button back"
          onClick={handleBack}
          disabled={step === 1}
        >
          Back
        </button>
        <button
          className="nav-button next"
          onClick={handleNext}
        >
          {step === getTotalSteps() ? 'Start Adventure' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default CharacterCreation;