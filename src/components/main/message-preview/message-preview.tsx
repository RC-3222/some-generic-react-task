import {useContext, useEffect, useState} from "react";
import {compileTemplate} from "../../../utils";
import {Input} from "../../common/input";
import {Button, ButtonVariants} from "../../common/button";
import {MessageTemplateContext} from "../../../app";

import styles from "./message-preview.module.scss";
import {createPortal} from "react-dom";

type MessagePreviewProps = {
    onHide: () => void;
}

export const MessagePreview = (props: MessagePreviewProps) => {
    const {onHide} = props;

    const messageTemplate = useContext(MessageTemplateContext);

    const [message, setMessage] = useState("");
    const [variables, setVariables] = useState<Record<string, string>>({});

    useEffect(() => {
        setMessage(compileTemplate(messageTemplate, variables));
    }, [variables, messageTemplate]);

    const changeVariables = (name: string, value: string) => {
        setVariables((prevState) => ({...prevState, [name]: value}));
    };

    return createPortal(<div className={styles.wrapper}>
        <div className={styles.backdrop}></div>
        <div className={styles.container}>
            <h1 className={styles.title}>Message Preview</h1>
            <button className={styles.closeIcon} onClick={onHide}>
                <img src="close-icon.svg" alt="close-icon"/>
            </button>
            <p className={styles.message}>{message}</p>
            <div className={styles.variablesContainer}>
                <h2 className={styles.variablesContainer__title}>Variables: </h2>
                {messageTemplate.varNames.map((name) => (
                    <Input
                        id={name}
                        key={name}
                        label={name}
                        placeholder={name}
                        className={styles.variable}
                        defaultValue={variables[name]}
                        changeHandler={(value) => changeVariables(name, value)}
                    />
                ))}
            </div>
            <Button variant={ButtonVariants.Secondary} onClick={onHide}>
                Close
            </Button>
        </div>
    </div>, document.body)
};
