var TableView = function (container, isSelected) {
    BaseView.call(this, container, isSelected);

    this.detailsEnabled = PIVOT_PARAMETERS.detailsEnabled;
    this.filterElement = PIVOT_PARAMETERS.filterElement;
    this.isCreated = false;
}

TableView.prototype = Object.create(BaseView.prototype);
TableView.prototype.constructor = TableView;

TableView.prototype.createView = function (options) {
    var self = this;

    if (!self.isCreated) {
        self.isCreated = true;

        var div = makeElement("div", "tableView ag-theme-balham", options.tableLayer);

        div.innerHtml = '';
        var width = options.canvas.clientWidth - options.leftRailWidth - 11;
        var height = options.canvas.clientHeight - 12;
        div.style = "width: " + width + "px; height:" + height + "px; position: relative; margin-left: " + (options.leftRailWidth + 5) + "px; margin-top: 6px;margin-right: 6px;";

        self.deleteAdditionalProperties = function(item) {
            var clone = Object.assign({}, item.facets);
            Object.entries(clone).forEach(function (property) {
                if (property[0][0] === '_') {
                    delete clone[property[0]];
                }
            });

            return clone;
        }

        var data = Object.entries(options.activeItems).map(function (item) {
            var dataObj = {};
            Object.entries(self.deleteAdditionalProperties(item[1])).forEach(function (item1) {
                dataObj[item1[0]] = item1[1][0];
            });
            return dataObj;
        });

        var isHTML = function(str) {
            var doc = new DOMParser().parseFromString(str, "text/html");
            return Array.from(doc.body.childNodes).some(function (node) { return node.nodeType === 1 });
        }

        var columns = [ { headerName: "", field: "make", checkboxSelection: true, suppressSizeToFit: true, width: 30 } ];
        var item = Object.entries(options.activeItems)[0];
        Object.entries(self.deleteAdditionalProperties(item[1])).forEach(function (item1) {
            if (isHTML(item1[1])) {
                columns.push({
                    headerName: item1[0],
                    field: item1[0],
                    cellRenderer: function (params) {
                        return params.data[item1[0]];
                    }
                });
            } else {
                columns.push({ headerName: item1[0], field: item1[0], sortable: true, resizable: true });
            }
        });

        var setFilter = function () {
            var selectedNodes = self.gridOptions.api.getSelectedNodes()
            var selectedData = selectedNodes.map(function (node) { return node.data })

            var clickedItems = Object.entries(options.activeItems).map(function (item) { return item[1]; }).filter(function (item) {
                var result = false;
                selectedData.forEach(function (data) {
                    result = (Array.isArray(item.id) ? item.id[0] : item.id) === data[self.filterElement] || result;
                });
                return result;
            });

            if (self.detailsEnabled && clickedItems.length === 1) {
                self.container.trigger("showDetails", clickedItems[0], self.container.facets);
                self.container.trigger("showInfoButton");
            } else {
                self.container.trigger("hideDetails");
                self.container.trigger("hideInfoButton");
            }
            self.container.trigger("filterSet", clickedItems, self.container.facets);
        }

        self.gridOptions = {
            columnDefs: columns,
            rowData: data,
            rowSelection: 'multiple',
            onRowSelected: function (row) {
                setFilter();
            }
        };        

        new agGrid.Grid(document.querySelector('.tableView'), self.gridOptions);
        var allColumnIds = self.gridOptions.columnApi.getAllColumns().map(function (column) {
            return column.colId;
        });
        var skeepHeader = false;
        self.gridOptions.columnApi.autoSizeColumns(allColumnIds, skeepHeader);
    }
}

TableView.prototype.filter = function (filterData) {
    var self = this;

    if (self.isCreated) {
        self.gridOptions.api.setRowData(Object.entries(filterData).map(function (item) {
            var dataObj = {};
            Object.entries(self.deleteAdditionalProperties(item[1])).forEach(function (item1) {
                dataObj[item1[0]] = item1[1][0];
            });
            return dataObj;
        }));
    }
}
