import {Button, ButtonVariants} from './components/common/button';
import {createContext, useState} from 'react';
import {TemplateEditor} from './components/main/template-editor';
import {MessageTemplate} from './classes';
import {createMessageTemplate} from './utils';

import styles from './app.module.scss';

const defaultMessageTemplate = createMessageTemplate();
export const MessageTemplateContext = createContext<MessageTemplate>(
    defaultMessageTemplate
);

function App() {
    const [showEditor, setShowEditor] = useState(false);

    const [messageTemplate, setMessageTemplate] = useState(
        defaultMessageTemplate
    );

    const showEditorHandler = () => {
        setShowEditor(true);
    };

    const hideEditorHandler = () => {
        setShowEditor(false);
        setMessageTemplate(createMessageTemplate());
    };

    return (
        showEditor ? <MessageTemplateContext.Provider value={messageTemplate}>
                <TemplateEditor onHide={hideEditorHandler}/>
            </MessageTemplateContext.Provider>
            : <main className={styles.main}>
                <Button variant={ButtonVariants.Secondary} onClick={showEditorHandler}>
                    Message Editor
                </Button>
            </main>
    );
}

export default App;
