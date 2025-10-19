// frontend/src/components/CharacterCreation.js - FIXED & WORKING
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
    skills: []
  });

  const [pointsRemaining, setPointsRemaining] = useState(27);
  const [selectedRaceData, setSelectedRaceData] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [availableFeats, setAvailableFeats] = useState([]);
  const [selectedFeat, setSelectedFeat] = useState(null);
  const [selectedFeatData, setSelectedFeatData] = useState(null);

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
    'Bard': Object.keys(allSkills), // Bards can choose any
    'Druid': ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
    'Monk': ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
    'Sorcerer': ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
    'Warlock': ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion']
  };

  const classSkillCount = {
    'Fighter': 2,
    'Wizard': 2,
    'Rogue': 4,
    'Cleric': 2,
    'Ranger': 3,
    'Paladin': 2,
    'Barbarian': 2,
    'Bard': 3,
    'Druid': 2,
    'Monk': 2,
    'Sorcerer': 2,
    'Warlock': 2
  };

  useEffect(() => {
    if (!gameState?.campaign) {
      navigate('/campaign');
      return;
    }

    // Load classes and races
    api.get('/api/game/classes')
      .then(response => setClasses(response.data))
      .catch(err => console.error('Error loading classes:', err));

    api.get('/api/game/races')
      .then(response => setRaces(response.data))
      .catch(err => console.error('Error loading races:', err));
  }, [gameState, navigate]);

  const handleNameChange = (e) => {
    setCharacter({ ...character, name: e.target.value });
  };

  const handleRaceSelect = async (raceName) => {
    setCharacter({ ...character, race: raceName });
    
    try {
      const response = await api.get(`/api/game/races/${raceName}`);
      setSelectedRaceData(response.data);
      
      // If Variant Human, load feats
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
    
    // Set available skills based on class
    const skills = classSkills[className] || Object.keys(allSkills);
    setAvailableSkills(skills);
    setSelectedSkills([]); // Reset selected skills
    
    // Load starting attacks
    try {
      const response = await api.get(`/api/game/attacks/${className}/1`);
      setCharacter(prev => ({ ...prev, attacks: response.data }));
    } catch (err) {
      console.error('Error loading attacks:', err);
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
      8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5,
      14: 7, 15: 9
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

    // Apply feat ability score increases (if any)
    if (selectedFeatData && selectedFeatData.abilityScoreIncrease) {
      const { abilityScoreIncrease } = selectedFeatData;
      if (abilityScoreIncrease.choice) {
        // For feats with a choice, we'll just apply to the first valid ability for now
        // In a full implementation, you'd ask the user to choose
        const ability = abilityScoreIncrease.choice[0];
        finalChar[ability] += abilityScoreIncrease.amount;
      } else {
        // Direct ability increases
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
    
    // Apply Tough feat if selected
    if (selectedFeat === 'Tough') {
      finalChar.maxHp += 2; // +2 HP at level 1
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

    // Load starting inventory
    api.get(`/api/game/items/starting/${character.class}`)
      .then(response => {
        finalChar.inventory = response.data || [];
        saveAndStart(finalChar);
      })
      .catch(err => {
        console.error('Error loading starting items:', err);
        finalChar.inventory = [];
        saveAndStart(finalChar);
      });
  };

  const saveAndStart = (finalChar) => {
    updateGameState({
      ...gameState,
      character: finalChar,
      currentLocation: gameState.campaign.startingLocation,
      encounterType: 'normal',
      conversationHistory: [],
      activeQuests: [],
      turnCount: 0
    });

    navigate('/play');
  };

  const getTotalSteps = () => {
    let steps = 5; // Name, Race, Class, Abilities, Skills
    if (character.race === 'Variant Human') {
      steps += 1; // Add feat selection step
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
    
    // Check if we're on skills step (step 5 for normal, step 6 for Variant Human)
    const isSkillsStep = (character.race === 'Variant Human' && step === 6) || 
                         (character.race !== 'Variant Human' && step === 5);
    
    if (isSkillsStep) {
      const requiredSkills = classSkillCount[character.class] || 2;
      if (selectedSkills.length < requiredSkills) {
        alert(`Please select ${requiredSkills} skills`);
        return;
      }
      calculateFinalStats();
      return;
    }
    
    // Check feat selection for Variant Human
    if (character.race === 'Variant Human' && step === 5 && !selectedFeat) {
      alert('Please select a feat');
      return;
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="page character-creation-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate('/campaign')}>
          ← Back
        </button>

        <header className="header">
          <h1 className="title">Create Character</h1>
          <div className="subtitle">Step {step} of {getTotalSteps()}</div>
        </header>

        <div className="character-form">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="form-step">
              <h2 className="step-title">What is your character's name?</h2>
              <input
                type="text"
                className="name-input form-input"
                value={character.name}
                onChange={handleNameChange}
                placeholder="Enter character name..."
                autoFocus
              />
              <div className="campaign-reminder">
                <strong>Campaign:</strong> {gameState.campaign.title}
              </div>
            </div>
          )}

          {/* Step 2: Race */}
          {step === 2 && (
            <div className="form-step">
              <h2 className="step-title">Choose your race</h2>
              <div className="selection-grid">
                {races.map((race, index) => (
                  <div
                    key={index}
                    className={`selection-card ${character.race === race ? 'selected' : ''}`}
                    onClick={() => handleRaceSelect(race)}
                  >
                    <div className="card-title">{race}</div>
                    {character.race === race && selectedRaceData && (
                      <div className="card-details">
                        <div className="detail-item">Speed: {selectedRaceData.speed} ft</div>
                        <div className="detail-item">Size: {selectedRaceData.size}</div>
                        {selectedRaceData.traits && (
                          <div className="detail-item traits">
                            Traits: {selectedRaceData.traits.join(', ')}
                          </div>
                        )}
                        <div className="card-description">{selectedRaceData.description}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Class */}
          {step === 3 && (
            <div className="form-step">
              <h2 className="step-title">Choose your class</h2>
              <div className="selection-grid">
                {classes.map((cls, index) => (
                  <div
                    key={index}
                    className={`selection-card ${character.class === cls ? 'selected' : ''}`}
                    onClick={() => handleClassSelect(cls)}
                  >
                    <div className="card-title">{cls}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Ability Scores */}
          {step === 4 && (
            <div className="form-step">
              <h2 className="step-title">Assign Ability Scores</h2>
              <div className="points-remaining">
                Points Remaining: <span className="points-value">{pointsRemaining}</span>
              </div>
              <div className="point-buy-info">
                Point Buy System (8-15 range, 27 points total)
              </div>

              <div className="abilities-container">
                {['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].map(ability => {
                  const baseValue = character[ability];
                  const racialBonus = selectedRaceData?.abilityScoreIncrease?.[ability] || 0;
                  const finalValue = baseValue + racialBonus;

                  return (
                    <div key={ability} className="ability-adjuster">
                      <div className="ability-name">{ability.toUpperCase()}</div>
                      <div className="ability-controls">
                        <button
                          className="ability-button"
                          onClick={() => handleAbilityChange(ability, baseValue - 1)}
                          disabled={baseValue <= 8}
                        >
                          −
                        </button>
                        <div className="ability-display">
                          <div className="base-value">{baseValue}</div>
                          {racialBonus > 0 && (
                            <div className="racial-bonus">+{racialBonus}</div>
                          )}
                          <div className="final-value">= {finalValue}</div>
                          <div className="modifier">
                            ({Math.floor((finalValue - 10) / 2) >= 0 ? '+' : ''}
                            {Math.floor((finalValue - 10) / 2)})
                          </div>
                        </div>
                        <button
                          className="ability-button"
                          onClick={() => handleAbilityChange(ability, baseValue + 1)}
                          disabled={baseValue >= 15}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Skills */}
          {step === 5 && character.race !== 'Variant Human' && (
            <div className="form-step">
              <h2 className="step-title">Choose Skill Proficiencies</h2>
              <div className="skills-info">
                Select {classSkillCount[character.class] || 2} skills
              </div>
              <div className="skills-remaining">
                {(classSkillCount[character.class] || 2) - selectedSkills.length} remaining
              </div>
              <div className="skills-selection-grid">
                {availableSkills.map(skill => (
                  <div
                    key={skill}
                    className={`skill-selection-card ${selectedSkills.includes(skill) ? 'selected' : ''} ${
                      !selectedSkills.includes(skill) && selectedSkills.length >= (classSkillCount[character.class] || 2) ? 'disabled' : ''
                    }`}
                    onClick={() => handleSkillToggle(skill)}
                  >
                    <div className="skill-name">{skill}</div>
                    <div className="skill-ability">({allSkills[skill]?.substring(0, 3).toUpperCase()})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Feat (Variant Human only) */}
          {step === 5 && character.race === 'Variant Human' && (
            <div className="form-step">
              <h2 className="step-title">Choose a Feat</h2>
              <div className="feat-info">
                As a Variant Human, you gain one feat at level 1
              </div>
              <div className="feats-selection-grid">
                {availableFeats.map(featName => (
                  <div
                    key={featName}
                    className={`feat-selection-card ${selectedFeat === featName ? 'selected' : ''}`}
                    onClick={() => handleFeatSelect(featName)}
                  >
                    <div className="feat-name">{featName}</div>
                    {selectedFeat === featName && selectedFeatData && (
                      <div className="feat-details">
                        <div className="feat-description">{selectedFeatData.description}</div>
                        <div className="feat-benefits">
                          {selectedFeatData.benefits.map((benefit, i) => (
                            <div key={i} className="feat-benefit">• {benefit}</div>
                          ))}
                        </div>
                        {selectedFeatData.prerequisites && (
                          <div className="feat-prereqs">Prerequisites: {selectedFeatData.prerequisites}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Skills (Variant Human) */}
          {step === 6 && character.race === 'Variant Human' && (
            <div className="form-step">
              <h2 className="step-title">Choose Skill Proficiencies</h2>
              <div className="skills-info">
                Select {classSkillCount[character.class] || 2} skills
              </div>
              <div className="skills-remaining">
                {(classSkillCount[character.class] || 2) - selectedSkills.length} remaining
              </div>
              <div className="skills-selection-grid">
                {availableSkills.map(skill => (
                  <div
                    key={skill}
                    className={`skill-selection-card ${selectedSkills.includes(skill) ? 'selected' : ''} ${
                      !selectedSkills.includes(skill) && selectedSkills.length >= (classSkillCount[character.class] || 2) ? 'disabled' : ''
                    }`}
                    onClick={() => handleSkillToggle(skill)}
                  >
                    <div className="skill-name">{skill}</div>
                    <div className="skill-ability">({allSkills[skill]?.substring(0, 3).toUpperCase()})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button className="secondary-button" onClick={handleBack}>
                Back
              </button>
            )}
            <button className="primary-button" onClick={handleNext}>
              {step === getTotalSteps() ? 'Start Adventure' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterCreation;