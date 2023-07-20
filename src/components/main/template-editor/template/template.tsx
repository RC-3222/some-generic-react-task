import {useContext, useReducer} from "react";
import {ITextNode, NodeType} from "../../../../classes";
import {Textarea} from "../../../common/textarea";
import styles from "./template.module.scss";
import {MessageTemplateContext} from "../../../../app";

type TemplateProps = {
    node: ITextNode;
    getActiveNode: (id: number) => void;
}

export const Template = (props: TemplateProps) => {
    const {node, getActiveNode} = props;

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const messageTemplate = useContext(MessageTemplateContext);

    const deleteBlock = (id: number) => {
        const activeNodeId = messageTemplate.deleteConditionBlock(id) ?? 0;
        getActiveNode(activeNodeId);
        forceUpdate();
    };

    return (
        !node.children
            ? <Textarea
                defaultText={node.text.value}
                changeHandler={(event) => {
                    node.text.value = event.target.value;
                    node.text.caretPosition = event.target.selectionStart;
                }}
                focusHandler={() => {
                    getActiveNode(node.id);
                }}
                className={styles.fullWidth}
            />
            : <div className={styles.container}>
                {node.children.map((child) => {
                    switch (child.type) {
                        case NodeType.text:
                            return (
                                <Template
                                    node={child}
                                    getActiveNode={getActiveNode}
                                    key={child.id}
                                />
                            );
                        case NodeType.if:
                            return (
                                <div className={styles.block} key={child.id}>
                                    <div className={styles.labelContainer}>
                                        <p className={styles.label}>{child.label}</p>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => deleteBlock(child.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <Textarea
                                        defaultText={child.text.value}
                                        changeHandler={(event) => {
                                            child.text.value = event.target.value;
                                            child.text.caretPosition = event.target.selectionStart;
                                        }}
                                        focusHandler={() => {
                                            getActiveNode(child.id);
                                        }}
                                        className={styles.fullWidth}
                                    />
                                </div>
                            );
                        case NodeType.then:
                        case NodeType.else:
                            return (
                                <div className={styles.block} key={child.id}>
                                    <div className={styles.labelContainer}>
                                        <p className={styles.label}>{child.label}</p>
                                    </div>
                                    <Template node={child} getActiveNode={getActiveNode}/>
                                </div>
                            );
                    }
                    return <></>;
                })}
            </div>
    );
};
