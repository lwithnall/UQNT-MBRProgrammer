import { BlockMirror, BlockMirrorViewMode } from "./block_mirror";

export interface TextViewConfiguration {
    width: string;
    visible: boolean;
    indentSidebar: boolean;
}

export declare class BlockMirrorTextEditor {
    constructor(blockMirror: BlockMirror);

    // Parent BlockMirror instance
    blockMirror: BlockMirror;

    // DOM elements
    textContainer: HTMLElement;
    textArea: HTMLTextAreaElement;
    textSidebar: HTMLElement;

    // CodeMirror instance
    codeMirror: unknown;

    // View configuration
    VIEW_CONFIGURATIONS: Record<BlockMirrorViewMode, TextViewConfiguration>;

    // Public API
    getCode(): string;
    setCode(code: string, quietly?: boolean): void;

    setMode(mode: BlockMirrorViewMode): void;
    setReadOnly(isReadOnly: boolean): void;

    enableImages(): void;
    disableImages(): void;

    setHighlightedLines(lines: number[], style?: string): void;
    clearHighlightedLines(style?: string): (number | undefined)[] | undefined;

    defocus(): void;

    resizeResponsively(): void;
    updateGutter(configuration?: TextViewConfiguration): void;
}