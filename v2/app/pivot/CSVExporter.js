var CSVExporter = function (decimalSeparator, fieldSeparator, rowSeparator, quote, culture, encoding) {
    Exporter.call(this);

    this.decimalSeparator = decimalSeparator;
    this.fieldSeparator = fieldSeparator;
    this.rowSeparator = rowSeparator;
    this.quote = quote;
    this.culture = culture;
    this.encoding = encoding;
}

CSVExporter.prototype = Object.create(Exporter.prototype);
CSVExporter.prototype.constructor = CSVExporter;

CSVExporter.prototype.export = function (rows) {
    var self = this;
    var bom = '\ufeff';
    var csvContent = "data:text/csv;charset=" + self.encoding + "," + bom + Object.keys(rows[0]).map(function(key) { return self.quote + key + self.quote; }).join(self.fieldSeparator) + self.rowSeparator +
        rows.map(function (row) { 
            return Object.values(row).map(function (r) {
                var val = Array.isArray(r) ? r[0] : r;

                if (val === undefined) {
                    val = self.quote + self.quote;
                } else if (val instanceof Date) {
                    val = self.quote + val.toLocaleString(self.culture) + self.quote;
                } else if (typeof val === "number") {
                    val = self.quote + val.toString().replaceAll(self.fieldSeparator, self.decimalSeparator) + self.quote;
                } else if (typeof val === "string") {
                    var href = getHrefFromHTML(val);
                    var text = getTextFromHTML(val);
                    if (href != undefined) {
                        //text = "[[hyperlink URL link =" + href + " display=" + text + "]].";
                        text = '=HYPERLINK(""' + href + '"")'; //""' + text + '"")';
                        val = self.quote + text + self.quote;
                    } else {
                        val = self.quote + text.replaceAll(self.fieldSeparator, "").replaceAll(self.quote, "").replaceAll(/(\r\n|\n|\r)/gm, "") + self.quote;
                    }                    
                }

                return val;
            }).join(self.fieldSeparator)
        }).join(self.rowSeparator);

    this.openFile(csvContent);
}

CSVExporter.prototype.openFile = function (content) {
    var encodedUri = encodeURI(content);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
}