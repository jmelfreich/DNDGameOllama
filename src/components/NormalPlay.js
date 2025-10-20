// frontend/src/components/NormalPlay.js - ENHANCED WITH SCROLLABLE HISTORY
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../utils/api';
import DiceRoller from './DiceRoller';

function NormalPlay({ gameState, updateGameState, onLevelUp, onShowCharacterSheet }) {
  const [narration, setNarration] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [showDiceRoll, setShowDiceRoll] = useState(false);
  const [currentRoll, setCurrentRoll] = useState(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [sceneImage, setSceneImage] = useState(null);
  const [customAction, setCustomAction] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [actionHistory, setActionHistory] = useState([]);
  const [fullHistory, setFullHistory] = useState([]);
  const historyEndRef = useRef(null);

  useEffect(() => {
    if (gameState.shouldGenerateAftermath) {
      // Generate aftermath scene after combat or dialog
      generateAftermathScene();
    } else if (gameState.lastNarration && gameState.lastOptions) {
      setNarration(gameState.lastNarration);
      setOptions(gameState.lastOptions);
      if (gameState.lastActionHistory) {
        setActionHistory(gameState.lastActionHistory);
      }
      if (gameState.fullPlayHistory) {
        setFullHistory(gameState.fullPlayHistory);
      }
    } else if (!narration) {
      generateInitialScene();
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when history updates
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [fullHistory]);

  const generateInitialScene = async () => {
    setLoading(true);
    setLoadingPhase('Starting your adventure...');
    
    try {
      setTimeout(() => {
        if (loading) setLoadingPhase('Generating the opening scene...');
      }, 1000);

      let contextMessage = `Begin the adventure. The character has just arrived at ${gameState.currentLocation}. ${gameState.campaign.description}`;

      if (gameState.dialogSummary) {
        contextMessage += `\n\nRecent dialog: ${gameState.dialogSummary}`;
      }

      if (gameState.battleSummary) {
        contextMessage += `\n\nRecent combat: ${gameState.battleSummary}`;
      }

      const response = await api.post('/api/game/play/action', {
        character: gameState.character,
        gameState: {
          currentLocation: gameState.currentLocation,
          activeQuests: gameState.activeQuests,
          encounterType: gameState.encounterType,
          deadNPCs: gameState.deadNPCs || [],
          consequenceLog: gameState.consequenceLog || [],
          npcRelationships: gameState.npcRelationships || {}
        },
        party: gameState.party || [gameState.character],
        conversationHistory: [
          {
            role: 'user',
            content: contextMessage
          }
        ]
      });

      setNarration(response.data.narration);
      setOptions(response.data.options || []);
      
      const newHistoryEntry = {
        type: 'narration',
        content: response.data.narration,
        timestamp: Date.now()
      };
      
      const newFullHistory = [...fullHistory, newHistoryEntry];
      setFullHistory(newFullHistory);

      const newGameState = {
        ...gameState,
        encounterType: response.data.encounterType,
        conversationHistory: [{
          role: 'assistant',
          content: JSON.stringify(response.data)
        }],
        turnCount: (gameState.turnCount || 0) + 1,
        contextSummary: response.data.contextSummary,
        lastNarration: response.data.narration,
        lastOptions: response.data.options,
        lastActionHistory: [],
        fullPlayHistory: newFullHistory,
        dialogSummary: null,
        battleSummary: null
      };

      if (response.data.npcInfo) {
        newGameState.currentNPC = response.data.npcInfo;
      }

      updateGameState(newGameState);
      generateSceneImage(response.data.narration);
    } catch (err) {
      console.error('Error generating scene:', err);
      setNarration('An error occurred. Please check that Ollama is running.');
      setOptions([]);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const generateAftermathScene = async () => {
    setLoading(true);
    setLoadingPhase('Continuing your adventure...');
    
    try {
      let contextMessage = '';
      
      if (gameState.battleSummary) {
        contextMessage = `COMBAT JUST ENDED. What happened: ${gameState.battleSummary}`;
        
        if (gameState.battleConsequences && gameState.battleConsequences.length > 0) {
          contextMessage += `\n\nImmediate consequences: ${gameState.battleConsequences.join('; ')}`;
        }
        
        contextMessage += `\n\nDescribe the immediate aftermath of this battle. What does the character see? How does the world react? What happens next?`;
      } else if (gameState.dialogSummary) {
        contextMessage = `CONVERSATION JUST ENDED. What happened: ${gameState.dialogSummary}`;
        
        if (gameState.dialogConsequences && gameState.dialogConsequences.length > 0) {
          contextMessage += `\n\nImmediate consequences: ${gameState.dialogConsequences.join('; ')}`;
        }
        
        contextMessage += `\n\nDescribe what happens immediately after this conversation. What does the character see? What happens next?`;
      }

      const response = await api.post('/api/game/play/action', {
        character: gameState.character,
        gameState: {
          currentLocation: gameState.currentLocation,
          activeQuests: gameState.activeQuests,
          encounterType: 'normal',
          deadNPCs: gameState.deadNPCs || [],
          consequenceLog: gameState.consequenceLog || [],
          npcRelationships: gameState.npcRelationships || {}
        },
        party: gameState.party || [gameState.character],
        conversationHistory: [
          {
            role: 'user',
            content: contextMessage
          }
        ]
      });

      setNarration(response.data.narration);
      setOptions(response.data.options || []);
      
      const newHistoryEntry = {
        type: 'narration',
        content: response.data.narration,
        timestamp: Date.now()
      };
      
      const newFullHistory = [...(gameState.fullPlayHistory || []), newHistoryEntry];
      setFullHistory(newFullHistory);

      const newGameState = {
        ...gameState,
        encounterType: response.data.encounterType,
        conversationHistory: [{
          role: 'assistant',
          content: JSON.stringify(response.data)
        }],
        turnCount: (gameState.turnCount || 0) + 1,
        contextSummary: response.data.contextSummary,
        lastNarration: response.data.narration,
        lastOptions: response.data.options,
        lastActionHistory: [],
        fullPlayHistory: newFullHistory,
        shouldGenerateAftermath: false,
        dialogSummary: null,
        battleSummary: null,
        dialogConsequences: null,
        battleConsequences: null
      };

      if (response.data.npcInfo) {
        newGameState.currentNPC = response.data.npcInfo;
      }

      updateGameState(newGameState);
      generateSceneImage(response.data.narration);
    } catch (err) {
      console.error('Error generating aftermath scene:', err);
      setNarration('An error occurred. Please check that Ollama is running.');
      setOptions([]);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const generateSceneImage = async (sceneText) => {
    const settings = JSON.parse(localStorage.getItem('dnd-settings') || '{}');
    
    if (!settings.enableImageGeneration || !settings.comfyuiUrl) {
      return;
    }

    setGeneratingImage(true);
    
    try {
      const response = await api.post('/api/game/generate-image', {
        prompt: sceneText,
        settings
      });

      if (response.data.imageUrl) {
        setSceneImage(response.data.imageUrl);
      }
    } catch (err) {
      console.error('Error generating image:', err);
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleOptionSelect = async (option) => {
    if (option.requiresRoll) {
      setCurrentRoll({
        option,
        skill: option.skill,
        dc: option.dc,
        advantage: option.advantage,
        disadvantage: option.disadvantage
      });
      setShowDiceRoll(true);
      return;
    }

    await processAction(option, null);
  };

  const handleCustomAction = async () => {
    if (!customAction.trim()) {
      return;
    }

    const customOption = {
      id: 999,
      text: customAction,
      requiresRoll: false
    };

    setCustomAction('');
    setShowCustomInput(false);
    await processAction(customOption, null);
  };

  const handleRollComplete = async (result) => {
    setShowDiceRoll(false);
    await processAction(currentRoll.option, result);
    setCurrentRoll(null);
  };

  const processAction = async (option, rollResult) => {
    setLoading(true);
    setLoadingPhase('Processing action...');
    setSceneImage(null);

    const newActionHistory = [
      ...actionHistory,
      {
        action: option.text,
        roll: rollResult ? `${rollResult.total} (${rollResult.success ? 'Success' : 'Failure'})` : null
      }
    ];
    setActionHistory(newActionHistory);

    // Add action to full history
    const actionHistoryEntry = {
      type: 'action',
      content: option.text,
      roll: rollResult,
      timestamp: Date.now()
    };
    const updatedFullHistory = [...fullHistory, actionHistoryEntry];
    setFullHistory(updatedFullHistory);

    try {
      const userMessage = {
        role: 'user',
        content: `I ${option.text}${rollResult ? `. Roll result: ${rollResult.total} (${rollResult.success ? 'Success' : 'Failure'})` : ''}`
      };

      const response = await api.post('/api/game/play/action', {
        character: gameState.character,
        gameState: {
          currentLocation: gameState.currentLocation,
          activeQuests: gameState.activeQuests,
          encounterType: gameState.encounterType,
          deadNPCs: gameState.deadNPCs || [],
          consequenceLog: gameState.consequenceLog || [],
          npcRelationships: gameState.npcRelationships || {}
        },
        party: gameState.party || [gameState.character],
        conversationHistory: [...gameState.conversationHistory, userMessage]
      });

      setNarration(response.data.narration);
      setOptions(response.data.options || []);

      // Add narration to full history
      const narrationHistoryEntry = {
        type: 'narration',
        content: response.data.narration,
        timestamp: Date.now()
      };
      const finalFullHistory = [...updatedFullHistory, narrationHistoryEntry];
      setFullHistory(finalFullHistory);

      const newConversationHistory = [
        ...gameState.conversationHistory,
        userMessage,
        {
          role: 'assistant',
          content: JSON.stringify(response.data)
        }
      ];

      const newGameState = {
        ...gameState,
        encounterType: response.data.encounterType,
        conversationHistory: newConversationHistory,
        turnCount: (gameState.turnCount || 0) + 1,
        contextSummary: response.data.contextSummary,
        lastNarration: response.data.narration,
        lastOptions: response.data.options,
        lastActionHistory: newActionHistory,
        fullPlayHistory: finalFullHistory,
        deadNPCs: response.data.deadNPCs || gameState.deadNPCs || [],
        npcRelationships: response.data.npcRelationships || gameState.npcRelationships || {},
        consequenceLog: response.data.consequenceLog || gameState.consequenceLog || []
      };

      if (response.data.encounterType === 'battle') {
        setLoadingPhase('Generating enemy...');
        
        const context = {
          battleContext: `Combat began: ${newActionHistory.map(h => h.action).join(', ')}. ${response.data.narration}`,
          recentActions: newActionHistory.slice(-3).map(h => h.action).join(', '),
          narration: response.data.narration,
          location: gameState.currentLocation
        };

        const enemyResponse = await api.post('/api/game/battle/generate-enemy', {
          character: gameState.character,
          location: gameState.currentLocation,
          difficulty: 'normal',
          context: context,
          gameState: {
            deadNPCs: newGameState.deadNPCs,
            consequenceLog: newGameState.consequenceLog
          }
        });

        newGameState.currentEnemy = enemyResponse.data;
        newGameState.inCombat = true;
        newGameState.battleContext = context.battleContext;
      }

      if (response.data.encounterType === 'dialog' && response.data.npcInfo) {
        // Check if NPC is dead
        const isNPCDead = newGameState.deadNPCs?.some(
          deadNPC => deadNPC.toLowerCase() === response.data.npcInfo.name.toLowerCase()
        );
        
        if (isNPCDead) {
          // Don't enter dialog with dead NPC, show message instead
          setNarration(`You approach where ${response.data.npcInfo.name} once was, but they are no longer among the living.`);
          setOptions(response.data.options || []);
        } else {
          newGameState.currentNPC = response.data.npcInfo;
        }
      }

      updateGameState(newGameState);
      generateSceneImage(response.data.narration);
    } catch (err) {
      console.error('Error processing action:', err);
      setNarration('An error occurred. Please try again.');
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '20px',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif',
      height: '100%'
    }}>
      {showDiceRoll && currentRoll && (
        <DiceRoller
          character={gameState.character}
          skill={currentRoll.skill}
          dc={currentRoll.dc}
          advantage={currentRoll.advantage}
          disadvantage={currentRoll.disadvantage}
          onComplete={handleRollComplete}
          onCancel={() => {
            setShowDiceRoll(false);
            setCurrentRoll(null);
          }}
        />
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 100px)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#f5f5f5',
          border: '1px solid #ccc',
          padding: '16px',
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#666',
            fontWeight: '600'
          }}>Recent Actions</h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            overflowY: 'auto',
            flex: 1
          }}>
            {actionHistory.slice(-5).map((item, index) => (
              <div key={index} style={{
                background: '#fff',
                border: '1px solid #ddd',
                padding: '8px',
                fontSize: '11px'
              }}>
                <div style={{ color: '#000', marginBottom: '4px' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.action}</ReactMarkdown>
                </div>
                {item.roll && <div style={{ color: '#666', fontSize: '10px' }}>{item.roll}</div>}
              </div>
            ))}
            {actionHistory.length === 0 && (
              <div style={{ color: '#999', fontSize: '11px', textAlign: 'center', padding: '16px 0' }}>
                Your actions will appear here
              </div>
            )}
          </div>
        </div>

        <div style={{
          background: '#f5f5f5',
          border: '1px solid #ccc',
          padding: '16px',
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#666',
            fontWeight: '600'
          }}>Turn History</h3>
          <div style={{
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {fullHistory.map((entry, index) => (
              <div key={index} style={{
                padding: '12px',
                background: entry.type === 'action' ? '#e8f4f8' : '#fff',
                border: '1px solid ' + (entry.type === 'action' ? '#b3d9ea' : '#ddd'),
                fontSize: '11px'
              }}>
                <div style={{
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: '#666',
                  marginBottom: '6px',
                  fontWeight: '600'
                }}>
                  {entry.type === 'action' ? '→ YOU' : '◆ DM'}
                </div>
                <div style={{ color: '#000', lineHeight: '1.4' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.content}</ReactMarkdown>
                </div>
                {entry.roll && (
                  <div style={{
                    marginTop: '6px',
                    fontSize: '10px',
                    color: entry.roll.success ? '#008000' : '#ff0000',
                    fontWeight: '600'
                  }}>
                    Roll: {entry.roll.total} {entry.roll.success ? '✓' : '✗'}
                  </div>
                )}
              </div>
            ))}
            <div ref={historyEndRef} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sceneImage && (
          <div style={{ border: '1px solid #ccc', overflow: 'hidden' }}>
            <img src={sceneImage} alt="Scene" style={{ width: '100%', display: 'block' }} />
          </div>
        )}
        {generatingImage && (
          <div style={{
            background: '#f5f5f5',
            border: '1px solid #ccc',
            padding: '32px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#666'
          }}>
            Generating scene image...
          </div>
        )}

        <div style={{
          background: '#fff',
          border: '2px solid #000',
          padding: '24px',
          lineHeight: '1.6'
        }}>
          <div style={{ color: '#000', fontSize: '14px' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{narration}</ReactMarkdown>
          </div>
        </div>

        {!loading && !showCustomInput && options.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {options.map((option) => (
              <button
                key={option.id}
                style={{
                  background: option.requiresRoll ? '#f5f5f5' : '#fff',
                  border: '1px solid ' + (option.requiresRoll ? '#666' : '#ccc'),
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontFamily: 'system-ui, sans-serif'
                }}
                onClick={() => handleOptionSelect(option)}
              >
                <span style={{
                  background: '#000',
                  color: '#fff',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  minWidth: '24px',
                  textAlign: 'center'
                }}>
                  {option.id.toString().padStart(2, '0')}
                </span>
                <span style={{ flex: 1, color: '#000', fontSize: '13px' }}>{option.text}</span>
                {option.requiresRoll && (
                  <span style={{
                    background: '#666',
                    color: '#fff',
                    padding: '4px 8px',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {option.skill} DC {option.dc}
                  </span>
                )}
              </button>
            ))}

            <button
              style={{
                background: '#fff',
                border: '1px solid #ccc',
                padding: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: 'system-ui, sans-serif'
              }}
              onClick={() => setShowCustomInput(true)}
            >
              <span style={{
                background: '#000',
                color: '#fff',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: '600',
                minWidth: '24px',
                textAlign: 'center'
              }}>
                ✎
              </span>
              <span style={{ flex: 1, color: '#000', fontSize: '13px' }}>Do something else...</span>
            </button>
          </div>
        )}

        {showCustomInput && !loading && (
          <div style={{
            background: '#f5f5f5',
            border: '1px solid #ccc',
            padding: '20px'
          }}>
            <div style={{
              color: '#000',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px',
              fontWeight: '600'
            }}>
              What do you do?
            </div>
            <textarea
              style={{
                width: '100%',
                border: '1px solid #ccc',
                padding: '12px',
                fontSize: '13px',
                fontFamily: 'system-ui, sans-serif',
                marginBottom: '12px',
                resize: 'vertical'
              }}
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              placeholder="I search the room for hidden doors..."
              rows={3}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCustomAction();
                }
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                onClick={handleCustomAction}
                disabled={!customAction.trim()}
              >
                Do It
              </button>
              <button
                style={{
                  background: '#fff',
                  color: '#000',
                  border: '1px solid #ccc',
                  padding: '12px 24px',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomAction('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div style={{
            background: '#f5f5f5',
            border: '1px solid #ccc',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '12px' }}>⟳</div>
            <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {loadingPhase}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NormalPlay;