import {MessageTemplate, NodeType} from '../classes';

/**
 * Compile specified template into actual message using exising variable info.
 *
 * @param template - Message template
 * @param values - Variable values represented as <variable>:<value> pairs
 * @returns Message with applied variable values
 */
export const compileTemplate = (
    template: MessageTemplate,
    values: Record<string, string>
) => {
    let message = '';

    const nodeStack = [template.tree];

    while (nodeStack.length) {
        const node = nodeStack.pop();
        if (node) {
            if (!node.children) {
                const parsedText = parseText(template, values, node.text.value);

                switch (node.type) {
                    case NodeType.if:
                        const thenNode = nodeStack.pop();
                        const elseNode = nodeStack.pop();
                        if (parsedText) {
                            thenNode && nodeStack.push(thenNode);
                        } else {
                            elseNode && nodeStack.push(elseNode);
                        }
                        break;
                    case NodeType.then:
                    case NodeType.else:
                    case NodeType.text:
                        message += parsedText;
                        break;
                }
            } else {
                nodeStack.push(...node.children.slice().reverse());
            }
        }
    }
    return message;
};

/**
 * A helper function to parse text of specified node.
 *
 * @param template - Message template
 * @param values - Variable values represented as <variable>:<value> pairs
 * @param text - Text content of a specified node
 * @returns Message with applied variable values
 */
function parseText(template: MessageTemplate, values: Record<string, string>, text: string) {
    // if there are no variables in text, it'll remain as is
    let parsedText = text;

    // search for all variable-like mentions in text
    const variables = text.match(/{[^{}]+}/gm);
    if (variables) {
        variables.forEach((v) => {
            const varName = v.slice(1, -1);
            // only existing variables should be processed, otherwise it's just a string
            if (template.varNames.includes(varName)) {
                parsedText = parsedText.replace(v, values[varName] ?? '');
            }
        });
    }

    return parsedText;
}
