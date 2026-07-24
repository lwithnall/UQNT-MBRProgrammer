import { JSX } from "react";
import { Pager } from "./Pager";

export function HelpWidget() {
    const pages: JSX.Element[] = [
        <div>Help Menu!</div>,
        <div>Page 2</div>,
        <div>Page 3</div>,
        <div>Page 4</div>,
    ]

    const helpPager = Pager({pages: pages});
    return helpPager;
}