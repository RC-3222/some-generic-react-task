import {useContext, useReducer, useState} from "react";
import {Button, ButtonVariants} from "../../common/button";
import {Template} from "./template";
import {callbackSave} from "../../../utils";
import {MessagePreview} from "../message-preview";
import {MessageTemplateContext} from "../../../app";
import {useNoScroll} from "../../../hooks";

import styles from "./template-editor.module.scss";

type TemplateEditorProps = {
    onHide: () => void;
}

export const TemplateEditor = (props: TemplateEditorProps) => {
    const {onHide} = props;

    const messageTemplate = useContext(MessageTemplateContext);

    const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const divideBlock = () => {
        if (activeNodeId !== null) {
            messageTemplate.divideNode(activeNodeId);
        }
        forceUpdate();
    };

    const addVariable = (varName: string) => {
        const id =
            activeNodeId ??
            messageTemplate.tree?.children?.at(0)?.id ??
            messageTemplate.tree.id;
        const node = messageTemplate.findNode(id);
        if (node) {
            const {value, caretPosition} = node.text;
            node.text.value = `${value.slice(
                0,
                caretPosition
            )}{${varName}}${value.slice(caretPosition)}`;
            node.text.caretPosition += varName.length + 2;

            forceUpdate();
        }
    };

    // disable scrolling if preview window is open
    useNoScroll(showPreview);

    const showMessagePreview = () => {
        setShowPreview(true);
    };

    const hideMessagePreview = () => {
        setShowPreview(false);
    };

    const saveTemplate = async () => {
        await callbackSave(messageTemplate);
    };


    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Message Template Editor</h1>
                    <div className={styles.controlArea}>
                        <div className={styles.variablesContainer}>
                            {messageTemplate.varNames.map((name) => (
                                <Button
                                    variant={ButtonVariants.Variable}
                                    key={name}
                                    onClick={() => addVariable(name)}
                                >{`{${name}}`}</Button>
                            ))}
                        </div>
                        <Button variant={ButtonVariants.Light} onClick={divideBlock}>IF-THEN-ELSE</Button>
                    </div>
                    <div className={styles.template}>
                        <Template
                            node={messageTemplate.tree}
                            getActiveNode={(id) => setActiveNodeId(id)}
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button variant={ButtonVariants.Secondary} onClick={showMessagePreview}>Preview</Button>
                        <Button variant={ButtonVariants.Primary} onClick={saveTemplate}>Save</Button>
                        <Button variant={ButtonVariants.Danger} onClick={onHide}>Close</Button>
                    </div>
                </div>
            </div>
            {showPreview && <MessagePreview onHide={hideMessagePreview}/>}
        </>
    );
};
