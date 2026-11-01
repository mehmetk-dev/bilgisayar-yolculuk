// Sunumdaki Scratch sahneleri için sitenin kendi sahne motoru (esbuild ile tek dosyaya paketlenir)
import { createWorld } from '../../../src/robot/sahne/runtime.js';
import { createStage, thumb } from '../../../src/robot/sahne/stage.js';
import { mk, BLOCKS, KEYS, SOUNDS, NOTES, COLORS, REPORTERS } from '../../../src/robot/sahne/blocks.js';
import { yonelme } from '../../../src/robot/sahne/editor.js';
import { COSTUMES, BACKDROPS } from '../../../src/robot/sahne/costumes.js';
import { playSound, playNote } from '../../../src/robot/sahne/sound.js';

window.RoboSahne = { yonelme, REPORTERS, createWorld, createStage, thumb, mk, BLOCKS, KEYS, SOUNDS, NOTES, COLORS, COSTUMES, BACKDROPS, playSound, playNote };
