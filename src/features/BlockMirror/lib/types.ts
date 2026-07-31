// // @ts-expect-error - porting from old js module, I am NOT typing this thing
// import type * as SkModule from '../../../vendor/skulpt/main';
// import type * as BlocklyModule from 'blockly/core';
// import type * as PythonModule from 'blockly/python';

// import type { Block } from 'blockly/core';
// import type { TextToBlocks } from './textToBlocks';

// // API object typing
// export type BlocklyAPI = typeof BlocklyModule;
// export type PythonAPI = typeof PythonModule;
// export type SkAPI = typeof SkModule;

// /* Refers to a 'block node'; parameters change depending on block type */
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export type astNode = any;

// /* Passed to ast module to 'register' a block in textToBlocks object */
// export interface BlockRegistrationContext {
//   Blockly: BlocklyAPI;
//   python: PythonAPI;
//   textToBlocks: TextToBlocks;
// }

// /* Info needed to convert python code to a block */
// export interface AstConversionInput {
//   context: BlockRegistrationContext;
//   node: astNode;
//   parent: astNode;
// }

// /* Function that registers an ast module in textToBlocks object */
// export type AstRegisterFunc = (context: BlockRegistrationContext) => void;
// /* Function that converts python code to a block */
// export type AstConversionFunc = (data: AstConversionInput) => Block;

// /* Binary operator data */
// export interface BinOp {
//   operator: string;
//   name: string;
//   order: PythonModule.Order;
//   verb: string;
//   connector: string;
// }

// /* Boolean operator data */
// export interface BoolOp {
//   operator: string;
//   name: string;
//   order: PythonModule.Order;
// }
