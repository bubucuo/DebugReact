function createElement(type, props, ...children) {
    delete props.__source;
    delete props.__self;
    return {
        type,
        props: {
            ...props,
            children: children.map(child => {
                return typeof child === "object"
                    ? child
                    : createTextNode(child);
            })
        }
    };
}

function createTextNode(text) {
    return {
        type: "TEXT",
        props: {
            children: [],
            nodeValue: text
        }
    };
}

export default {
    createElement,
    version: "kreact"
};
