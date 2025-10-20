// frontend/src/components/Dialog.js - FIXED NULL CHECK
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import DiceRoller from './DiceRoller';

function Dialog({ gameState, updateGameState }) {
  const [npcResponse, setNpcResponse] = useState('');
  const [dialogOptions, setDialogOptions] = useState([]);
  const [conversationLog, setConversationLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [showDiceRoll, setShowDiceRoll] = useState(false);
  const [currentRoll, setCurrentRoll] = useState(null);
  const [customDialog, setCustomDialog] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [shopMode, setShopMode] = useState(null);
  const [shopInventory, setShopInventory] = useState([]);

  // FIXED: Call hooks FIRST, then handle null check
  useEffect(() => {
    // Check for NPC inside useEffect
    if (!gameState?.currentNPC) {
      console.warn('No NPC found in dialog mode, returning to normal play');
      updateGameState({
        ...gameState,
        encounterType: 'normal',
        currentNPC: null
      });
      return;
    }
    
    initializeDialog();
  }, []);

  // Early return AFTER all hooks
  if (!gameState?.currentNPC) {
    return (
      <div className="dialog-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Returning to exploration...</div>
        </div>
      </div>
    );
  }

  const initializeDialog = async () => {
    setLoading(true);
    setLoadingPhase('Starting conversation...');

    try {
      const response = await api.post('/api/game/dialog/action', {
        character: gameState.character,
        npc: gameState.currentNPC,
        conversationHistory: [
          {
            role: 'user',
            content: `I approach ${gameState.currentNPC.name}. ${gameState.currentNPC.description || ''}`
          }
        ],
        gameState
      });

      setNpcResponse(response.data.npcResponse);
      setDialogOptions(response.data.dialogOptions);
      setConversationLog([
        { speaker: gameState.currentNPC.name, text: response.data.npcResponse }
      ]);
    } catch (err) {
      console.error('Error initializing dialog:', err);
      setNpcResponse('...');
      setDialogOptions([
        { id: 1, text: 'Leave', type: 'leave', requiresRoll: false }
      ]);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const handleOptionSelect = async (option) => {
    if (option.type === 'leave') {
      updateGameState({
        ...gameState,
        encounterType: 'normal',
        currentNPC: null
      });
      return;
    }

    if (option.type === 'buy' || option.type === 'sell') {
      await enterShopMode(option.type);
      return;
    }

    if (option.requiresRoll) {
      setCurrentRoll({
        option,
        skill: option.skill,
        dc: option.dc
      });
      setShowDiceRoll(true);
      return;
    }

    await processDialogOption(option, null);
  };

  const handleCustomDialog = async () => {
    if (!customDialog.trim()) {
      return;
    }

    const customOption = {
      id: 999,
      text: customDialog,
      type: 'talk',
      requiresRoll: false
    };

    setCustomDialog('');
    setShowCustomInput(false);
    await processDialogOption(customOption, null);
  };

  const handleRollComplete = async (result) => {
    setShowDiceRoll(false);
    await processDialogOption(currentRoll.option, result);
    setCurrentRoll(null);
  };

  const processDialogOption = async (option, rollResult) => {
    setLoading(true);
    setLoadingPhase('NPC is thinking...');
    setDialogOptions([]);

    const newLog = [
      ...conversationLog,
      { speaker: gameState.character.name, text: option.text }
    ];
    setConversationLog(newLog);

    try {
      const userMessage = {
        role: 'user',
        content: `Player says: "${option.text}"${rollResult ? `. ${option.skill} roll: ${rollResult.total} (${rollResult.success ? 'Success' : 'Failure'})` : ''}`
      };

      const response = await api.post('/api/game/dialog/action', {
        character: gameState.character,
        npc: gameState.currentNPC,
        conversationHistory: [...gameState.conversationHistory, userMessage],
        gameState
      });

      setNpcResponse(response.data.npcResponse);
      setDialogOptions(response.data.dialogOptions);
      setConversationLog([
        ...newLog,
        { speaker: gameState.currentNPC.name, text: response.data.npcResponse }
      ]);

      updateGameState({
        ...gameState,
        conversationHistory: [
          ...gameState.conversationHistory,
          userMessage,
          {
            role: 'assistant',
            content: JSON.stringify(response.data)
          }
        ]
      });
    } catch (err) {
      console.error('Error processing dialog:', err);
      setNpcResponse('...');
      setDialogOptions([
        { id: 1, text: 'Leave', type: 'leave', requiresRoll: false }
      ]);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const enterShopMode = async (mode) => {
    setShopMode(mode);
    
    if (mode === 'buy') {
      try {
        const response = await api.get('/api/game/items');
        const affordableItems = response.data.filter(item => 
          item.price <= gameState.character.gold
        );
        setShopInventory(affordableItems.slice(0, 20));
      } catch (err) {
        console.error('Error loading shop inventory:', err);
        setShopInventory([]);
      }
    } else if (mode === 'sell') {
      setShopInventory(gameState.character.inventory || []);
    }
  };

  const handleBuyItem = async (item) => {
    if (gameState.character.gold < item.price) {
      alert('Not enough gold!');
      return;
    }

    const newInventory = [...(gameState.character.inventory || []), item];
    const newGold = gameState.character.gold - item.price;

    updateGameState({
      ...gameState,
      character: {
        ...gameState.character,
        inventory: newInventory,
        gold: newGold
      }
    });

    alert(`Purchased ${item.name} for ${item.price} gold!`);
    setShopMode(null);
    setShopInventory([]);
  };

  const handleSellItem = async (item, index) => {
    const sellPrice = Math.floor(item.price * 0.5);
    const newInventory = [...gameState.character.inventory];
    newInventory.splice(index, 1);
    const newGold = gameState.character.gold + sellPrice;

    updateGameState({
      ...gameState,
      character: {
        ...gameState.character,
        inventory: newInventory,
        gold: newGold
      }
    });

    alert(`Sold ${item.name} for ${sellPrice} gold!`);
    setShopMode(null);
    setShopInventory([]);
  };

  return (
    <div className="dialog-container">
      {showDiceRoll && currentRoll && (
        <DiceRoller
          character={gameState.character}
          skill={currentRoll.skill}
          dc={currentRoll.dc}
          onComplete={handleRollComplete}
          onCancel={() => setShowDiceRoll(false)}
        />
      )}

      <div className="dialog-header">
        <h1 className="npc-name">{gameState.currentNPC.name}</h1>
        <div className="dialog-type">
          {shopMode ? `Shop - ${shopMode === 'buy' ? 'Buying' : 'Selling'}` : 'Conversation'}
        </div>
      </div>

      <div className="conversation-log">
        {conversationLog.map((entry, index) => (
          <div 
            key={index} 
            className={`conversation-entry ${entry.speaker === gameState.character.name ? 'player' : 'npc'}`}
          >
            <div className="speaker-name">{entry.speaker}</div>
            <div className="speaker-text">{entry.text}</div>
          </div>
        ))}
      </div>

      {shopMode ? (
        <div className="shop-container">
          <button 
            className="shop-back-button"
            onClick={() => setShopMode(null)}
          >
            ← Back to Conversation
          </button>

          <div className="shop-gold">
            Your Gold: {gameState.character.gold} gp
          </div>

          <div className="shop-items">
            {shopMode === 'buy' ? (
              shopInventory.length > 0 ? (
                shopInventory.map((item, index) => (
                  <div key={index} className="shop-item">
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-description">{item.description}</div>
                      <div className="item-type">{item.type}</div>
                    </div>
                    <div className="item-actions">
                      <div className="item-price">{item.price} gp</div>
                      <button
                        className="buy-button"
                        onClick={() => handleBuyItem(item)}
                        disabled={gameState.character.gold < item.price}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No items available for purchase</div>
              )
            ) : (
              shopInventory.length > 0 ? (
                shopInventory.map((item, index) => (
                  <div key={index} className="shop-item">
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-description">{item.description}</div>
                      <div className="item-type">{item.type}</div>
                    </div>
                    <div className="item-actions">
                      <div className="item-price">{Math.floor(item.price * 0.5)} gp</div>
                      <button
                        className="sell-button"
                        onClick={() => handleSellItem(item, index)}
                      >
                        Sell
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No items to sell</div>
              )
            )}
          </div>
        </div>
      ) : (
        <>
          {!loading && (
            <div className="dialog-options">
              {dialogOptions.map(option => (
                <button
                  key={option.id}
                  className={`dialog-option ${option.type}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <span className="option-number">{option.id.toString().padStart(2, '0')}</span>
                  <span className="option-text">{option.text}</span>
                  {option.requiresRoll && (
                    <span className="option-badge">{option.skill} DC {option.dc}</span>
                  )}
                </button>
              ))}

              {!showCustomInput && (
                <button
                  className="dialog-option custom-dialog-toggle"
                  onClick={() => setShowCustomInput(true)}
                >
                  <span className="option-number">✎</span>
                  <span className="option-text">Say something else...</span>
                </button>
              )}
            </div>
          )}

          {showCustomInput && !loading && (
            <div className="custom-dialog-container">
              <div className="custom-dialog-label">What do you say?</div>
              <textarea
                className="custom-dialog-input"
                value={customDialog}
                onChange={(e) => setCustomDialog(e.target.value)}
                placeholder="I'd like to ask about the ancient ruins..."
                rows={3}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCustomDialog();
                  }
                }}
              />
              <div className="custom-dialog-buttons">
                <button
                  className="custom-dialog-submit"
                  onClick={handleCustomDialog}
                  disabled={!customDialog.trim()}
                >
                  Say It
                </button>
                <button
                  className="custom-dialog-cancel"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomDialog('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">{loadingPhase}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dialog;