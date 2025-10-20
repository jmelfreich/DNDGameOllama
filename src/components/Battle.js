// frontend/src/components/Battle.js - ENHANCED VERSION
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../utils/api';

// Damage Number Component
function DamageNumber({ damage, type, position, id }) {
  return (
    <div 
      className={`damage-number damage-${type}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      {damage}
    </div>
  );
}

// Turn Order Component
function TurnOrderDisplay({ player, enemy, party }) {
  const allCombatants = [
    { ...player, isPlayer: true, type: 'player' },
    ...(party || []).map((p, i) => ({ ...p, isPlayer: true, type: `party-${i}` })),
    { ...enemy, isPlayer: false, type: 'enemy' }
  ].sort((a, b) => {
    const aInit = a.dexterity || 10;
    const bInit = b.dexterity || 10;
    return bInit - aInit;
  });

  return (
    <div className="turn-order-display">
      <div className="turn-order-title">Turn Order</div>
      {allCombatants.map((combatant, idx) => (
        <div key={idx} className="turn-order-item">
          <div className="turn-order-icon">{combatant.isPlayer ? '🧙' : '👹'}</div>
          <div className="turn-order-info">
            <div className="turn-order-name">{combatant.name}</div>
            <div className="turn-order-hp">{combatant.hp}/{combatant.maxHp}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Game Over Component
function GameOverScreen({ onRestart }) {
  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h1 className="game-over-title">GAME OVER</h1>
        <p className="game-over-subtitle">Your party has been defeated...</p>
        <button className="game-over-button" onClick={onRestart}>
          Return to Menu
        </button>
      </div>
    </div>
  );
}

function Battle({ gameState, updateGameState, onLevelUp }) {
  const [battleLog, setBattleLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [activeTab, setActiveTab] = useState('attack');
  const [showItemSelection, setShowItemSelection] = useState(false);
  const [showPartySwap, setShowPartySwap] = useState(false);
  const [currentEnemyHP, setCurrentEnemyHP] = useState(null);
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const damageIdCounter = useRef(0);

  useEffect(() => {
    if (!gameState.currentEnemy) {
      console.warn('No enemy found in battle mode, generating enemy...');
      generateEnemy();
    } else {
      setCurrentEnemyHP(gameState.currentEnemy.hp);
      setBattleLog([
        `A ${gameState.currentEnemy.name} appears!`,
        gameState.currentEnemy.description || 'The enemy prepares to attack.'
      ]);
    }
  }, []);

  const addDamageNumber = (damage, type, targetIsEnemy) => {
    const id = damageIdCounter.current++;
    
    // Position based on target
    const baseX = targetIsEnemy ? window.innerWidth - 400 : 400;
    const baseY = 250;
    
    const newDamage = {
      id,
      damage: type === 'miss' ? 'MISS' : type === 'crit' ? `${damage}!!` : damage.toString(),
      type,
      position: {
        x: baseX + (Math.random() * 60 - 30),
        y: baseY + (Math.random() * 40 - 20)
      }
    };

    setDamageNumbers(prev => [...prev, newDamage]);
    
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== id));
    }, 1500);
  };

  const generateEnemy = async () => {
    setLoading(true);
    setLoadingPhase('Generating enemy...');

    try {
      const context = {
        location: gameState.currentLocation || 'unknown location',
        battleContext: gameState.battleContext || '',
        dialogContext: gameState.dialogSummary || '',
        recentActions: gameState.conversationHistory?.slice(-3).map(h => h.content).join(' ') || ''
      };

      const response = await api.post('/api/game/battle/generate-enemy', {
        character: gameState.character,
        location: context.location,
        difficulty: 'normal',
        context: context,
        gameState: {
          deadNPCs: gameState.deadNPCs || [],
          consequenceLog: gameState.consequenceLog || [],
          dialogSummary: gameState.dialogSummary || null
        }
      });

      setCurrentEnemyHP(response.data.hp);

      updateGameState({
        ...gameState,
        currentEnemy: response.data,
        inCombat: true
      });

      setBattleLog([
        `A ${response.data.name} appears!`,
        response.data.description || 'The enemy prepares to attack.'
      ]);
    } catch (err) {
      console.error('Error generating enemy:', err);
      updateGameState({
        ...gameState,
        encounterType: 'normal',
        currentEnemy: null,
        inCombat: false
      });
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const getActiveCharacter = () => {
    if (gameState.party && gameState.party.length > 0) {
      return gameState.party.find(member => member.isActive) || gameState.party[0];
    }
    return gameState.character;
  };

  const getParty = () => {
    if (gameState.party && gameState.party.length > 0) {
      return gameState.party;
    }
    return [{
      ...gameState.character,
      isActive: true,
      isLeader: true
    }];
  };

  const handleSwapPartyMember = (index) => {
    const party = getParty();
    const newParty = party.map((member, i) => ({
      ...member,
      isActive: i === index
    }));

    updateGameState({
      ...gameState,
      party: newParty
    });

    setBattleLog([
      ...battleLog,
      `${newParty[index].name} steps forward to fight!`
    ]);

    setShowPartySwap(false);
    setTimeout(() => processEnemyTurn(), 1500);
  };

  const calculateAttackModifier = (attack, character) => {
    let abilityScore;
    if (attack.type === 'melee' && !attack.finesse) {
      abilityScore = character.strength;
    } else if (attack.type === 'ranged' || attack.finesse) {
      abilityScore = character.dexterity;
    } else {
      abilityScore = attack.type === 'melee' ? character.strength : character.dexterity;
    }

    const abilityModifier = Math.floor((abilityScore - 10) / 2);
    const proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;
    const totalModifier = abilityModifier + proficiencyBonus;
    
    return {
      modifier: totalModifier,
      abilityModifier,
      proficiencyBonus,
      abilityScore
    };
  };

  // AUTOMATED ATTACK - No dice roller modal
  const handleAttackSelect = async (attack) => {
    setLoading(true);
    setLoadingPhase('Attacking...');

    const activeChar = getActiveCharacter();
    const attackModifiers = calculateAttackModifier(attack, activeChar);
    
    // Auto-roll the attack
    const d20Roll = Math.floor(Math.random() * 20) + 1;
    const total = d20Roll + attackModifiers.modifier;
    const criticalHit = d20Roll === 20;
    const criticalMiss = d20Roll === 1;

    const rollResult = {
      d20Roll,
      total,
      criticalHit,
      criticalFailure: criticalMiss
    };

    await processBattleAction({
      type: 'attack',
      name: attack.name,
      damage: attack.damage,
      attackData: attack,
      attackModifier: attackModifiers.modifier
    }, rollResult);
  };

  const handleDefend = async () => {
    setLoading(true);
    setLoadingPhase('Defending...');
    
    const activeChar = getActiveCharacter();
    const newLog = [...battleLog, `${activeChar.name} takes a defensive stance...`];
    setBattleLog(newLog);
    
    setTimeout(async () => {
      await processEnemyTurn();
      setLoading(false);
      setLoadingPhase('');
    }, 1000);
  };

  const handleUseItem = () => {
    const activeChar = getActiveCharacter();
    const usableItems = (activeChar.inventory || []).filter(item => item.usableInCombat);
    
    if (usableItems.length === 0) {
      alert('You have no items usable in combat!');
      return;
    }
    
    setShowItemSelection(true);
  };

  const handleItemSelect = async (item) => {
    setShowItemSelection(false);
    setLoading(true);
    setLoadingPhase('Using item...');

    const activeChar = getActiveCharacter();

    try {
      const response = await api.post('/api/game/battle/use-item', {
        character: activeChar,
        enemy: { ...gameState.currentEnemy, hp: currentEnemyHP },
        item: item,
        conversationHistory: gameState.conversationHistory,
        gameState
      });

      const newLog = [...battleLog, response.data.narration];
      setBattleLog(newLog);

      const playerDamage = response.data.playerDamage || 0;
      if (playerDamage > 0) {
        addDamageNumber(playerDamage, 'hit', true);
      }

      const newEnemyHP = Math.max(0, currentEnemyHP - playerDamage);
      setCurrentEnemyHP(newEnemyHP);

      let updatedCharacter = { ...activeChar };
      updatedCharacter.hp = Math.min(
        updatedCharacter.maxHp,
        updatedCharacter.hp + (response.data.playerHealing || 0)
      );

      if (response.data.itemConsumed) {
        updatedCharacter.inventory = updatedCharacter.inventory.filter(i => 
          i.name !== item.name || i.description !== item.description
        );
      }

      const updatedParty = getParty().map(member =>
        member.isActive ? updatedCharacter : member
      );

      const newGameState = {
        ...gameState,
        character: gameState.character.name === updatedCharacter.name ? updatedCharacter : gameState.character,
        party: updatedParty,
        currentEnemy: {
          ...gameState.currentEnemy,
          hp: newEnemyHP
        }
      };

      if (newEnemyHP <= 0) {
        handleVictory(newLog, updatedCharacter.hp, updatedCharacter.inventory);
        return;
      }

      updateGameState(newGameState);
      setTimeout(() => processEnemyTurn(), 1500);
    } catch (err) {
      console.error('Error using item:', err);
      setBattleLog([...battleLog, 'Failed to use item!']);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const handleTalk = async () => {
    setLoading(true);
    setLoadingPhase('Attempting to talk...');

    const activeChar = getActiveCharacter();
    const newLog = [...battleLog, `${activeChar.name} attempts to reason with ${gameState.currentEnemy.name}...`];
    setBattleLog(newLog);

    try {
      const response = await api.post('/api/game/dialog/action', {
        character: activeChar,
        npc: {
          name: gameState.currentEnemy.name,
          description: gameState.currentEnemy.description,
          relationship: 'hostile'
        },
        conversationHistory: gameState.conversationHistory || [],
        gameState,
        userAction: 'I try to talk and negotiate'
      });

      setBattleLog([...newLog, response.data.npcResponse]);
      
      if (response.data.dialogOptions.some(opt => opt.type === 'leave')) {
        updateGameState({
          ...gameState,
          encounterType: 'dialog',
          currentNPC: {
            name: gameState.currentEnemy.name,
            description: gameState.currentEnemy.description,
            wasEnemy: true
          },
          currentEnemy: null,
          inCombat: false
        });
      } else {
        setBattleLog([...newLog, `${gameState.currentEnemy.name} refuses to negotiate!`]);
        setTimeout(() => processEnemyTurn(), 1000);
      }
    } catch (err) {
      console.error('Error talking:', err);
      setBattleLog([...newLog, 'Your words fall on deaf ears...']);
      setTimeout(() => processEnemyTurn(), 1000);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const rollDamage = (damageString) => {
    try {
      const match = damageString.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
      if (!match) return 1;

      const numDice = parseInt(match[1]);
      const diceSize = parseInt(match[2]);
      const bonus = match[3] ? parseInt(match[3]) : 0;

      let total = bonus;
      for (let i = 0; i < numDice; i++) {
        total += Math.floor(Math.random() * diceSize) + 1;
      }

      return Math.max(1, total);
    } catch (err) {
      console.error('Error rolling damage:', err);
      return 1;
    }
  };

  const processBattleAction = async (action, rollResult) => {
    const activeChar = getActiveCharacter();

    try {
      const hit = rollResult.total >= gameState.currentEnemy.ac;
      const criticalHit = rollResult.criticalHit;
      const criticalMiss = rollResult.criticalFailure;
      
      let narration = '';
      let playerDamage = 0;
      
      if (criticalHit) {
        narration = `🎯 CRITICAL HIT! ${activeChar.name} strikes ${gameState.currentEnemy.name} with devastating force!`;
        const damageRoll = rollDamage(action.damage);
        playerDamage = damageRoll * 2;
        addDamageNumber(playerDamage, 'crit', true);
      } else if (criticalMiss) {
        narration = `💥 CRITICAL MISS! ${activeChar.name}'s ${action.name} goes completely awry!`;
        playerDamage = 0;
        addDamageNumber(0, 'miss', true);
      } else if (hit) {
        narration = `✔ ${activeChar.name}'s ${action.name} hits ${gameState.currentEnemy.name}!`;
        playerDamage = rollDamage(action.damage);
        addDamageNumber(playerDamage, 'hit', true);
      } else {
        narration = `✗ ${activeChar.name}'s ${action.name} misses ${gameState.currentEnemy.name}!`;
        playerDamage = 0;
        addDamageNumber(0, 'miss', true);
      }

      narration += ` (Rolled: ${rollResult.d20Roll} + ${action.attackModifier} = ${rollResult.total} vs AC ${gameState.currentEnemy.ac})`;
      
      if (playerDamage > 0) {
        narration += ` | Damage: ${playerDamage}`;
      }

      const newLog = [...battleLog, narration];
      setBattleLog(newLog);

      const newEnemyHP = Math.max(0, currentEnemyHP - playerDamage);
      setCurrentEnemyHP(newEnemyHP);

      const newGameState = {
        ...gameState,
        currentEnemy: {
          ...gameState.currentEnemy,
          hp: newEnemyHP
        }
      };

      if (newEnemyHP <= 0) {
        handleVictory(newLog, activeChar.hp);
        return;
      }

      updateGameState(newGameState);
      setTimeout(() => processEnemyTurn(), 1500);
    } catch (err) {
      console.error('Error processing battle action:', err);
      setBattleLog([...battleLog, 'An error occurred!']);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const processEnemyTurn = async () => {
    if (currentEnemyHP <= 0) {
      return;
    }

    setLoading(true);
    setLoadingPhase('Enemy attacking...');

    const activeChar = getActiveCharacter();

    try {
      const enemyAttack = gameState.currentEnemy.attacks[
        Math.floor(Math.random() * gameState.currentEnemy.attacks.length)
      ];

      const attackRoll = Math.floor(Math.random() * 20) + 1;
      const enemyModifier = Math.floor(gameState.currentEnemy.level / 2) + 2;
      const attackTotal = attackRoll + enemyModifier;
      
      const dexModifier = Math.floor((activeChar.dexterity - 10) / 2);
      let playerAC = 10 + dexModifier;
      
      const equippedArmor = activeChar.equipment?.armor;
      if (equippedArmor && equippedArmor.armorClass) {
        playerAC = equippedArmor.armorClass + (equippedArmor.allowsDex ? Math.min(dexModifier, 2) : 0);
      }
      
      const hit = attackTotal >= playerAC;

      let narration = '';
      let enemyDamage = 0;

      if (attackRoll === 20) {
        narration = `💥 ${gameState.currentEnemy.name} scores a CRITICAL HIT with ${enemyAttack.name}!`;
        enemyDamage = rollDamage(enemyAttack.damage) * 2;
        addDamageNumber(enemyDamage, 'crit', false);
      } else if (attackRoll === 1) {
        narration = `${gameState.currentEnemy.name}'s ${enemyAttack.name} completely misses!`;
        enemyDamage = 0;
        addDamageNumber(0, 'miss', false);
      } else if (hit) {
        narration = `${gameState.currentEnemy.name} hits ${activeChar.name} with ${enemyAttack.name}!`;
        enemyDamage = rollDamage(enemyAttack.damage);
        addDamageNumber(enemyDamage, 'hit', false);
      } else {
        narration = `${gameState.currentEnemy.name}'s ${enemyAttack.name} misses ${activeChar.name}!`;
        enemyDamage = 0;
        addDamageNumber(0, 'miss', false);
      }

      narration += ` (${attackRoll} + ${enemyModifier} = ${attackTotal} vs AC ${playerAC})`;
      
      if (enemyDamage > 0) {
        narration += ` | Damage: ${enemyDamage}`;
      }

      const newLog = [...battleLog, narration];
      setBattleLog(newLog);

      let updatedCharacter = { ...activeChar };
      updatedCharacter.hp = Math.max(0, updatedCharacter.hp - enemyDamage);

      const updatedParty = getParty().map(member =>
        member.isActive ? updatedCharacter : member
      );

      const newGameState = {
        ...gameState,
        character: gameState.character.name === updatedCharacter.name ? updatedCharacter : gameState.character,
        party: updatedParty,
        currentEnemy: {
          ...gameState.currentEnemy,
          hp: currentEnemyHP
        }
      };

      if (updatedCharacter.hp <= 0) {
        checkPartyWipe(newGameState, newLog);
      } else {
        updateGameState(newGameState);
      }
    } catch (err) {
      console.error('Error in enemy turn:', err);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const checkPartyWipe = (currentGameState, currentLog) => {
    const party = currentGameState.party || [currentGameState.character];
    const aliveMembers = party.filter(m => m.hp > 0);
    
    if (aliveMembers.length > 0) {
      const newActiveIndex = party.findIndex(m => m.hp > 0);
      const newParty = party.map((member, i) => ({
        ...member,
        isActive: i === newActiveIndex
      }));
      
      const fallenMember = party.find(m => m.isActive);
      const newLog = [...currentLog, `${fallenMember.name} has fallen! ${newParty[newActiveIndex].name} steps up to fight!`];
      setBattleLog(newLog);
      
      updateGameState({
        ...currentGameState,
        party: newParty
      });
    } else {
      handleDefeat();
    }
  };

  const generateCombatSummary = async (enemyName, battleLog) => {
    setLoadingPhase('Generating combat summary...');
    
    try {
      const response = await api.post('/api/game/combat/generate-summary', {
        enemyName,
        battleLog,
        character: getActiveCharacter(),
        gameState
      });

      return response.data;
    } catch (err) {
      console.error('Error generating combat summary:', err);
      return {
        summary: `You defeated ${enemyName} in combat.`,
        consequences: [],
        isNPCDeath: false
      };
    }
  };

  const handleVictory = async (log, newHP, newInventory = null) => {
    const activeChar = getActiveCharacter();
    const enemyName = gameState.currentEnemy.name;
    const xpGained = gameState.currentEnemy.xpReward || 100;
    
    let updatedCharacter = { ...activeChar };
    updatedCharacter.hp = newHP;
    updatedCharacter.xp = updatedCharacter.xp + xpGained;
    if (newInventory) {
      updatedCharacter.inventory = newInventory;
    }

    const leveledUp = updatedCharacter.xp >= updatedCharacter.xpToNextLevel;

    const victoryLog = [...log, `Victory! ${activeChar.name} gained ${xpGained} XP!`];
    
    if (leveledUp) {
      victoryLog.push('🎉 Level up!');
    }

    setBattleLog(victoryLog);

    const combatSummaryData = await generateCombatSummary(enemyName, victoryLog);

    const updatedParty = getParty().map(member =>
      member.isActive ? updatedCharacter : member
    );

    const newDeadNPCs = gameState.deadNPCs || [];
    if (combatSummaryData.isNPCDeath) {
      newDeadNPCs.push(enemyName);
    }

    const newConsequenceLog = gameState.consequenceLog || [];
    if (combatSummaryData.consequences && combatSummaryData.consequences.length > 0) {
      newConsequenceLog.push({
        type: 'combat',
        enemy: enemyName,
        consequences: combatSummaryData.consequences,
        timestamp: Date.now()
      });
    }

    const newCombatHistory = gameState.combatHistory || [];
    newCombatHistory.push({
      enemy: enemyName,
      log: victoryLog,
      timestamp: Date.now()
    });

    setTimeout(() => {
      updateGameState({
        ...gameState,
        encounterType: 'normal',
        currentEnemy: null,
        inCombat: false,
        character: gameState.character.name === updatedCharacter.name ? updatedCharacter : gameState.character,
        party: updatedParty,
        deadNPCs: newDeadNPCs,
        consequenceLog: newConsequenceLog,
        combatHistory: newCombatHistory,
        battleSummary: combatSummaryData.summary,
        battleConsequences: combatSummaryData.consequences,
        shouldGenerateAftermath: true,
        lastNarration: null,
        lastOptions: null,
        lastActionHistory: []
      });

      if (leveledUp && onLevelUp) {
        onLevelUp();
      }
    }, 2000);
  };

  const handleDefeat = () => {
    setBattleLog([...battleLog, '💀 Your party has been defeated...']);
    setGameOver(true);
  };

  const handleGameOverRestart = () => {
    localStorage.removeItem('dnd-ollama-game-state');
    window.location.href = '/';
  };

  const getHPPercentage = (current, max) => {
    return Math.max(0, Math.min(100, (current / max) * 100));
  };

  if (!gameState.currentEnemy) {
    return (
      <div className="battle-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Preparing battle...</div>
        </div>
      </div>
    );
  }

  const activeChar = getActiveCharacter();
  const party = getParty();
  const displayEnemyHP = currentEnemyHP !== null ? currentEnemyHP : gameState.currentEnemy.hp;

  if (gameOver) {
    return <GameOverScreen onRestart={handleGameOverRestart} />;
  }

  return (
    <div className="battle-container">
      <style>{`
        .damage-number {
          position: fixed;
          font-size: 32px;
          font-weight: bold;
          pointer-events: none;
          z-index: 1000;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
          animation: damageFloat 1.5s ease-out forwards;
        }

        @keyframes damageFloat {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 1;
          }
          50% {
            transform: translateY(-40px) scale(1.1);
            opacity: 1;
          }
          100% {
            transform: translateY(-80px) scale(1);
            opacity: 0;
          }
        }

        .damage-hit {
          color: #ffffff;
        }

        .damage-crit {
          color: #ff0000;
          font-size: 48px;
          animation: critFloat 1.5s ease-out forwards;
        }

        @keyframes critFloat {
          0% {
            transform: translateY(0) scale(0.8) rotate(-5deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-50px) scale(1.3) rotate(5deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1) rotate(0deg);
            opacity: 0;
          }
        }

        .damage-miss {
          color: #888888;
          font-size: 24px;
        }

        .turn-order-display {
          position: fixed;
          right: 20px;
          top: 80px;
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid #444;
          border-radius: 8px;
          padding: 15px;
          min-width: 180px;
          max-width: 200px;
          z-index: 100;
        }

        .turn-order-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          text-align: center;
          color: #ffd700;
        }

        .turn-order-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          margin-bottom: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .turn-order-icon {
          font-size: 20px;
        }

        .turn-order-info {
          flex: 1;
        }

        .turn-order-name {
          font-size: 12px;
          font-weight: bold;
        }

        .turn-order-hp {
          font-size: 10px;
          color: #aaa;
        }

        .game-over-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeInOverlay 1s;
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .game-over-content {
          text-align: center;
          animation: gameOverAppear 1.5s;
        }

        @keyframes gameOverAppear {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .game-over-title {
          font-size: 96px;
          font-weight: bold;
          color: #ff0000;
          text-shadow: 0 0 30px rgba(255, 0, 0, 0.8);
          margin-bottom: 20px;
          letter-spacing: 8px;
        }

        .game-over-subtitle {
          font-size: 20px;
          color: #aaa;
          margin-bottom: 40px;
        }

        .game-over-button {
          padding: 15px 40px;
          font-size: 18px;
          background: #333;
          border: 2px solid #666;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s;
        }

        .game-over-button:hover {
          background: #444;
          border-color: #888;
        }
      `}</style>

      {damageNumbers.map(dn => (
        <DamageNumber key={dn.id} {...dn} />
      ))}

      <TurnOrderDisplay 
        player={activeChar} 
        enemy={gameState.currentEnemy} 
        party={party.filter(p => !p.isActive)}
      />

      {showItemSelection && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowItemSelection(false)}>×</button>
            <h2 className="modal-title">Use Item</h2>
            <div className="item-selection-list">
              {(activeChar.inventory || [])
                .filter(item => item.usableInCombat)
                .map((item, index) => (
                  <button
                    key={index}
                    className="item-selection-button"
                    onClick={() => handleItemSelect(item)}
                  >
                    <div className="item-name">{item.name}</div>
                    <div className="item-description">{item.description}</div>
                    {item.effect && <div className="item-effect">Effect: {item.effect}</div>}
                  </button>
                ))}
              {(activeChar.inventory || []).filter(item => item.usableInCombat).length === 0 && (
                <div className="empty-state">No usable items in combat</div>
              )}
            </div>
          </div>
        </div>
      )}

      {showPartySwap && (
        <div className="modal-overlay">
          <div className="modal-content party-swap-modal">
            <button className="modal-close" onClick={() => setShowPartySwap(false)}>×</button>
            <h2 className="modal-title">Swap Party Member</h2>
            <p className="modal-subtitle">Swapping will cost your turn - the enemy will attack next!</p>
            <div className="party-swap-list">
              {party.map((member, index) => (
                <button
                  key={index}
                  className={`party-swap-button ${member.isActive ? 'active' : ''} ${member.hp === 0 ? 'dead' : ''}`}
                  onClick={() => handleSwapPartyMember(index)}
                  disabled={member.isActive || member.hp === 0}
                >
                  <div className="member-info">
                    <div className="member-name">
                      {member.name} {member.isActive && '⚔️'}
                    </div>
                    <div className="member-class">
                      {member.class} Lv.{member.level}
                    </div>
                    <div className="member-hp">
                      HP: {member.hp}/{member.maxHp}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="battle-field">
        <div className="combatant enemy-combatant">
          <div className="combatant-name">{gameState.currentEnemy.name}</div>
          <div className="combatant-level">Level {gameState.currentEnemy.level}</div>
          <div className="hp-bar">
            <div className="hp-label">HP</div>
            <div className="hp-track">
              <div 
                className="hp-fill enemy-hp"
                style={{ width: `${getHPPercentage(displayEnemyHP, gameState.currentEnemy.maxHp)}%` }}
              />
            </div>
            <div className="hp-value">
              {displayEnemyHP}/{gameState.currentEnemy.maxHp}
            </div>
          </div>
          <div className="combatant-ac">AC: {gameState.currentEnemy.ac}</div>
        </div>

        <div className="combatant player-combatant">
          <div className="combatant-name">{activeChar.name}</div>
          <div className="combatant-level">Level {activeChar.level}</div>
          <div className="hp-bar">
            <div className="hp-label">HP</div>
            <div className="hp-track">
              <div 
                className="hp-fill player-hp"
                style={{ width: `${getHPPercentage(activeChar.hp, activeChar.maxHp)}%` }}
              />
            </div>
            <div className="hp-value">
              {activeChar.hp}/{activeChar.maxHp}
            </div>
          </div>
        </div>

        {party.length > 1 && (
          <div className="party-display-battle">
            <h4>Party</h4>
            <div className="party-members-battle">
              {party.map((member, index) => (
                <div 
                  key={index} 
                  className={`party-member-battle ${member.isActive ? 'active' : ''} ${member.hp === 0 ? 'dead' : ''}`}
                >
                  <div className="member-name-battle">{member.name}</div>
                  <div className="member-hp-battle">
                    {member.hp}/{member.maxHp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="battle-log">
          <div className="battle-log-header">Battle Log</div>
          <div className="battle-log-content">
            {battleLog.map((entry, index) => (
              <div key={index} className="log-entry">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry}</ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="battle-actions">
        <div className="action-tabs">
          <button
            className={`action-tab ${activeTab === 'attack' ? 'active' : ''}`}
            onClick={() => setActiveTab('attack')}
            disabled={loading}
          >
            Attack
          </button>
          <button
            className={`action-tab ${activeTab === 'other' ? 'active' : ''}`}
            onClick={() => setActiveTab('other')}
            disabled={loading}
          >
            Actions
          </button>
          {party.length > 1 && (
            <button
              className={`action-tab ${activeTab === 'party' ? 'active' : ''}`}
              onClick={() => setActiveTab('party')}
              disabled={loading}
            >
              Party
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">{loadingPhase}</div>
          </div>
        ) : (
          <>
            {activeTab === 'attack' && (
              <div className="attack-grid">
                {(activeChar.attacks || []).map((attack, index) => (
                  <button
                    key={index}
                    className="attack-button"
                    onClick={() => handleAttackSelect(attack)}
                  >
                    <div className="attack-name">{attack.name}</div>
                    <div className="attack-damage">{attack.damage}</div>
                    {attack.description && (
                      <div className="attack-description">{attack.description}</div>
                    )}
                  </button>
                ))}
                {(!activeChar.attacks || activeChar.attacks.length === 0) && (
                  <div className="empty-state">No attacks available</div>
                )}
              </div>
            )}

            {activeTab === 'other' && (
              <div className="other-actions">
                <button className="other-button" onClick={handleDefend}>
                  <span className="other-icon">🛡️</span>
                  <span className="other-text">Defend</span>
                </button>
                <button className="other-button" onClick={handleUseItem}>
                  <span className="other-icon">🧪</span>
                  <span className="other-text">Use Item</span>
                </button>
                <button className="other-button" onClick={handleTalk}>
                  <span className="other-icon">💬</span>
                  <span className="other-text">Talk</span>
                </button>
              </div>
            )}

            {activeTab === 'party' && party.length > 1 && (
              <div className="party-actions">
                <button 
                  className="party-action-button"
                  onClick={() => setShowPartySwap(true)}
                >
                  🔄 Swap Active Member
                </button>
                <div className="party-action-note">
                  Swapping costs your turn!
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Battle;