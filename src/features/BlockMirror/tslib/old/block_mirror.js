import { Sk } from '../../../../vendor/skulpt/main.js';
import * as Blockly from 'blockly/core';
import './main.js';
import { BlockMirrorBlockEditor } from './block_editor';
import { BlockMirrorTextEditor } from './text_editor';
import { BlockMirrorTextToBlocks } from './text_to_blocks';

export function BlockMirror(configuration) {
  this.validateConfiguration(configuration);
  this.initializeVariables();

  if (!this.configuration.skipSkulpt) {
    this.loadSkulpt();
  }

  this.textToBlocks = new BlockMirrorTextToBlocks(this);
  this.textEditor = new BlockMirrorTextEditor(this);
  this.blockEditor = new BlockMirrorBlockEditor(this);

  this.setMode(this.configuration.viewMode);
}

BlockMirror.prototype.validateConfiguration = function (configuration) {
  this.configuration = {};

  // Container
  if ('container' in configuration) {
    this.configuration.container = configuration.container;
  } else {
    throw new Error('Invalid configuration: Missing "container" property.');
  }

  // blocklyPath
  if ('blocklyMediaPath' in configuration) {
    this.configuration.blocklyMediaPath = configuration.blocklyMediaPath;
  } else {
    this.configuration.blocklyMediaPath = '../../blockly/media/';
  }

  // Run function
  if ('run' in configuration) {
    this.configuration.run = configuration.run;
  } else {
    this.configuration.run = function () {
      console.log('Ran!');
    };
  }

  // readOnly
  this.configuration['readOnly'] = configuration['readOnly'] || false;

  // height
  this.configuration.height = configuration.height || 500;

  // viewMode
  this.configuration.viewMode = configuration.viewMode || 'split';

  // Need to load skulpt?
  this.configuration.skipSkulpt = configuration.skipSkulpt || false;

  // Delay?
  this.configuration.blockDelay = configuration.blockDelay || false;

  // Toolbox
  this.configuration.toolbox = configuration.toolbox || 'normal';

  this.configuration.renderer = configuration.renderer || 'Thrasos';

  // Convert image URLs?
  this.configuration.imageUploadHook =
    configuration.imageUploadHook || ((old) => Promise.resolve(old));
  this.configuration.imageDownloadHook = configuration.imageDownloadHook || ((old) => old);
  this.configuration.imageLiteralHook = configuration.imageLiteralHook || ((old) => old);
  this.configuration.imageDetection = configuration.imageDetection || 'string';
  this.configuration.imageMode = configuration.imageMode || false;
};

BlockMirror.prototype.initializeVariables = function () {
  this.tags = {
    toolbar: document.createElement('div'),
    blockContainer: document.createElement('div'),
    blockEditor: document.createElement('div'),
    blockArea: document.createElement('div'),
    textSidebar: document.createElement('div'),
    textContainer: document.createElement('div'),
    textArea: document.createElement('textarea'),
  };
  // Toolbar
  // Loading this breaks a lot of stuff
  // this.configuration.container.appendChild(this.tags.toolbar);
  // Block side
  this.configuration.container.appendChild(this.tags.blockContainer);
  this.tags.blockContainer.appendChild(this.tags.blockEditor);
  this.tags.blockContainer.appendChild(this.tags.blockArea);
  // Text side
  this.configuration.container.appendChild(this.tags.textContainer);
  this.tags.textContainer.appendChild(this.tags.textSidebar);
  this.tags.textContainer.appendChild(this.tags.textArea);

  for (let name in this.tags) {
    this.tags[name].style['box-sizing'] = 'border-box';
  }

  // Files
  this.code_ = '';
  this.mode_ = null;

  // Update Flags
  this.silenceBlock = false;
  this.silenceBlockTimer = null;
  this.silenceText = false;
  this.silenceModel = 0;
  this.blocksFailed = false;
  this.blocksFailedTimeout = null;
  this.triggerOnChange = null;
  this.firstEdit = true;

  // Toolbox width
  this.blocklyToolboxWidth = 0;

  // Listeners
  this.listeners_ = [];
};

BlockMirror.prototype.loadSkulpt = function () {
  Sk.configure({
    __future__: Sk.python3,
    read: function (filename) {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles['files'][filename] === undefined) {
        throw "File not found: '" + filename + "'";
      }
      return Sk.builtinFiles['files'][filename];
    },
  });
};

BlockMirror.prototype.removeAllChangeListeners = function () {
  this.listeners_.length = 0;
};

BlockMirror.prototype.removeChangeListener = function (callback) {
  let index = this.listeners_.indexOf(callback);
  if (index !== -1) {
    this.listeners_.splice(index, 1);
  }
};

BlockMirror.prototype.addChangeListener = function (callback) {
  this.listeners_.push(callback);
};

BlockMirror.prototype.fireChangeListener = function (event) {
  for (let i = 0, func; (func = this.listeners_[i]); i++) {
    func(event);
  }
};

BlockMirror.prototype.setCode = function (code, quietly) {
  this.code_ = code;
  if (!quietly) {
    this.blockEditor.setCode(code, true);
    this.textEditor.setCode(code, true);
  }
  this.fireChangeListener({ name: 'changed', value: code });
};

BlockMirror.prototype.getCode = function () {
  return this.code_;
};

BlockMirror.prototype.getMode = function () {
  return this.mode_;
};

BlockMirror.prototype.setMode = function (mode) {
  this.mode_ = mode;
  this.blockEditor.setMode(mode);
  this.textEditor.setMode(mode);
};

BlockMirror.prototype.setImageMode = function (imageMode) {
  this.configuration.imageMode = imageMode;
  if (imageMode) {
    this.textEditor.enableImages();
  } else {
    this.textEditor.disableImages();
  }
  console.log(imageMode);
};

BlockMirror.prototype.setReadOnly = function (isReadOnly) {
  this.textEditor.setReadOnly(isReadOnly);
  this.blockEditor.setReadOnly(isReadOnly);
  $(this.configuration.container).toggleClass('block-mirror-read-only', isReadOnly);
};

BlockMirror.prototype.refresh = function () {
  this.blockEditor.resized();
  this.textEditor.codeMirror.refresh();
};

BlockMirror.prototype.forceBlockRefresh = function () {
  this.blockEditor.setCode(this.code_, true);
};

BlockMirror.prototype.VISIBLE_MODES = {
  block: ['block', 'split'],
  text: ['text', 'split'],
};

BlockMirror.prototype.BREAK_WIDTH = 675;

BlockMirror.prototype.setHighlightedLines = function (lines, style) {
  this.textEditor.setHighlightedLines(lines, style);
  //this.blockEditor.highlightLines(lines, style);
};

BlockMirror.prototype.clearHighlightedLines = function (style = null) {
  this.textEditor.clearHighlightedLines(style);
  //this.blockEditor.unhighlightLines(lines, style);
};

////////////////////////////////////////////////////////////////////

BlockMirrorBlockEditor.EXTRA_TOOLS = {};

const TOOLBOX_CATEGORY = {};

TOOLBOX_CATEGORY.VARIABLES = { name: 'Variables', colour: 'VARIABLES', custom: 'VARIABLE' };
TOOLBOX_CATEGORY.DECISIONS = {
  name: 'Decisions',
  colour: 'LOGIC',
  blocks: ['if ___: pass', 'if ___: pass\nelse: pass', '___ < ___', '___ and ___', 'not ___'],
};
TOOLBOX_CATEGORY.CALCULATIONS = {
  name: 'Calculation',
  colour: 'MATH',
  blocks: ['___ + ___', 'round(___)'],
};
TOOLBOX_CATEGORY.OUTPUT_WITH_PLOTTING = {
  name: 'Output',
  colour: 'PLOTTING',
  blocks: [
    'print(___)',
    'plt.plot(___)',
    'plt.scatter(___, ___)',
    'plt.hist(___)',
    'plt.bar(___, ___, tick_label=___)',
    'plt.boxplot(___)',
    'plt.show()',
    'plt.title(___)',
    'plt.xlabel(___)',
    'plt.ylabel(___)',
    'plt.hlines(___, ___, ___)',
    'plt.vlines(___, ___, ___)',
  ],
};
TOOLBOX_CATEGORY.TURTLES = {
  name: 'Turtles',
  colour: 'PLOTTING',
  blocks: [
    'turtle.mainloop()',
    'turtle.forward(50)',
    'turtle.backward(50)',
    'turtle.right(90)',
    'turtle.left(90)',
    'turtle.goto(0, 0)',
    'turtle.setx(100)',
    'turtle.sety(100)',
    'turtle.setheading(270)',
    'turtle.pendown()',
    'turtle.penup()',
    "turtle.pencolor('blue')",
  ],
};
TOOLBOX_CATEGORY.INPUT = { name: 'Input', colour: 'TEXT', blocks: ["input('')"] };
TOOLBOX_CATEGORY.VALUES = { name: 'Values', colour: 'TEXT', blocks: ['""', '0', 'True'] };
TOOLBOX_CATEGORY.SEP = '<sep></sep>';

TOOLBOX_CATEGORY.CONVERSIONS = {
  name: 'Conversion',
  colour: 'TEXT',
  blocks: ['int(___)', 'float(___)', 'str(___)', 'bool(___)'],
};

TOOLBOX_CATEGORY.DICTIONARIES = {
  name: 'Dictionaries',
  colour: 'DICTIONARY',
  blocks: ["{'1st key': ___, '2nd key': ___, '3rd key': ___}", '{}', "___['key']"],
};

BlockMirrorBlockEditor.prototype.TOOLBOXES = {
  //******************************************************
  empty: [{ name: 'Empty Toolbox', colour: 'PYTHON', blocks: [] }],
  //******************************************************
  minimal: [
    // TODO: What should live in here?
    TOOLBOX_CATEGORY.VARIABLES,
  ],
  //******************************************************
  normal: [
    TOOLBOX_CATEGORY.VARIABLES,
    TOOLBOX_CATEGORY.DECISIONS,
    {
      name: 'Iteration',
      colour: 'CONTROL',
      blocks: ['for ___ in ___: pass', 'while ___: pass', 'break'],
    },
    {
      name: 'Functions',
      colour: 'FUNCTIONS',
      blocks: ['def ___(___): pass', 'def ___(___: int)->str: pass', 'return ___'],
    },
    TOOLBOX_CATEGORY.SEP,
    TOOLBOX_CATEGORY.CALCULATIONS,
    TOOLBOX_CATEGORY.OUTPUT_WITH_PLOTTING,
    TOOLBOX_CATEGORY.INPUT,
    TOOLBOX_CATEGORY.TURTLES,
    TOOLBOX_CATEGORY.SEP,
    TOOLBOX_CATEGORY.VALUES,
    TOOLBOX_CATEGORY.CONVERSIONS,
    {
      name: 'Lists',
      colour: 'LIST',
      blocks: ['[0, 0, 0]', '[___, ___, ___]', '[]', '___.append(___)', 'range(0, 10)'],
    },
    TOOLBOX_CATEGORY.DICTIONARIES,
  ],
  //******************************************************
  ct: [
    TOOLBOX_CATEGORY.VARIABLES,
    TOOLBOX_CATEGORY.DECISIONS,
    { name: 'Iteration', colour: 'CONTROL', blocks: ['for ___ in ___: pass'] },
    TOOLBOX_CATEGORY.SEP,
    TOOLBOX_CATEGORY.CALCULATIONS,
    TOOLBOX_CATEGORY.OUTPUT_WITH_PLOTTING,
    TOOLBOX_CATEGORY.INPUT,
    TOOLBOX_CATEGORY.SEP,
    TOOLBOX_CATEGORY.VALUES,
    TOOLBOX_CATEGORY.CONVERSIONS,
    {
      name: 'Lists',
      colour: 'LIST',
      blocks: ['[0, 0, 0]', '[___, ___, ___]', '[]', '___.append(___)'],
    },
  ],
  //******************************************************
  full: [
    TOOLBOX_CATEGORY.VARIABLES,
    {
      name: 'Literal Values',
      colour: 'LIST',
      blocks: [
        '0',
        "''",
        'True',
        'None',
        '[___, ___, ___]',
        '(___, ___, ___)',
        '{___, ___, ___}',
        '{___: ___, ___: ___, ___: ___}',
      ],
    },
    {
      name: 'Calculations',
      colour: 'MATH',
      blocks: ['-___', '___ + ___', '___ >> ___', 'abs(___)', 'round(___)'],
    },
    {
      name: 'Logic',
      colour: 'LOGIC',
      blocks: [
        '___ if ___ else ___',
        '___ == ___',
        '___ < ___',
        '___ in ___',
        '___ and ___',
        'not ___',
      ],
    },
    TOOLBOX_CATEGORY.SEP,
    {
      name: 'Classes',
      colour: 'OO',
      blocks: ['class ___: pass', 'class ___(___): pass', '___.___', '___: ___', 'super()'],
    },
    {
      name: 'Functions',
      colour: 'FUNCTIONS',
      blocks: [
        'def ___(___): pass',
        'def ___(___: int)->str: pass',
        'return ___',
        'yield ___',
        'lambda ___: ___',
      ],
    },
    {
      name: 'Imports',
      colour: 'PYTHON',
      blocks: [
        'import ___',
        'from ___ import ___',
        'import ___ as ___',
        'from ___ import ___ as ___',
      ],
    },
    TOOLBOX_CATEGORY.SEP,
    {
      name: 'Control Flow',
      colour: 'CONTROL',
      blocks: [
        'if ___: pass',
        'if ___: pass\nelse: pass',
        'for ___ in ___: pass',
        'while ___: pass',
        'break',
        'continue',
        'try: pass\nexcept ___ as ___: pass',
        'raise ___',
        'assert ___',
        'with ___ as ___: pass',
      ],
    },
    TOOLBOX_CATEGORY.SEP,
    TOOLBOX_CATEGORY.OUTPUT_WITH_PLOTTING,
    TOOLBOX_CATEGORY.INPUT,
    {
      name: 'Files',
      colour: 'FILE',
      blocks: [
        "with open('', 'r') as ___: pass",
        '___.read()',
        '___.readlines()',
        '___.write(___)',
        '___.writelines(___)',
      ],
    },
    TOOLBOX_CATEGORY.SEP,
    {
      name: 'Conversion',
      colour: 'TEXT',
      blocks: [
        'int(___)',
        'float(___)',
        'str(___)',
        'chr(___)',
        'bool(___)',
        'list(___)',
        'dict(___)',
        'tuple(___)',
        'set(___)',
        'type(___)',
        'isinstance(___)',
      ],
    },
    {
      name: 'Builtin Functions',
      colour: 'SEQUENCES',
      blocks: [
        'len(___)',
        'sorted(___)',
        'enumerate(___)',
        'reversed(___)',
        'range(0, 10)',
        'min(___, ___)',
        'max(___, ___)',
        'sum(___)',
        'all(___)',
        'any(___)',
        'zip(___, ___)',
        'map(___, ___)',
        'filter(___, ___)',
      ],
    },
    {
      name: 'List Methods',
      colour: 'LIST',
      blocks: ['___.append(___)', '___.pop()', '___.clear()'],
    },
    {
      name: 'String Methods',
      colour: 'TEXT',
      blocks: [
        "___.startswith('')",
        "___.endswith('')",
        "___.replace('', '')",
        "___.lower('')",
        "___.upper('')",
        "___.title('')",
        "___.strip('')",
        "___.split('')",
        "''.join(___)",
        "___.format('')",
        "___.strip('')",
      ],
    },
    {
      name: 'Subscripting',
      colour: 'SEQUENCES',
      blocks: ['___[___]', '___[___:___]', '___[___:___:___]'],
    },
    {
      name: 'Generators',
      colour: 'SEQUENCES',
      blocks: [
        '[___ for ___ in ___]',
        '(___ for ___ in ___)',
        '{___ for ___ in ___}',
        '{___: ___ for ___ in ___ if ___}',
        '[___ for ___ in ___ if ___]',
        '(___ for ___ in ___ if ___)',
        '{___ for ___ in ___ if ___}',
        '{___: ___ for ___ in ___ if ___}',
      ],
    },
    { name: 'Comments', colour: 'PYTHON', blocks: ['# ', '"""\n"""'] } /*,
        {name: "Weird Stuff", colour: "PYTHON", blocks: [
            "delete ___",
            "global ___"
        ]}*/,
  ],
  //******************************************************
  ct2: [
    { name: 'Memory', colour: 'VARIABLES', custom: 'VARIABLE', hideGettersSetters: true },
    TOOLBOX_CATEGORY.SEP,

    '<category name="Expressions" expanded="true">',
    {
      name: 'Constants',
      colour: 'TEXT',
      blocks: ['""', '0', 'True', '[0, 0, 0]', '[___, ___, ___]', '[]'],
    },
    { name: 'Variables', colour: 'VARIABLES', blocks: ['VARIABLE'] },
    TOOLBOX_CATEGORY.CALCULATIONS,
    TOOLBOX_CATEGORY.CONVERSIONS,
    { name: 'Conditions', colour: 'LOGIC', blocks: ['___ == ___', '___ and ___', 'not ___'] },
    TOOLBOX_CATEGORY.INPUT,
    '</category>',
    TOOLBOX_CATEGORY.SEP,

    '<category name="Operations" expanded="true">',
    { name: 'Assignment', colour: 'VARIABLES', blocks: ['VARIABLE = ___', '___.append(___)'] },
    TOOLBOX_CATEGORY.OUTPUT_WITH_PLOTTING,
    '</category>',
    TOOLBOX_CATEGORY.SEP,

    '<category name="Control" expanded="true">',
    { name: 'Decision', colour: 'CONTROL', blocks: ['if ___: pass', 'if ___: pass\nelse: pass'] },
    { name: 'Iteration', colour: 'CONTROL', blocks: ['for ___ in ___: pass'] },
    '</category>',
  ],
};
