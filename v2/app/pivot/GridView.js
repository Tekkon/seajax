var GridView = function (container, isSelected) {
    BaseView.call(this, container, isSelected);
}

GridView.prototype = Object.create(BaseView.prototype);
GridView.prototype.constructor = GridView;

GridView.prototype.createView = function (options) {
    options.mapLayer.style = "visibility: hidden;"

    // first, put the items in an array.
    this.container.allSortedItems = this.container.activeItemsArr;

    // second, sort it.
    var self = this;
    this.container.allSortedItems.sort(function (a, b) {
        a = a.facets[self.container.sortFacet];
        b = b.facets[self.container.sortFacet];
        // check for undefined values! all facets are optional, but
        // items without the facet listed should always be sorted last.
        if (!a) {
            if (!b) {
                return 0;
            }
            return 1;
        }
        if (!b) {
            return -1;
        }
        // any facet may have multiple values, but we only sort by the first one
        a = a[0];
        b = b[0];

        // from here on, the comparison depends on the type. sometimes string facets
        // define custom comparators for orders that make more sense than alphabetical.
        var comparator = self.container.facet.comparator || self.container.comparators[self.container.facet.type];
        return comparator(a, b);
    });

    // third, lay out the items in a grid.
    this.container.totalItemCount = this.container.allSortedItems.length;
    // compute layout width
    this.container.numPerRow = this.container.computeLayoutWidth(this.container.totalItemCount, this.container.containerRect.width, this.container.containerRect.height, this.container.avgHeight);
    this.container.widthPerItem = this.container.containerRect.width / this.container.numPerRow;

    // check: if there's only one row, we can probably make it a bit bigger
    if (this.container.numPerRow > this.container.totalItemCount) {
        this.container.widthPerItem = Math.min(
            this.container.containerRect.width / this.container.totalItemCount,
            this.container.containerRect.height / this.container.avgHeight
        );
    }

    var gridInfo = this.container.placeGrid(
        0,
        0,
        this.container.allSortedItems,
        this.container.numPerRow,
        this.container.widthPerItem,
        this.container.widthPerItem * this.container.avgHeight
    );
    this.container.finalItemWidth = gridInfo.itemWidth;
    this.container.topLeftItemInfo = gridInfo.topLeft;
    this.container.rightmostItemInfo = gridInfo.rightmost;
}