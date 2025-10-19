// Calculate ability modifier from ability score
export function calculateModifier(abilityScore) {
  return Math.floor((abilityScore - 10) / 2);
}

// Roll dice with optional modifier and advantage/disadvantage
export function rollDice(sides, numberOfDice = 1, modifier = 0, advantageType = 'normal') {
  const rolls = [];
  
  if (advantageType === 'advantage') {
    // Roll twice, take the higher
    const roll1 = Math.floor(Math.random() * sides) + 1;
    const roll2 = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll1, roll2);
    const selectedRoll = Math.max(roll1, roll2);
    return {
      rolls: rolls,
      selectedRoll: selectedRoll,
      modifier: modifier,
      total: selectedRoll + modifier
    };
  } else if (advantageType === 'disadvantage') {
    // Roll twice, take the lower
    const roll1 = Math.floor(Math.random() * sides) + 1;
    const roll2 = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll1, roll2);
    const selectedRoll = Math.min(roll1, roll2);
    return {
      rolls: rolls,
      selectedRoll: selectedRoll,
      modifier: modifier,
      total: selectedRoll + modifier
    };
  } else {
    // Normal roll
    for (let i = 0; i < numberOfDice; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    const sum = rolls.reduce((a, b) => a + b, 0);
    return {
      rolls: rolls,
      modifier: modifier,
      total: sum + modifier
    };
  }
}

// Parse dice notation (e.g., "2d6+3")
export function parseDiceNotation(notation) {
  const match = notation.match(/(\d+)d(\d+)([+-]\d+)?/);
  if (!match) return null;
  
  return {
    numberOfDice: parseInt(match[1]),
    sides: parseInt(match[2]),
    modifier: match[3] ? parseInt(match[3]) : 0
  };
}

// Roll from notation string
export function rollFromNotation(notation, advantageType = 'normal') {
  const parsed = parseDiceNotation(notation);
  if (!parsed) return null;
  
  return rollDice(parsed.sides, parsed.numberOfDice, parsed.modifier, advantageType);
}

// Calculate damage from dice notation
export function calculateDamage(notation) {
  const roll = rollFromNotation(notation);
  return roll ? roll.total : 0;
}

// Saving throw
export function savingThrow(abilityScore, dc, proficient = false, proficiencyBonus = 2) {
  const modifier = calculateModifier(abilityScore);
  const totalModifier = proficient ? modifier + proficiencyBonus : modifier;
  const roll = rollDice(20, 1, totalModifier);
  
  return {
    ...roll,
    success: roll.total >= dc,
    dc: dc
  };
}

// Skill check
export function skillCheck(abilityScore, dc, proficient = false, proficiencyBonus = 2, advantageType = 'normal') {
  const modifier = calculateModifier(abilityScore);
  const totalModifier = proficient ? modifier + proficiencyBonus : modifier;
  const roll = rollDice(20, 1, totalModifier, advantageType);
  
  return {
    ...roll,
    success: roll.total >= dc,
    dc: dc
  };
}

// Attack roll
export function attackRoll(attackBonus, targetAC, advantageType = 'normal') {
  const roll = rollDice(20, 1, attackBonus, advantageType);
  const naturalRoll = advantageType === 'normal' ? roll.rolls[0] : roll.selectedRoll;
  
  return {
    ...roll,
    hit: roll.total >= targetAC,
    criticalHit: naturalRoll === 20,
    criticalMiss: naturalRoll === 1,
    targetAC: targetAC
  };
}

// Initiative roll
export function initiativeRoll(dexterityScore) {
  const modifier = calculateModifier(dexterityScore);
  return rollDice(20, 1, modifier);
}