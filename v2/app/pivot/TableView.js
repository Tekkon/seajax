var TableView = function (container, isSelected) {
    BaseView.call(this, container, isSelected);
    var self = this;

    self.detailsEnabled = PIVOT_PARAMETERS.detailsEnabled;
    self.filterElement = PIVOT_PARAMETERS.filterElement;
    self.isCreated = false;
    self.activeItems = {};

    self.button = new Button("div", "pivot_sorttools tableButton pivot_hoverable", $('.pivot_topbar')[0], i18n.t("tableView"));
    self.button.htmlElement.onclick = function () {
        self.select();

        $('.frontLayer')[0].style.visibility = "hidden";
        $('.behindLayer')[0].style.visibility = "hidden";
        $('.mapLayer')[0].style.visibility = "hidden";
        $('.tableLayer')[0].style.visibility = "visible";
    }
}

TableView.prototype = Object.create(BaseView.prototype);
TableView.prototype.constructor = TableView;

TableView.prototype.createView = function (options) {
    var self = this;

    if (!self.isCreated) {
        self.isCreated = true;

        var div = makeElement("div", "tableView ag-theme-balham tableDiv", options.tableLayer);
        self.div = div;
        div.innerHtml = '';
        var width = options.canvas.clientWidth - options.leftRailWidth - 11;
        var height = options.canvas.clientHeight - 12;

        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.tableDiv { ' + "width: " + width + "px; height:" + height + "px; position: relative; margin-left: " + (options.leftRailWidth + 5) + "px; margin-top: 6px;margin-right: 6px;"; + ' }';
        document.getElementsByTagName('head')[0].appendChild(style);

        var data = Object.entries(options.activeItems).map(function (item) {
            var dataObj = {};
            Object.entries(deleteAdditionalProperties(item[1])).forEach(function (item1) {
                dataObj[item1[0]] = item1[1][0];
            });
            return dataObj;
        });
        self.activeItems = options.activeItems;

        var columns = []; // [ { headerName: "", field: "make", checkboxSelection: true, suppressSizeToFit: true, width: 30 } ];
        var item = Object.entries(options.activeItems)[0];

        if (item != undefined) {
            Object.entries(deleteAdditionalProperties(item[1])).forEach(function (item1) {
                if (isHTML(item1[1])) {
                    columns.push({
                        headerName: item1[0],
                        field: item1[0],
                        cellRenderer: function (params) {
                            return params.data !== undefined ? params.data[item1[0]] : '';
                        }
                    });
                } else {
                    columns.push({ headerName: item1[0], field: item1[0], sortable: true, resizable: true });
                }
            });
        }

        self.isExecuteSelectItem = true;
        self.setFilter = function () {
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

            self.container.selectedItems = [];
            if (clickedItems.length > 0) {
                self.container.selectedItems.push(clickedItems[0]);
            }
        }

        self.gridOptions = {
            columnDefs: columns,
            //rowData: data,
            rowSelection: 'single', //'multiple',
            //rowDeselection: true,
            onRowSelected: function (row) {
               self.setFilter();
            },
            rowModelType: 'infinite',
            datasource: self.getDataSource(data)
        };

        new agGrid.Grid(document.querySelector('.tableView'), self.gridOptions);
        var allColumnIds = self.gridOptions.columnApi.getAllColumns().map(function (column) {
            return column.colId;
        });
        var skeepHeader = false;
        self.gridOptions.columnApi.autoSizeColumns(allColumnIds, skeepHeader);
    }
       
    self.showSelectedItems();    
}

TableView.prototype.getDataSource = function (data) {
    return {
        rowCount: null, // behave as infinite scroll
        getRows: function (params) {
            console.log('asking for ' + params.startRow + ' to ' + params.endRow);
            // At this point in your code, you would call the server, using $http if in AngularJS 1.x.
            // To make the demo look real, wait for 500ms before returning
            setTimeout(function () {
                // take a slice of the total rows
                var rowsThisPage = data.slice(params.startRow, params.endRow);
                // if on or after the last page, work out the last row.
                var lastRow = -1;
                if (data.length <= params.endRow) {
                    lastRow = data.length;
                }
                // call the success callback
                params.successCallback(rowsThisPage, lastRow);
            }, 500);
        }
    }
}

TableView.prototype.filter = function (filterData) {
    var self = this;
    self.container.selectedItems = [];
    self.rearrange(filterData);
}

TableView.prototype.rearrange = function (filterData) {
    var self = this;
    if (self.isCreated) {
        var data = Object.entries(filterData).map(function (item) {
            var dataObj = {};
            Object.entries(deleteAdditionalProperties(item[1])).forEach(function (item1) {
                dataObj[item1[0]] = item1[1][0];
            });
            return dataObj;
        });
        self.gridOptions.api.setDatasource(self.getDataSource(data));
    }
}

TableView.prototype.showSelectedItems = function () {
    var self = this;

    if (self.gridOptions !== undefined) {
        self.gridOptions.api.deselectAll();
    }

    self.container.selectedItems.forEach(function (item, index) {
        if (item != undefined) {
            var selectedNodeIndex = 0;
            if (self.gridOptions !== undefined) {
                self.gridOptions.api.forEachNode(function (node, index) {
                    if (node.data[self.filterElement] === (Array.isArray(item.id) ? item.id[0] : item.id)) {
                        node.setSelected(true, true);
                        selectedNodeIndex = index;
                    }
                });

                self.gridOptions.api.ensureIndexVisible(selectedNodeIndex);
            }
        }
    }); 
}

TableView.prototype.clearFilter = function () {
    var self = this;

    if (self.gridOptions !== undefined) {
        self.gridOptions.api.deselectAll();
    }
}
