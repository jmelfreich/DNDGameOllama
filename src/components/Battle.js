// frontend/src/components/Battle.js - COMPLETE FIX
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import DiceRoller from './DiceRoller';

function Battle({ gameState, updateGameState, onLevelUp }) {
  const [battleLog, setBattleLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [showDiceRoll, setShowDiceRoll] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [activeTab, setActiveTab] = useState('attack');
  const [showItemSelection, setShowItemSelection] = useState(false);

  useEffect(() => {
    if (!gameState.currentEnemy) {
      console.warn('No enemy found in battle mode, generating enemy...');
      generateEnemy();
    } else {
      setBattleLog([
        `A ${gameState.currentEnemy.name} appears!`,
        gameState.currentEnemy.description || 'The enemy prepares to attack.'
      ]);
    }
  }, []);

  const generateEnemy = async () => {
    setLoading(true);
    setLoadingPhase('Generating enemy...');

    try {
      const response = await api.post('/api/game/battle/generate-enemy', {
        character: gameState.character,
        location: gameState.currentLocation || 'unknown location',
        difficulty: 'normal'
      });

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

  const handleAttackSelect = (attack) => {
    setSelectedAction({
      type: 'attack',
      name: attack.name,
      damage: attack.damage,
      attackData: attack
    });
    setShowDiceRoll(true);
  };

  const handleDefend = async () => {
    setLoading(true);
    setLoadingPhase('Defending...');
    
    const newLog = [...battleLog, 'You take a defensive stance...'];
    setBattleLog(newLog);
    
    setTimeout(async () => {
      await processEnemyTurn();
      setLoading(false);
      setLoadingPhase('');
    }, 1000);
  };

  const handleUseItem = () => {
    const usableItems = (gameState.character.inventory || []).filter(item => item.usableInCombat);
    
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

    try {
      const response = await api.post('/api/game/battle/use-item', {
        character: gameState.character,
        enemy: gameState.currentEnemy,
        item: item,
        conversationHistory: gameState.conversationHistory,
        gameState
      });

      const newLog = [...battleLog, response.data.narration];
      setBattleLog(newLog);

      const newEnemyHP = Math.max(0, gameState.currentEnemy.hp - (response.data.playerDamage || 0));
      const newCharacterHP = Math.min(
        gameState.character.maxHp,
        gameState.character.hp + (response.data.playerHealing || 0)
      );

      let newInventory = gameState.character.inventory;
      if (response.data.itemConsumed) {
        newInventory = gameState.character.inventory.filter(i => i.id !== item.id);
      }

      if (response.data.battleEnd && response.data.victory) {
        handleVictory(newLog, newCharacterHP, newInventory);
      } else if (newCharacterHP <= 0) {
        handleDefeat();
      } else {
        updateGameState({
          ...gameState,
          currentEnemy: {
            ...gameState.currentEnemy,
            hp: newEnemyHP
          },
          character: {
            ...gameState.character,
            hp: newCharacterHP,
            inventory: newInventory
          }
        });

        if (!response.data.battleEnd) {
          setTimeout(() => processEnemyTurn(), 1000);
        }
      }
    } catch (err) {
      console.error('Error using item:', err);
      setBattleLog([...battleLog, 'Failed to use item...']);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const handleTalk = async () => {
    setLoading(true);
    setLoadingPhase('Attempting to talk...');
    
    const newLog = [...battleLog, 'You attempt to reason with your opponent...'];
    setBattleLog(newLog);
    
    try {
      const response = await api.post('/api/game/dialog/action', {
        character: gameState.character,
        npc: { 
          name: gameState.currentEnemy.name, 
          description: gameState.currentEnemy.description,
          type: 'enemy' 
        },
        conversationHistory: [{
          role: 'user',
          content: 'I want to talk and negotiate instead of fighting.'
        }],
        gameState
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

  const handleRollComplete = async (result) => {
    setShowDiceRoll(false);
    
    if (!result || !selectedAction) {
      console.error('Missing result or action');
      setSelectedAction(null);
      return;
    }

    await processBattleAction(selectedAction, result);
    setSelectedAction(null);
  };

  const processBattleAction = async (action, rollResult) => {
    setLoading(true);
    setLoadingPhase('Processing attack...');

    try {
      // Determine hit/miss based on roll
      const hit = rollResult.success || rollResult.criticalHit;
      const criticalHit = rollResult.criticalHit;
      
      let narration = '';
      let playerDamage = 0;
      
      if (criticalHit) {
        narration = `🎯 CRITICAL HIT! You strike ${gameState.currentEnemy.name} with devastating force!`;
        // Critical hits do double damage
        const damageRoll = rollDamage(action.damage);
        playerDamage = damageRoll * 2;
      } else if (hit) {
        narration = `✓ Your ${action.name} hits ${gameState.currentEnemy.name}!`;
        playerDamage = rollDamage(action.damage);
      } else {
        narration = `✗ Your ${action.name} misses ${gameState.currentEnemy.name}!`;
        playerDamage = 0;
      }

      narration += ` (Rolled: ${rollResult.roll} + ${rollResult.modifier} = ${rollResult.total} vs AC ${gameState.currentEnemy.ac})`;
      
      if (playerDamage > 0) {
        narration += ` Damage: ${playerDamage}`;
      }

      const newLog = [...battleLog, narration];
      setBattleLog(newLog);

      const newEnemyHP = Math.max(0, gameState.currentEnemy.hp - playerDamage);
      const battleEnd = newEnemyHP <= 0;

      if (battleEnd) {
        const victoryLog = [...newLog, `${gameState.currentEnemy.name} has been defeated!`];
        setBattleLog(victoryLog);
        handleVictory(victoryLog, gameState.character.hp);
      } else {
        updateGameState({
          ...gameState,
          currentEnemy: {
            ...gameState.currentEnemy,
            hp: newEnemyHP
          }
        });

        // Enemy turn after a short delay
        setTimeout(() => processEnemyTurn(), 1500);
      }
    } catch (err) {
      console.error('Error in battle action:', err);
      setBattleLog([...battleLog, 'An error occurred in combat...']);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const rollDamage = (damageString) => {
    // Parse damage string like "1d8", "2d6+3", etc.
    try {
      const match = damageString.match(/(\d+)d(\d+)([+\-]\d+)?/);
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

  const processEnemyTurn = async () => {
    if (!gameState.currentEnemy || gameState.currentEnemy.hp <= 0) {
      return;
    }

    setLoading(true);
    setLoadingPhase('Enemy attacking...');

    try {
      const enemyAttack = gameState.currentEnemy.attacks[
        Math.floor(Math.random() * gameState.currentEnemy.attacks.length)
      ];

      // Enemy attack roll
      const attackRoll = Math.floor(Math.random() * 20) + 1;
      const enemyModifier = Math.floor(gameState.currentEnemy.level / 2) + 2;
      const attackTotal = attackRoll + enemyModifier;
      
      // Calculate player AC (10 + dex modifier, simplified)
      const playerAC = 10 + Math.floor((gameState.character.dexterity - 10) / 2);
      const hit = attackTotal >= playerAC;

      let narration = '';
      let enemyDamage = 0;

      if (attackRoll === 20) {
        narration = `💥 ${gameState.currentEnemy.name} scores a critical hit with ${enemyAttack.name}!`;
        enemyDamage = rollDamage(enemyAttack.damage) * 2;
      } else if (hit) {
        narration = `${gameState.currentEnemy.name} hits you with ${enemyAttack.name}!`;
        enemyDamage = rollDamage(enemyAttack.damage);
      } else {
        narration = `${gameState.currentEnemy.name}'s ${enemyAttack.name} misses you!`;
        enemyDamage = 0;
      }

      if (enemyDamage > 0) {
        narration += ` Damage: ${enemyDamage}`;
      }

      const newLog = [...battleLog, narration];
      setBattleLog(newLog);

      const newCharacterHP = Math.max(0, gameState.character.hp - enemyDamage);

      if (newCharacterHP <= 0) {
        handleDefeat();
      } else {
        updateGameState({
          ...gameState,
          character: {
            ...gameState.character,
            hp: newCharacterHP
          }
        });
      }
    } catch (err) {
      console.error('Error in enemy turn:', err);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const handleVictory = (log, newHP, newInventory = null) => {
    const xpGained = gameState.currentEnemy.xpReward || 100;
    const newXP = gameState.character.xp + xpGained;
    const leveledUp = newXP >= gameState.character.xpToNextLevel;

    const victoryLog = [...log, `Victory! You gained ${xpGained} XP!`];
    
    if (leveledUp) {
      victoryLog.push('🎉 You leveled up!');
    }

    setBattleLog(victoryLog);

    setTimeout(() => {
      updateGameState({
        ...gameState,
        encounterType: 'normal',
        currentEnemy: null,
        inCombat: false,
        character: {
          ...gameState.character,
          hp: newHP,
          xp: newXP,
          inventory: newInventory || gameState.character.inventory
        }
      });

      if (leveledUp && onLevelUp) {
        onLevelUp();
      }
    }, 2000);
  };

  const handleDefeat = () => {
    setBattleLog([...battleLog, '💀 You have been defeated...']);
    
    setTimeout(() => {
      alert('Game Over! Returning to menu...');
      localStorage.removeItem('dnd-ollama-game-state');
      window.location.href = '/';
    }, 2000);
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

  return (
    <div className="battle-container">
      {showDiceRoll && selectedAction && (
        <DiceRoller
          character={gameState.character}
          skill="attack"
          dc={gameState.currentEnemy.ac}
          attackRoll={true}
          onComplete={handleRollComplete}
          onCancel={() => {
            setShowDiceRoll(false);
            setSelectedAction(null);
          }}
        />
      )}

      {showItemSelection && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowItemSelection(false)}>×</button>
            <h2 className="modal-title">Use Item</h2>
            <div className="item-selection-list">
              {(gameState.character.inventory || [])
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
              {(gameState.character.inventory || []).filter(item => item.usableInCombat).length === 0 && (
                <div className="empty-state">No usable items in combat</div>
              )}
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
                style={{ width: `${getHPPercentage(gameState.currentEnemy.hp, gameState.currentEnemy.maxHp)}%` }}
              />
            </div>
            <div className="hp-value">
              {gameState.currentEnemy.hp}/{gameState.currentEnemy.maxHp}
            </div>
          </div>
          <div className="combatant-ac">AC: {gameState.currentEnemy.ac}</div>
        </div>

        <div className="combatant player-combatant">
          <div className="combatant-name">{gameState.character.name}</div>
          <div className="combatant-level">Level {gameState.character.level}</div>
          <div className="hp-bar">
            <div className="hp-label">HP</div>
            <div className="hp-track">
              <div 
                className="hp-fill player-hp"
                style={{ width: `${getHPPercentage(gameState.character.hp, gameState.character.maxHp)}%` }}
              />
            </div>
            <div className="hp-value">
              {gameState.character.hp}/{gameState.character.maxHp}
            </div>
          </div>
        </div>
      </div>

      <div className="battle-log">
        <div className="battle-log-header">Battle Log</div>
        <div className="battle-log-content">
          {battleLog.map((entry, index) => (
            <div key={index} className="log-entry">{entry}</div>
          ))}
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
                {(gameState.character.attacks || []).map((attack, index) => (
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
                {(!gameState.character.attacks || gameState.character.attacks.length === 0) && (
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
          </>
        )}
      </div>
    </div>
  );
}

export default Battle;