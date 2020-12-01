var GridView = function (container, isSelected) {
    BaseView.call(this, container, isSelected);
    var self = this;

    self.button = new Button("div", "pivot_sorttools gridButton pivot_hoverable", $('.pivot_topbar')[0], i18n.t("gridView"));
    self.button.htmlElement.onclick = function () {
        self.select();

        $('.frontLayer')[0].style.visibility = "visible";
        $('.behindLayer')[0].style.visibility = "visible";
        $('.mapLayer')[0].style.visibility = "hidden";
        $('.tableLayer')[0].style.visibility = "hidden";
    }
}

GridView.prototype = Object.create(BaseView.prototype);
GridView.prototype.constructor = GridView;

GridView.prototype.createView = function (options) {
    var self = this;

    // first, put the items in an array.
    self.container.allSortedItems = self.container.activeItemsArr;

    // second, sort it.
    var self = self;
    self.container.allSortedItems.sort(function (a, b) {
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
    self.container.totalItemCount = self.container.allSortedItems.length;
    // compute layout width
    self.container.numPerRow = self.container.computeLayoutWidth(self.container.totalItemCount, self.container.containerRect.width, self.container.containerRect.height, self.container.avgHeight);
    self.container.widthPerItem = self.container.containerRect.width / self.container.numPerRow;

    // check: if there's only one row, we can probably make it a bit bigger
    if (self.container.numPerRow > self.container.totalItemCount) {
        self.container.widthPerItem = Math.min(
            self.container.containerRect.width / self.container.totalItemCount,
            self.container.containerRect.height / self.container.avgHeight
        );
    }

    var gridInfo = self.container.placeGrid(
        0,
        0,
        self.container.allSortedItems,
        self.container.numPerRow,
        self.container.widthPerItem,
        self.container.widthPerItem * self.container.avgHeight
    );
    self.container.finalItemWidth = gridInfo.itemWidth;
    self.container.topLeftItemInfo = gridInfo.topLeft;
    self.container.rightmostItemInfo = gridInfo.rightmost;
}

GridView.prototype.rearrange = function () {
    var self = this;

    // since we'll be animating a rearrange now, disable mouse tracking
    self.container.tracker.setTracking(false);

    // move the viewport to its home location
    self.container.viewport.goHome();    

    // clear item borders
    self.container.clearHighlights();

    // if we're already at home zoom the animation won't start, so we'll fake it
    // so that we can get a finish event.
    self.container.animating = true;

    // if we had a mouseover title for a graph bar, get rid of it
    self.container.container.title = "";

    // if anybody else is midway through a rearrange, they'll have to wait for us to catch up
    self.container.clearListeners("animationfinish");
}

GridView.prototype.rearrangePart1 = function () {
    var self = this;

    self.container.removeListener("animationfinish", self.container.rearrangePart1);

    // make sure the update function will know what's going on
    self.container.rearranging = true;
    self.container.anythingChanged = true;

    self.container.resetRearrangingItems();

    // remember whatever is onscreen right now, since we'll need it during
    // the rearrange steps
    self.container.prevActiveItems = Seadragon2.Object.clone(self.container.currentItems);
}

GridView.prototype.rearrangePart1_2 = function () {
    var self = this;

    // get rid of any grid self.bars we've drawn before
    self.container.backLayer.innerHTML = "";

    // figure out the aspect ratio for grid boxes
    self.container.avgHeight = self.container.getAverageItemHeight();

    self.container.facet = self.container.facets[self.container.sortFacet] || {};

    // either an array of items, or an array of {label:string, items:array}
    //var self.allSortedItems;

    var containerSize = self.container.viewport.getContainerSize();
    self.container.containerRect = new Seadragon2.Rect(0, 0, containerSize.x, containerSize.y);

    // regardless of the current view type, we need to reset the destination array
    // for all current items
    for (var i = self.container.activeItemsArr.length - 1; i >= 0; i--) {
        self.container.activeItemsArr[i].destination = [];
    }
}

GridView.prototype.rearrangePart1_3 = function () {
    var self = this;

    // recalculate template sizes and scaling for the front layer
    if (self.container.currentTemplateLevel === -1 && self.container.finalItemWidth && self.container.templates.length) {
        self.container.setupFrontLayer(1);
    }

    // each of these squares should be able to zoom in up to 2x width of the container
    var containerSize = self.container.viewport.getContainerSize();
    self.container.viewport.maxZoom = containerSize.x / self.widthPerItem * 2;
}

GridView.prototype.rearrangePart2 = function () {
    var self = this;

    var id, item, anythingRemoved = false;
    for (id in self.container.prevActiveItems) {
        if (hasOwnProperty.call(self.container.prevActiveItems, id) && !hasOwnProperty.call(self.container.activeItems, id)) {
            anythingRemoved = true;
            item = prevActiveItems[id];
            item.destination = self.container.getLocationOutside(item.source);
            self.container.beginAnimate(item);
            delete self.container.currentItems[id];
        }
    }

    if (anythingRemoved) {
        // wait for removal animation to finish before rearranging
        self.container.addListener("animationfinish", self.container.rearrangePart3);
    } else {
        // move right along to rearrange phase
        self.container.rearrangePart3();
    }
}

GridView.prototype.rearrangePart3 = function () {
    var self = this;

    self.container.removeListener("animationfinish", self.container.rearrangePart3);
    var id, item, anythingMoved = false, source, dest, sourceLength, destLength, i, html;

    // first, remove HTML content from the view for any items that have moved offscreen
    if (self.container.templates[self.container.currentTemplateLevel].type === "html") {
        for (i = self.container.rearrangingItemsArr.length - 1; i >= 0; i--) {
            html = self.container.rearrangingItemsArr[i].html[self.container.currentTemplateLevel];
            html.forEach(function (domElement) {
                self.container.frontLayer.removeChild(domElement);
                domElement.pvInDom = false;
            });
            html.splice(1, html.length - 1);
        }
    }

    self.container.resetRearrangingItems();

    // recalculate template sizes and scaling for the front layer
    if (self.container.finalItemWidth && self.container.templates.length) {
        self.container.setupFrontLayer(1);
    }

    for (id in self.container.prevActiveItems) {
        if (hasOwnProperty.call(self.container.prevActiveItems, id) && hasOwnProperty.call(self.container.activeItems, id)) {
            item = self.container.prevActiveItems[id];
            source = item.source;
            dest = item.destination;
            sourceLength = source.length;
            destLength = dest.length;
            html = item.html;

            // make sure the source and destination arrays are the same length
            // by inserting duplicates. we assume each has at least one entry.
            for (i = sourceLength; i < destLength; i++) {
                if (source[0] !== undefined) {
                    source.push(source[0]);
                }

                // we also must make duplicates of the HTML objects that represent self item, if
                // they are being used instead of drawing on a canvas.
                html.forEach(function (htmlArray, index) {
                    if (self.container.templates[index].type === "html") {
                        var first = htmlArray[0];
                        var copy = self.clone(first);
                        htmlArray.push(copy);
                        if (index === self.container.currentTemplateLevel) {
                            self.container.setTransform(copy, source[0]);
                            self.container.addElementToFrontLayer(copy);
                            copy.pvInDom = true;
                        }
                    }
                });
            }
            for (i = destLength; i < sourceLength; i++) {
                if (dest[0] !== undefined) {
                    dest.push(dest[0]);
                }
            }

            if (self.container.beginAnimate(item)) {
                anythingMoved = true;
            }
        }
    }

    if (anythingMoved) {
        // wait for rearrange to finish
        self.container.addListener("animationfinish", self.container.rearrangePart4);
    } else {
        // move along to insertion phase
        self.container.rearrangePart4();
    }
}

GridView.prototype.rearrangePart4 = function () {
    var self = this;

    self.container.removeListener("animationfinish", self.container.rearrangePart4);
    self.container.resetRearrangingItems();
    var id, anythingInserted = false, item, j;
    for (j = self.container.activeItemsArr.length - 1; j >= 0; j--) {
        item = self.container.activeItemsArr[j];
        id = item.id;
        if (!hasOwnProperty.call(self.container.prevActiveItems, id)) {
            item.source = self.container.getLocationOutside(item.destination);
            self.container.beginAnimate(item);
            self.container.currentItems[id] = item;
            anythingInserted = true;

            // make additional copies of the HTML template if necessary
            item.html.forEach(function (htmlArray, index) {
                if (self.container.templates[index].type === "html") {
                    var i;
                    for (i = item.source.length - 1; i > 0; i--) {
                        htmlArray.push(self.clone(htmlArray[0]));
                    }
                }
            });

            // append items to the DOM as necessary
            if (self.container.templates[self.container.currentTemplateLevel].type === "html") {
                item.html[self.container.currentTemplateLevel].forEach(function (node, index) {
                    self.container.setTransform(node, item.source[index]);
                    self.container.addElementToFrontLayer(node);
                    node.pvInDom = true;
                });
            }
        }
    }

    if (anythingInserted) {
        // wait for rearrange to finish
        self.container.addListener("animationfinish", self.container.finishRearrange);
    } else {
        // immediately mark completion
        self.container.finishRearrange();
    }
}

GridView.prototype.finishRearrange = function () {
    var self = this;

    self.container.removeListener("animationfinish", self.container.finishRearrange);
    self.container.tracker.setTracking(true);
    self.container.rearranging = false;
    self.container.resetRearrangingItems();

    // raise an event to say that rearranging is done
    self.container.trigger("finishedRearrange");

    // raise an event if the collection just finished clearing
    if (!self.container.items.length && !self.container.activeItemsArr.length) {
        self.container.trigger("itemsCleared");
    }
}

GridView.prototype.updateOnce = function (arg, curTime) {
    var self = this;

    var containerSize = self.container.viewport.getContainerSize();
    now = curTime || new Date().getTime();
    var id, item, i, sdimg, j;

    if (self.container.delayedFunction) {
        var delayedFunctionCopy = self.container.delayedFunction;
        self.container.delayedFunction = undefined;
        delayedFunctionCopy();
    }

    // we'll need to know what kind of repaint to do, depending on the zoom level
    var currentTemplateType, usingSdimg, usingHtml, usingCanvas;

    if (self.rearranging) {
        // the viewport can't move during a rearrange, so don't waste time
        // trying to update it. We will have to clear the canvas though, which is done here:
        self.container.redraw();

        currentTemplateType = self.container.templates[self.container.currentTemplateLevel].type;
        usingSdimg = currentTemplateType === "sdimg" || currentTemplateType === "fakehtml";
        usingHtml = currentTemplateType === "html";
        usingCanvas = currentTemplateType === "canvas" ||
            currentTemplateType === "color" ||
            currentTemplateType === "img";

        // update current position of all items, draw them

        var progress, regress, source, dest, done = true, x, y, width, height, curSource, curDest, curStartTime, startTime;

        // Note that redraws are only done at 100% size (home zoom), so we don't
        // have to bother with transforming coordinates: the item's coordinates
        // are actually its coordinates in the canvas!

        // first draw any items that are staying put
        if (usingSdimg || usingCanvas) {
            for (j = self.container.activeItemsArr.length - 1; j >= 0; j--) {
                item = self.container.activeItemsArr[j];
                id = item.id;
                if (!hasOwnProperty.call(self.container.rearrangingItems, id)) {
                    source = item.source;
                    // if the source property isn't set, it means this a newly added item that hasn't yet been
                    // placed out of bounds. just ignore it.
                    if (source) {
                        sdimg = item.sdimg[self.container.currentTemplateLevel];
                        for (i = source.length - 1; i >= 0; i--) {
                            curSource = source[i];
                            if (usingSdimg && sdimg) {
                                self.container.drawImage(self.container.ctx, sdimg, curSource.x, curSource.y, curSource.width, curSource.height);
                            } else {
                                self.container.drawCanvasItem(
                                    self.container.ctx,
                                    curSource.x,
                                    curSource.y,
                                    curSource.width,
                                    curSource.height,
                                    item
                                );
                            }
                        }
                    }
                }
            }
        }

        // then draw the moving items (they'll go on top)
        for (j = self.container.rearrangingItemsArr.length - 1; j >= 0; j--) {
            item = self.container.rearrangingItemsArr[j];
            source = item.source;
            dest = item.destination;
            startTime = item.startTime;
            sdimg = item.sdimg[self.container.currentTemplateLevel];
            for (i = source.length - 1; i >= 0; i--) {
                curSource = source[i];
                curDest = dest[i];
                curStartTime = startTime[i];
                progress = curStartTime === undefined ? 1 : Math.max((now - curStartTime) / 700, 0);
                if (progress >= 1) {
                    progress = 1;
                    regress = 0;
                } else {
                    done = false;
                    // transform to springy progress
                    progress = (progress < 0.5) ?
                        (Math.exp(progress * self.container.stiffness) - 1) * self.container.springConstant :
                        1 - (Math.exp((1 - progress) * self.container.stiffness) - 1) * self.container.springConstant;
                    regress = 1 - progress;
                }
                x = curSource.x * regress + curDest.x * progress;
                y = curSource.y * regress + curDest.y * progress;
                width = curSource.width * regress + curDest.width * progress;
                height = curSource.height * regress + curDest.height * progress;
                if (usingSdimg && sdimg) {
                    self.container.drawImage(self.container.ctx, sdimg, x, y, width, height);
                } else if (usingHtml) {
                    self.container.setTransform(
                        item.html[self.container.currentTemplateLevel][i],
                        new Seadragon2.Rect(x, y, width, height)
                    );
                } else { // if usingCanvas, or fallback for sdimg that's not ready
                    self.container.drawCanvasItem(self.container.ctx, x, y, width, height, item);
                }
            }
        }

        // we have to trigger an animationfinish event when we're done, so the next
        // phase of rearranging can get started
        if (done) {
            self.container.trigger("animationfinish", self.container);
        }
    } else {

        var animated = self.container.viewport.update();

        if (!self.container.animating && animated) {
            // we weren't animating, and now we did ==> animation start
            self.container.trigger("animationstart", self.container);
        }

        self.container.anythingChanged = self.container.anythingChanged || animated;

        if (self.container.anythingChanged) {
            self.container.anythingChanged = false;

            // since we're redrawing everything, we can re-detect what the mouse pointer is on
            self.container.hoveredItem = undefined;
            self.container.lastHoveredBar = self.container.hoveredBar;
            self.container.hoveredBar = undefined;

            var viewportBounds, targetViewportBounds, itemBounds, location, zoomPercent, centerItemBounds, currentBest = Infinity, distToCenter;
            viewportBounds = self.container.getBounds(true);

            // choose the appropriate template level, since the zoom may have changed
            self.container.setupFrontLayer(self.container.viewport.getZoom(true), viewportBounds);

            self.container.currentTemplateType = self.container.templates[self.container.currentTemplateLevel].type;
            usingSdimg = currentTemplateType === "sdimg" || currentTemplateType === "fakehtml";
            usingHtml = currentTemplateType === "html";
            usingCanvas = currentTemplateType === "canvas" ||
                currentTemplateType === "color" ||
                currentTemplateType === "img";

            // update the canvas transform and clear it
            self.container.redraw();

            targetViewportBounds = self.container.getBounds();
            zoomPercent = self.container.viewport.getZoomPercent();

            // update the UI slider
            self.container.trigger("zoom", zoomPercent);

            // find the mouse position in content coordinates                
            if (self.container.lastMousePosition) {
                self.container.contentMousePosition = self.container.viewport.pointFromPixel(self.container.lastMousePosition.minus(new Seadragon2.Point(self.container.padding.left, self.container.padding.top)), true);
            }

            self.container.views.filter(function (elem) {
                return elem.isSelected;
            })[0].update({
                canvas: self.container.canvas,
                container: self.container.container,
                frontLayer: self.container.frontLayer,
                backLayer: self.container.backLayer,
                mapLayer: self.container.mapLayer,
                tableLayer: self.container.tableLayer,
                leftRailWidth: self.container.leftRailWidth,
                rightRailWidth: self.container.rightRailWidth,
                inputElmt: self.container.inputElmt
            });

            var wideEnough = (containerSize.x - self.container.rightRailWidth) * 0.5,
                tallEnough = containerSize.y * 0.5,
                itemBoundsArray,
                adjustedCenter = new Seadragon2.Point(-self.container.rightRailWidth / 2, 0),
                html;

            self.container.centerItem = undefined;
            self.container.zoomedIn = false;

            // draw every item on the canvas
            for (j = self.container.activeItemsArr.length - 1; j >= 0; j--) {
                item = self.container.activeItemsArr[j];
                itemBoundsArray = item.source;
                sdimg = item.sdimg[self.container.currentTemplateLevel];
                for (i = itemBoundsArray.length - 1; i >= 0; i--) {
                    itemBounds = itemBoundsArray[i];
                    if (itemBounds) {
                        if (self.container.rectsOverlap(viewportBounds, itemBounds)) {
                            // we have to draw every item, but we only need to bother with updating the ones
                            // that will stay in the viewport after this movement.
                            if (self.container.rectsOverlap(targetViewportBounds, itemBounds)) {
                                location = self.container.viewport.rectPixelsFromPoints(itemBounds, false, true);
                                if (usingSdimg && sdimg) {
                                    sdimg.update(location);
                                }
                                if (location.width > wideEnough || location.height > tallEnough) {
                                    self.container.zoomedIn = true;
                                }
                                distToCenter = location.getCenter().distanceTo(adjustedCenter);
                                if (distToCenter < currentBest) {
                                    currentBest = distToCenter;
                                    self.container.centerItem = item;
                                    centerItemIndex = i;
                                    centerItemBounds = itemBounds;
                                }
                            }

                            // redraw the image at its new location, if the item is represented as a sdimg.
                            // if it's an HTML template, make sure it's in the DOM.
                            if (usingSdimg && sdimg) {
                                self.container.anythingChanged =
                                    !self.container.drawImage(self.container.ctx, sdimg,
                                        itemBounds.x, itemBounds.y,
                                        itemBounds.width, itemBounds.height) ||
                                    self.container.anythingChanged;
                            } else if (usingHtml) {
                                html = item.html[self.container.currentTemplateLevel][i];
                                if (!html.pvInDom) {
                                    self.container.addElementToFrontLayer(html);
                                    html.pvInDom = true;
                                }
                            } else { // if usingCanvas, or fallback for sdimg that's not ready
                                self.container.anythingChanged =
                                    !self.container.drawCanvasItem(
                                        self.container.ctx,
                                        itemBounds.x,
                                        itemBounds.y,
                                        itemBounds.width,
                                        itemBounds.height,
                                        item
                                    ) ||
                                    self.container.anythingChanged;
                            }

                            // check whether the mouse is over the current item
                            if (self.container.lastMousePosition && itemBounds.contains(self.container.contentMousePosition)) {
                                self.container.hoveredItem = item;
                                self.container.hoveredItemIndex = i;
                            }
                        } else if (usingHtml) {
                            // if we're using HTML templates, make sure this item isn't in the DOM for performance.
                            html = item.html[self.container.currentTemplateLevel][i];
                            if (html.pvInDom) {
                                self.container.frontLayer.removeChild(html);
                                html.pvInDom = false;
                            }
                        }
                    }
                }
            }

            // prepare to draw outlines
            var lineWidth = self.container.viewport.deltaPointsFromPixels(new Seadragon2.Point(3, 0)).x; // 3px regardless of zoom

            // draw an outline for hovered item
            self.container.outlineItem(self.container.hoveredItem, self.container.hoveredItemIndex, self.container.hoverBorderColor, self.container.ctx, self.container.domHoverBorder, lineWidth);

            // show or hide the details pane as necessary
            if (self.container.centerItem && self.container.zoomedIn) {
                if (self.container.detailsEnabled) {
                    self.container.trigger("showDetails", self.containercenterItem, self.container.facets);
                    self.container.trigger("showInfoButton");
                }

                self.container.trigger("filterItem", self.container.centerItem, self.container.facets);

                // relax the pan constraints so that we can see stuff on the far right side
                // without the details pane getting in the way.
                self.container.viewport.visibilityRatio = (containerSize.x - self.container.rightRailWidth) / containerSize.x;
            } else {
                /*if (self.detailsEnabled) {
                    self.trigger("hideDetails");
                    self.trigger("hideInfoButton");
                }*/

                //self.trigger("clearFilter");
                self.container.viewport.visibilityRatio = 1;
            }

            // draw an outline for selected item
            self.container.outlineItem(self.container.selectedItem, self.container.selectedItemIndex, self.container.selectedBorderColor, self.container.ctx, self.container.domSelectedBorder, lineWidth);
        }

        if (self.container.animating && !animated) {
            // we were animating, and now we're not anymore ==> animation finish
            self.container.trigger("animationfinish", self.container);
        }

        self.container.animating = animated;
    }
}