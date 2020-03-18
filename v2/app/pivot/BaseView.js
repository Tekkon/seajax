var BaseView = function (container, isSelected) {
    this.isSelected = isSelected;
    this.container = container;
    this.button = {};
}

BaseView.prototype.createView = function (options) {

}

BaseView.prototype.select = function () {
    this.isSelected = true;
    this.button.select();
    this.onSelected();
}

BaseView.prototype.deselect = function () {
    this.isSelected = false;
    this.button.deselect();
}

BaseView.prototype.onSelected = function () {
    
};

BaseView.prototype.onClick = function (options) {

}

BaseView.prototype.update = function (options) {

}

BaseView.prototype.filter = function (filterData) {

}

BaseView.prototype.clearFilter = function () {

}

BaseView.prototype.rearrange = function (filterData) {

}

BaseView.prototype.showSelectedItems = function () {

}

BaseView.prototype.button = function () {
    return this.button;
}