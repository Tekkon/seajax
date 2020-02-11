var BaseView = function (container, isSelected) {
    this.isSelected = isSelected;
    this.container = container;
}

BaseView.prototype.createView = function (options) {

}

BaseView.prototype.select = function () {
    this.isSelected = true;
    this.onSelected();
}

BaseView.prototype.deselect = function () {
    this.isSelected = false;
}

BaseView.prototype.onSelected = function () {
    
}

BaseView.prototype.onClick = function (options) {

}

BaseView.prototype.update = function (options) {

}

BaseView.prototype.filter = function (filterData) {

}

BaseView.prototype.clearFilter = function () {

}