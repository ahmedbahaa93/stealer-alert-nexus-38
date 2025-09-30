'use strict';

const fs = require('fs');
const path = require('path');

const directoriesToScan = [path.join(__dirname, 'components')];

// Function to process each file
function processFile(filePath) {
  // Only process .tsx and .jsx files
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) {
    return;
  }



  let content = fs.readFileSync(filePath, 'utf8');

  // Look for imports from '../ui/motion'
  const relativeImportRegex =
    /import\s+{([^}]+)}\s+from\s+['"]\.\.\/ui\/motion['"];/g;

  if (relativeImportRegex.test(content)) {
    // Reset regex to start from beginning
    relativeImportRegex.lastIndex = 0;

    // Replace with absolute import
    const updatedContent = content.replace(
      relativeImportRegex,
      "import {$1} from '@/components/ui/motion';"
    );

    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
    }
  }
}

// Function to walk through directories
function walkDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else {
      processFile(filePath);
    }
  }
}

// Start the processing


for (const dir of directoriesToScan) {
  walkDir(dir);
}


