export const enum NodeType {
    text = 'TEXT',
    if = 'IF',
    then = 'THEN',
    else = 'ELSE',
}

export type NodeProps = {
    type: NodeType;
    id: number;
    text?: string;
    label?: string;
    parentId: number | null;
};

export interface ITextNode extends Omit<NodeProps, 'text'> {
    text: { value: string; caretPosition: number };
    children: Array<ITextNode> | null;
}

export interface ITemplate {
    tree: ITextNode;
    nodeCount: number;
}

/** A tree-like structure that represents message template. */
export class MessageTemplate {
    private readonly _tree: ITextNode;
    private readonly _varNames: string[];

    private _nodeCount: number;

    /** Create a new instance.
     *
     * @param template Existing template to be used as a base. If not provided, creates a totally new instance.
     * @param varNames An array of existing variable names.
     * */
    constructor(template: ITemplate | null, varNames: string[]) {
        this._tree = template?.tree || this.createNode({
            type: NodeType.text,
            id: 0,
            text: "",
            parentId: null,
        });
        this._nodeCount = template?.nodeCount || 0;
        this._varNames = varNames;
    }

    /** Create a new node */
    private createNode(props: NodeProps) {
        return {
            id: props.id,
            parentId: props.parentId,
            type: props.type,
            label: props.label,
            text: {value: props.text || '', caretPosition: 0},
            children: null,
        };
    }

    /** Find a node by id.
     *
     * @param id id of a node to find
     *  */
    findNode(id: number) {
        const find = (id: number, node: ITextNode) => {
            if (id === node.id) return node;
            if (!node.children) return;

            let textNode: ITextNode | undefined;
            node.children.every((child) => {
                textNode = find(id, child);
                return !textNode;
            });

            return textNode;
        };
        return find(id, this._tree);
    }

    /** Divide a node with specified id into two nodes and create IF-THEN-ELSE block between them.
     *
     * @param id id of a node to divide
     * */
    divideNode(id: number) {
        const node = this.findNode(id);

        if (node) {
            const block = [
                this.createNode({
                    type: NodeType.text,
                    id: ++this._nodeCount,
                    text: node.text.value.slice(0, node.text.caretPosition),
                    label: node.label,
                    parentId: node.parentId,
                }),
                this.createNode({
                    type: NodeType.if,
                    id: ++this._nodeCount,
                    label: NodeType.if,
                    parentId: node.parentId,
                }),
                this.createNode({
                    type: NodeType.then,
                    id: ++this._nodeCount,
                    label: NodeType.then,
                    parentId: node.parentId,
                }),
                this.createNode({
                    type: NodeType.else,
                    id: ++this._nodeCount,
                    label: NodeType.else,
                    parentId: node.parentId,
                }),
                this.createNode({
                    type: NodeType.text,
                    id: ++this._nodeCount,
                    text: node.text.value.slice(node.text.caretPosition),
                    label: node.label,
                    parentId: node.parentId,
                }),
            ];

            // If node type is text (not condition block) it adds new condition block to its parent children array
            if (node.type === NodeType.text && node.parentId !== null) {
                const parent = this.findNode(node.parentId);
                if (parent?.children) {
                    const nodeIndex = parent.children.findIndex(
                        (child) => child.id === node.id
                    );
                    parent.children = [
                        ...parent?.children.slice(0, nodeIndex),
                        ...block,
                        ...parent?.children.slice(nodeIndex + 1),
                    ];
                }
            } else {
                // if node type is THEN or ELSE it creates an array of children for it
                block.forEach((el) => el.parentId = node.id);
                node.children = block;
            }
        }
    }

    /**
     * Delete IF-THEN-ELSE block with specified id and return its parent's id.
     *
     * @param id id of condition block to delete
     * @returns id of parent node
     */
    deleteConditionBlock(id: number) {
        const block = this.findNode(id);

        if (block?.parentId == null) return;

        let parent = this.findNode(block.parentId);
        let children = parent?.children;

        if (children) {
            const nodeIndex = children.findIndex((child) => child.id === block?.id);
            children[nodeIndex - 1].text.value += children[nodeIndex + 3].text.value;
            children.splice(nodeIndex, 4);
            if (children.length === 1) {
                parent!.text.value = children[nodeIndex - 1].text.value;
                parent!.children = null;
                return parent!.id;
            }
            return children[nodeIndex - 1].id;
        }
    }

    get tree() {
        return this._tree;
    }

    get varNames() {
        return this._varNames;
    }

    get nodeCount() {
        return this._nodeCount;
    }
}

