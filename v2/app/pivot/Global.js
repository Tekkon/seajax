function parseHTML(str) {
    return new DOMParser().parseFromString(str, "text/html");
}

function isHTML(str) {
    if (str !== "" && str !== null && str !== undefined) {
        var doc = parseHTML(str);
        return Array.from(doc.body.childNodes).some(function (node) { return node.nodeType === 1 });
    }
    
    return false;
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
            
            txt += node.textContent;
            i += 1;
        });

        return txt;
    } else {
        return str;
    }
}

function getHrefFromHTML(str) {
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
            }
            i += 1;
        });

        return txt;
    } else {
        return undefined;
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

String.prototype.replaceAll = function (search, replace) {
    return this.split(search).join(replace);
}

function cleanUTF8String(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) <= 127) {
            output += input.charAt(i);
        }
    }
    return output;
}

function arraysEqual(a1, a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1) == JSON.stringify(a2);
}