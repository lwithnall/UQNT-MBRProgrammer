import { JSX } from "react";
import { Pager } from "./Pager";

export function InfoWidget() {
    const pages: JSX.Element[] = [
        <div>Info Menu!</div>,
        <div>Page 2</div>,
        <div>Page 3</div>,
        <div>Page 4</div>,
    ]

    const infoPager = Pager({pages: pages});
    return infoPager;
}