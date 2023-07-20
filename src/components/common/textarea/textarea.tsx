import {ChangeEvent, ChangeEventHandler, FocusEventHandler, useEffect, useRef, useState} from "react";
import {genClassNameString} from "../../../utils";
//import {DEFAULT_TEXTAREA_MIN_HEIGHT} from "../../../constants";
import styles from "./textarea.module.scss";
//import {useWindowWidth} from "../../../hooks";
import TextareaAutosize from "react-autosize-textarea";

type TextareaProps = {
    defaultText?: string;
    label?: string;
    changeHandler?: ChangeEventHandler<HTMLTextAreaElement>;
    focusHandler?: FocusEventHandler<HTMLTextAreaElement>;
    className?: string;
}

export const Textarea = (props: TextareaProps) => {
    const {
        defaultText,
        label,
        className,
        changeHandler,
        focusHandler,
    } = props;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [value, setValue] = useState(defaultText);

    useEffect(() => setValue(defaultText), [defaultText]);

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
        if (changeHandler) changeHandler(event);
    };

    const updateCaret = (event: any) => {
        if (changeHandler) changeHandler(event);
    };

    return (
        <div className={genClassNameString(styles.container, className ?? "")}>
            {label && <label>{label}</label>}
            <TextareaAutosize
                className={styles.textarea}
                value={value}
                ref={textareaRef}
                onChange={onChange}
                onFocus={focusHandler}

                onKeyUp={updateCaret}
                onClick={updateCaret}
            />
        </div>
    );
};
