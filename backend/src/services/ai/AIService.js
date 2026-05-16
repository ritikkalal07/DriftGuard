import MockAIProvider from './MockAIProvider.js';

/**
 * AI Service Factory
 * Manages different AI providers and provides a unified interface
 */
class AIService {
  constructor() {
    this.provider = null;
    this.providerType = process.env.AI_PROVIDER || 'mock';
    this.initializeProvider();
  }

  /**
   * Initialize the AI provider based on configuration
   */
  initializeProvider() {
    switch (this.providerType.toLowerCase()) {
      case 'mock':
        this.provider = new MockAIProvider();
        console.log('✅ AI Service initialized with Mock Provider');
        break;
      
      case 'watsonx':
        // TODO: Implement WatsonxProvider when API keys are available
        console.log('⚠️  Watsonx provider not yet implemented, falling back to Mock');
        this.provider = new MockAIProvider();
        break;
      
      case 'openai':
        // TODO: Implement OpenAIProvider when API keys are available
        console.log('⚠️  OpenAI provider not yet implemented, falling back to Mock');
        this.provider = new MockAIProvider();
        break;
      
      case 'custom':
        // TODO: Implement CustomProvider for user-defined endpoints
        console.log('⚠️  Custom provider not yet implemented, falling back to Mock');
        this.provider = new MockAIProvider();
        break;
      
      default:
        console.log('⚠️  Unknown provider, using Mock');
        this.provider = new MockAIProvider();
    }
  }

  /**
   * Switch to a different AI provider
   */
  switchProvider(providerType) {
    this.providerType = providerType;
    this.initializeProvider();
  }

  /**
   * Analyze documentation drift
   * @param {Object} codeContext - Information about changed code
   * @param {Object} docContext - Information about related documentation
   * @param {Object} diffContext - Git diff information
   * @returns {Promise<Object>} Drift analysis result
   */
  async analyzeDocumentationDrift(codeContext, docContext, diffContext) {
    if (!this.provider) {
      throw new Error('AI provider not initialized');
    }

    try {
      const result = await this.provider.analyzeDocumentationDrift(
        codeContext,
        docContext,
        diffContext
      );
      return result;
    } catch (error) {
      console.error('Error in AI drift analysis:', error);
      throw new Error('Failed to analyze documentation drift');
    }
  }

  /**
   * Generate documentation patch
   * @param {Object} report - Drift report data
   * @returns {Promise<String>} Generated documentation patch
   */
  async generateDocPatch(report) {
    if (!this.provider) {
      throw new Error('AI provider not initialized');
    }

    try {
      const patch = await this.provider.generateDocPatch(report);
      return patch;
    } catch (error) {
      console.error('Error generating doc patch:', error);
      throw new Error('Failed to generate documentation patch');
    }
  }

  /**
   * Generate PR reviewer comment
   * @param {Object} report - Drift report data
   * @returns {Promise<String>} Generated reviewer comment
   */
  async generateReviewerComment(report) {
    if (!this.provider) {
      throw new Error('AI provider not initialized');
    }

    try {
      const comment = await this.provider.generateReviewerComment(report);
      return comment;
    } catch (error) {
      console.error('Error generating reviewer comment:', error);
      throw new Error('Failed to generate reviewer comment');
    }
  }

  /**
   * Summarize scan results
   * @param {Object} scanResults - Scan statistics and results
   * @returns {Promise<String>} Scan summary
   */
  async summarizeScan(scanResults) {
    if (!this.provider) {
      throw new Error('AI provider not initialized');
    }

    try {
      const summary = await this.provider.summarizeScan(scanResults);
      return summary;
    } catch (error) {
      console.error('Error summarizing scan:', error);
      throw new Error('Failed to summarize scan results');
    }
  }

  /**
   * Get current provider information
   */
  getProviderInfo() {
    return {
      type: this.providerType,
      name: this.provider?.name || 'Unknown',
      isReady: !!this.provider
    };
  }
}

// Export singleton instance
const aiService = new AIService();
export default aiService;

// Made with Bob
