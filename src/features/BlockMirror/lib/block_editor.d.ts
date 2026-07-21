import { BlockMirror, BlockMirrorViewMode } from "./block_mirror";
import { WorkspaceSvg } from "blockly";

export interface ViewConfiguration {
  width: string;
  visible: boolean;
}

export declare class BlockMirrorBlockEditor {
  constructor(blockMirror: BlockMirror);

  // Workspace injection / div elements
  blockMirror: BlockMirror;
  blockContainer: HTMLElement;
  blockEditor: HTMLElement;
  blockArea: HTMLElement;
  workspace: WorkspaceSvg;

  VIEW_CONFIGURATIONS: Record<BlockMirrorViewMode, ViewConfiguration>

  getCode(): string;
  setCode(code: string, quietly?: boolean): void;
  setMode(mode: BlockMirrorViewMode): void;
  setReadOnly(isReadOnly: boolean): void;
  resized(): void;

  // Generate PNG from blocks
  getPngFromBlocks(
    callback: (url: string, image: HTMLImageElement) => void
  ): void;
}