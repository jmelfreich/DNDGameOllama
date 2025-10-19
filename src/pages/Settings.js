import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    ollamaUrl: 'http://127.0.0.1:11434',
    ollamaModel: 'qwen3:8b',
    comfyuiUrl: '',
    comfyuiWorkflow: '',
    enableImageGeneration: false
  });
  
  const [ollamaStatus, setOllamaStatus] = useState({
    checking: false,
    connected: false,
    models: [],
    error: null
  });

  const [testingModel, setTestingModel] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('dnd-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('dnd-settings', JSON.stringify(settings));
    alert('Settings saved successfully');
  };

  const checkOllamaConnection = async () => {
    setOllamaStatus({ checking: true, connected: false, models: [], error: null });
    setTestResult(null);
    
    try {
      const response = await api.get('/api/game/ollama/status');
      
      console.log('Ollama status response:', response.data);
      
      if (response.data.status === 'connected') {
        setOllamaStatus({
          checking: false,
          connected: true,
          models: response.data.models,
          error: null
        });
      } else {
        setOllamaStatus({
          checking: false,
          connected: false,
          models: [],
          error: response.data.error || 'Cannot connect to Ollama'
        });
      }
    } catch (error) {
      console.error('Error checking Ollama connection:', error);
      setOllamaStatus({
        checking: false,
        connected: false,
        models: [],
        error: error.response?.data?.error || error.message
      });
    }
  };

  const testModel = async () => {
    setTestingModel(true);
    setTestResult(null);

    try {
      const response = await api.post('/api/game/ollama/test', {
        model: settings.ollamaModel
      });

      console.log('Model test response:', response.data);
      setTestResult(response.data);
    } catch (error) {
      console.error('Error testing model:', error);
      setTestResult({
        success: false,
        error: error.response?.data?.error || error.message
      });
    } finally {
      setTestingModel(false);
    }
  };

  const handleLoadWorkflow = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings({ ...settings, comfyuiWorkflow: event.target.result });
      };
      reader.readAsText(file);
    }
  };

  const formatModelSize = (size) => {
    if (!size) return '';
    const gb = size / 1024 / 1024 / 1024;
    return `${gb.toFixed(1)} GB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="page settings-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>

        <header className="header">
          <h1 className="title">Settings</h1>
          <div className="subtitle">Configure your game</div>
        </header>

        <div className="settings-form">
          {/* Ollama Configuration */}
          <section className="settings-section">
            <h2 className="section-title">Ollama Configuration</h2>
            
            <div className="form-section">
              <label className="form-label">
                Ollama URL
                <span className="form-description">
                  URL of your Ollama instance
                </span>
              </label>
              <input
                type="text"
                className="form-input"
                value={settings.ollamaUrl}
                onChange={(e) => setSettings({ ...settings, ollamaUrl: e.target.value })}
                placeholder="http://127.0.0.1:11434"
              />
            </div>

            <div className="form-section">
              <label className="form-label">
                Default Model
                <span className="form-description">
                  Model to use for game generation
                </span>
              </label>
              <input
                type="text"
                className="form-input"
                value={settings.ollamaModel}
                onChange={(e) => setSettings({ ...settings, ollamaModel: e.target.value })}
                placeholder="qwen3:8b"
              />
            </div>

            {/* Connection Check */}
            <div className="connection-check-section">
              <button
                className="check-connection-button"
                onClick={checkOllamaConnection}
                disabled={ollamaStatus.checking}
              >
                {ollamaStatus.checking ? 'Checking Connection...' : 'Check Ollama Connection'}
              </button>

              {ollamaStatus.connected && (
                <div className="connection-success">
                  <div className="status-header">
                    <span className="status-icon">✓</span>
                    <span className="status-text">Connected to Ollama</span>
                  </div>
                  
                  <div className="models-list">
                    <h3 className="models-title">Available Models ({ollamaStatus.models.length})</h3>
                    <div className="models-grid">
                      {ollamaStatus.models.map((model, index) => (
                        <div 
                          key={index} 
                          className={`model-card ${model.name === settings.ollamaModel ? 'selected' : ''}`}
                          onClick={() => setSettings({ ...settings, ollamaModel: model.name })}
                        >
                          <div className="model-name">{model.name}</div>
                          <div className="model-details">
                            <span className="model-size">{formatModelSize(model.size)}</span>
                            {model.modified_at && (
                              <span className="model-date">{formatDate(model.modified_at)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Model Button */}
                  <button
                    className="test-model-button"
                    onClick={testModel}
                    disabled={testingModel || !settings.ollamaModel}
                  >
                    {testingModel ? 'Testing Model...' : `Test ${settings.ollamaModel}`}
                  </button>

                  {testResult && (
                    <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
                      {testResult.success ? (
                        <div>
                          <div className="test-result-header">✓ Model Test Successful</div>
                          <div className="test-result-content">
                            Response: {testResult.response?.message || 'OK'}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="test-result-header">✗ Model Test Failed</div>
                          <div className="test-result-content">
                            Error: {testResult.error}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {ollamaStatus.error && (
                <div className="connection-error">
                  <div className="status-header">
                    <span className="status-icon">✗</span>
                    <span className="status-text">Cannot Connect to Backend</span>
                  </div>
                  <div className="error-details">
                    <strong>Error:</strong> {ollamaStatus.error}
                  </div>
                  <div className="error-help">
                    <strong>Troubleshooting:</strong>
                    <ul>
                      <li>Make sure the backend is running: <code>cd backend && npm start</code></li>
                      <li>Backend should be at: <code>http://localhost:3001</code></li>
                      <li>Check backend terminal for errors</li>
                      <li>Make sure Ollama is running: <code>ollama serve</code></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ComfyUI Configuration */}
          <section className="settings-section">
            <h2 className="section-title">Image Generation (Optional)</h2>
            
            <div className="form-section">
              <label className="form-label">
                <input
                  type="checkbox"
                  checked={settings.enableImageGeneration}
                  onChange={(e) => setSettings({ ...settings, enableImageGeneration: e.target.checked })}
                />
                <span style={{ marginLeft: '8px' }}>Enable Image Generation (ComfyUI)</span>
              </label>
            </div>

            {settings.enableImageGeneration && (
              <>
                <div className="form-section">
                  <label className="form-label">
                    ComfyUI URL
                    <span className="form-description">
                      URL of your ComfyUI instance
                    </span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.comfyuiUrl}
                    onChange={(e) => setSettings({ ...settings, comfyuiUrl: e.target.value })}
                    placeholder="http://127.0.0.1:8188"
                  />
                </div>

                <div className="form-section">
                  <label className="form-label">
                    ComfyUI Workflow
                    <span className="form-description">
                      Upload your workflow JSON file
                    </span>
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleLoadWorkflow}
                    className="file-input"
                  />
                  {settings.comfyuiWorkflow && (
                    <div className="workflow-status">✓ Workflow loaded</div>
                  )}
                </div>
              </>
            )}
          </section>

          <button className="primary-button" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;