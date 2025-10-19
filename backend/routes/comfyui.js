const express = require('express');
const router = express.Router();
const axios = require('axios');

// Generate image using ComfyUI
router.post('/generate', async (req, res) => {
  try {
    const { prompt, workflow, comfyuiUrl } = req.body;
    
    if (!comfyuiUrl) {
      return res.status(400).json({ error: 'ComfyUI URL not configured' });
    }

    // Load workflow and replace prompt
    const modifiedWorkflow = JSON.parse(workflow);
    
    // Find the text prompt node and update it
    for (const nodeId in modifiedWorkflow) {
      const node = modifiedWorkflow[nodeId];
      if (node.class_type === 'CLIPTextEncode' || node.class_type === 'Text') {
        if (node.inputs && node.inputs.text !== undefined) {
          node.inputs.text = prompt;
        }
      }
    }

    // Queue the workflow
    const queueResponse = await axios.post(`${comfyuiUrl}/prompt`, {
      prompt: modifiedWorkflow
    });

    const { prompt_id } = queueResponse.data;

    // Poll for completion (simplified - in production, use websockets)
    let completed = false;
    let attempts = 0;
    let imageData = null;

    while (!completed && attempts < 60) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const historyResponse = await axios.get(`${comfyuiUrl}/history/${prompt_id}`);
        const history = historyResponse.data[prompt_id];
        
        if (history && history.outputs) {
          // Extract image from outputs
          for (const nodeId in history.outputs) {
            const output = history.outputs[nodeId];
            if (output.images && output.images.length > 0) {
              const image = output.images[0];
              imageData = {
                filename: image.filename,
                subfolder: image.subfolder,
                type: image.type
              };
              completed = true;
              break;
            }
          }
        }
      } catch (err) {
        // History not ready yet
      }
      
      attempts++;
    }

    if (imageData) {
      // Get the actual image
      const imageUrl = `${comfyuiUrl}/view?filename=${imageData.filename}&subfolder=${imageData.subfolder}&type=${imageData.type}`;
      res.json({ imageUrl, imageData });
    } else {
      res.status(500).json({ error: 'Image generation timed out' });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

module.exports = router;