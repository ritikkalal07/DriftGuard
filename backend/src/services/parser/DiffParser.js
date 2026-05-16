/**
 * Diff Parser Service
 * Parses git diffs and extracts changed files, functions, and symbols
 */
class DiffParser {
  /**
   * Parse git diff content
   * @param {String} diffContent - Raw git diff text
   * @returns {Object} Parsed diff information
   */
  parseDiff(diffContent) {
    const files = [];
    const lines = diffContent.split('\n');
    
    let currentFile = null;
    let currentHunk = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // New file detected
      if (line.startsWith('diff --git')) {
        if (currentFile) {
          currentFile.changes = this.analyzeChanges(currentHunk);
          files.push(currentFile);
        }
        
        const match = line.match(/diff --git a\/(.*?) b\/(.*)/);
        currentFile = {
          path: match ? match[2] : 'unknown',
          additions: 0,
          deletions: 0,
          hunks: [],
          changes: []
        };
        currentHunk = [];
      }
      
      // File path (alternative format)
      else if (line.startsWith('+++') && currentFile) {
        const match = line.match(/\+\+\+ b\/(.*)/);
        if (match) {
          currentFile.path = match[1];
        }
      }
      
      // Hunk header
      else if (line.startsWith('@@') && currentFile) {
        const match = line.match(/@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@(.*)/);
        if (match) {
          currentFile.hunks.push({
            oldStart: parseInt(match[1]),
            oldLines: parseInt(match[2] || 1),
            newStart: parseInt(match[3]),
            newLines: parseInt(match[4] || 1),
            context: match[5].trim()
          });
        }
      }
      
      // Changed lines
      else if (currentFile && (line.startsWith('+') || line.startsWith('-'))) {
        if (line.startsWith('+') && !line.startsWith('+++')) {
          currentFile.additions++;
          currentHunk.push({ type: 'addition', content: line.substring(1) });
        } else if (line.startsWith('-') && !line.startsWith('---')) {
          currentFile.deletions++;
          currentHunk.push({ type: 'deletion', content: line.substring(1) });
        }
      }
    }
    
    // Add last file
    if (currentFile) {
      currentFile.changes = this.analyzeChanges(currentHunk);
      files.push(currentFile);
    }
    
    return {
      files,
      totalFiles: files.length,
      totalAdditions: files.reduce((sum, f) => sum + f.additions, 0),
      totalDeletions: files.reduce((sum, f) => sum + f.deletions, 0)
    };
  }

  /**
   * Analyze changes to detect modified symbols
   * @param {Array} hunk - Array of changed lines
   * @returns {Array} Detected symbols
   */
  analyzeChanges(hunk) {
    const symbols = [];
    const addedLines = hunk.filter(h => h.type === 'addition').map(h => h.content);
    const deletedLines = hunk.filter(h => h.type === 'deletion').map(h => h.content);
    const allLines = [...addedLines, ...deletedLines];
    
    // Detect functions
    const functionPatterns = [
      /function\s+(\w+)\s*\(/g,
      /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g,
      /(\w+)\s*:\s*function\s*\(/g,
      /async\s+function\s+(\w+)/g,
      /def\s+(\w+)\s*\(/g,  // Python
      /public\s+\w+\s+(\w+)\s*\(/g,  // Java/C#
    ];
    
    for (const pattern of functionPatterns) {
      for (const line of allLines) {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          symbols.push({
            type: 'function',
            name: match[1],
            context: line.trim()
          });
        }
      }
    }
    
    // Detect classes
    const classPatterns = [
      /class\s+(\w+)/g,
      /interface\s+(\w+)/g,
      /type\s+(\w+)\s*=/g
    ];
    
    for (const pattern of classPatterns) {
      for (const line of allLines) {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          symbols.push({
            type: 'class',
            name: match[1],
            context: line.trim()
          });
        }
      }
    }
    
    // Detect routes/endpoints
    const routePatterns = [
      /app\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
      /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
      /@(Get|Post|Put|Delete|Patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
    ];
    
    for (const pattern of routePatterns) {
      for (const line of allLines) {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          symbols.push({
            type: 'route',
            name: `${match[1].toUpperCase()} ${match[2]}`,
            context: line.trim()
          });
        }
      }
    }
    
    // Detect config/env variables
    const configPatterns = [
      /process\.env\.(\w+)/g,
      /config\.(\w+)/g,
      /const\s+(\w+)\s*=\s*process\.env/g
    ];
    
    for (const pattern of configPatterns) {
      for (const line of allLines) {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          symbols.push({
            type: 'config',
            name: match[1],
            context: line.trim()
          });
        }
      }
    }
    
    // Detect imports/exports
    const importPatterns = [
      /import\s+.*?from\s+['"`]([^'"`]+)['"`]/g,
      /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      /export\s+(default\s+)?(\w+)/g
    ];
    
    for (const pattern of importPatterns) {
      for (const line of allLines) {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          symbols.push({
            type: match[0].startsWith('export') ? 'export' : 'import',
            name: match[1] || match[2],
            context: line.trim()
          });
        }
      }
    }
    
    // Remove duplicates
    const uniqueSymbols = [];
    const seen = new Set();
    
    for (const symbol of symbols) {
      const key = `${symbol.type}:${symbol.name}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueSymbols.push(symbol);
      }
    }
    
    return uniqueSymbols;
  }

  /**
   * Extract file extension
   */
  getFileExtension(filePath) {
    const match = filePath.match(/\.([^.]+)$/);
    return match ? match[1] : '';
  }

  /**
   * Determine if file is a documentation file
   */
  isDocumentationFile(filePath) {
    const docExtensions = ['md', 'txt', 'rst', 'adoc'];
    const docPaths = ['docs/', 'documentation/', 'README'];
    
    const ext = this.getFileExtension(filePath);
    if (docExtensions.includes(ext.toLowerCase())) {
      return true;
    }
    
    return docPaths.some(path => filePath.includes(path));
  }

  /**
   * Determine if file is a code file
   */
  isCodeFile(filePath) {
    const codeExtensions = [
      'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'cs', 
      'go', 'rb', 'php', 'swift', 'kt', 'rs', 'scala'
    ];
    
    const ext = this.getFileExtension(filePath);
    return codeExtensions.includes(ext.toLowerCase());
  }
}

export default new DiffParser();

// Made with Bob
