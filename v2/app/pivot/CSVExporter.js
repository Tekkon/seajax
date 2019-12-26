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

    var csvContent = "data:text/csv;charset=" + self.encoding + "," + Object.keys(rows[0]).join(self.fieldSeparator) + self.rowSeparator +
        rows.map(function (row) { 
            return Object.values(row).map(function (r) {
                var val = Array.isArray(r) ? r[0] : r;

                if (val instanceof Date) {
                    val = val.toLocaleString(self.culture);
                } else if (typeof val === "string") {
                    val = self.quote + val.replace(self.fieldSeparator, "") + self.quote;
                } else if (typeof val === "number") {
                    val = val.toString().replace(self.fieldSeparator, self.decimalSeparator);
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
}