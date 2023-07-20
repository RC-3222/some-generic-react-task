import {ITemplate, MessageTemplate} from '../classes';
import {DEFAULT_VARIABLE_NAMES} from '../constants';


/** Save the specified template into localStorage. */
export const callbackSave = async (messageTemplate: ITemplate | null) => {
    const newTemplate = messageTemplate
        ? {
            tree: messageTemplate.tree,
            nodeCount: messageTemplate.nodeCount,
        }
        : null;
    localStorage.setItem('template', JSON.stringify(newTemplate));
};

/**
 * Parse an array of variables and a template from local storage if they exist,
 * or create default ones if they don't.
 *
 * @returns A new message template based on existing (or default) template and variables
 *  */
export const createMessageTemplate = () => {
    const arrVarNames = localStorage.arrVarNames
        ? JSON.parse(localStorage.arrVarNames)
        : DEFAULT_VARIABLE_NAMES;
    const template = localStorage.template
        ? JSON.parse(localStorage.template)
        : null;

    return new MessageTemplate(template, arrVarNames);
};

/**
 * Merge specified CSS classNames into one className string.
 *
 * @param classNames - An array of classnames to merge
 * @returns A merged className string
 */
export const genClassNameString = (...classNames: string[]) => classNames.join(" ");

export * from './compile-template';
