import {
  parseGolangCoverage,
  convertToFileCoverage,
} from './golangler_to_istanbul.js';

import { writeFileSync } from 'fs';

const golangCoverage = parseGolangCoverage('coverage.out');
const istanbulJson = convertToFileCoverage(golangCoverage);

writeFileSync('coverage.json', JSON.stringify(istanbulJson, null, 2));
