// frontend/src/components/Dialog.js - V3 WITH IMMEDIATE FEEDBACK & RELIABLE GENERATION
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../utils/api';
import DiceRoller from './DiceRoller';

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    background: '#fff',
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '32px'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  historyPanel: {
    background: '#f5f5f5',
    border: '1px solid #ccc',
    padding: '16px',
    maxHeight: '500px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  historyTitle: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#666',
    fontWeight: '600',
    marginBottom: '8px'
  },
  historyEntry: {
    background: '#fff',
    border: '1px solid #ddd',
    padding: '12px',
    fontSize: '11px'
  },
  historySpeaker: {
    fontSize: '9px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#666',
    fontWeight: '700',
    marginBottom: '6px'
  },
  historyText: {
    color: '#000',
    lineHeight: '1.4'
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px'
  },
  npcInfo: {
    borderLeft: '8px solid #000',
    paddingLeft: '32px'
  },
  npcName: {
    margin: '0 0 8px 0',
    fontSize: '48px',
    fontWeight: '700',
    lineHeight: '1',
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
    color: '#000'
  },
  npcRelationship: {
    margin: '0',
    fontSize: '11px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#ff0000'
  },
  conversationLog: {
    border: '1px solid #000',
    background: '#fff',
    maxHeight: '500px',
    overflowY: 'auto',
    minHeight: '300px'
  },
  conversationEntry: {
    padding: '24px 32px',
    borderBottom: '1px solid #e0e0e0',
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    gap: '32px',
    alignItems: 'start'
  },
  playerEntry: {
    background: '#fafafa'
  },
  npcEntry: {
    background: '#fff'
  },
  speakerName: {
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#000',
    textAlign: 'right',
    paddingTop: '2px'
  },
  speakerText: {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#000',
    textAlign: 'left'
  },
  rollResult: {
    marginTop: '12px',
    fontSize: '11px',
    fontWeight: '500',
    color: '#ff0000',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontFamily: "'Courier New', monospace"
  },
  specialActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2px',
    border: '2px solid #000'
  },
  specialButton: {
    padding: '24px 16px',
    border: 'none',
    background: '#fff',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'center',
    color: '#000',
    borderRight: '2px solid #000'
  },
  specialButtonHover: {
    background: '#000',
    color: '#fff'
  },
  specialButtonDisabled: {
    opacity: '0.3',
    cursor: 'not-allowed'
  },
  dialogOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  dialogOption: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr auto',
    alignItems: 'center',
    gap: '0',
    padding: '0',
    background: '#fff',
    border: '1px solid #000',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'left'
  },
  dialogOptionDisabled: {
    opacity: '0.5',
    cursor: 'not-allowed',
    pointerEvents: 'none'
  },
  dialogOptionHover: {
    background: '#000',
    color: '#fff'
  },
  skillCheck: {
    borderLeft: '4px solid #ff0000'
  },
  recruitOption: {
    borderLeft: '8px solid #000'
  },
  optionNumber: {
    background: '#000',
    color: '#fff',
    padding: '20px 0',
    fontSize: '18px',
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: "'Courier New', monospace",
    borderRight: '1px solid #000'
  },
  optionText: {
    padding: '20px 24px',
    fontSize: '14px',
    lineHeight: '1.4',
    color: '#000',
    textTransform: 'none',
    letterSpacing: '0'
  },
  optionBadge: {
    padding: '20px 24px',
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    borderLeft: '1px solid #000',
    minWidth: '120px',
    textAlign: 'center'
  },
  customToggle: {
    border: '1px dashed #000',
    background: '#fafafa'
  },
  customContainer: {
    background: '#fafafa',
    border: '2px solid #000',
    padding: '32px'
  },
  customLabel: {
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#000',
    fontWeight: '700',
    marginBottom: '16px'
  },
  customInput: {
    width: '100%',
    padding: '16px',
    border: '1px solid #000',
    fontSize: '16px',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    resize: 'vertical',
    marginBottom: '16px',
    background: '#fff'
  },
  customButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 200px',
    gap: '2px'
  },
  customSubmit: {
    padding: '16px',
    background: '#000',
    color: '#fff',
    border: 'none',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.15em'
  },
  customSubmitHover: {
    background: '#ff0000'
  },
  customCancel: {
    padding: '16px',
    background: '#fff',
    color: '#000',
    border: '1px solid #000',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.15em'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '80px 20px',
    border: '1px solid #000',
    marginTop: '40px'
  },
  loadingSpinner: {
    width: '60px',
    height: '60px',
    margin: '0 auto 24px',
    border: '2px solid #e0e0e0',
    borderTop: '2px solid #000',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '11px',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontWeight: '700'
  }
};

function Dialog({ gameState, updateGameState }) {
  const [dialogTree, setDialogTree] = useState(null);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [conversationLog, setConversationLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [showDiceRoll, setShowDiceRoll] = useState(false);
  const [currentRoll, setCurrentRoll] = useState(null);
  const [customDialog, setCustomDialog] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [shopMode, setShopMode] = useState(null);
  const [shopInventory, setShopInventory] = useState([]);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const conversationEndRef = useRef(null);
  const historyEndRef = useRef(null);

  useEffect(() => {
    if (!gameState?.currentNPC) {
      console.warn('No NPC found in dialog mode, returning to normal play');
      updateGameState({
        ...gameState,
        encounterType: 'normal',
        currentNPC: null
      });
      return;
    }
    
    generateDialogTree();
  }, []);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationLog]);

  if (!gameState?.currentNPC) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>RETURNING TO EXPLORATION</div>
        </div>
      </div>
    );
  }

  const generateDialogTree = async () => {
    setLoading(true);
    setLoadingPhase('GENERATING CONVERSATION');

    try {
      const response = await api.post('/api/game/dialog/generate-tree', {
        character: gameState.character,
        npc: gameState.currentNPC,
        gameState: gameState,
        party: gameState.party || [gameState.character]
      });

      console.log('Dialog tree received with', Object.keys(response.data.nodes).length, 'nodes');
      
      setDialogTree(response.data);
      setCurrentNodeId(response.data.rootNodeId);
      
      const rootNode = response.data.nodes[response.data.rootNodeId];
      if (rootNode) {
        setConversationLog([
          { speaker: gameState.currentNPC.name, text: rootNode.npcText, timestamp: Date.now() }
        ]);
      }
    } catch (err) {
      console.error('Error generating dialog tree:', err);
      
      if (err.response?.data?.error === 'NPC_DEAD') {
        alert(err.response.data.message);
        handleLeave(true);
      } else {
        setConversationLog([
          { speaker: gameState.currentNPC.name, text: '...', timestamp: Date.now() }
        ]);
      }
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const getCurrentNode = () => {
    if (!dialogTree || !currentNodeId) return null;
    return dialogTree.nodes[currentNodeId];
  };

  const isTerminalNode = (node) => {
    if (!node || !node.options) return true;
    
    const dialogOptions = node.options.filter(opt => 
      opt.type === 'talk' || opt.type === 'skill_check'
    );
    
    return dialogOptions.length === 0;
  };

  const handleOptionSelect = async (option) => {
    // Prevent double-clicks
    if (loading) {
      console.log('⚠️ Button click ignored - already processing');
      return;
    }

    if (option.type === 'leave') {
      handleLeave(false);
      return;
    }

    if (option.type === 'attack') {
      handleAttack();
      return;
    }

    if (option.type === 'trade') {
      await enterShopMode('buy');
      return;
    }

    if (option.type === 'recruit') {
      await handleRecruitment(option);
      return;
    }

    if (option.requiresRoll) {
      // Show selection immediately for rolls too
      const immediateLog = [
        ...conversationLog,
        { 
          speaker: gameState.character.name, 
          text: option.text,
          roll: null,
          timestamp: Date.now()
        }
      ];
      setConversationLog(immediateLog);
      
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

    await navigateToNode(option.nextNodeId, option);
  };

  const handleRollComplete = async (result) => {
    setShowDiceRoll(false);
    const option = currentRoll.option;
    
    // Update the last log entry with roll result
    const updatedLog = conversationLog.map((entry, index) => {
      if (index === conversationLog.length - 1 && entry.speaker === gameState.character.name) {
        return {
          ...entry,
          roll: `${result.total} (${result.success ? 'SUCCESS' : 'FAILURE'})`
        };
      }
      return entry;
    });
    setConversationLog(updatedLog);
    
    const nextNodeId = result.success ? option.successNodeId : option.failureNodeId;
    await navigateToNode(nextNodeId, option, result, true);
    
    setCurrentRoll(null);
  };

  const navigateToNode = async (nextNodeId, option, rollResult = null, skipAddingToLog = false) => {
    // IMMEDIATE FEEDBACK: Add player's selection to log FIRST
    if (!skipAddingToLog) {
      const immediateLog = [
        ...conversationLog,
        { 
          speaker: gameState.character.name, 
          text: option.text,
          roll: rollResult ? `${rollResult.total} (${rollResult.success ? 'SUCCESS' : 'FAILURE'})` : null,
          timestamp: Date.now()
        }
      ];
      setConversationLog(immediateLog);
    }

    // Then validate and proceed
    if (!nextNodeId) {
      console.log('⚠️ No nextNodeId - using expand-tree');
      setLoading(true);
      setLoadingPhase('NPC RESPONDING');
      await expandDialogTree(option.text);
      setLoading(false);
      return;
    }

    if (!dialogTree || !dialogTree.nodes) {
      console.error('❌ Dialog tree invalid');
      handleLeave(false);
      return;
    }

    // Check if node exists
    if (!dialogTree.nodes[nextNodeId]) {
      console.log(`⚠️ Node ${nextNodeId} not found - using expand-tree`);
      setLoading(true);
      setLoadingPhase('NPC RESPONDING');
      await expandDialogTree(option.text);
      setLoading(false);
      return;
    }

    // Node exists - proceed normally
    setLoading(true);
    setLoadingPhase('NPC RESPONDING');

    try {
      const nextNode = dialogTree.nodes[nextNodeId];
      
      setCurrentNodeId(nextNodeId);
      
      // Add NPC response after a brief delay for realism
      setTimeout(() => {
        setConversationLog(prev => [
          ...prev,
          { speaker: gameState.currentNPC.name, text: nextNode.npcText, timestamp: Date.now() }
        ]);

        if (nextNode.outcome && nextNode.outcome.type !== 'continue' && nextNode.outcome.type !== 'end_dialog') {
          processOutcome(nextNode.outcome);
        }
        
        setLoading(false);
        setLoadingPhase('');
      }, 500);
    } catch (err) {
      console.error('❌ Error navigating:', err);
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const expandDialogTree = async (playerText) => {
    try {
      const response = await api.post('/api/game/dialog/expand-tree', {
        character: gameState.character,
        npc: gameState.currentNPC,
        gameState: gameState,
        party: gameState.party || [gameState.character],
        customInput: playerText,
        currentNodeId: currentNodeId,
        dialogTree: dialogTree
      });

      console.log('✅ Generated new node:', response.data.newNodeId);

      const updatedTree = {
        ...dialogTree,
        nodes: {
          ...dialogTree.nodes,
          [response.data.newNodeId]: {
            id: response.data.newNodeId,
            npcText: response.data.npcText,
            options: response.data.options,
            outcome: response.data.outcome
          }
        }
      };

      setDialogTree(updatedTree);
      setCurrentNodeId(response.data.newNodeId);

      setConversationLog(prev => [
        ...prev,
        { speaker: gameState.currentNPC.name, text: response.data.npcText, timestamp: Date.now() }
      ]);

      if (response.data.outcome) {
        await processOutcome(response.data.outcome);
      }
    } catch (err) {
      console.error('❌ Expand tree failed:', err);
      setConversationLog(prev => [
        ...prev,
        { speaker: gameState.currentNPC.name, text: '...', timestamp: Date.now() }
      ]);
    }
  };

  const handleCustomDialog = async () => {
    if (!customDialog.trim()) {
      return;
    }

    // Prevent double submission
    if (loading) {
      return;
    }

    // IMMEDIATE FEEDBACK: Show user's input right away
    const immediateLog = [
      ...conversationLog,
      { speaker: gameState.character.name, text: customDialog, timestamp: Date.now() }
    ];
    setConversationLog(immediateLog);

    setLoading(true);
    setLoadingPhase('PROCESSING INPUT');

    const inputText = customDialog;
    setCustomDialog('');
    setShowCustomInput(false);

    await expandDialogTree(inputText);
    
    setLoading(false);
    setLoadingPhase('');
  };

  const processOutcome = async (outcome) => {
    if (outcome.type === 'continue') {
      return;
    }

    try {
      const response = await api.post('/api/game/dialog/process-outcome', {
        character: gameState.character,
        npc: gameState.currentNPC,
        outcome: outcome,
        gameState: gameState,
        party: gameState.party || [gameState.character]
      });

      const newGameState = {
        ...gameState,
        character: response.data.character,
        party: response.data.party,
        ...response.data.gameState
      };

      if (outcome.type === 'start_combat') {
        await transitionToCombat();
        return;
      }

      if (outcome.type === 'start_trade') {
        await enterShopMode('buy');
        return;
      }

      if (outcome.type === 'end_dialog') {
        updateGameState(newGameState);
        handleLeave(false);
        return;
      }

      updateGameState(newGameState);

      if (response.data.message) {
        alert(response.data.message);
      }
    } catch (err) {
      console.error('Error processing outcome:', err);
    }
  };

  const handleRecruitment = async (option) => {
    if (option.requiresRoll) {
      // Show selection immediately
      const immediateLog = [
        ...conversationLog,
        { 
          speaker: gameState.character.name, 
          text: option.text,
          roll: null,
          timestamp: Date.now()
        }
      ];
      setConversationLog(immediateLog);
      
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

    await navigateToNode(option.nextNodeId, option);
  };

  const transitionToCombat = async () => {
    setLoading(true);
    setLoadingPhase('INITIATING COMBAT');

    try {
      const enemyResponse = await api.post('/api/game/dialog/npc-to-enemy', {
        npc: gameState.currentNPC,
        character: gameState.character,
        gameState: gameState
      });

      const dialogSummary = `Combat began during dialog with ${gameState.currentNPC.name}. Previous conversation: ${conversationLog.map(log => `${log.speaker}: ${log.text}`).join(' ')}`;

      updateGameState({
        ...gameState,
        encounterType: 'battle',
        currentEnemy: enemyResponse.data,
        inCombat: true,
        currentNPC: null,
        dialogSummary,
        conversationHistory: [
          ...gameState.conversationHistory,
          {
            role: 'system',
            content: dialogSummary
          }
        ]
      });
    } catch (err) {
      console.error('Error transitioning to combat:', err);
      setLoadingPhase('');
      setLoading(false);
    }
  };

  const generateDialogSummary = async (wasAbandoned) => {
    setLoadingPhase('Generating summary...');
    
    try {
      const response = await api.post('/api/game/dialog/generate-summary', {
        npcName: gameState.currentNPC.name,
        conversationLog,
        wasAbandoned,
        character: gameState.character,
        gameState,
        party: gameState.party || [gameState.character]
      });

      return response.data;
    } catch (err) {
      console.error('Error generating dialog summary:', err);
      return {
        summary: `You ${wasAbandoned ? 'abruptly left' : 'finished talking with'} ${gameState.currentNPC.name}.`,
        consequences: wasAbandoned ? [`${gameState.currentNPC.name} may remember you left mid-conversation.`] : [],
        relationshipChange: wasAbandoned ? -5 : 0
      };
    }
  };

  const handleLeave = async (forcedLeave = false) => {
    if (loading && !forcedLeave) {
      return;
    }
    
    setLoading(true);
    
    const currentNode = getCurrentNode();
    const isTerminal = isTerminalNode(currentNode);
    
    const wasAbandoned = forcedLeave || (!isTerminal && currentNode && currentNode.options && currentNode.options.length > 1);
    
    const summaryData = await generateDialogSummary(wasAbandoned);
    
    const newNPCRelationships = { ...(gameState.npcRelationships || {}) };
    const currentRelationship = newNPCRelationships[gameState.currentNPC.name] || 0;
    newNPCRelationships[gameState.currentNPC.name] = currentRelationship + summaryData.relationshipChange;

    const newConsequenceLog = gameState.consequenceLog || [];
    if (summaryData.consequences && summaryData.consequences.length > 0) {
      newConsequenceLog.push({
        type: 'dialog',
        npc: gameState.currentNPC.name,
        consequences: summaryData.consequences,
        timestamp: Date.now()
      });
    }

    const newDialogHistory = gameState.dialogHistory || [];
    newDialogHistory.push({
      npc: gameState.currentNPC.name,
      log: conversationLog,
      timestamp: Date.now()
    });

    updateGameState({
      ...gameState,
      encounterType: 'normal',
      currentNPC: null,
      npcRelationships: newNPCRelationships,
      consequenceLog: newConsequenceLog,
      dialogHistory: newDialogHistory,
      dialogSummary: summaryData.summary,
      dialogConsequences: summaryData.consequences,
      shouldGenerateAftermath: true,
      lastNarration: null,
      lastOptions: null,
      lastActionHistory: []
    });
  };

  const handleAttack = async () => {
    if (loading) return;
    
    if (window.confirm(`Attack ${gameState.currentNPC.name}?`)) {
      await transitionToCombat();
    }
  };

  const enterShopMode = async (mode) => {
    setLoading(true);
    setLoadingPhase('OPENING SHOP');

    try {
      const response = await api.post('/api/game/shop/inventory', {
        npc: gameState.currentNPC,
        character: gameState.character,
        gameState: gameState
      });

      setShopInventory(response.data.inventory || []);
      setShopMode(mode);
    } catch (err) {
      console.error('Error loading shop:', err);
      alert('Failed to open shop');
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const handleBuyItem = async (item) => {
    if (gameState.character.gold < item.price) {
      alert('NOT ENOUGH GOLD');
      return;
    }

    try {
      const response = await api.post('/api/game/shop/buy', {
        character: gameState.character,
        item
      });

      updateGameState({
        ...gameState,
        character: response.data.character
      });

      alert(`PURCHASED ${item.name.toUpperCase()}`);
    } catch (err) {
      console.error('Error buying item:', err);
      alert('PURCHASE FAILED');
    }
  };

  const handleSellItem = async (item, index) => {
    try {
      const response = await api.post('/api/game/shop/sell', {
        character: gameState.character,
        itemIndex: index
      });

      updateGameState({
        ...gameState,
        character: response.data.character
      });

      alert(`SOLD ${item.name.toUpperCase()}`);
    } catch (err) {
      console.error('Error selling item:', err);
      alert('SALE FAILED');
    }
  };

  const currentNode = getCurrentNode();
  const isTerminal = currentNode ? isTerminalNode(currentNode) : false;

  if (shopMode) {
    return (
      <div style={styles.container}>
        <div></div>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '32px', alignItems: 'center', marginBottom: '40px', paddingBottom: '32px', borderBottom: '2px solid #000' }}>
            <h2 style={{ margin: '0', fontSize: '36px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#000' }}>
              {shopMode === 'buy' ? 'PURCHASE' : 'SELL'}
            </h2>
            <button 
              style={{ padding: '16px', background: '#000', color: '#fff', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.15em' }}
              onClick={() => setShopMode(null)}
            >
              BACK TO DIALOG
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ background: '#000', color: '#fff', padding: '24px 32px', fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '32px', letterSpacing: '-0.02em' }}>
              GOLD: {gameState.character.gold}
            </div>
            
            {shopMode === 'buy' ? (
              <>
                {shopInventory.map((item, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '0', border: '1px solid #000', background: '#fff' }}>
                    <div style={{ padding: '24px 32px', borderRight: '1px solid #000' }}>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#000', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{item.name}</div>
                      <div style={{ fontSize: '14px', color: '#000', lineHeight: '1.5', marginBottom: '12px' }}>{item.description}</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#ff0000', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.price} GOLD</div>
                    </div>
                    <button
                      style={{
                        padding: '24px',
                        background: gameState.character.gold < item.price ? '#e0e0e0' : '#000',
                        color: gameState.character.gold < item.price ? '#999' : '#fff',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: gameState.character.gold < item.price ? 'not-allowed' : 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em'
                      }}
                      onClick={() => handleBuyItem(item)}
                      disabled={gameState.character.gold < item.price}
                    >
                      BUY
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <>
                {(gameState.character.inventory || []).map((item, index) => (
                  <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '0', border: '1px solid #000', background: '#fff' }}>
                    <div style={{ padding: '24px 32px', borderRight: '1px solid #000' }}>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#000', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{item.name}</div>
                      <div style={{ fontSize: '14px', color: '#000', lineHeight: '1.5', marginBottom: '12px' }}>{item.description}</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#ff0000', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SELL: {Math.floor((item.price || 10) * 0.5)} GOLD</div>
                    </div>
                    <button
                      style={{ padding: '24px', background: '#000', color: '#fff', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.15em' }}
                      onClick={() => handleSellItem(item, index)}
                    >
                      SELL
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
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

      <div style={styles.sidebar}>
        <div style={styles.historyPanel}>
          <div style={styles.historyTitle}>Conversation History</div>
          {conversationLog.map((entry, index) => (
            <div key={index} style={styles.historyEntry}>
              <div style={styles.historySpeaker}>
                {entry.speaker === gameState.character.name ? '→ YOU' : '◆ ' + entry.speaker}
              </div>
              <div style={styles.historyText}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.text}</ReactMarkdown>
              </div>
              {entry.roll && (
                <div style={{ ...styles.rollResult, marginTop: '6px' }}>
                  {entry.roll}
                </div>
              )}
            </div>
          ))}
          <div ref={historyEndRef} />
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.npcInfo}>
          <h2 style={styles.npcName}>{gameState.currentNPC.name}</h2>
          <p style={styles.npcRelationship}>{gameState.currentNPC.relationship || 'UNKNOWN'}</p>
        </div>

        <div style={styles.conversationLog}>
          {conversationLog.map((entry, index) => (
            <div
              key={index}
              style={{
                ...styles.conversationEntry,
                ...(entry.speaker === gameState.character.name ? styles.playerEntry : styles.npcEntry)
              }}
            >
              <div style={styles.speakerName}>{entry.speaker}</div>
              <div>
                <div style={styles.speakerText}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.text}</ReactMarkdown>
                </div>
                {entry.roll && (
                  <div style={styles.rollResult}>
                    {entry.roll}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={conversationEndRef} />
        </div>

        {!loading && currentNode && (
          <>
            <div style={styles.specialActions}>
              <button
                style={{
                  ...styles.specialButton,
                  borderRight: '2px solid #000',
                  ...(isTerminal ? { background: '#00aa00', color: '#fff' } : {}),
                  ...(hoveredButton === 'leave' && !isTerminal ? styles.specialButtonHover : {}),
                  ...(loading ? styles.specialButtonDisabled : {})
                }}
                onClick={() => handleLeave(false)}
                onMouseEnter={() => setHoveredButton('leave')}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={loading}
              >
                {isTerminal ? '✓ LEAVE' : 'LEAVE'}
              </button>
              <button
                style={{
                  ...styles.specialButton,
                  borderRight: '2px solid #000',
                  ...(hoveredButton === 'attack' ? { background: '#ff0000', color: '#fff' } : {}),
                  ...(loading ? styles.specialButtonDisabled : {})
                }}
                onClick={handleAttack}
                onMouseEnter={() => setHoveredButton('attack')}
                onMouseLeave={() => setHoveredButton(null)}
                disabled={loading}
              >
                ATTACK
              </button>
              <button
                style={{
                  ...styles.specialButton,
                  borderRight: 'none',
                  ...(hoveredButton === 'trade' ? styles.specialButtonHover : {}),
                  ...(!gameState.currentNPC.canTrade || loading ? styles.specialButtonDisabled : {})
                }}
                onClick={() => enterShopMode('buy')}
                disabled={!gameState.currentNPC.canTrade || loading}
                onMouseEnter={() => setHoveredButton('trade')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                TRADE
              </button>
            </div>

            <div style={styles.dialogOptions}>
              {currentNode.options
                .filter(option => option.type !== 'leave')
                .filter(option => !option.text.toLowerCase().includes('leave abruptly'))
                .map((option) => (
                <button
                  key={option.id}
                  style={{
                    ...styles.dialogOption,
                    ...(option.requiresRoll ? styles.skillCheck : {}),
                    ...(option.type === 'recruit' ? styles.recruitOption : {}),
                    ...(hoveredOption === option.id && !loading ? styles.dialogOptionHover : {}),
                    ...(loading ? styles.dialogOptionDisabled : {})
                  }}
                  onClick={() => handleOptionSelect(option)}
                  onMouseEnter={() => setHoveredOption(option.id)}
                  onMouseLeave={() => setHoveredOption(null)}
                  disabled={loading}
                >
                  <div style={{
                    ...styles.optionNumber,
                    ...(hoveredOption === option.id && !loading ? { background: '#000', color: '#fff' } : {})
                  }}>
                    {option.id.toString().padStart(2, '0')}
                  </div>
                  <div style={{
                    ...styles.optionText,
                    ...(hoveredOption === option.id && !loading ? { color: '#fff' } : {})
                  }}>
                    {option.text}
                  </div>
                  {option.requiresRoll && (
                    <div style={{
                      ...styles.optionBadge,
                      ...(hoveredOption === option.id && !loading ? { color: '#fff', borderLeft: '1px solid #fff' } : {})
                    }}>
                      {option.skill} DC {option.dc}
                    </div>
                  )}
                  {option.type === 'recruit' && !option.requiresRoll && (
                    <div style={{
                      ...styles.optionBadge,
                      ...(hoveredOption === option.id && !loading ? { color: '#fff', borderLeft: '1px solid #fff' } : {})
                    }}>
                      RECRUIT
                    </div>
                  )}
                </button>
              ))}

              {!showCustomInput && (
                <button
                  style={{
                    ...styles.dialogOption,
                    ...styles.customToggle,
                    ...(hoveredOption === 'custom' && !loading ? styles.dialogOptionHover : {}),
                    ...(loading ? styles.dialogOptionDisabled : {})
                  }}
                  onClick={() => setShowCustomInput(true)}
                  onMouseEnter={() => setHoveredOption('custom')}
                  onMouseLeave={() => setHoveredOption(null)}
                  disabled={loading}
                >
                  <div style={{
                    ...styles.optionNumber,
                    ...(hoveredOption === 'custom' && !loading ? { background: '#000', color: '#fff' } : {})
                  }}>
                    ✎
                  </div>
                  <div style={{
                    ...styles.optionText,
                    ...(hoveredOption === 'custom' && !loading ? { color: '#fff' } : {})
                  }}>
                    CUSTOM INPUT
                  </div>
                </button>
              )}
            </div>
          </>
        )}

        {showCustomInput && !loading && (
          <div style={styles.customContainer}>
            <div style={styles.customLabel}>WHAT DO YOU SAY OR DO?</div>
            <textarea
              style={styles.customInput}
              value={customDialog}
              onChange={(e) => setCustomDialog(e.target.value)}
              placeholder="I ask about the ancient ruins..."
              rows={3}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCustomDialog();
                }
              }}
            />
            <div style={styles.customButtons}>
              <button
                style={styles.customSubmit}
                onClick={handleCustomDialog}
                disabled={!customDialog.trim() || loading}
              >
                SUBMIT
              </button>
              <button
                style={styles.customCancel}
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomDialog('');
                }}
                disabled={loading}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <div style={styles.loadingText}>{loadingPhase}</div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Dialog;