var GraphView = function (container, isSelected) {
    GridView.call(this, container, isSelected);
    var self = this;

    self.button = new Button("div", "pivot_sorttools graphButton pivot_hoverable", $('.pivot_topbar')[0], i18n.t("graphView"));
    self.button.htmlElement.onclick = function () {
        self.select();

        $('.frontLayer')[0].style.visibility = "visible";
        $('.behindLayer')[0].style.visibility = "visible";
        $('.mapLayer')[0].style.visibility = "hidden";
        $('.tableLayer')[0].style.visibility = "hidden";
    }
}

GraphView.prototype = Object.create(GridView.prototype);
GraphView.prototype.constructor = GraphView;

GraphView.prototype.createView = function (options) {
    this.container.allSortedItems = this.container.bucketize[this.container.facet.type || "String"](this.container.sortFacet);

    var barWidth = this.container.containerRect.width / this.container.allSortedItems.length;
    var innerBarWidth = barWidth * 0.86;

    this.container.bars = [];
    this.container.topLeftItemInfo = this.container.rightmostItemInfo = undefined;

    // find the highest bar, so we can size them all properly
    var biggestCategoryCount = 0, currentCategory;
    for (i = 0; i < this.container.allSortedItems.length; i++) {
        currentCategory = this.container.allSortedItems[i];
        if (currentCategory.items.length > biggestCategoryCount) {
            biggestCategoryCount = currentCategory.items.length;
        }
    }

    // set up some styles that will be the same for all bars
    var sizeRatio = 100 / barWidth; // the ratio between screen pixels and css pixels in the bars
    this.container.backZoomContainer.setSizeRatio(sizeRatio);
    this.container.barTemplate.style.height = (sizeRatio * this.container.containerRect.height) + "px";

    // if there are only a few bars, we don't want the labels getting ridiculously huge.
    if (35 / sizeRatio > 70) {
        var newHeight = Math.max(5, Math.round(70 * sizeRatio));
        this.container.barTemplate.firstChild.style.bottom = newHeight + 7 + "px";
        this.container.barTemplate.lastChild.style.height = newHeight + "px";
        this.container.barTemplate.style.fontSize = newHeight / 2 + "px";
        this.container.containerRect.height -= (newHeight + 13) / 100 * barWidth;
    } else {
        this.container.barTemplate.firstChild.style.bottom = "";
        this.container.barTemplate.lastChild.style.height = "";
        this.container.barTemplate.style.fontSize = "";
        this.container.containerRect.height -= 0.48 * barWidth;
    }

    // choose the number of items per row, similar to grid view but upside down
    var maxBarHeight = this.container.containerRect.height - 0.06 * barWidth;
    this.container.numPerRow = this.container.computeLayoutWidth(biggestCategoryCount, innerBarWidth, maxBarHeight, this.container.avgHeight);
    this.container.widthPerItem = innerBarWidth / this.container.numPerRow;

    var prevRightLabel, curGridInfo, prevGridInfo, a, b;

    // now go through and put all of the items in a location
    for (i = 0; i < this.container.allSortedItems.length; i++) {
        var horizOffset = barWidth * (i + 0.07);
        currentCategory = this.container.allSortedItems[i];
        this.container.totalItemCount = currentCategory.items.length;

        // make the HTML elements that form the visual bar
        var bar = this.container.clone(this.container.barTemplate);
        bar.style.left = (100 * i + 1) + "px";
        var outerBar = bar.firstChild,
            innerBar = outerBar.firstChild,
            barLabel = outerBar.nextSibling;
        options.backLayer.appendChild(bar);
        if (currentCategory.leftLabel) {
            // this graph bar has a label for its left and right edges.
            // we won't display its center label at all.
            var leftLabel = makeElement("div", "pivot_leftlabel", barLabel);
            addText(leftLabel, currentCategory.leftLabel);
            // now check whether the bar to our left wants to share our left label.
            if (prevRightLabel) {
                prevRightLabel.parentNode.removeChild(prevRightLabel);
                leftLabel.style.left = -leftLabel.offsetWidth / 2 + "px";
                leftLabel.style.textAlign = "center";
            } else {
                // we have less room for the left label, so make it narrower
                leftLabel.style.width = "50%";
            }
            var rightLabel = makeElement("div", "pivot_rightlabel", barLabel);
            addText(rightLabel, currentCategory.rightLabel);
            prevRightLabel = rightLabel;
        } else {
            // this graph bar has a single, centered label
            addText(barLabel, currentCategory.label);
            prevRightLabel = undefined;
        }

        // check for whether we need to center the row
        if (this.container.totalItemCount < this.container.numPerRow && this.container.totalItemCount > 0) {
            var adjustedWidth = 86 * this.container.totalItemCount / this.container.numPerRow;
            horizOffset = barWidth * i + (100 - adjustedWidth) / 2 * barWidth / 100;
            adjustedWidth += 4;
            // round to an even width, so it looks better
            adjustedWidth = Math.round(adjustedWidth / 2) * 2;
            innerBar.style.width = adjustedWidth + "px";
            innerBar.style.left = ((98 - adjustedWidth) / 2) + "px";
        }

        // place the items
        curGridInfo = this.container.placeGrid(
            this.container.containerRect.height,
            horizOffset,
            currentCategory.items,
            this.container.numPerRow,
            this.container.widthPerItem,
            this.container.widthPerItem * this.container.avgHeight,
            true
        );
        this.container.finalItemWidth = curGridInfo.itemWidth;

        // keep track of global leftmost and rightmost items
        if (!this.container.topLeftItemInfo) {
            this.container.topLeftItemInfo = curGridInfo.topLeft;
        }
        if (curGridInfo.rightmost) {
            this.container.rightmostItemInfo = curGridInfo.rightmost;
        }

        // link up keyboard navigation to move between bars
        if (prevGridInfo) {
            a = prevGridInfo.lowest;
            b = curGridInfo.topLeft;
            if (a && b) {
                a.item.destination[a.index].down = b;
                b.item.destination[b.index].up = a;
            }
            if (a && !curGridInfo.lowest) {
                curGridInfo.lowest = a;
            }
            a = prevGridInfo.rightmost;
            if (a && b) {
                a.item.destination[a.index].right = b;
                b.item.destination[b.index].left = a;
            }
            if (a && !curGridInfo.rightmost) {
                curGridInfo.rightmost = a;
            }
        }
        prevGridInfo = curGridInfo;

        // set the height of the background bar
        innerBar.style.height = Math.round(
            100 *
                Math.ceil(currentCategory.items.length / this.container.numPerRow) *
                this.container.widthPerItem * this.container.avgHeight / barWidth +
                4
        ) + "px";

        // keep track of all bars we make
        var filterValues;
        switch (this.container.facets[this.container.sortFacet].type) {
            case "String":
            case "Link":
                filterValues = currentCategory.values;
                break;
            case "Number":
            case "DateTime":
                filterValues = [{
                    lowerBound: currentCategory.lowerBound,
                    upperBound: currentCategory.upperBound,
                    inclusive: currentCategory.inclusive
                }];
                break;
            default:
                Seadragon2.Debug.warn("Unrecognized category type: " + this.container.facets[optins.sortFacet].type);
        }
        this.container.bars.push({
            bar: bar,
            values: filterValues,
            min: barWidth * i,
            name: currentCategory.label,
            count: this.container.totalItemCount
        });
    }
}

GraphView.prototype.update = function (options) {
    var barsCount;
    if (this.container.lastMousePosition) {
        // check for whether the mouse is over a bar, and
        // save it in hoveredBar to prepare for possible clicks.
        barsCount = this.container.bars.length;
        for (i = 0; i < barsCount; i++) {
            if (this.container.bars[i].min <= this.container.contentMousePosition.x) {
                this.container.hoveredBar = this.container.bars[i];
            } else {
                break;
            }
        }
    }
    if (this.container.hoveredBar && !this.container.hoveredBar.count) {
        // there are no items in this bar, so don't filter by it
        this.container.hoveredBar = undefined;
    }
    if (this.container.hoveredBar !== this.container.lastHoveredBar) {
        if (this.container.hoveredBar) {
            this.container.hoveredBar.bar.className = "pivot_bar pivot_highlight";
            options.container.title = this.container.hoveredBar.name;
        } else {
            options.container.title = "";
        }
        if (this.container.lastHoveredBar) {
            this.container.lastHoveredBar.bar.className = "pivot_bar";
        }
    }
}

GraphView.prototype.onClick = function (options) {
    var barsCount;
    // check for whether the mouse is over a bar, and
    // save it in hoveredBar to prepare for possible clicks.
    barsCount = this.container.bars.length;
    for (i = 0; i < barsCount; i++) {
        if (this.container.bars[i].min <= this.container.position.x) {
            this.container.hoveredBar = this.container.bars[i];
        } else {
            break;
        }
    }
    if (this.container.hoveredBar && !this.container.hoveredBar.count) {
        // there are no items in this bar, so don't filter by it
        this.container.hoveredBar = undefined;
    }
}