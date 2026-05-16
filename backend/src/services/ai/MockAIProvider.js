/**
 * Mock AI Provider - Simulates AI responses for demo purposes
 * This allows the platform to work without external AI API keys
 */
class MockAIProvider {
  constructor() {
    this.name = 'Mock AI Provider';
  }

  /**
   * Analyze documentation drift between code and docs
   */
  async analyzeDocumentationDrift(codeContext, docContext, diffContext) {
    // Simulate AI processing delay
    await this.delay(500);

    const analysis = this.generateDriftAnalysis(codeContext, docContext, diffContext);
    return analysis;
  }

  /**
   * Generate documentation patch suggestion
   */
  async generateDocPatch(report) {
    await this.delay(300);

    const patch = this.generatePatchSuggestion(report);
    return patch;
  }

  /**
   * Generate reviewer comment for PR
   */
  async generateReviewerComment(report) {
    await this.delay(200);

    const comment = this.generateReviewComment(report);
    return comment;
  }

  /**
   * Summarize scan results
   */
  async summarizeScan(scanResults) {
    await this.delay(400);

    const summary = this.generateScanSummary(scanResults);
    return summary;
  }

  // Private helper methods

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateDriftAnalysis(codeContext, docContext, diffContext) {
    const { changedFile, changedSymbols } = codeContext;
    const { relatedDocs } = docContext;

    // Determine drift status based on heuristics
    let driftStatus = 'possible';
    let severityScore = 50;
    let confidenceScore = 60;
    let explanation = '';

    // Check if documentation exists
    if (!relatedDocs || relatedDocs.length === 0) {
      driftStatus = 'missing';
      severityScore = 80;
      confidenceScore = 90;
      explanation = `No documentation found for changes in ${changedFile}. `;
      
      if (changedSymbols && changedSymbols.length > 0) {
        const symbolNames = changedSymbols.map(s => s.name).join(', ');
        explanation += `The following symbols were modified: ${symbolNames}. Documentation should be added to explain their purpose and usage.`;
      }
    } else {
      // Analyze based on change type
      const hasApiChanges = changedSymbols.some(s => s.type === 'function' || s.type === 'route');
      const hasConfigChanges = changedSymbols.some(s => s.type === 'config' || s.type === 'variable');
      
      if (hasApiChanges) {
        driftStatus = 'high';
        severityScore = 75;
        confidenceScore = 80;
        explanation = `API changes detected in ${changedFile}. `;
        
        const apiSymbols = changedSymbols.filter(s => s.type === 'function' || s.type === 'route');
        explanation += `Modified functions/routes: ${apiSymbols.map(s => s.name).join(', ')}. `;
        explanation += `The existing documentation in ${relatedDocs[0].path} may not reflect these changes. `;
        explanation += `API response structures, parameters, or behavior may have changed.`;
      } else if (hasConfigChanges) {
        driftStatus = 'high';
        severityScore = 70;
        confidenceScore = 75;
        explanation = `Configuration changes detected in ${changedFile}. `;
        explanation += `The setup or installation documentation may need updates to reflect new configuration requirements.`;
      } else {
        driftStatus = 'possible';
        severityScore = 45;
        confidenceScore = 55;
        explanation = `Code changes detected in ${changedFile}. `;
        explanation += `Review the documentation in ${relatedDocs[0].path} to ensure it still accurately describes the current implementation.`;
      }
    }

    return {
      driftStatus,
      severityScore,
      confidenceScore,
      explanation,
      affectedDocs: relatedDocs || []
    };
  }

  generatePatchSuggestion(report) {
    const { changedFile, changedSymbols, driftStatus, relatedDocs } = report;

    if (driftStatus === 'missing') {
      // Generate new documentation
      if (changedSymbols && changedSymbols.length > 0) {
        const symbol = changedSymbols[0];
        
        if (symbol.type === 'function') {
          return `## ${symbol.name}

**Description:** This function handles ${symbol.name.toLowerCase().replace(/([A-Z])/g, ' $1').trim()}.

**Parameters:**
- \`param1\` (type): Description of parameter

**Returns:**
- \`type\`: Description of return value

**Example:**
\`\`\`javascript
const result = ${symbol.name}(param1);
\`\`\`

**Notes:**
- Add any important notes or warnings here
`;
        } else if (symbol.type === 'route') {
          return `## ${symbol.name}

**Endpoint:** \`${symbol.name}\`

**Method:** GET/POST/PUT/DELETE

**Description:** This endpoint handles ${symbol.name.toLowerCase()}.

**Request Body:**
\`\`\`json
{
  "field": "value"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {}
}
\`\`\`
`;
        }
      }

      return `# Documentation for ${changedFile}

## Overview
This file contains important functionality that should be documented.

## Usage
Describe how to use the code in this file.

## Examples
Provide code examples here.
`;
    }

    // Generate update for existing documentation
    if (relatedDocs && relatedDocs.length > 0) {
      const docPath = relatedDocs[0].path;
      
      if (docPath.toLowerCase().includes('readme')) {
        return `## Updated Section

**Changes in ${changedFile}:**
${changedSymbols.map(s => `- Modified ${s.type}: \`${s.name}\``).join('\n')}

**Impact:**
The changes affect the following functionality:
- Update point 1
- Update point 2
- Update point 3

**Migration Guide:**
If you're upgrading from a previous version, note these breaking changes:
1. Change description 1
2. Change description 2
`;
      }

      if (docPath.toLowerCase().includes('api')) {
        return `### Updated API Response

The response structure has been updated:

**Old Response:**
\`\`\`json
{
  "id": 1,
  "name": "example"
}
\`\`\`

**New Response:**
\`\`\`json
{
  "id": 1,
  "name": "example",
  "additionalField": "new data"
}
\`\`\`
`;
      }
    }

    return `Update the documentation to reflect the recent changes in ${changedFile}.

Key changes:
${changedSymbols.map(s => `- ${s.type} \`${s.name}\` was modified`).join('\n')}

Please review and update accordingly.
`;
  }

  generateReviewComment(report) {
    const { changedFile, driftStatus, severityScore, explanation } = report;

    let emoji = '⚠️';
    let priority = 'Medium';

    if (driftStatus === 'high' || driftStatus === 'missing') {
      emoji = '🚨';
      priority = 'High';
    } else if (driftStatus === 'none') {
      emoji = '✅';
      priority = 'Low';
    }

    return `${emoji} **Documentation Drift Detected** (Priority: ${priority})

**File:** \`${changedFile}\`
**Drift Status:** ${driftStatus.toUpperCase()}
**Severity Score:** ${severityScore}/100

**Analysis:**
${explanation}

**Recommendation:**
${this.getRecommendation(driftStatus, severityScore)}

---
*Generated by DriftGuard - AI Documentation Drift Detector*
`;
  }

  getRecommendation(driftStatus, severityScore) {
    if (driftStatus === 'missing') {
      return '📝 Add documentation for the new or modified code before merging.';
    }
    
    if (driftStatus === 'high') {
      return '🔄 Update the existing documentation to reflect the code changes.';
    }
    
    if (severityScore > 60) {
      return '👀 Review the documentation and update if necessary.';
    }
    
    return '✓ Documentation appears to be in sync, but a quick review is recommended.';
  }

  generateScanSummary(scanResults) {
    const { totalReports, highDrift, possibleDrift, missingDocs, noDrift } = scanResults;

    let summary = `Scan completed successfully. Analyzed ${totalReports} file(s).\n\n`;

    if (highDrift > 0) {
      summary += `🚨 ${highDrift} file(s) with HIGH drift - immediate attention required\n`;
    }

    if (missingDocs > 0) {
      summary += `📝 ${missingDocs} file(s) with MISSING documentation\n`;
    }

    if (possibleDrift > 0) {
      summary += `⚠️ ${possibleDrift} file(s) with POSSIBLE drift - review recommended\n`;
    }

    if (noDrift > 0) {
      summary += `✅ ${noDrift} file(s) with NO drift detected\n`;
    }

    summary += `\n**Overall Health:** `;
    const driftPercentage = ((highDrift + missingDocs) / totalReports) * 100;
    
    if (driftPercentage > 50) {
      summary += '🔴 Poor - Significant documentation issues detected';
    } else if (driftPercentage > 25) {
      summary += '🟡 Fair - Some documentation updates needed';
    } else if (driftPercentage > 0) {
      summary += '🟢 Good - Minor documentation updates recommended';
    } else {
      summary += '🟢 Excellent - Documentation is up to date';
    }

    return summary;
  }
}

export default MockAIProvider;

// Made with Bob
