var TableView = function (container, isSelected) {
    BaseView.call(this, container, isSelected);

    this.detailsEnabled = PIVOT_PARAMETERS.detailsEnabled;
}

TableView.prototype = Object.create(BaseView.prototype);
TableView.prototype.constructor = TableView;

TableView.prototype.createView = function (options) {
    var self = this;

    var div = makeElement("div", "tableView", options.tableLayer);

    div.innerHtml = '';
    var width = options.canvas.clientWidth - options.leftRailWidth - 11;
    var height = options.canvas.clientHeight - 12;
    div.style = "width: " + width + "px; height:" + height + "px; position: relative; margin-left: " + (options.leftRailWidth + 5) + "px; margin-top: 6px;margin-right: 6px;";
    $('.tableView').dxDataGrid({
        dataSource: Object.entries(options.activeItems).map(function(item) {
            return item[1].facets;
        }),
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        scrolling: {
            columnRenderingMode: "standard",
            mode: "standard",
            preloadEnabled: false,
            rowRenderingMode: "standard",
            scrollByContent: true,
            scrollByThumb: true,
            showScrollbar: "always",
            useNative: "auto"
        },
        showBorders: true,
        showColumnHeaders: true,
        showColumnLines: true,
        showRowLines: true,
        selection: {
            allowSelectAll: true,
            deferred: false,
            mode: "multiple",
            selectAllMode: "allPages",
            showCheckBoxesMode: "onClick"
        },
        onSelectionChanged: function (obj) {
            clickedItems = Object.entries(options.activeItems).map(function (item) { return item[1]; }).filter(function (item) {
                var result = false;

                obj.selectedRowsData.forEach(function (data) {
                    result = item.facets === data || result;
                });

                return result;
            });

            if (self.detailsEnabled && clickedItems.length === 1) {
                self.container.trigger("showDetails", clickedItems[0], self.container.facets);
                self.trigger("showInfoButton");
            } else {
                self.container.trigger("hideDetails");
                self.container.trigger("hideInfoButton");
            }
            self.container.trigger("filterSet", clickedItems, self.container.facets);
        }
    });
}

TableView.prototype.filter = function (filterData) {
   
}
