var TableView = function (container, isSelected) {
    BaseView.call(this, container, isSelected);
}

TableView.prototype = Object.create(BaseView.prototype);
TableView.prototype.constructor = TableView;

TableView.prototype.createView = function (options) {
    var div = makeElement("div", "tableView", options.tableLayer);

    div.innerHtml = '';
    var width = options.canvas.clientWidth - options.leftRailWidth - 11;
    var height = options.canvas.clientHeight - 12;
    div.style = "width: " + width + "px; height:" + height + "px; position: relative; margin-left: " + (options.leftRailWidth + 5) + "px; margin-top: 6px;margin-right: 6px;";
    $('.tableView').dxDataGrid({
        dataSource: Object.entries(options.activeItems).map(function(item) {
            return item[1].facets;
        }),
        allowColumnReordering: false,
        allowColumnResizing: false,
        columnAutoWidth: false,
        columnWidth: 300,
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
        showRowLines: true
    });
}

TableView.prototype.filter = function (filterData) {
   
}
