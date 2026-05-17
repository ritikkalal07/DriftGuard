import { createDriftReport, createSuggestion } from '../../utils/supabaseHelpers.js';
import DiffParser from '../parser/DiffParser.js';
import DocMatcher from '../matcher/DocMatcher.js';
import AIService from '../ai/AIService.js';

class DriftDetectionService {
  /**
   * Analyze a git diff and detect documentation drift
   */
  async analyzeDiff(diffContent, projectId, scanId) {
    try {
// Parse the diff
       const parsedDiff = DiffParser.parseDiff(diffContent);
       
       const results = {
         totalFiles: parsedDiff.files.length,
         highDriftCount: 0,
         mediumDriftCount: 0,
         lowDriftCount: 0,
         noDriftCount: 0,
         missingDocsCount: 0,
         reports: []
       };

       // Process each changed file
       for (const file of parsedDiff.files) {
         // Match related documentation
         const relatedDocs = DocMatcher.findRelatedDocs(file.path, file.symbols || []);
         
         // Analyze drift for each file
         const driftAnalysis = await this.analyzeFileDrift(file, relatedDocs);
         
         // Create drift report
         const report = await createDriftReport({
           scan_id: scanId,
           project_id: projectId,
           changed_file: file.path,
           changed_symbols: file.symbols || [],
           related_docs: relatedDocs,
           drift_status: driftAnalysis.status,
           severity_score: driftAnalysis.severity,
           confidence_score: driftAnalysis.confidence,
           explanation: driftAnalysis.explanation,
           suggested_patch: driftAnalysis.suggestedPatch,
           reviewer_comment: driftAnalysis.reviewerComment,
           status: 'pending'
         });

         // Create suggestions if available
         if (driftAnalysis.suggestions && driftAnalysis.suggestions.length > 0) {
           for (const suggestion of driftAnalysis.suggestions) {
             await createSuggestion({
               report_id: report.id,
               suggestion_type: suggestion.type,
               original_content: suggestion.original,
               suggested_content: suggestion.suggested,
               explanation: suggestion.explanation,
               status: 'pending'
             });
           }
         }

// Update counts
          switch (driftAnalysis.status) {
            case 'high_drift':
              results.highDriftCount++;
              break;
            case 'possible_drift':
              results.mediumDriftCount++;
              break;
            case 'no_drift':
              results.noDriftCount++;
              break;
            case 'missing_docs':
              results.missingDocsCount++;
              break;
          }

          results.reports.push(report);
      }

      return results;
    } catch (error) {
      console.error('Drift analysis error:', error);
      throw error;
    }
  }

  /**
   * Analyze drift for a single file
   */
  async analyzeFileDrift(file, relatedDocs) {
    try {
      // Check if documentation exists
      if (!relatedDocs || relatedDocs.length === 0) {
        return {
          status: 'missing_docs',
          severity: 70,
          confidence: 90,
          explanation: `No documentation found for ${file.path}. Consider adding documentation for the changes made.`,
          suggestedPatch: this.generateMissingDocSuggestion(file),
          reviewerComment: `⚠️ Missing documentation for ${file.path}`,
          suggestions: []
        };
      }

      // Use AI to analyze drift
      const aiAnalysis = await AIService.analyzeDocumentationDrift(
        file,
        relatedDocs,
        ''
      );

      return {
        status: aiAnalysis.driftStatus || 'possible_drift',
        severity: aiAnalysis.severityScore || 50,
        confidence: aiAnalysis.confidenceScore || 70,
        explanation: aiAnalysis.explanation || 'Potential documentation drift detected',
        suggestedPatch: aiAnalysis.suggestedPatch || '',
        reviewerComment: aiAnalysis.reviewerComment || '',
        suggestions: aiAnalysis.suggestions || []
      };
    } catch (error) {
      console.error('File drift analysis error:', error);
      // Return default analysis on error
      return {
        status: 'possible_drift',
        severity: 50,
        confidence: 50,
        explanation: 'Unable to fully analyze drift. Manual review recommended.',
        suggestedPatch: '',
        reviewerComment: '⚠️ Manual review needed',
        suggestions: []
      };
    }
  }

  /**
   * Generate suggestion for missing documentation
   */
  generateMissingDocSuggestion(file) {
    const symbols = file.symbols || [];
    if (symbols.length === 0) {
      return `# Documentation for ${file.path}\n\nPlease add documentation for the changes in this file.`;
    }

    let suggestion = `# Documentation for ${file.path}\n\n`;
    symbols.forEach(symbol => {
      suggestion += `## ${symbol.name}\n\n`;
      suggestion += `Type: ${symbol.type}\n\n`;
      suggestion += `Description: [Add description here]\n\n`;
    });

    return suggestion;
  }
}

export default new DriftDetectionService();

// Made with Bob
