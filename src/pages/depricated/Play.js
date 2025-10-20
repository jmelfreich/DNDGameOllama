// frontend/src/pages/Play.js - COMPLETE PRODUCTION VERSION WITH PARTY SYSTEM
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NormalPlay from '../../components/NormalPlay';
import Battle from '../../components/Battle';
import Dialog from '../../components/Dialog';
import CharacterSheet from '../../components/CharacterSheet';
import LevelUp from '../../components/LevelUp';

function Play({ gameState, updateGameState }) {
  const navigate = useNavigate();
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showPartyManagement, setShowPartyManagement] = useState(false);

  // Safety check
  if (!gameState || !gameState.character) {
    console.error('No game state found, redirecting to home');
    navigate('/');
    return null;
  }

  // *** FIX #8: Initialize party system ***
  const getParty = () => {
    if (!gameState.party) {
      // Initialize party with main character
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
      member.name === updatedCharacter.name ? { ...updatedCharacter, isActive: member.isActive, isLeader: member.isLeader } : member
    );

    updateGameState({
      ...gameState,
      character: updatedCharacter,
      party: newParty
    });
    setShowLevelUp(false);
  };

  const handleViewCharacter = (index) => {
    setSelectedCharacterIndex(index);
    setShowCharacterSheet(true);
  };

  const handleUpdateCharacter = (updatedCharacter) => {
    const newParty = [...party];
    newParty[selectedCharacterIndex] = {
      ...updatedCharacter,
      isActive: newParty[selectedCharacterIndex].isActive,
      isLeader: newParty[selectedCharacterIndex].isLeader
    };

    // If updating main character
    if (newParty[selectedCharacterIndex].isLeader) {
      updateGameState({
        ...gameState,
        character: updatedCharacter,
        party: newParty
      });
    } else {
      updateGameState({
        ...gameState,
        party: newParty
      });
    }
  };

  const handleSetActive = (index) => {
    if (!gameState.inCombat) {
      const newParty = party.map((member, i) => ({
        ...member,
        isActive: i === index
      }));

      updateGameState({
        ...gameState,
        party: newParty,
        character: newParty[index].isLeader ? newParty[index] : gameState.character
      });
    }
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
    
    // If removed character was active, set first character as active
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
          />
        );
    }
  };

  return (
    <div className="play-container">
      {/* *** FIX #8: Party UI *** */}
      <div className="party-sidebar">
        <div className="party-header">
          <h3>Party</h3>
          <button
            className="party-manage-button"
            onClick={() => setShowPartyManagement(!showPartyManagement)}
          >
            ⚙️
          </button>
        </div>

        <div className="party-members-list">
          {party.map((member, index) => (
            <div
              key={index}
              className={`party-member ${member.isActive ? 'active' : ''} ${member.hp === 0 ? 'dead' : ''}`}
              onClick={() => handleViewCharacter(index)}
            >
              <div className="member-name">
                {member.isLeader && '👑 '}
                {member.name}
                {member.isActive && ' ⚔️'}
              </div>
              <div className="member-class">
                {member.class} Lv.{member.level}
              </div>
              <div className="member-hp-bar">
                <div
                  className="hp-fill"
                  style={{ width: `${(member.hp / member.maxHp) * 100}%` }}
                ></div>
                <span className="hp-text">
                  {member.hp}/{member.maxHp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {party.length < 6 && (
          <div className="party-info">
            Party: {party.length}/6
          </div>
        )}
      </div>

      <div className="game-main-area">
        {renderGameMode()}
      </div>

      <div className="character-sidebar">
        <button
          className="view-sheet-button"
          onClick={() => handleViewCharacter(0)}
        >
          📋 Character Sheet
        </button>
        
        <div className="quick-stats">
          <h4>{getActiveCharacter().name}</h4>
          <div className="stat-line">
            HP: {getActiveCharacter().hp}/{getActiveCharacter().maxHp}
          </div>
          <div className="stat-line">
            AC: {10 + Math.floor((getActiveCharacter().dexterity - 10) / 2)}
          </div>
          <div className="stat-line">
            Gold: {getActiveCharacter().gold}
          </div>
        </div>
      </div>

      {/* *** FIX #8: Party Management Modal *** */}
      {showPartyManagement && (
        <div className="modal-overlay">
          <div className="modal-content party-management-modal">
            <button className="modal-close" onClick={() => setShowPartyManagement(false)}>×</button>
            <h2>Party Management</h2>

            <div className="party-management-list">
              {party.map((member, index) => (
                <div key={index} className="party-management-item">
                  <div className="member-info">
                    <h4>
                      {member.name} {member.isLeader && '👑'} {member.isActive && '⚔️'}
                    </h4>
                    <p>
                      {member.race} {member.class} - Level {member.level}
                    </p>
                    <p>HP: {member.hp}/{member.maxHp}</p>
                  </div>

                  <div className="member-actions">
                    {!member.isActive && !gameState.inCombat && member.hp > 0 && (
                      <button
                        className="action-button"
                        onClick={() => handleSetActive(index)}
                      >
                        Set Active
                      </button>
                    )}

                    {!member.isLeader && (
                      <button
                        className="action-button"
                        onClick={() => handleSetLeader(index)}
                      >
                        Make Leader
                      </button>
                    )}

                    <button
                      className="action-button"
                      onClick={() => handleViewCharacter(index)}
                    >
                      View Sheet
                    </button>

                    <button
                      className="action-button"
                      onClick={() => handleTalkToPartyMember(index)}
                      disabled={member.isActive}
                    >
                      Talk
                    </button>

                    {!member.isLeader && party.length > 1 && (
                      <button
                        className="action-button remove-button"
                        onClick={() => handleRemovePartyMember(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {party.length < 6 && (
              <div className="add-party-note">
                <p>You can recruit up to 6 party members. Find companions during your adventure!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Play;