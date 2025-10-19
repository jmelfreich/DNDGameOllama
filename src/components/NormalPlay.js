// frontend/src/components/NormalPlay.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import DiceRoller from './DiceRoller';

function NormalPlay({ gameState, updateGameState, onLevelUp }) {
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

  useEffect(() => {
    if (!narration) {
      generateInitialScene();
    }
  }, []);

  const generateInitialScene = async () => {
    setLoading(true);
    setLoadingPhase('Starting your adventure...');
    
    try {
      setTimeout(() => {
        if (loading) setLoadingPhase('Generating the opening scene...');
      }, 1000);

      const response = await api.post('/api/game/play/action', {
        character: gameState.character,
        gameState: {
          currentLocation: gameState.currentLocation,
          activeQuests: gameState.activeQuests
        },
        conversationHistory: [
          {
            role: 'user',
            content: `Begin the adventure. The character has just arrived at ${gameState.currentLocation}. ${gameState.campaign.description}`
          }
        ]
      });

      setNarration(response.data.narration);
      setOptions(response.data.options);
      
      updateGameState({
        ...gameState,
        encounterType: response.data.encounterType,
        conversationHistory: [...gameState.conversationHistory, {
          role: 'assistant',
          content: JSON.stringify(response.data)
        }],
        turnCount: gameState.turnCount + 1,
        contextSummary: response.data.contextSummary
      });

      generateSceneImage(response.data.narration);
    } catch (err) {
      console.error('Error generating scene:', err);
      setNarration('An error occurred. Please check that Ollama is running.');
      setOptions([
        { id: 1, text: 'Try again', requiresRoll: false }
      ]);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const generateSceneImage = async (sceneDescription) => {
    const settings = JSON.parse(localStorage.getItem('dnd-settings') || '{}');
    
    if (!settings.enableImageGeneration || !settings.comfyuiUrl) {
      return;
    }

    setGeneratingImage(true);
    
    try {
      const response = await api.post('/api/comfyui/generate', {
        prompt: sceneDescription,
        workflow: settings.comfyuiWorkflow
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

  const handleOptionSelect = (option) => {
    if (option.requiresRoll) {
      setCurrentRoll({
        option,
        skill: option.skill,
        dc: option.dc
      });
      setShowDiceRoll(true);
    } else {
      handleAction(option, null);
    }
  };

  const handleCustomAction = () => {
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
    handleAction(customOption, null);
  };

  const handleRollComplete = (result) => {
    setShowDiceRoll(false);
    handleAction(currentRoll.option, result);
    setCurrentRoll(null);
  };

  const handleAction = async (option, rollResult) => {
    setLoading(true);
    setLoadingPhase('Processing your action...');
    setOptions([]);

    try {
      setTimeout(() => {
        if (loading) setLoadingPhase('The DM is thinking...');
      }, 1000);

      setTimeout(() => {
        if (loading) setLoadingPhase('Determining the outcome...');
      }, 2000);

      const userMessage = {
        role: 'user',
        content: `Player chooses: "${option.text}"${rollResult ? `. Roll result: ${rollResult.total} (${rollResult.success ? 'Success' : 'Failure'})` : ''}`
      };

      const response = await api.post('/api/game/play/action', {
        character: gameState.character,
        gameState: {
          currentLocation: gameState.currentLocation,
          activeQuests: gameState.activeQuests
        },
        conversationHistory: [...gameState.conversationHistory, userMessage]
      });

      setNarration(response.data.narration);
      setOptions(response.data.options);

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
        turnCount: gameState.turnCount + 1,
        contextSummary: response.data.contextSummary
      };

      // Check if entering combat
      if (response.data.encounterType === 'battle') {
        setLoadingPhase('Generating enemy...');
        
        const enemyResponse = await api.post('/api/game/battle/generate-enemy', {
          character: gameState.character,
          location: gameState.currentLocation,
          difficulty: 'normal'
        });

        newGameState.currentEnemy = enemyResponse.data;
        newGameState.inCombat = true;
      }

      // Check if entering dialog
      if (response.data.encounterType === 'dialog') {
        newGameState.currentNPC = {
          name: 'NPC',
          description: response.data.narration
        };
      }

      updateGameState(newGameState);
      generateSceneImage(response.data.narration);
    } catch (err) {
      console.error('Error processing action:', err);
      setNarration('An error occurred. Please try again.');
      setOptions([{ id: 1, text: 'Try again', requiresRoll: false }]);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  return (
    <div className="play-container">
      {showDiceRoll && currentRoll && (
        <DiceRoller
          character={gameState.character}
          skill={currentRoll.skill}
          dc={currentRoll.dc}
          onComplete={handleRollComplete}
          onCancel={() => setShowDiceRoll(false)}
        />
      )}

      <div className="scene-content">
        {sceneImage && (
          <div className="scene-image">
            <img src={sceneImage} alt="Scene" />
          </div>
        )}
        
        {generatingImage && (
          <div className="image-loading">
            <div className="loading-spinner-small"></div>
            <span>Generating scene image...</span>
          </div>
        )}

        <div className="narration-box">
          <div className="narration-label">Scene</div>
          <div className="narration-text">{narration}</div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">{loadingPhase}</div>
          </div>
        ) : (
          <div className="options-container">
            <div className="options-label">What do you do?</div>
            <div className="options-list">
              {options.map(option => (
                <button
                  key={option.id}
                  className="option-button"
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
                  className="option-button custom-action-toggle"
                  onClick={() => setShowCustomInput(true)}
                >
                  <span className="option-number">✎</span>
                  <span className="option-text">Do something else...</span>
                </button>
              )}
            </div>

            {showCustomInput && (
              <div className="custom-action-container">
                <div className="custom-action-label">What do you want to do?</div>
                <textarea
                  className="custom-action-input"
                  value={customAction}
                  onChange={(e) => setCustomAction(e.target.value)}
                  placeholder="I want to examine the ancient runes on the wall..."
                  rows={3}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCustomAction();
                    }
                  }}
                />
                <div className="custom-action-buttons">
                  <button
                    className="custom-action-submit"
                    onClick={handleCustomAction}
                    disabled={!customAction.trim()}
                  >
                    Do It
                  </button>
                  <button
                    className="custom-action-cancel"
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
          </div>
        )}
      </div>
    </div>
  );
}

export default NormalPlay;