// frontend/src/pages/CampaignSetup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function CampaignSetup({ updateGameState }) {
  const navigate = useNavigate();
  const [campaignIdea, setCampaignIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingPhase, setLoadingPhase] = useState('');

  const exampleIdeas = [
    'A dark necromancer threatens the kingdom',
    'Ancient dragons have awakened from their slumber',
    'A mysterious plague spreads through the land',
    'Pirates terrorize the coastal towns',
    'An evil cult summons demons from the abyss',
    'The kingdom is on the brink of civil war',
    'Lost ruins hold the key to ancient power',
    'A meteor crashes, bringing otherworldly creatures'
  ];

  const handleGenerate = async () => {
    if (!campaignIdea.trim()) {
      setError('Please enter a campaign idea');
      return;
    }

    setLoading(true);
    setError('');
    setLoadingPhase('Connecting to AI Dungeon Master...');

    try {
      setTimeout(() => {
        if (loading) setLoadingPhase('Generating campaign world...');
      }, 2000);

      setTimeout(() => {
        if (loading) setLoadingPhase('Creating quest objectives...');
      }, 4000);

      setTimeout(() => {
        if (loading) setLoadingPhase('Finalizing details...');
      }, 6000);

      const response = await api.post('/api/game/campaign/generate', {
        campaignIdea
      });

      const campaign = response.data;
      
      updateGameState({
        campaign,
        character: null,
        conversationHistory: [],
        turnCount: 0,
        contextSummary: null
      });

      navigate('/character');
    } catch (err) {
      console.error('Error generating campaign:', err);
      setError('Failed to generate campaign. Please check Ollama is running and try again.');
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  const handleExampleClick = (idea) => {
    setCampaignIdea(idea);
  };

  return (
    <div className="page campaign-setup-page">
      <div className="container">
        <button 
          className="back-button" 
          onClick={() => navigate('/')}
          disabled={loading}
        >
          ← Back
        </button>

        <header className="header">
          <h1 className="title">Create Your Campaign</h1>
          <div className="subtitle">Describe your adventure and let the AI generate the world</div>
        </header>

        <div className="campaign-form">
          <div className="form-section">
            <label className="form-label">
              Campaign Idea
              <span className="form-description">
                Describe the setting, theme, or main conflict of your adventure
              </span>
            </label>
            <textarea
              className="form-input campaign-textarea"
              value={campaignIdea}
              onChange={(e) => setCampaignIdea(e.target.value)}
              placeholder="Enter your campaign idea here... (e.g., A dark necromancer threatens the kingdom)"
              rows={5}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="example-ideas">
            <div className="example-label">Need inspiration? Try these:</div>
            <div className="example-grid">
              {exampleIdeas.map((idea, index) => (
                <button
                  key={index}
                  className="example-button"
                  onClick={() => handleExampleClick(idea)}
                  disabled={loading}
                >
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <button
            className="primary-button generate-button"
            onClick={handleGenerate}
            disabled={loading || !campaignIdea.trim()}
          >
            {loading ? 'Generating Campaign...' : 'Generate Campaign'}
          </button>

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">
                {loadingPhase}
              </div>
              <div className="loading-subtext">
                This may take a minute...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CampaignSetup;