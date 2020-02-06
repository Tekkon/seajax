function parseHTML(str) {
    return new DOMParser().parseFromString(str, "text/html");
}

function isHTML(str) {
    var doc = parseHTML(str);
    return Array.from(doc.body.childNodes).some(function (node) { return node.nodeType === 1 });
}

function getTextFromHTML(str) {
    if (isHTML(str)) {
        var doc = parseHTML(str);
        var txt = '';
        var i = 0;

        doc.body.childNodes.forEach(function (node) {
            if (i > 0) {
                txt += " ";
            }            
            
            var href = node.getAttribute("href");
            if (href !== undefined) {
                txt += href;
            } else {
                txt += node.textContent;
            }
            i += 1;
        });

        return txt;
    } else {
        return str;
    }
}

function deleteAdditionalProperties(item) {
    var clone = Object.assign({}, item.facets);
    Object.entries(clone).forEach(function (property) {
        if (property[0][0] === '_') {
            delete clone[property[0]];
        }
    });

    return clone;
}