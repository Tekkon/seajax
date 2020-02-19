var Button = function (element, classes, container, title) {
    this.htmlElement = makeElement(element, classes, container);
    this.htmlElement.title = title;
}

Button.prototype.select = function () {
    this.htmlElement.className = this.htmlElement.className.replace("pivot_hoverable", "pivot_activesort");
}

Button.prototype.deselect = function () {
    this.htmlElement.className = this.htmlElement.className.replace("pivot_activesort", "pivot_hoverable");
}