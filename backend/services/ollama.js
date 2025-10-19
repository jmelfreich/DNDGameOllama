// backend/services/ollama.js
const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'qwen3:8b';

/**
 * Generate structured output using Ollama with JSON schema validation
 * @param {Object} options - Generation options
 * @param {Array} options.messages - Array of message objects with role and content
 * @param {Object} options.schema - JSON schema for structured output
 * @param {string} options.model - Model to use (optional, defaults to qwen3:8b)
 * @returns {Object} Parsed JSON response matching the schema
 */
async function generateStructured({ messages, schema, model = DEFAULT_MODEL }) {
  try {
    console.log(`🤖 Generating with model: ${model}`);
    console.log(`📋 Schema:`, JSON.stringify(schema, null, 2));
    
    const response = await axios.post(
      `${OLLAMA_URL}/api/chat`,
      {
        model: model,
        messages: messages,
        stream: false,
        format: schema, // Ollama structured outputs format parameter
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      },
      {
        timeout: 120000, // 2 minutes
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Generation complete');
    
    // Parse the JSON response
    const content = response.data.message.content;
    let parsedContent;
    
    try {
      parsedContent = JSON.parse(content);
    } catch (parseError) {
      // Sometimes the model returns markdown code blocks, strip them
      const cleanedContent = content
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();
      parsedContent = JSON.parse(cleanedContent);
    }
    
    console.log('📦 Parsed response:', JSON.stringify(parsedContent, null, 2).substring(0, 200) + '...');
    
    return parsedContent;
    
  } catch (error) {
    console.error('❌ Ollama generation error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to Ollama. Make sure Ollama is running with "ollama serve"');
      throw new Error('Cannot connect to Ollama. Make sure Ollama is running with "ollama serve"');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('❌ Ollama request timed out');
      throw new Error('Ollama request timed out. The model might be too slow or not responding');
    } else if (error.response?.status === 404) {
      console.error(`❌ Model "${model}" not found`);
      throw new Error(`Model not found. Please pull it with: ollama pull ${model}`);
    } else {
      console.error('❌ Ollama API error:', error.message);
      throw error;
    }
  }
}

/**
 * Check if Ollama is running and list available models
 * @returns {Object} Connection status and models list
 */
async function checkConnection() {
  try {
    console.log('🔍 Checking Ollama connection...');
    
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Ollama is running');
    
    return {
      connected: true,
      models: response.data.models || [],
      url: OLLAMA_URL
    };
  } catch (error) {
    console.error('❌ Ollama connection failed:', error.message);
    
    return {
      connected: false,
      error: error.message,
      errorCode: error.code,
      url: OLLAMA_URL
    };
  }
}

/**
 * Get information about a specific model
 * @param {string} modelName - Name of the model
 * @returns {Object} Model information
 */
async function getModelInfo(modelName) {
  try {
    const response = await axios.post(`${OLLAMA_URL}/api/show`, {
      name: modelName
    }, {
      timeout: 5000
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error getting info for model ${modelName}:`, error.message);
    throw error;
  }
}

module.exports = {
  generateStructured,
  checkConnection,
  getModelInfo
};