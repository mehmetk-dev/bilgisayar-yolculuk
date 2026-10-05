// Dönem kayıt defteri
import { buildEra1990, IO_1990 } from './era1990.js';
import { buildEra2000, IO_2000 } from './era2000.js';
import { buildEra2010, IO_2010 } from './era2010.js';
import { buildEra2025, IO_2025 } from './era2025.js';

export const ERA_BUILDERS = { 1990: buildEra1990, 2000: buildEra2000, 2010: buildEra2010, 2025: buildEra2025 };
export const ERA_IO = { 1990: IO_1990, 2000: IO_2000, 2010: IO_2010, 2025: IO_2025 };
