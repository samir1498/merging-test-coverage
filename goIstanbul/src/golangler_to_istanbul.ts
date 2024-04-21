import { readFileSync } from 'fs';

export function parseGolangCoverage(coverageFilePath) {
  const coverageData = readFileSync(coverageFilePath, 'utf8');
  const lines = coverageData.split('\n');

  const fileCoverage = {};
  let currentFile;

  for (const line of lines) {
    const parts = line.trim().split(':');

    if (parts.length === 1) {
      // New file
      currentFile = parts[0].trim();
      fileCoverage[currentFile] = {
        s: {}, // Statement counts
        b: {}, // Branch counts
        f: {}, // Function counts
        l: {}, // Line counts
        fnMap: {}, // Function map
        statementMap: {}, // Statement map
        branchMap: {}, // Branch map
      };
    } else {
      const metric = parts[0].trim();
      const value = parseFloat(parts[1].trim());
      const details = parts.slice(2).join(':').trim();
      let lineNumber;

      switch (metric) {
        case 'statements':
        case 'branches':
        case 'functions':
          fileCoverage[currentFile][metric.charAt(0)] = value; // Update counts
          break;
        case 'lines':
          lineNumber = parseInt(details, 10);
          fileCoverage[currentFile][metric.charAt(0)][lineNumber] = value;
          break;
        default:
        // Handle function/statement/branch details if needed
      }
    }
  }

  return fileCoverage;
}

export function convertToFileCoverage(fileCoverage) {
  const istanbulCoverage = {};

  for (const file in fileCoverage) {
    istanbulCoverage[file] = {
      path: file,
      s: fileCoverage[file].s,
      b: fileCoverage[file].b,
      f: fileCoverage[file].f,
      l: fileCoverage[file].l,
      // fnMap, statementMap, and branchMap would require additional parsing logic
      // based on Golang coverage data format (if available)
    };
  }

  return istanbulCoverage;
}

// Usage example (optional)
// const golangCoverage = parseGolangCoverage('coverage.out');
// const istanbulJson = convertToFileCoverage(golangCoverage);
// fs.writeFileSync('coverage.json', JSON.stringify(istanbulJson, null, 2));
