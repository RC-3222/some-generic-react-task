import {useEffect} from "react";

/** A custom hook to prevent scrolling based on the specified condition.
 *
 * @param condition Condition to prevent scrolling
 * */
export const useNoScroll = (condition: boolean) => {
    useEffect(() => {
        document.body.style.overflowY = condition ? "hidden" : "visible";
    }, [condition]);
};