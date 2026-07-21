import * as python from 'blockly/python';
import type { BinOp, BoolOp } from './types';

export const BLOCK_COLOURS = {
  VARIABLES: 225,
  FUNCTIONS: 210,
  OO: 240,
  CONTROL: 270,
  MATH: 190,
  TEXT: 120,
  FILE: 170,
  PLOTTING: 140,
  LOGIC: 345,
  PYTHON: 60,
  EXCEPTIONS: 300,
  SEQUENCES: 15,
  LIST: 30,
  DICTIONARY: 0,
  SET: 10,
  TUPLE: 20,
};

// Annotated assignment operator options
export const ANNOTATION_OPTIONS = [
  ['int', 'int'],
  ['float', 'float'],
  ['str', 'str'],
  ['bool', 'bool'],
  ['None', 'None'],
];
export const ANNOTATION_GENERATE: Record<string, string> = Object.fromEntries(ANNOTATION_OPTIONS);

// Used for empty variable inputs
export const PYGEN_BLANK = '___';

// Binary operator mappings
export const BINOPS: BinOp[] = [
  { operator: '-', name: 'Sub', order: python.Order.ADDITIVE, verb: 'decrease', connector: 'by' },
  {
    operator: '*',
    name: 'Mult',
    order: python.Order.MULTIPLICATIVE,
    verb: 'multiply',
    connector: 'by',
  },
  {
    operator: '/',
    name: 'Div',
    order: python.Order.MULTIPLICATIVE,
    verb: 'divide',
    connector: 'by',
  },
  {
    operator: '%',
    name: 'Mod',
    order: python.Order.MULTIPLICATIVE,
    verb: 'modulo',
    connector: 'by',
  },
  {
    operator: '**',
    name: 'Pow',
    order: python.Order.EXPONENTIATION,
    verb: 'raise',
    connector: 'to',
  },
  {
    operator: '//',
    name: 'FloorDiv',
    order: python.Order.MULTIPLICATIVE,
    verb: 'floor divide',
    connector: 'by',
  },
  {
    operator: '<<',
    name: 'LShift',
    order: python.Order.BITWISE_SHIFT,
    verb: 'left shift',
    connector: 'by',
  },
  {
    operator: '>>',
    name: 'RShift',
    order: python.Order.BITWISE_SHIFT,
    verb: 'right shift',
    connector: 'by',
  },
  {
    operator: '|',
    name: 'BitOr',
    order: python.Order.BITWISE_OR,
    verb: 'bitwise OR',
    connector: 'using',
  },
  {
    operator: '^',
    name: 'BitXor',
    order: python.Order.BITWISE_XOR,
    verb: 'bitwise XOR',
    connector: 'using',
  },
  {
    operator: '&',
    name: 'BitAnd',
    order: python.Order.BITWISE_AND,
    verb: 'bitwise AND',
    connector: 'using',
  },
  {
    operator: '@',
    name: 'MatMult',
    order: python.Order.MULTIPLICATIVE,
    verb: 'matrix multiply',
    connector: 'by',
  },
];

export const BINOPS_SIMPLE = ['Add', 'Sub', 'Mult', 'Div', 'Mod', 'Pow'];
export const binopsBlocklyDisplayFull: [string, string][] = BINOPS.map((b) => [b.operator, b.name]);
export const binopsBlocklyDisplay = binopsBlocklyDisplayFull.filter(
  (b) => BINOPS_SIMPLE.indexOf(b[1]) >= 0
);
export const binopsAugassignDisplayFull: [string, string][] = BINOPS.map((b) => [b.verb, b.name]);
export const binopsAugassignDisplay = binopsAugassignDisplayFull.filter(
  (b) => BINOPS_SIMPLE.indexOf(b[1] as string) >= 0
);
export const binopsBlocklyGenerate: Record<string, [string, python.Order]> = {};
export const binopsAugassignPreposition: Record<string, string> = {};
BINOPS.forEach((b) => {
  binopsBlocklyGenerate[b.name] = [' ' + b.operator, b.order];
  binopsAugassignPreposition[b.name] = b.verb;
});

/* Boolean Operator stuff */
export const BOOLOPS: BoolOp[] = [
  { operator: 'and', name: 'And', order: python.Order.LOGICAL_AND },
  { operator: 'or', name: 'Or', order: python.Order.LOGICAL_OR },
];

export const boolopsBlocklyDisplay = BOOLOPS.map((b) => [b.operator, b.name]);
export const boolopsBlocklyGenerate: Record<string, [string, python.Order]> = {};
BOOLOPS.forEach((b) => (boolopsBlocklyGenerate[b.name] = [' ' + b.operator + ' ', b.order]));
