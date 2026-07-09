import { BlockMirrorTextToBlocks } from "./text_to_blocks";
import { BlockMirrorTextEditor } from "./text_editor";
import { BlockMirrorBlockEditor } from "./block_editor"

export type BlockMirrorViewMode = "split" | "block" | "text";

export interface BlockMirrorConfiguration {
    container: HTMLElement;
    blocklyMediaPath?: string;
    run?: () => void;
    readOnly?: boolean;
    height?: number;
    viewMode?: BlockMirrorViewMode;
    skipSkulpt?: boolean;
    blockDelay?: boolean;

    // Toolbox
    toolbox?: string;
    renderer?: string;

    // Convert image URLs?
    imageUploadHook?: (url: string) => Promise<string>;
    imageDownloadHook?: (url: string) => string;
    imageLiteralHook?: (url: string) => string;
    imageDetection?: string;
    imageMode?: boolean;
}

export declare class BlockMirror {
    constructor(configuration: BlockMirrorConfiguration);

    textToBlocks: BlockMirrorTextToBlocks;
    textEditor: BlockMirrorTextEditor;
    blockEditor: BlockMirrorBlockEditor;

    VISIBLE_MODES: Record<string, string[]>;
    BREAK_WIDTH: number;

    getCode(): string;
    setCode(code: string, quietly?: boolean): void;
    getMode(): string | null;
    setMode(mode: "split" | "block" | "text"): void;
    setReadOnly(readOnly: boolean): void;
    setImageMode(enabled: boolean): void;
    refresh(): void;
    forceBlockRefresh(): void;

    // Change listeners
    addChangeListener(callback: (event: unknown) => void): void;
    removeChangeListener(callback: (event: unknown) => void): void;
    removeAllChangeListeners(): void;

    // Line highlights
    setHighlightedLines(lines: number[], style?: string): void;
    clearHighlightedLines(style?: string | null): void;
}