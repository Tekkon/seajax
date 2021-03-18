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
                    val = val.toString().replaceAll(self.fieldSeparator, self.decimalSeparator);
                } else if (typeof val === "string") {
                    var href = getHrefFromHTML(val);
                    var text = getTextFromHTML(val);
                    if (href != undefined) {
                        val = self.quote + href + self.quote;
                    } else {
                        val = self.quote + text.replaceAll(self.fieldSeparator, "").replaceAll(self.quote, "").replaceAll(/(\r\n|\n|\r)/gm, "") + self.quote;
                    }                    
                }

                return val;
            }).join(self.fieldSeparator)
        }).join(self.rowSeparator);

    this.dataURLtoBlob(csvContent, this.callback);
}

CSVExporter.prototype.dataURLtoBlob = function(dataurl, callback) {
    var arr = dataurl.substring(28, dataurl.length - 1), mime = dataurl.substring(0, 27).match(/:(.*?);/)[1],
        bstr = unescape(encodeURIComponent(arr)), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    callback(new Blob([u8arr], { type: mime }));
}

CSVExporter.prototype.callback = function (blob) {
    if (window.navigator.msSaveOrOpenBlob !== undefined) {
        window.navigator.msSaveOrOpenBlob(blob, "data.csv");
    } else {
        var a = document.createElement('a');
        a.download = 'data.csv';
        a.innerHTML = 'download';
        a.href = URL.createObjectURL(blob);
        a.onclick = function () {
            requestAnimationFrame(function () {
                URL.revokeObjectURL(decodeURI(a.href));
                document.body.removeChild(a);
            });
        };
        a.click();
    }
};