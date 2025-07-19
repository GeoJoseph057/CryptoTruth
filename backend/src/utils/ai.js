const cohere = require('cohere');
cohere.apiKey = process.env.COHERE_API_KEY;

/**
 * Analyze rumor content using Cohere AI
 * @param {string} content - The rumor content to analyze
 * @param {string} category - The rumor category
 * @returns {Promise<Object>} Analysis result with confidence and reasoning
 */
async function analyzeRumor(content, category = 'Other') {
  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: `Analyze this cryptocurrency rumor and provide a confidence score (0-100) and brief reasoning:\n\nRumor: "${content}"\nCategory: ${category}\n\nPlease respond in JSON format:\n{\n  "confidence": <number 0-100>,\n  "reasoning": "<brief explanation>",\n  "keyFactors": ["<factor1>", "<factor2>"]\n}`,
      max_tokens: 200,
      temperature: 0.3,
      k: 0,
      stop_sequences: [],
      return_likelihoods: 'NONE'
    });

    const analysis = response.body.generations[0].text;

    try {
      // Try to parse JSON response
      const parsed = JSON.parse(analysis);
      return {
        confidence: Math.min(100, Math.max(0, parsed.confidence || 50)),
        reasoning: parsed.reasoning || 'Analysis completed',
        keyFactors: parsed.keyFactors || []
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        confidence: 50,
        reasoning: analysis || 'Analysis completed',
        keyFactors: []
      };
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      confidence: 50,
      reasoning: 'Analysis unavailable',
      keyFactors: []
    };
  }
}

/**
 * Get AI confidence score for a rumor
 * @param {string} content - Rumor content
 * @param {string} category - Rumor category
 * @returns {Promise<number>} Confidence score (0-100)
 */
async function getConfidenceScore(content, category = 'Other') {
  try {
    const analysis = await analyzeRumor(content, category);
    return analysis.confidence;
  } catch (error) {
    console.error('Confidence score error:', error);
    return 50; // Default neutral score
  }
}

module.exports = {
  analyzeRumor,
  getConfidenceScore
};