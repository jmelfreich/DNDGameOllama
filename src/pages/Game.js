// frontend/src/pages/Game.js - ENHANCED WITH CONSEQUENCE TRACKING (NO POPUPS)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NormalPlay from '../components/NormalPlay';
import Battle from '../components/Battle';
import Dialog from '../components/Dialog';
import CharacterSheet from '../components/CharacterSheet';
import LevelUp from '../components/LevelUp';
import api from '../utils/api';

function Game({ gameState, updateGameState }) {
  const navigate = useNavigate();
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showPartyManagement, setShowPartyManagement] = useState(false);
  const [resting, setResting] = useState(false);

  useEffect(() => {
    // Initialize enhanced game state properties if they don't exist
    if (!gameState.deadNPCs) {
      updateGameState({
        ...gameState,
        deadNPCs: [],
        npcRelationships: {},
        consequenceLog: [],
        dialogHistory: [],
        combatHistory: []
      });
    }
  }, []);

  if (!gameState || !gameState.character) {
    console.error('No game state found, redirecting to home');
    navigate('/');
    return null;
  }

  const getParty = () => {
    if (!gameState.party) {
      const initialParty = [{
        ...gameState.character,
        isActive: true,
        isLeader: true
      }];
      updateGameState({
        ...gameState,
        party: initialParty
      });
      return initialParty;
    }
    return gameState.party;
  };

  const party = getParty();

  const getActiveCharacter = () => {
    return party.find(member => member.isActive) || party[0];
  };

  const handleLevelUp = () => {
    setShowLevelUp(true);
  };

  const completeLevelUp = (updatedCharacter) => {
    const newParty = party.map(member =>
      member.name === updatedCharacter.name ? updatedCharacter : member
    );

    updateGameState({
      ...gameState,
      character: newParty.find(m => m.isLeader) || updatedCharacter,
      party: newParty
    });

    setShowLevelUp(false);
  };

  const handleUpdateCharacter = (updatedCharacter) => {
    const newParty = party.map(member =>
      member.name === updatedCharacter.name ? updatedCharacter : member
    );

    updateGameState({
      ...gameState,
      character: newParty.find(m => m.isLeader) || updatedCharacter,
      party: newParty
    });
  };

  const handleViewCharacter = (index) => {
    setSelectedCharacterIndex(index);
    setShowCharacterSheet(true);
  };

  const handleSetActive = (index) => {
    if (gameState.inCombat) {
      alert('Cannot change active character during combat!');
      return;
    }

    const newParty = party.map((member, i) => ({
      ...member,
      isActive: i === index
    }));

    updateGameState({
      ...gameState,
      party: newParty
    });
  };

  const handleSetLeader = (index) => {
    const newParty = party.map((member, i) => ({
      ...member,
      isLeader: i === index
    }));

    updateGameState({
      ...gameState,
      character: newParty[index],
      party: newParty
    });
  };

  const handleRemovePartyMember = (index) => {
    if (party.length === 1) {
      alert('Cannot remove the last party member!');
      return;
    }

    if (party[index].isLeader) {
      alert('Cannot remove the party leader! Set a new leader first.');
      return;
    }

    const newParty = party.filter((_, i) => i !== index);
    
    if (party[index].isActive && newParty.length > 0) {
      newParty[0].isActive = true;
    }

    updateGameState({
      ...gameState,
      party: newParty
    });
  };

  const handleTalkToPartyMember = (index) => {
    const partyMember = party[index];
    
    updateGameState({
      ...gameState,
      encounterType: 'dialog',
      currentNPC: {
        name: partyMember.name,
        description: `${partyMember.name}, your ${partyMember.class} companion`,
        relationship: 'ally',
        canTrade: false,
        isPartyMember: true
      }
    });

    setShowPartyManagement(false);
  };

  const handleRest = async (restType) => {
    setResting(true);

    try {
      const response = await api.post('/api/game/play/rest', {
        character: gameState.character,
        restType,
        gameState,
        party: gameState.party || [gameState.character]
      });

      let updatedCharacter = { ...gameState.character };
      let updatedParty = gameState.party ? [...gameState.party] : [gameState.character];

      if (restType === 'short') {
        const healAmount = Math.floor(Math.random() * gameState.character.level * 4) + gameState.character.level;
        updatedCharacter.hp = Math.min(updatedCharacter.hp + healAmount, updatedCharacter.maxHp);
        
        updatedParty = updatedParty.map(member => {
          if (member.isActive) {
            return updatedCharacter;
          }
          const memberHeal = Math.floor(Math.random() * member.level * 4) + member.level;
          return {
            ...member,
            hp: Math.min(member.hp + memberHeal, member.maxHp)
          };
        });
      } else {
        updatedCharacter.hp = updatedCharacter.maxHp;
        updatedCharacter.spellSlots = { ...updatedCharacter.maxSpellSlots };
        
        updatedParty = updatedParty.map(member => ({
          ...member,
          hp: member.maxHp,
          spellSlots: { ...member.maxSpellSlots }
        }));
      }

      updateGameState({
        ...gameState,
        character: updatedCharacter,
        party: updatedParty
      });

      alert(`${restType === 'short' ? 'Short' : 'Long'} rest complete! Party healed.`);
    } catch (err) {
      console.error('Error resting:', err);
      alert('Failed to rest. Please try again.');
    } finally {
      setResting(false);
    }
  };

  const renderGameMode = () => {
    if (showLevelUp) {
      return <LevelUp character={getActiveCharacter()} onComplete={completeLevelUp} />;
    }

    if (showCharacterSheet && selectedCharacterIndex !== null) {
      const char = party[selectedCharacterIndex];
      return (
        <CharacterSheet
          character={char}
          onClose={() => {
            setShowCharacterSheet(false);
            setSelectedCharacterIndex(null);
          }}
          onUpdateCharacter={handleUpdateCharacter}
          isPartyMember={!char.isLeader}
        />
      );
    }

    switch (gameState.encounterType) {
      case 'battle':
        return (
          <Battle
            gameState={{
              ...gameState,
              character: getActiveCharacter()
            }}
            updateGameState={updateGameState}
            onLevelUp={handleLevelUp}
          />
        );
      case 'dialog':
      case 'shopping':
        return (
          <Dialog
            gameState={gameState}
            updateGameState={updateGameState}
          />
        );
      default:
        return (
          <NormalPlay
            gameState={gameState}
            updateGameState={updateGameState}
            onLevelUp={handleLevelUp}
            onShowCharacterSheet={() => handleViewCharacter(0)}
          />
        );
    }
  };

  return (
    <div className="game-page">
      <nav className="game-nav">
        <button className="nav-button" onClick={() => navigate('/')}>
          ← Menu
        </button>
        <div className="nav-info">
          <span className="nav-item">{getActiveCharacter().name}</span>
          <span className="nav-separator">|</span>
          <span className="nav-item">Lv {getActiveCharacter().level}</span>
          <span className="nav-separator">|</span>
          <span className="nav-item">HP: {getActiveCharacter().hp}/{getActiveCharacter().maxHp}</span>
          {party.length > 1 && (
            <>
              <span className="nav-separator">|</span>
              <span className="nav-item">Party: {party.length}</span>
            </>
          )}
        </div>
        <button 
          className="nav-button"
          onClick={() => setShowPartyManagement(true)}
        >
          👥 Party
        </button>
      </nav>

      <div className="game-container">
        {renderGameMode()}
      </div>

      {showPartyManagement && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            background: '#fff',
            border: '2px solid #000',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              background: '#000',
              padding: '16px 24px',
              borderBottom: '2px solid #000',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{
                margin: 0,
                color: '#fff',
                fontSize: '18px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: '600'
              }}>
                Party Management
              </h2>
              <button
                style={{
                  background: 'transparent',
                  border: '2px solid #fff',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => setShowPartyManagement(false)}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {party.map((member, index) => (
                  <div key={index} style={{
                    background: '#f5f5f5',
                    border: '1px solid #ccc',
                    padding: '20px',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '20px',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        color: '#000',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {member.name}
                        {member.isLeader && <span>👑</span>}
                        {member.isActive && <span>⚔️</span>}
                      </div>
                      <div style={{
                        color: '#666',
                        fontSize: '13px',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        {member.race} {member.class} • Level {member.level}
                      </div>
                      <div style={{
                        color: '#666',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        HP: {member.hp}/{member.maxHp}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      justifyContent: 'flex-end'
                    }}>
                      {!member.isActive && !gameState.inCombat && member.hp > 0 && (
                        <button
                          style={{
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                          onClick={() => handleSetActive(index)}
                        >
                          Set Active
                        </button>
                      )}

                      {!member.isLeader && (
                        <button
                          style={{
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                          onClick={() => handleSetLeader(index)}
                        >
                          Make Leader
                        </button>
                      )}

                      <button
                        style={{
                          background: '#fff',
                          color: '#000',
                          border: '1px solid #ccc',
                          padding: '8px 16px',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                        onClick={() => {
                          setShowPartyManagement(false);
                          handleViewCharacter(index);
                        }}
                      >
                        View Sheet
                      </button>

                      <button
                        style={{
                          background: '#fff',
                          color: '#000',
                          border: '1px solid #ccc',
                          padding: '8px 16px',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          cursor: member.isActive ? 'not-allowed' : 'pointer',
                          fontWeight: '600',
                          opacity: member.isActive ? 0.5 : 1
                        }}
                        onClick={() => handleTalkToPartyMember(index)}
                        disabled={member.isActive}
                      >
                        Talk
                      </button>

                      {!member.isLeader && party.length > 1 && (
                        <button
                          style={{
                            background: '#fff',
                            color: '#000',
                            border: '1px solid #000',
                            padding: '8px 16px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                          onClick={() => handleRemovePartyMember(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {gameState.encounterType === 'normal' && (
                <div style={{
                  borderTop: '1px solid #ccc',
                  paddingTop: '24px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    color: '#000',
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '16px',
                    fontWeight: '600'
                  }}>
                    Rest
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px'
                  }}>
                    <button
                      style={{
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        padding: '16px',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        cursor: resting ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        opacity: resting ? 0.5 : 1
                      }}
                      onClick={() => handleRest('short')}
                      disabled={resting}
                    >
                      🏕️ Short Rest
                    </button>
                    <button
                      style={{
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        padding: '16px',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        cursor: resting ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        opacity: resting ? 0.5 : 1
                      }}
                      onClick={() => handleRest('long')}
                      disabled={resting}
                    >
                      🛏️ Long Rest
                    </button>
                  </div>
                </div>
              )}

              {party.length < 6 && (
                <div style={{
                  borderTop: '1px solid #ccc',
                  marginTop: '24px',
                  paddingTop: '16px',
                  textAlign: 'center'
                }}>
                  <p style={{
                    margin: 0,
                    color: '#666',
                    fontSize: '12px',
                    lineHeight: '1.6'
                  }}>
                    You can recruit up to 6 party members. Find companions during your adventure!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;