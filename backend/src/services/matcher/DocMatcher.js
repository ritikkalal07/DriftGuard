/**
 * Documentation Matcher Service
 * Finds related documentation for changed code files
 */
class DocMatcher {
  /**
   * Find related documentation for a changed file
   * @param {String} changedFile - Path to changed code file
   * @param {Array} changedSymbols - Symbols changed in the file
   * @param {Array} projectFiles - All files in the project (optional)
   * @returns {Array} Related documentation files with match scores
   */
  findRelatedDocs(changedFile, changedSymbols = [], projectFiles = []) {
    const relatedDocs = [];
    
    // Strategy 1: Look for README files
    const readmeMatches = this.findReadmeFiles(changedFile);
    relatedDocs.push(...readmeMatches);
    
    // Strategy 2: Look for docs directory files
    const docsMatches = this.findDocsDirectoryFiles(changedFile, changedSymbols);
    relatedDocs.push(...docsMatches);
    
    // Strategy 3: Look for API documentation
    const apiMatches = this.findApiDocs(changedFile, changedSymbols);
    relatedDocs.push(...apiMatches);
    
    // Strategy 4: Look for inline comments in the changed file
    const inlineMatches = this.findInlineComments(changedFile);
    relatedDocs.push(...inlineMatches);
    
    // Strategy 5: Look for files with similar names
    const similarNameMatches = this.findSimilarNamedDocs(changedFile);
    relatedDocs.push(...similarNameMatches);
    
    // Remove duplicates and sort by match score
    const uniqueDocs = this.deduplicateAndSort(relatedDocs);
    
    return uniqueDocs;
  }

  /**
   * Find README files that might be related
   */
  findReadmeFiles(changedFile) {
    const matches = [];
    const pathParts = changedFile.split('/');
    
    // Root README
    matches.push({
      path: 'README.md',
      type: 'readme',
      matchScore: 60,
      content: null
    });
    
    // Directory-specific README
    if (pathParts.length > 1) {
      const dir = pathParts.slice(0, -1).join('/');
      matches.push({
        path: `${dir}/README.md`,
        type: 'readme',
        matchScore: 75,
        content: null
      });
    }
    
    return matches;
  }

  /**
   * Find documentation in docs directory
   */
  findDocsDirectoryFiles(changedFile, changedSymbols) {
    const matches = [];
    const fileName = this.getFileName(changedFile);
    const baseName = this.getBaseName(fileName);
    
    // Look for docs with similar names
    const docPaths = [
      `docs/${baseName}.md`,
      `docs/api/${baseName}.md`,
      `docs/guides/${baseName}.md`,
      `documentation/${baseName}.md`,
    ];
    
    for (const path of docPaths) {
      matches.push({
        path,
        type: 'guide',
        matchScore: 70,
        content: null
      });
    }
    
    // Look for API documentation if symbols suggest API changes
    if (changedSymbols.some(s => s.type === 'route' || s.type === 'function')) {
      matches.push({
        path: 'docs/api/README.md',
        type: 'api',
        matchScore: 65,
        content: null
      });
      
      matches.push({
        path: 'docs/API.md',
        type: 'api',
        matchScore: 65,
        content: null
      });
    }
    
    return matches;
  }

  /**
   * Find API documentation
   */
  findApiDocs(changedFile, changedSymbols) {
    const matches = [];
    
    // Check if file contains API routes
    const hasRoutes = changedSymbols.some(s => s.type === 'route');
    const hasApiInPath = changedFile.toLowerCase().includes('api') || 
                         changedFile.toLowerCase().includes('route') ||
                         changedFile.toLowerCase().includes('controller');
    
    if (hasRoutes || hasApiInPath) {
      matches.push({
        path: 'docs/api/endpoints.md',
        type: 'api',
        matchScore: 80,
        content: null
      });
      
      matches.push({
        path: 'API.md',
        type: 'api',
        matchScore: 75,
        content: null
      });
      
      matches.push({
        path: 'docs/API_REFERENCE.md',
        type: 'api',
        matchScore: 75,
        content: null
      });
    }
    
    return matches;
  }

  /**
   * Find inline comments in the changed file
   */
  findInlineComments(changedFile) {
    // This would typically read the file and extract JSDoc/docstrings
    // For now, we'll indicate that inline docs should be checked
    return [{
      path: changedFile,
      type: 'inline',
      matchScore: 90,
      content: 'Inline comments and docstrings in this file'
    }];
  }

  /**
   * Find documentation files with similar names
   */
  findSimilarNamedDocs(changedFile) {
    const matches = [];
    const fileName = this.getFileName(changedFile);
    const baseName = this.getBaseName(fileName);
    
    // Common documentation patterns
    const patterns = [
      `${baseName}.md`,
      `${baseName}-guide.md`,
      `${baseName}-api.md`,
      `${baseName}-docs.md`,
      `how-to-${baseName}.md`,
      `${baseName.toLowerCase()}.md`,
    ];
    
    for (const pattern of patterns) {
      matches.push({
        path: pattern,
        type: 'other',
        matchScore: 55,
        content: null
      });
    }
    
    return matches;
  }

  /**
   * Calculate match score based on multiple factors
   */
  calculateMatchScore(changedFile, docFile, changedSymbols) {
    let score = 0;
    
    // Exact name match
    const changedBaseName = this.getBaseName(this.getFileName(changedFile));
    const docBaseName = this.getBaseName(this.getFileName(docFile));
    
    if (changedBaseName.toLowerCase() === docBaseName.toLowerCase()) {
      score += 40;
    }
    
    // Partial name match
    if (docBaseName.toLowerCase().includes(changedBaseName.toLowerCase()) ||
        changedBaseName.toLowerCase().includes(docBaseName.toLowerCase())) {
      score += 20;
    }
    
    // Same directory
    const changedDir = this.getDirectory(changedFile);
    const docDir = this.getDirectory(docFile);
    
    if (changedDir === docDir) {
      score += 15;
    }
    
    // Symbol name matches in doc path
    for (const symbol of changedSymbols) {
      if (docFile.toLowerCase().includes(symbol.name.toLowerCase())) {
        score += 10;
      }
    }
    
    // Documentation type bonuses
    if (docFile.toLowerCase().includes('readme')) {
      score += 10;
    }
    
    if (docFile.toLowerCase().includes('api') && 
        changedSymbols.some(s => s.type === 'route' || s.type === 'function')) {
      score += 15;
    }
    
    return Math.min(score, 100);
  }

  /**
   * Remove duplicate docs and sort by match score
   */
  deduplicateAndSort(docs) {
    const seen = new Map();
    
    for (const doc of docs) {
      const existing = seen.get(doc.path);
      if (!existing || doc.matchScore > existing.matchScore) {
        seen.set(doc.path, doc);
      }
    }
    
    return Array.from(seen.values())
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5); // Return top 5 matches
  }

  /**
   * Helper: Get file name from path
   */
  getFileName(path) {
    return path.split('/').pop();
  }

  /**
   * Helper: Get base name without extension
   */
  getBaseName(fileName) {
    return fileName.replace(/\.[^.]+$/, '');
  }

  /**
   * Helper: Get directory from path
   */
  getDirectory(path) {
    const parts = path.split('/');
    return parts.slice(0, -1).join('/');
  }

  /**
   * Check if a file path matches ignore patterns
   */
  shouldIgnore(filePath, ignorePatterns = []) {
    const defaultIgnores = [
      'node_modules',
      '.git',
      'dist',
      'build',
      'coverage',
      '.next',
      '.cache'
    ];
    
    const allPatterns = [...defaultIgnores, ...ignorePatterns];
    
    return allPatterns.some(pattern => {
      if (pattern.includes('*')) {
        // Simple glob pattern matching
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(filePath);
      }
      return filePath.includes(pattern);
    });
  }
}

export default new DocMatcher();

// Made with Bob
