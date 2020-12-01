// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

/*global Seadragon2, window, PivotNumber_format, PivotDate_generateBuckets,
makeElement, addText, hasOwnProperty, makeTemplate, document, lzwEncode, location*/

// Viewer. This is written so that it is a consumer of the Seadragon2 library
// rather than being a part of it (the only global variable reference is Seadragon2).
/**
 * The main viewer control. It attempts to mimic the functionality of Silverlight's
 * PivotViewer control. See the
 * <a href="../../app/pivot/quickstart.html">developer's guide</a> for an overview with
 * examples. It has methods to add and remove content, and change filtering and sorting.
 * Rather than calling its constructor directly, you probably want to call Pivot.init
 * to generate a PivotViewer instance. This class can raise the following custom events:
 * <dl>
 * <dt>itemsCleared</dt><dd>function(): The collection has been cleared in response to a
 * call to the clearItems method, and now the viewer is ready for other method calls.</dd>
 * <dt>hideDetails</dt><dd>function(): The UI should hide the details pane.</dd>
 * <dt>hideInfoButton</dt><dd>function(): The UI should hide the info button (the
 * placeholder for a collapsed details pane).</dd>
 * <dt>zoom</dt><dd>function(zoomPercent): The UI should change its zoom slider to the
 * given percentage.</dd>
 * <dt>showDetails</dt><dd>function(centerItem, self.facets): The UI should show the details
 * pane, and fill in information about the provided centerItem. The viewer's list of
 * all self.facet categories is passed along too.</dd>
 * <dt>showInfoButton</dt><dd>function(): The UI should show the info button (the
 * placeholder for a collapsed details pane).</dd>
 * <dt>filterrequest</dt><dd>function(filter): The user has clicked on a graph bar and
 * requested a new filter be applied. The UI should respond by updating its filter pane
 * state appropriately and calling addFilter on the viewer with the requested filter.
 * The UI must then call the viewer's filter method to initiate the update.</dd>
 * <dt>facetsSet</dt><dd>function(self.facets): A new set of self.facets was set as a result of
 * calling the setFacets method. The UI should update its filter and sort options to
 * match.</dd>
 * <dt>titleChange</dt><dd>function(title): The UI should update its collection title
 * to the given string.</dd>
 * <dt>copyright</dt><dd>function(legalInfo): The UI should change its copyright notice
 * to the given string and URL.</dd>
 * <dt>finishedRearrange</dt><dd>A rearrangement animation has finished.</dd>
 * </dl>
 * @class PivotViewer
 * @namespace Pivot
 * @extends Seadragon2.EventManager
 * @constructor
 * @param canvas {HTMLCanvasElement} The canvas on which this viewer should draw content
 * @param container {HTMLElement} The parent element of the canvas. Should be the same
 * size and position onscreen as the canvas.
 * @param frontLayer {HTMLElement} The DOM layer for content that goes in front of the
 * canvas. Should be the same size and position onscreen as the canvas.
 * @param backLayer {HTMLElement} The DOM layer for content that goes behind the canvas.
 * Should be the same size and position onscreen as the canvas.
 * @param leftRailWidth {number} The distance in pixels to save on the left side for the
 * filter pane
 * @param rightRailWidth {number} The distance in pixels that will be taken on the right
 * side by the details pane, whenever it is active
 * @param inputElmt {HTMLInputElement} A focusable textbox that is in the DOM but not
 * visible to the user.
 */
var PivotViewer = Pivot.PivotViewer = function (canvas, container, frontLayer, backLayer, mapLayer, tableLayer, leftRailWidth, rightRailWidth, inputElmt) {

    // Fields
    var self = this;

    self.container = container;
    self.backLayer = backLayer;
    self.frontLayer = frontLayer;
    self.allSortedItems = undefined;

    self.facets = {};
    self.facet = {}
    self.items = [];
    self.sortFacet = "";

    self.numPerRow = undefined;
    self.widthPerItem = undefined;
    self.totalItemCount = undefined;
    self.containerRect = undefined;
    self.avgHeight = undefined;
    self.activeItemsArr = [];
    self.selectedItems = [];
    self.isAdditionalViewsCreated = false;

    var innerTracker;

    var viewport;

    self.animating = false;
    self.rearranging = false;

    self.activeItems = {}; // all items that are currently filtered in, by ID
    self.prevActiveItems = {}; // same thing, but before the current filter was applied
    self.rearrangingItems = {}; // items that are moving in the current rearrange step
    self.currentItems = {}; // any items that are onscreen after the current rearrange step

    var allItemsById = {}; // lets us look up any item in the collection by ID

    // it turns out iterating over properties in an object is pretty expensive,
    // so we'll optimize a bit by keeping track of the active items in an array too
    
    self.rearrangingItemsArr = [];

    var now = new Date().getTime();

    // like Springs constants, but for rearranging
    self.stiffness = 8;
    self.springConstant = 1 / (2 * (Math.exp(self.stiffness / 2) - 1));

    self.ctx = canvas.getContext("2d");

    var filters = [];

    self.lastMousePosition = undefined;
    self.contentMousePosition = undefined;
    self.lastHoveredBar = undefined;
    self.position = undefined;
    self.hoveredItem = undefined;
    self.hoveredItemIndex = undefined; // which of the hovered item's positions actually has the mouse
    self.selectedItem = undefined;
    self.selectedItemIndex = undefined;
    self.centerItem = undefined;
    self.centerItemIndex = undefined;
    self.topLeftItemInfo = undefined; // item and index of top-left corner
    self.rightmostItemInfo = undefined; // item and index of last item
    self.zoomedIn = undefined; // whether we're zoomed close enough to need details pane
    self.hoveredBar = undefined;
    self.barTemplate = undefined;
    self.bars = [];
    self.backZoomContainer = undefined;
    var frontZoomContainer;
    var dragCursorSet;

    var itemBorder = 0.05;

    self.detailsEnabled = PIVOT_PARAMETERS.detailsEnabled;

    // references for performance
    var originPoint = new Seadragon2.Point(0, 0);
    self.drawImage = Seadragon2.Image.drawImage;
    var transform = Seadragon2.Element.transform;

    // keep track of whether we can skip the next redraw
    self.anythingChanged = true;

    // keep track of click timing so we can ignore double-clicks
    var lastClickTime = 0;
    var doubleClickThreshold = 300;

    // HTML item templates for different zoom levels
    self.templates = [];
    // put in a default template type for if none are specified
    self.templates[-1] = { type: "sdimg" };

    // the current level of HTML template being displayed (as an index into the templates array)
    self.currentTemplateLevel = -1;
    // the natural (maximum) width of the current template level
    var currentTemplateWidth;
    // the scale factor applied to the HTML overlay layer
    var templateScale;

    // the size of an item at home zoom, which is necessary for choosing the appropriate template size
    self.finalItemWidth = undefined;

    self.delayedFunction; // anything we need to run at the beginning of the next repaint

    // overlays
    self.domHoverBorder = undefined;
    self.domSelectedBorder = undefined;

    // the color of outlines for selected and hovered items
    self.hoverBorderColor = undefined;
    self.selectedBorderColor = undefined;

    // standard options we'll use for any deep zoom images
    var sdimgOpts = { manualUpdates: true };

    // detect an IE bug so we know whether to work around it
    var brokenInnerHTML = (function () {
        var a = makeElement("div");
        var b = makeElement("div");
        b.innerHTML = "a";
        a.appendChild(b);
        a.innerHTML = "";
        // at this point, b.firstChild has become null in IE only
        return !b.firstChild;
    }());

    // a collection of items that need to be rendered server-side for performance
    var serverSideItems = {};

    // the timeout that will send off a batch of items to be processed on the render server
    var serverRenderTimeout;

    // a map of template level to URL for server-side rendering that is in progress
    var contentPollingEndpoints = {};

    // the number of template levels currently being rendered server-side
    var contentPollingCount = 0;

    // the number of times we have requested server-side rendering
    var renderRequestCount = 0;

    // Helpers -- FILTERING

    self.TableView = new TableView(self, false);
    self.MapView = new MapView(self, true);
    self.GraphView = new GraphView(self, false);
    self.GridView = new GridView(self, false);

    // VIEWS
    self.views = [
        self.GridView,
        self.GraphView,
        self.MapView,
        self.TableView
    ];

    function runFilters() {
        // clear the active items
        self.prevActiveItems = self.activeItems;
        self.activeItems = {};
        self.activeItemsArr = [];

        // run all current filters, and put the array contents in a set.
        // if this method is slow, try moving the inner function out here and keeping
        // a current-item variable instead of a closure. this way looks cleaner though.
        self.items.forEach(function (item) {
            if (filters.every(function (filter) { return filter(item); })) {
                self.activeItems[item.id] = item;
                self.activeItemsArr.push(item);
            }
        });

        var isActiveItemsChanged = !arraysEqual(Object.entries(self.activeItems).map(function (item) { return item[1].id }), Object.entries(self.prevActiveItems).map(function (item) { return item[1].id }));

        if (isActiveItemsChanged || self.views[0].isSelected || self.views[1].isSelected) {

            self.views.forEach(function (view) {
                view.filter(self.activeItems);
            });         

            if (self.detailsEnabled) {
                self.trigger("hideDetails");
                self.trigger("hideInfoButton");
            }
            self.trigger('filterSet', self.activeItems);
        }        
    }

    // Helpers -- ARRANGEMENT

    // run the specified function at the beginning of the next repaint cycle. if the
    // second argument is supplied, wait that many cycles before calling the function.
    function delayFunction(func, delay) {
        if (!delay || delay < 0) {
            if (!self.delayedFunction) {
                self.delayedFunction = func;
            } else {
                var otherFunc = self.delayedFunction;
                self.delayedFunction = function () {
                    otherFunc();
                    func();
                };
            }
        } else {
            delayFunction(function () {
                delayFunction(func, delay - 1);
            });
        }
    }

    self.getLocationOutside = function(locArray) {
        var containerSize = viewport.getContainerSize(),
            containerCenter = containerSize.times(0.5),
            center,
            farEnough = containerSize.x + containerSize.y,
            result = [],
            i,
            n = locArray.length,
            loc;
        for (i = 0; i < n; i++) {
            loc = locArray[i];
            center = loc.getCenter().minus(containerCenter);
            center = center.times(farEnough / center.distanceTo(originPoint));
            result.push(new Seadragon2.Rect(center.x - 100, center.y - 100, loc.width * 1.2, loc.height * 1.2));            
        }
        return result;
    }

    // put an HTML item template into the front layer of the viewer. if the HTML item hasn't been fully initialized
    // yet, finish it up. we do this to avoid loading images and such for items which haven't actually been put into
    // the DOM.
    self.addElementToFrontLayer = function(htmlContent) {
        var unsetHTML = htmlContent.unsetHTML;
        if (unsetHTML) {
            htmlContent.innerHTML = unsetHTML;
            delete htmlContent.unsetHTML;
        }
        frontLayer.appendChild(htmlContent);
    }

    // self.clone the given node, and also copy over the unsetHTML property.
    self.clone = function(htmlElement) {
        var result = htmlElement.cloneNode(true);
        result.unsetHTML = htmlElement.unsetHTML;
        return result;
    }

    self.beginAnimate = function(item) {
        var i,
            result = false,
            source = item.source,
            dest = item.destination,
            n = source.length, // we assume dest already has the same length
            startTime = item.startTime = [],
            id = item.id,
            containerSize = viewport.getContainerSize(),
            containerX = containerSize.x / 2,
            containerY = containerSize.y / 2,
            curDest,
            sdimg = item.sdimg[self.currentTemplateLevel];

        for (i = 0; i < n; i++) {
            curDest = dest[i];
            if (!source[i].equals(curDest)) {

                // something is animating
                result = true;

                // tell the update method when to start moving it
                startTime[i] = Math.random() * 300 + now;

                // put it in the list to receive updates.
                // make sure we only add each item to the array once.
                if (!hasOwnProperty.call(self.rearrangingItems, id)) {
                    self.rearrangingItemsArr.push(item);
                }
                self.rearrangingItems[id] = item;

                // let the sdimg know where it's going and how big it'll be.
                // note that we need an offset so that foveation is to the middle.
                // this might be called multiple times for a single item, but
                // that should be okay.

                if (sdimg) {
                    sdimg.update(new Seadragon2.Rect(
                        curDest.x - containerX,
                        curDest.y - containerY,
                        curDest.width,
                        curDest.height
                    ));
                }
            }
        }

        // return true if animation will happen
        return result;
    }

    self.resetRearrangingItems = function() {
        // get all the items ready for their next move, whenever it may be
        var item, rect, rectString, rects, i, source, dest, n, j;
        for (j = self.rearrangingItemsArr.length - 1; j >= 0; j--) {
            // the item's destination property is an array of rects to which it has
            // just moved. some of them may be duplicates; we need to prune those out.
            rects = {};
            item = self.rearrangingItemsArr[j];
            source = item.source = [];
            dest = item.destination;
            item.destination = undefined;
            n = dest.length;
            for (i = 0; i < n; i++) {
                rect = dest[i];
                rectString = rect.toString();
                if (!rects.hasOwnProperty(rectString)) {
                    rects[rectString] = true;
                    if (rect !== undefined) {
                        source.push(rect);
                    }
                }
            }

            // now prune down the arrays of the HTML representations for that item,
            // to the same length.
            n = source.length;
            item.html.forEach(function (templateArray, index) {
                if (self.templates[index].type === "html") {
                    var removed = templateArray.splice(n, templateArray.length - n);

                    // if this layer of HTML templates is in the view, remove the extras.
                    if (index === self.currentTemplateLevel) {
                        removed.forEach(function (domNode) {
                            frontLayer.removeChild(domNode);
                            domNode.pvInDom = false;
                        });
                    }
                }
            });
        }
        self.rearrangingItems = {};
        self.rearrangingItemsArr = [];
    }

    self.setTransform = function(html, position) {
        if (position != undefined) {
            transform(
                html,
                templateScale * position.x,
                templateScale * position.y,
                position.width / currentTemplateWidth * templateScale
            );
        }        
    }

    // this step reenables mouse tracking, among other things
    self.finishRearrange = function() {
        if (!self.GridView.isSelected || self.GraphView.isSelected) {
            self.GridView.finishRearrange();
        }
    }

    // this step adds new items
    self.rearrangePart4 = function() {
        if (!self.GridView.isSelected || self.GraphView.isSelected) {
            self.GridView.rearrangePart4();
        }
    }

    // this step rearranges things that are still in view
    self.rearrangePart3 = function() {
        if (self.GridView.isSelected || self.GraphView.isSelected) {
            self.GridView.rearrangePart3();
        }
    }

    // this step removes things that were filtered out
    function rearrangePart2() {
        if (self.GridView.isSelected || self.GraphView.isSelected) {
            self.GridView.rearrangePart2()
        }
    }

    self.placeGrid = function(verticalOffset, horizontalOffset, allSortedItems, numPerRow, widthPerItem, heightPerItem, upward) {
        var totalItemCount = allSortedItems.length,
            itemsPlaced = 0,
            i,
            firstRow = [],
            lastRow = [],
            curRow,
            destination,
            j,
            item,
            smallerDimension,
            padding,
            paddedHeight,
            paddedWidth,
            other,
            otherRow,
            itemInfo,
            offset,
            rightmost,
            lowest,
            topLeft;

        // if we're placing items upward, the starting vertical offset given was the lower-left
        // corner of the bottom row. we'll place rows based on the upper-left corner, so shift
        // it up to start.
        if (upward) {
            verticalOffset -= heightPerItem;
        }

        // iterate over the rows
        for (i = 0; itemsPlaced < totalItemCount; i++) {
            // calculate how much white space we need inside each edge (minimum)
            padding = Math.max(widthPerItem, heightPerItem) * itemBorder / (1 + 2 * itemBorder);
            paddedHeight = heightPerItem - padding * 2;
            paddedWidth = widthPerItem - padding * 2;

            // keep track of items placed so we can set up keyboard navigation
            curRow = [];

            // iterate over the items in the row
            for (j = 0; j < numPerRow && itemsPlaced < totalItemCount; j++) {
                item = allSortedItems[itemsPlaced];

                if (item.normHeight > paddedHeight / paddedWidth) {
                    // use the maximum height and leave extra room on the sides as necessary
                    smallerDimension = paddedHeight / item.normHeight;
                    destination = new Seadragon2.Rect(
                        horizontalOffset + (j + 0.5) * widthPerItem - smallerDimension / 2,
                        verticalOffset + padding,
                        smallerDimension,
                        paddedHeight
                    );
                } else {
                    // use the maximum width and leave extra room above and below
                    smallerDimension = paddedWidth * item.normHeight;
                    destination = new Seadragon2.Rect(
                        horizontalOffset + j * widthPerItem + padding,
                        verticalOffset + 0.5 * heightPerItem - smallerDimension / 2,
                        paddedWidth,
                        smallerDimension
                    );
                }

                item.destination.push(destination);
                itemInfo = {item: item, index: item.destination.length - 1};
                curRow.push(itemInfo);
                itemsPlaced++;

                // the destination must know what items are next to it in each direction.
                // here, we set up left-right relationships within the row.
                other = curRow[j - 1] || (!upward && lastRow[lastRow.length - 1]);
                if (other) {
                    destination.left = other;
                    other.item.destination[other.index].right = itemInfo;
                }

                // next, link to the row above the current one
                otherRow = upward ? firstRow : lastRow;
                offset = upward ? -1 : 0;
                other = otherRow[j + offset];
                if (other) {
                    destination.up = other;
                    other.item.destination[other.index].down = itemInfo;
                }

                // finally, link to the row below the current one
                otherRow = upward ? lastRow : firstRow;
                offset = upward ? 0 : 1;
                other = otherRow[j + offset];
                if (other) {
                    destination.down = other;
                    other.item.destination[other.index].up = itemInfo;
                }
            }

            // now that the current row has been placed, set up left-right relationships
            // between it and the previous row, for rows being placed upward
            if (upward) {
                other = lastRow[0];
                if (other) {
                    destination.right = other;
                    other.item.destination[other.index].left = itemInfo;
                }
            }

            if (!destination.down) {
                lowest = itemInfo;
            }

            // keep track of the first and last rows placed so we can create up-down relationships
            if (!i) {
                firstRow = curRow;
            }
            lastRow = curRow;

            // move to the next row
            verticalOffset += upward ? -heightPerItem : heightPerItem;
        }

        // return an object that contains info about the top-left and bottom-right items
        // in this grid. note that the bottom item (without an item below) may
        // not be the same as the right item, if placement is downwards.
        topLeft = upward ? lastRow[0] : firstRow[0];
        if (upward) {
            other = firstRow[firstRow.length - 1];
            lowest = other;
            rightmost = other;
        } else {
            rightmost = lastRow[lastRow.length - 1];
        }
        return {
            topLeft: topLeft,
            lowest: lowest,
            rightmost: rightmost,
            itemWidth: paddedWidth
        };
    }

    // round the given positive number down to the nearest number that can be represented
    // as n * 10^m, where m is an integer and n is 1, 2.5, or 5.
    function makeFriendlyNumber(a) {
        var scale = Math.floor(Math.log(a) / Math.LN10),
            b = a * Math.pow(10, -scale),
            c = b < 2.5 ? 1 : b < 5 ? 2.5 : 5;
        return c * Math.pow(10, scale);
    }

    self.comparators = {
        Number: function (a, b) {
            return a - b;
        },
        String: function (a, b) {
            return a > b ? 1 : a === b ? 0 : -1;
        },
        Link: function (a, b) {
            a = a.content;
            b = b.content;
            return a > b ? 1 : a === b ? 0 : -1;
        }
    };
    self.comparators.DateTime = self.comparators.Number;
    self.comparators.LongString = self.comparators.String;

    // these functions set up the bar categories for graph view.
    self.bucketize = {
        String: function (facetName) {
            var item, bucketMap = {}, id, facetData, bucket, allSortedItems = [], bucketName, i;

            function putInBucket(bucketName) {
                // we use the same bucketing code for links, so check for its short value
                bucketName = bucketName.content || bucketName;
                bucket = bucketMap[bucketName];
                if (!bucket) {
                    bucket = bucketMap[bucketName] = {};
                }
                bucket[id] = item;
            }

            for (i = self.activeItemsArr.length - 1; i >= 0; i--) {
                // any self.facet can have multiple values, and we sort the item into
                // all applicable buckets. if it doesn't have any values, put it
                // into the i18n.t("noInfo") bucket.
                item = self.activeItemsArr[i];
                id = item.id;
                facetData = item.facets[facetName];
                if (facetData) {
                    facetData.forEach(putInBucket);
                } else {
                    putInBucket(i18n.t("noInfo"));
                }
            }

            for (bucketName in bucketMap) {
                if (hasOwnProperty.call(bucketMap, bucketName)) {
                    allSortedItems.push({
                        label: bucketName,
                        items: bucketMap[bucketName],
                        values: [bucketName]
                    });
                }
            }

            var comparator = self.facets[facetName].comparator || function (a, b) {
                return (a > b) ? 1 : (a === b) ? 0 : -1;
            };

            // sort the buckets. by default, this is alphabetical, but the self.facet category
            // could define a more sensible sorting order for its contents.
            allSortedItems.sort(function (a, b) {
                var relation = comparator(a.label, b.label);
                return relation ?
                    ((relation > 0 && b.label !== i18n.t("noInfo")) || a.label === i18n.t("noInfo")) ?
                        1 :
                        -1 :
                    0;
            });

            // check whether there are too many buckets to look awesome, and if so, combine them
            // into bigger chunks
            var reducingFactor = Math.ceil(allSortedItems.length / 12);
            if (reducingFactor > 1) {
                var combinedItems = [],
                    curBucketValues,
                    curBucketItems,
                    curBucket;
                allSortedItems.forEach(function (bucket, index) {
                    if (index % reducingFactor === 0 || bucket.label === i18n.t("noInfo")) {
                        // start a new bucket!
                        curBucket = {
                            label: bucket.label
                        };
                        combinedItems.push(curBucket);
                        curBucketValues = curBucket.values = bucket.values;
                        curBucketItems = curBucket.items = bucket.items;
                    } else {
                        // continue an existing bucket!
                        curBucketValues.push(bucket.values[0]);
                        var id, items = bucket.items;
                        for (id in items) {
                            if (hasOwnProperty.call(items, id)) {
                                curBucketItems[id] = items[id];
                            }
                        }

                        // check whether we should end working on this bucket
                        if (index % reducingFactor === reducingFactor - 1 ||
                                index === allSortedItems.length - 1 ||
                                allSortedItems[index + 1].label === i18n.t("noInfo")) {
                            // end the current bucket!
                            curBucket.label += " to " + bucket.label;
                        }
                    }
                });
                // now that we're done combining stuff, put it back in self.allSortedItems
                allSortedItems = combinedItems;
            }

            // one last thing: transform our item lists from object to array
            allSortedItems.forEach(function (bucket) {
                var arr = [],
                    id,
                    items = bucket.items;
                for (id in items) {
                    if (hasOwnProperty.call(items, id)) {
                        arr.push(items[id]);
                    }
                }
                bucket.items = arr;
            });

            return allSortedItems;
        },
        Number: function (facetName, isDate) {
            var item,
                facetData,
                max = -Infinity,
                min = Infinity,
                buckets = [],
                bucketWidth,
                i,
                noInfoItems,
                noInfoBucket,
                highestIndex,
                upperBound,
                leftLabel,
                rightLabel,
                putInBucket;

            // first, find max and min
            function updateMinMax(value) {
                if (value > max) {
                    max = value;
                }
                if (value < min) {
                    min = value;
                }
            }
            for (i = self.activeItemsArr.length - 1; i >= 0; i--) {
                item = self.activeItemsArr[i];
                facetData = item.facets[facetName];
                if (facetData) {
                    // any self.facet can have any number of values, and we'll use all of them.
                    facetData.forEach(updateMinMax);
                } else {
                    noInfoItems = true;
                }
            }

            if (isDate) {
                // choose the bucket size.
                buckets = PivotDate_generateBuckets(min, max);
            } else {
                // next, choose the bucket size. this should make at least 4 self.bars, but no more than 11.
                bucketWidth = makeFriendlyNumber((max - min) / 4);

                // adjust min so it's friendly-value aligned
                if (bucketWidth) {
                    min = bucketWidth * Math.floor(min / bucketWidth);
                }

                // most buckets will be closed on the lower end of their range and open on the upper end:
                // [min, max). The topmost bucket, however, includes its upper bound.
                // set them up here.
                for (i = min; i < max || (bucketWidth === 0 && !buckets.length); i += bucketWidth) {
                    upperBound = i + bucketWidth;
                    // TODO this should change depending on custom number display options.
                    leftLabel = PivotNumber_format(i);
                    rightLabel = PivotNumber_format(upperBound);
                    buckets.push({
                        label: leftLabel + " to " + rightLabel,
                        lowerBound: i,
                        upperBound: upperBound,
                        leftLabel: leftLabel,
                        rightLabel: rightLabel,
                        items: []
                    });
                }
            }

            if (buckets.length) {
                highestIndex = buckets.length - 1;
                buckets[highestIndex].inclusive = true;
            }
            if (noInfoItems) {
                noInfoBucket = [];
                buckets.push({
                    label: i18n.t("noInfo"),
                    items: noInfoBucket
                });
            }

            // set up the function that is responsible for putting the current item
            // into one of the possible arrays, given its self.facet value (Number or DateTime).
            putInBucket = isDate ?
                function (value) {
                    // since the width of each bucket isn't constant (some months
                    // are longer and such), we iterate over the bucket categories.
                    // A bit less elegant than the solution for Numbers, but still
                    // technically constant time since we guarantee there will never
                    // be more than 16 buckets.
                    var i,
                        bucket;
                    for (i = 0; i <= highestIndex; i++) {
                        bucket = buckets[i];
                        if (value < bucket.upperBound || i === highestIndex) {
                            bucket.items.push(item);
                            break;
                        }
                    }
                } :
                function (value) {
                    var index = Math.floor((value - min) / bucketWidth);
                    // check for arithmetic error or width 0
                    if (isNaN(index) || index < 0) {
                        index = 0;
                    }
                    if (index > highestIndex) {
                        index = highestIndex;
                    }
                    buckets[index].items.push(item);
                };

            // now iterate over the items again, putting them in the appropriate bucket.
            // note that each item may be listed in multiple buckets.
            for (i = self.activeItemsArr.length - 1; i >= 0; i--) {
                item = self.activeItemsArr[i];
                facetData = item.facets[facetName];
                if (facetData) {
                    facetData.forEach(putInBucket);
                } else {
                    noInfoBucket.push(item);
                }
            }

            return buckets;
        }
    };
    self.bucketize.LongString = self.bucketize.String;
    // links are a lot like strings, so we'll reuse the bucketizing code
    self.bucketize.Link = self.bucketize.String;
    // likewise DateTimes can share some code with Numbers
    self.bucketize.DateTime = function (facetName) {
        return self.bucketize.Number(facetName, true);
    };

    // we need to lay out items in a grid, but we don't know ahead of time what
    // shape the items will be, or if they're all exactly the same shape. so we
    // take a geometric average of the height:width ratio for all items, and that
    // will be the space in which each item gets to draw itself.
    self.getAverageItemHeight = function() {
        var sum = self.items.reduce(function (prev, item) {
            var normHeight = item.normHeight;
            if (!normHeight) {
                normHeight = item.normHeight = item.sdimg[-1].state.source.normHeight;
            }
            return prev + Math.log(normHeight);
        }, 1);
        var avg = Math.exp(sum / self.items.length);
        // we'll add padding evenly to both directions
        if (avg < 1) {
            avg = (avg + 2 * itemBorder) / (1 + 2 * itemBorder);
        } else {
            avg = (1 + 2 * itemBorder) / (1 / avg + 2 * itemBorder);
        }
        return avg;
    }

    // find the best number of columns to use for a grid of items occupying the given
    // width and height, where each item's normalized height is given by itemHeight.
    self.computeLayoutWidth = function(count, width, height, itemHeight) {
        // make a reasonable first approximation
        var result = Math.ceil(Math.sqrt(itemHeight * width * count / height));
        // and then adjust it as necessary
        while (Math.ceil(count / result) * width / result * itemHeight > height) {
            result++;
        }
        return result;
    }

    self.clearHighlights = function() {
        var temp;
        temp = self.domHoverBorder.parentNode;
        if (temp) {
            temp.removeChild(self.domHoverBorder);
        }
        temp = self.domSelectedBorder.parentNode;
        if (temp) {
            temp.removeChild(self.domSelectedBorder);
        }
    }

    // choose the template size to use
    self.setupFrontLayer = function(zoom, bounds) {
        if (self.templates.length) {
            var oldTemplateLevel = self.currentTemplateLevel,
                id,
                item;

            self.currentTemplateLevel = 0;
            while (self.templates[self.currentTemplateLevel] && self.templates[self.currentTemplateLevel].width < self.finalItemWidth * zoom) {
                self.currentTemplateLevel++;
            }
            if (self.currentTemplateLevel > self.templates.length - 1) {
                self.currentTemplateLevel = self.templates.length - 1;
            }

            if (self.currentTemplateLevel !== oldTemplateLevel) {
                currentTemplateWidth = self.templates[self.currentTemplateLevel].width;

                self.clearHighlights();

                // Remove the front layer contents (we'll repopulate it soon).
                // note that trying to clear them all at once via frontLayer.innerHTML="" doesn't work in IE,
                // since it breaks all relationships between children and grandchildren. however,
                // its removeChild implementation is so painfully slow that we really have no choice. It
                // seems that a single innerHTML="" plus a cloneNode per item is actually faster than
                // calling removeChild for every item.
                if (self.templates[oldTemplateLevel].type === "html") {
                    for (id in self.currentItems) {
                        if (hasOwnProperty.call(self.currentItems, id)) {
                            item = self.currentItems[id];
                            var htmlArr = item.html[oldTemplateLevel];
                            htmlArr.forEach(function (htmlContent, index) {
                                if (htmlContent.pvInDom) {
                                    htmlContent.pvInDom = false;
                                    if (brokenInnerHTML) {
                                        // make a copy of the node to save it from its imminent demise
                                        htmlArr[index] = self.clone(htmlContent);
                                    }
                                }
                            });
                        }
                    }
                }
                frontLayer.innerHTML = "";
            }

            var oldTemplateScale = templateScale;
            templateScale = currentTemplateWidth / self.finalItemWidth;

            if (oldTemplateScale !== templateScale) {
                // change the CSS size of the front zoom container so it can fit the new item arrangement at its
                // natural resolution. If the bounds parameter was not passed, we need to force an immediate update
                // to avoid graphical hiccups. Otherwise, it'll be updated elsewhere anyway.
                frontZoomContainer.setSizeRatio(templateScale, !bounds);

                // iterate over each position for each item, updating its location, and adding it to the DOM
                // if necessary.
                if (self.templates[self.currentTemplateLevel].type === "html") {
                    for (id in self.currentItems) {
                        if (hasOwnProperty.call(self.currentItems, id)) {
                            item = self.currentItems[id];
                            item.html[self.currentTemplateLevel].forEach(function (htmlContent, index) {
                                var sourceLocation = item.source[index];
                                self.setTransform(htmlContent, sourceLocation);
                                if (self.currentTemplateLevel !== oldTemplateLevel && (!bounds || self.rectsOverlap(bounds, sourceLocation))) {
                                    self.addElementToFrontLayer(htmlContent);
                                    htmlContent.pvInDom = true;
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    self.rearrangePart1 = function() {
        if (self.GridView.isSelected || self.GraphView.isSelected) {
            self.GridView.rearrangePart1();
        }

        // now that the viewport has zoomed to its default position, run the filters
        runFilters();

        if (self.GridView.isSelected || self.GraphView.isSelected) {
            self.GridView.rearrangePart1_2();
        }
        
        self.views.filter(function (elem) {
            return elem.isSelected;
        })[0].createView({
            canvas: canvas, container: container, frontLayer: frontLayer, backLayer: backLayer, mapLayer: mapLayer, tableLayer: tableLayer,
            leftRailWidth: leftRailWidth, rightRailWidth: rightRailWidth, inputElmt: inputElmt, items: self.items, activeItems: self.activeItems
        });           
        
        if (self.GridView.isSelected || self.GraphView.isSelected) {
            self.GridView.rearrangePart1_3();
        }

        // move on to part 2
        rearrangePart2();
    }

    self.showView = function() {
        rearrange();
    }

    function rearrange() {
        // deselect anything that was selected
        self.selectedItem = undefined;

        if (self.GridView.isSelected || self.GraphView.isSelected) {
            self.GridView.rearrange();
        }        

        // once it gets there, we'll start the rearrange.
        //self.addListener("animationfinish", rearrangePart1);
        self.rearrangePart1();
    }

    // Helpers -- CORE

    self.rectsOverlap = function(a, b) {
        if (b !== undefined && a !== undefined) {
            return (b.x + b.width > a.x) && (a.x + a.width > b.x) && (b.y + b.height > a.y) && (a.y + a.height > b.y);
        }

        return false;
    }

    // generate an ID that doesn't match any of the items in the collection
    var generateId = (function () {
        var nextId = 0;
        return function () {
            var id;
            do {
                id = (nextId++).toString();
            } while (hasOwnProperty.call(allItemsById, id));
            return id;
        };
    }());

    self.outlineItem = function(item, index, color, ctx, border, lineWidth) {
        var bounds,
            html;
        if (item) {
            bounds = item.source[index];
            if (self.templates[self.currentTemplateLevel].type !== "html") {
                // draw it on canvas
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = color;
                ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            } else {
                // we have to set the border element as the parent of the hovered item
                html = item.html[self.currentTemplateLevel][index];
                html.appendChild(border);
                // adjust line width so it doesn't scale with content
                lineWidth = lineWidth * templateScale + "px";
                border.pvtop.style.height = border.pvright.style.width =
                    border.pvbottom.style.height = border.pvleft.style.width = lineWidth;
            }
        } else if (self.currentTemplateLevel !== -1) {
            // remove the border from its current location
            html = border.parentNode;
            if (html) {
                html.removeChild(border);
            }
        }
    }

    self.drawCanvasItem = function(ctx, x, y, width, height, item) {
        ctx.save();
        var result;
        try {
            result = item.canvas[self.currentTemplateLevel](ctx, x, y, width, height, item);
        } catch (e) {
            // do nothing - it might have failed if a required self.facet isn't available or something
        }
        ctx.restore();
        return result;
    }

    function updateOnce(arg, curTime) {
        if (self.GridView.isSelected || self.GraphView.isSelected) {
            self.GridView.updateOnce(arg, curTime);
        }

        return true;
    }

    // Mouse input handlers

    function onExit() {
        self.lastMousePosition = undefined;
        self.anythingChanged = true;
    }

    function onMove(e) {
        e = e || window.event;
        self.lastMousePosition = Seadragon2.Mouse.getPosition(e).minus(Seadragon2.Element.getPosition(container));
        self.anythingChanged = true;
    }

    function onClick(tracker, id, position, quick, shift, isInputElmt) {
        var now = new Date().getTime(), itemBounds;

        // We have to search the items to figure out which one is hovered, since touch events
        // don't start by telling us where the mouse is hovering.
        if (position) {
            // find the mouse position in content coordinates
            self.position = viewport.pointFromPixel(position.minus(new Seadragon2.Point(self.padding.left, self.padding.top)), true);

            var i, j, itemBoundsArray, item;

            self.views.filter(function (elem) {
                return elem.isSelected;
            })[0].onClick({ canvas: canvas, container: container, frontLayer: frontLayer, backLayer: backLayer, mapLayer: mapLayer, tableLayer: tableLayer, leftRailWidth: leftRailWidth, rightRailWidth: rightRailWidth, inputElmt: inputElmt });

            // iterate every item on the canvas
            for (j = self.activeItemsArr.length - 1; j >= 0; j--) {
                item = self.activeItemsArr[j];
                itemBoundsArray = item.source;
                for (i = itemBoundsArray.length - 1; i >= 0; i--) {
                    itemBounds = itemBoundsArray[i];
                    if (itemBounds) {
                        // check whether the mouse is over the current item
                        if (itemBounds.contains(self.position)) {
                            self.hoveredItem = item;
                            self.hoveredItemIndex = i;
                        }
                    }
                }
            }
        }

        if (!isInputElmt && quick && now - lastClickTime > doubleClickThreshold) {
            if (self.hoveredItem && (self.selectedItem !== self.hoveredItem || self.selectedItemIndex !== self.hoveredItemIndex)) {
                // select the currently hovered item
                self.selectedItem = self.hoveredItem;
                self.selectedItemIndex = self.hoveredItemIndex;

                // zoom to fit the hovered item. this overrides the default
                // zoom that would happen if you click on the background.
                itemBounds = self.hoveredItem.source[self.hoveredItemIndex];
                var containerSize = viewport.getContainerSize(),
                    containerWidth = containerSize.x,
                    containerHeight = containerSize.y,
                    widthPadding,
                    innerContainerWidth = self.detailsEnabled ? containerWidth - rightRailWidth : containerWidth;

                // adjust the itemBounds to leave extra room for the right rail
                widthPadding = Math.max(
                    ((innerContainerWidth / itemBounds.width * itemBounds.height / containerHeight * 1.4) - 1) / 2,
                    0.2
                );
                itemBounds = new Seadragon2.Rect(
                    itemBounds.x - itemBounds.width * widthPadding,
                    itemBounds.y,
                    itemBounds.width * (1 + 2 * widthPadding) * containerWidth / innerContainerWidth,
                    itemBounds.height
                );

                // move there
                viewport.fitBounds(itemBounds);
            } else if (!self.hoveredItem && self.hoveredBar) {
                // add a filter
                self.trigger("filterrequest", {
                    facet: self.sortFacet,
                    values: self.hoveredBar.values,
                    type: self.facets[self.sortFacet].type
                });
            } else {
                // to mimic the functionality of real PivotViewer, most clicks go home
                self.selectedItem = undefined;
                viewport.goHome();
            }

            // only if we didn't ignore this click, reset the double-click timer
            lastClickTime = now;
        }
    }

    function onPress() {
        // now that the user is interacting with the canvas, we'll try to catch their keystrokes
        inputElmt.focus();
    }

    function onRelease() {
        // change the cursor back to default
        var documentElement = document.documentElement;
        dragCursorSet = false;
        documentElement.className = documentElement.className.replace(" pivot_move", "");
    }

    function onDrag() {
        // the Viewer already changes the mouse cursor on mouse down, but we need
        // a more global change that will override styles we've set elsewhere on
        // the page, such as the filter pane which has the default cursor.
        // This sets the cursor for not only the document element, but all of its children.
        if (!dragCursorSet) {
            dragCursorSet = true;
            document.documentElement.className += " pivot_move";
        }

        // since the user is moving the viewport, we no longer have a selected item
        self.selectedItem = undefined;
    }

    function onScroll() {
        // since the user is moving the viewport, we no longer have a selected item
        self.selectedItem = undefined;

        // now that the user is interacting with the canvas, we'll try to catch their keystrokes
        inputElmt.focus();
    }

    function onKeyDown(e) {
        var keyCode = e.keyCode,
            location,
            newItemInfo;
        if (keyCode >= 37 && keyCode <= 40) {
            if (!viewport.getZoomPercent()) {
                // from home zoom, right/down goes to first item and left/up goes to last item
                switch (keyCode) {
                case 37:
                case 38:
                    newItemInfo = self.rightmostItemInfo;
                    break;
                case 39:
                case 40:
                    newItemInfo = self.topLeftItemInfo;
                    break;
                }
            } else {
                // from any other zoom, base movement on the item closest to the center of the viewer
                location = self.centerItem.source[self.centerItemIndex];
                switch (keyCode) {
                case 37:
                    newItemInfo = location.left;
                    break;
                case 38:
                    newItemInfo = location.up;
                    break;
                case 39:
                    newItemInfo = location.right;
                    break;
                case 40:
                    newItemInfo = location.down;
                    break;
                }
            }
            if (newItemInfo) {
                // center the view on the new item, just like we do for a click.
                // if we're already moving there (due to fast repeated key-presses), don't bother.
                if (self.selectedItem !== newItemInfo.item || self.selectedItemIndex !== newItemInfo.index) {
                    self.hoveredItem = newItemInfo.item;
                    self.hoveredItemIndex = newItemInfo.index;
                    onClick(undefined, 0, undefined, true);
                }
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
        }
    }

    // the Viewer already resizes the Viewport's notion of container size,
    // but it doesn't know that our content will also resize to fit into the new space.
    // here, we resize the viewport's content dimensions to match its container size.
    function onResize(width, height) {
        // delay resizing the canvas until the beginning of the next repaint, to reduce flicker
        delayFunction(function () {
            canvas.width = width;
            canvas.height = height;
        });
        viewport.resizeContent(viewport.getContainerSize());
        viewport.update();
        rearrange();
    }

    // Helpers -- UI

    // Make a div with four other divs in it, positioned around the edges. The point is that
    // the resulting element can be used as an overlay border for HTML content. I decided this
    // was a reasonable solution given the following constraints:
    // 1) Keep the common case cheap: We don't want an extra level of DOM for every element
    // 2) Act like PivotViewer: Its item borders are drawn inside the edges of the items' space.
    // 3) Interactability: We can't slap a big transparent div in front of other HTML content.
    function buildFakeBorder(className) {
        var result = makeElement("div"),
            cur,
            style,
            directions = ["top", "right", "bottom", "left"],
            i,
            j;
        for (i = 0; i < 4; i++) {
            cur = result["pv" + directions[i]] = makeElement("div", className, result);
            style = cur.style;
            for (j = 0; j < 4; j++) {
                if (i !== j) {
                    style[directions[j]] = "-1px";
                }
            }
        }
        return result;
    }

    function initialize() {
        // set up the HTML zoom layers
        self.backZoomContainer = new Seadragon2.HTMLZoomContainer(backLayer);
        frontZoomContainer = new Seadragon2.HTMLZoomContainer(frontLayer);

        // inherit from Viewer
        Seadragon2.Viewer.call(self, container, {
            constrainDuringPan: true,
            ignoreChange: true,
            viewportOptions: {
                minZoom: 1,
                visibilityRatio: 1,
                selfUpdating: false
            },
            padding: {
                top: 5,
                right: 5,
                bottom: 5,
                left: leftRailWidth + 5
            },
            dragCursor: "",
            zoomContainers: [
                self.backZoomContainer,
                new Seadragon2.CanvasZoomContainer(canvas),
                frontZoomContainer
            ]
        });

        // now that we built zoom containers inside the HTML layers, update our references
        backLayer = backLayer.firstChild;
        frontLayer = frontLayer.firstChild;

        // and save some references to that Viewer's stuff
        innerTracker = self.tracker;
        viewport = self.viewport;

        // replace the default click handler, since we want to do other stuff
        innerTracker.clearListeners("click");

        if (self.GridView.isSelected || self.GraphView.isSelected) {
            // we need a bit of mouse tracking that the viewer doesn't provide already
            innerTracker.addListener("exit", onExit);
            Seadragon2.Event.add(container, "mousemove", onMove, false);
            innerTracker.addListener("click", onClick);
            innerTracker.addListener("press", onPress);
            innerTracker.addListener("release", onRelease);
            innerTracker.addListener("drag", onDrag);
            innerTracker.addListener("scroll", onScroll);

            // and keyboard tracking for navigating with arrows
            inputElmt.addEventListener("keydown", onKeyDown, false);
        }

        // add a listener to update stuff if the viewer size changes onscreen
        self.addListener("resize", onResize);

        self.addListener("clearFilter", function () {
            if (self.detailsEnabled) {
                self.trigger("hideDetails");
                self.trigger("hideInfoButton");
            }

            self.selectedItems = [];
        });

        // Rather than trying to figure out when we can stop drawing
        // or change frame rate, I'll just use the global timer.
        Seadragon2.Timer.register(updateOnce);

        // build some HTML as a template for each graph bar
        self.barTemplate = makeElement("div", "pivot_bar");
        var outerBar;
        outerBar = makeElement("div", "pivot_outerbar", self.barTemplate);
        makeElement("div", "pivot_innerbar", outerBar);
        makeElement("div", "pivot_barlabel", self.barTemplate);

        // make HTML overlay elements for the boxes that overlay selected or hovered items
        self.domHoverBorder = buildFakeBorder("pivot_hoverborder");
        self.domSelectedBorder = buildFakeBorder("pivot_selectedborder");

        // temporarily add them to the DOM so we can measure their color
        frontLayer.appendChild(self.domHoverBorder);
        frontLayer.appendChild(self.domSelectedBorder);
        self.hoverBorderColor = Seadragon2.Element.getStyle(self.domHoverBorder.pvtop).backgroundColor;
        self.selectedBorderColor = Seadragon2.Element.getStyle(self.domSelectedBorder.pvtop).backgroundColor;
        frontLayer.removeChild(self.domHoverBorder);
        frontLayer.removeChild(self.domSelectedBorder);
    }

    // Methods -- UI

    /**
     * Zoom the view, toward its center, to the given percentage zoom (0 is minimum, 100 is maximum).
     * @method zoomToPercent
     * @param percent {number} The target zoom level
     */
    self.zoomToPercent = function (percent) {
        viewport.zoomToPercent(percent);
        viewport.applyConstraints();
    };

    /**
     * Move the viewport to center on the item left of the center item. Wraps around at edges.
     * @method moveLeft
     */
    self.moveLeft = function () {
        // same as pressing left key
        onKeyDown({keyCode: 37});
    };

    /**
     * Move the viewport to center on the item right of the center item. Wraps around at edges.
     * @method moveRight
     */
    self.moveRight = function () {
        // same as pressing right key
        onKeyDown({keyCode: 39});
    };

    /**
     * Center the item with the given ID as if it had been clicked.
     * @method setCenterItem
     * @param id {string} The ID of the item to center
     */
    self.setCenterItem = function (id) {
        if (!hasOwnProperty.call(allItemsById, id)) {
            throw "setCenterItem: No matching ID found: " + id;
        }
        if (!innerTracker.isTracking()) {
            throw "setCenterItem: Can't execute during rearrange.";
        }
        if (!hasOwnProperty.call(self.activeItems, id)) {
            throw "setCenterItem: Item is currently not filtered in.";
        }
        var item = allItemsById[id];
        if (item !== self.selectedItem) {
            self.hoveredItem = item;
            self.hoveredItemIndex = 0;
            onClick(undefined, 0, undefined, true);
        }
    };

    /**
     * Collapse the details pane and show the info button instead.
     * @method collapseDetails
     */
    self.collapseDetails = function () {
        self.detailsEnabled = false;
        if (self.selectedItem) {
            // move the viewport so the selected item stays centered
            self.hoveredItem = self.selectedItem;
            self.hoveredItemIndex = self.selectedItemIndex;
            self.selectedItem = undefined;
            onClick(undefined, 0, undefined, true);
        }
        self.trigger("hideDetails");
        self.trigger("showInfoButton");
        //self.trigger("clearFilter");
    };

    /**
     * Show the details pane and hide the info button.
     * @method expandDetails
     */
    self.expandDetails = function () {
        self.detailsEnabled = true;
        if (self.selectedItem) {
            // move the viewport so the selected item stays centered
            self.hoveredItem = self.selectedItem;
            self.hoveredItemIndex = self.selectedItemIndex;
            self.selectedItem = undefined;
            onClick(undefined, 0, undefined, true);
        }
        self.trigger("hideInfoButton");
        self.trigger("showDetails", self.centerItem, self.facets);
        self.trigger("filterItem", self.centerItem, self.facets);
    };

    // Methods -- SORTING & FILTERING

    /**
     * Sort the collection by the selected self.facet. The collection will immediately begin rearranging.
     * @method sortBy
     * @param facetName {string} the name of the self.facet category to sort by
     */
    self.sortBy = function (facetName) {
        self.sortFacet = facetName;
        rearrange();
    };

    /**
     * Start rearranging the viewer based on the currently selected filters.
     * @method filter
     */
    self.filter = function () {
        rearrange();
    };

    /**
     * Add a new filter to the viewer. Do not immediately start rearranging.
     * @method addFilter
     * @param filter {function} The filtering function. It takes one argument, a collection item,
     * and returns true if the item is allowed and false if the item is filtered out.
     */
    self.addFilter = function (filter) {
        if (typeof filter === "function") {
            filters.push(filter);
        }
    };

    /**
     * Remove a filter from the viewer. Do not immediately start rearranging.
     * @method removeFilter
     * @param filter {function} The filtering function, which was previously added to the viewer
     * by a call to addFilter.
     */
    self.removeFilter = function (filter) {
        var index = filters.indexOf(filter);
        if (index !== -1) {
            filters.splice(index, 1);
        }
    };

    /**
     * Clear all filters from the viewer. Do not immediately start rearranging.
     * @method clearFilters
     */
    self.clearFilters = function () {
        filters = [];
    };

    // Methods -- CONTENT

    /**
     * Set new self.facet categories for the collection. This method can only be called when the
     * viewer is empty, which means before any calls to addItems or after the "itemsCleared"
     * event has been triggered in response to a clearItems call.
     * @method setFacets
     * @param newFacets {object} The new self.facet categories. The property names in this object
     * are the names of the categories, and the values of the properties are objects describing
     * the categories. Each category description should have the following properties:
     * <dl>
     * <dt>type</dt><dd>string - The type of self.facet category. Valid types are "String",
     * "LongString" (which gets treated like String), "Number", "DateTime", and "Link".</dd>
     * <dt>isFilterVisible</dt><dd>bool - Whether the self.facet shows up in the filter selection
     * pane and the sort order drop-down</dd>
     * <dt>isWordWheelVisible</dt><dd>bool - Whether the self.facet category will be accessible via
     * the search box</dd>
     * <dt>isMetaDataVisible</dt><dd>bool - Whether the self.facet shows up in the details pane</dd>
     * <dt>orders</dt><dd>optional Array - Allows you to set custom sort orders for String
     * self.facets other than the default alphabetical and most-common-first orders. Each element
     * in this array must have a "name" string property and an "order" array of strings, which
     * contains all possible self.facet values in the desired order.</dd>
     * </dl>
     */
    self.setFacets = function (newFacets) {
        if (self.items.length) {
            throw "You must set self.facet categories before adding items.";
        }

        // the old filters probably won't make any sense anymore, and
        // the view portion forgets them automatically.
        filters = [];

        self.facets = newFacets;

        // look through the newly added self.facets and set up self.comparators
        // for any self.facets that define a custom sort order
        var facetName, facetData, orders;
        for (facetName in self.facets) {
            if (hasOwnProperty.call(self.facets, facetName)) {
                facetData = self.facets[facetName];
                orders = facetData.orders;
                if (orders && orders.length) {
                    // make a new variable scope so we can bind by value
                    (function () {
                        var orderArray = orders[0].order,
                            orderMap = {};
                        orderArray.forEach(function (value, index) {
                            orderMap[value] = index;
                        });
                        facetData.comparator = function (a, b) {
                            var isAOrdered = hasOwnProperty.call(orderMap, a),
                                isBOrdered = hasOwnProperty.call(orderMap, b);
                            return isAOrdered ?
                                isBOrdered ?
                                    orderMap[a] - orderMap[b] :
                                    -1 :
                                isBOrdered ?
                                    1 :
                                    a === b ?
                                        0 :
                                        a > b ?
                                            1 :
                                            -1;
                        };
                    }());
                }
            }
        }

        // fire an event so that the UI components can update themselves
        self.trigger("hideDetails");
        self.trigger("hideInfoButton");
        self.trigger("facetsSet", self.facets);
        //self.trigger("clearFilter");
    };

    // Helpers -- TEMPLATING

    function pollForContent() {
        var index;
        for (index in contentPollingEndpoints) {
            if (hasOwnProperty.call(contentPollingEndpoints, index)) {
                var endpoint = contentPollingEndpoints[index];

                (function () {
                    var indexCopy = parseInt(index, 10),
                        level = endpoint.level,
                        itemArray = endpoint.items;

                    // TODO make sure that we don't set the sdimgs multiple times for a single level,
                    // in case the network requests overlapped. We must however leave the option to
                    // make the level anew if it actually needs it because the items have changed.
                    Seadragon2.Xml.fetch(endpoint.url, function () {
                        // success callback
                        var result;
                        try {
                            result = JSON.parse(self.responseText);
                        } catch (e) {
                            Seadragon2.Debug.warn(i18n.t("parsingJsonError"));
                            return;
                        }

                        // check: is the DZC finished?
                        if (result.ready) {
                            // we no longer need to poll for this content
                            delete contentPollingEndpoints[indexCopy];
                            contentPollingCount--;

                            // make sure we update the view now that there is new content
                            if (level === self.currentTemplateLevel.toString()) {
                                self.anythingChanged = true;
                            }

                            // calculate some properties that we'll need for setting up tile sources
                            var dzcInfo = result.dzi;
                            var dzcUrl = dzcInfo.url;
                            dzcUrl = dzcUrl.substr(0, dzcUrl.length - 4) + "_files/";
                            var width = dzcInfo.width;
                            var height = dzcInfo.height;
                            var tileSize = dzcInfo.tileSize;
                            var format = dzcInfo.tileFormat;

                            var maxLevel = Math.min(
                                Math.log(tileSize) / Math.LN2,
                                Math.ceil(Math.log(Math.max(width, height)) / Math.LN2)
                            );

                            // Note that the server does actually create a .dzc file for this collection.
                            // However, there are two problems with it:
                            // 1. I'm not sure if you can set Access-Control-Allow-Origin for Azure blob storage.
                            // 2. It's needlessly big and we already know all of the information it will contain.
                            // Given those issues, it's far easier and faster to just build the DzcTileSource objects
                            // here, rather than referencing the DZC file by URL.

                            // create new sdimgs at this level for each item
                            itemArray.forEach(function (item, itemIndex) {
                                var sdimg = item.sdimg[level] = new Seadragon2.Image(sdimgOpts);
                                sdimg.src = new Seadragon2.DzcTileSource(
                                    width,
                                    height,
                                    tileSize,
                                    maxLevel,
                                    itemIndex,
                                    dzcUrl,
                                    format,
                                    itemIndex
                                );
                                sdimg.update();
                            });
                        }

                        // check: did the server fail?
                        if (result.failed) {
                            // no point in polling for it any more
                            delete contentPollingEndpoints[indexCopy];
                            contentPollingCount--;
                        }
                    }, function () {
                        // failure callback
                        Seadragon2.Debug.warn(i18n.t("receivedFailureCode"));
                    });
                }());
            }
        }

        // register to try again after a bit
        if (contentPollingCount) {
            delayFunction(pollForContent, 60);
        }
    }

    function renderOnServer() {
        var serverName, index, itemsArray, jsonObject, jsonString, reduce = [].reduce, template;

        // build the object that we'll use for the POST request
        jsonObject = {
            href: location.href,
            // we have to upload all current styles to the server so it renders correctly
            style: reduce.call(document.styleSheets, function (prev, styleSheet) {
                return prev + reduce.call(styleSheet.cssRules, function (prev, styleRule) {
                    return prev + styleRule.cssText;
                }, "");
            }, "")
        };

        // iterate over the servers (usually there will only be one).
        // for each, upload the list of items that we'll render on it.
        for (index in serverSideItems) {
            if (hasOwnProperty.call(serverSideItems, index)) {
                itemsArray = serverSideItems[index];
                template = self.templates[index];
                serverName = template.renderer + "pivot/";
                jsonObject.width = template.width;
                jsonObject.height = template.height || template.width;

                // we don't want to upload the full representation of each item, just its
                // HTML template for this level.
                jsonObject.items = itemsArray.map(function (item) {
                    return item.html[index][0].innerHTML;
                });

                // generate a JSON string that we can upload
                jsonString = JSON.stringify(jsonObject);

                // compress it and base64-encode the result
                jsonString = lzwEncode(jsonString);

                // introduce a new scope so we can use temporary variables in the callbacks
                (function () {
                    var indexCopy = index,
                        rendererCopy = template.renderer,
                        itemsArrayCopy = itemsArray;

                    // POSTing with mime type application/json requires pre-flighting the request.
                    // it should be fewer total round trips if we stick with default text/plain.
                    Seadragon2.Xml.fetch(serverName, function () {
                        // success handler
                        var result;
                        try {
                            result = JSON.parse(self.responseText);
                        } catch (e) {
                            Seadragon2.Debug.warn(i18n.t("parsingJsonFailed"));
                            return;
                        }

                        // now that we know the ID of the generated content, we'll have to poll the content
                        // endpoint for its status until it is finished.
                        contentPollingEndpoints[renderRequestCount++] = {
                            level: indexCopy,
                            url: rendererCopy + "content/" + result.id,
                            items: itemsArrayCopy
                        };
                        contentPollingCount++;
                        if (contentPollingCount === 1) {
                            // ideally this would be a one second delay, but in a big collection it
                            // is probably slower. if we need better precision, we could
                            // use setTimeout instead.
                            delayFunction(pollForContent, 60);
                        }
                    }, function () {
                        // failure handler
                        Seadragon2.Debug.warn(i18n.t("postCollectionDataFailed") +
                            self.statusText + "; response: " + self.responseText);
                    }, jsonString);
                }());
            }
        }

        // clear temporary state now that the items have been posted
        serverSideItems = {};
        serverRenderTimeout = undefined;
    }

    // Create the template levels for a new item, or update template levels for
    // an existing item. Note that any levels rendered server-side have "one-time"
    // data bindings, meaning changes to properties will be ignored for those levels.
    function updateTemplate(item) {
        var oldHtmlArray = item.html, // don't overwrite if already existed!
            htmlArray = item.html = [],
            oldCanvasArray = item.canvas,
            canvasArray = item.canvas = [],
            oldSdimgArray = item.sdimg,
            sdimgArray = item.sdimg = [],
            renderer,
            serverItemsArray,
            isNewItem = !oldHtmlArray;

        // template level -1 is used for if no templates were specified
        // (the old CXML case).
        if (oldSdimgArray) {
            sdimgArray[-1] = oldSdimgArray[-1];
        }
        self.templates.forEach(function (template, index) {
            switch (template.type) {
            case "canvas":
                htmlArray.push([]);
                canvasArray.push(template.func);
                sdimgArray.push(undefined);
                break;
            case "img":
            case "color":
                htmlArray.push([]);
                canvasArray.push(makeTemplate(template, item));
                sdimgArray.push(undefined);
                break;
            case "sdimg":
                htmlArray.push([]);
                canvasArray.push(undefined);
                sdimgArray.push(sdimgArray[-1]);
                break;
            case "fakehtml":
                if (isNewItem) {
                    renderer = template.renderer;

                    // push this item to the server for rendering as part of a dynamic DZC
                    serverItemsArray = serverSideItems[index] = serverSideItems[index] || [];
                    serverItemsArray.push(item);

                    // get ready to send a request for server-side rendering
                    // (not right away, because we want to accumulate all items before
                    // launching the request)
                    if (serverRenderTimeout === undefined) {
                        serverRenderTimeout = true;
                        delayFunction(renderOnServer);
                    }

                    htmlArray.push([makeTemplate(template, item)]);

                    // we have to have fallback content because it takes a long time to render server-side.
                    // it would ruin our perf to have the fallback content be actual html, so we'll draw
                    // something on the canvas. if nothing else was specified, just draw a gray box to fill
                    // the space.
                    canvasArray.push(makeTemplate(template.fallback || {
                        type: "color",
                        template: "gray"
                    }, item));

                    sdimgArray.push(undefined);
                } else {
                    // this binding already happened once and we're not redoing it.
                    // just copy the results over to the new templates.
                    htmlArray.push(oldHtmlArray[index]);
                    canvasArray.push(oldCanvasArray[index]);
                    sdimgArray.push(oldSdimgArray[index]);
                }
                break;
            case "html":
                if (oldHtmlArray) {
                    // there were already HTML representations of this item. since they might
                    // be onscreen and likely have other useful position info and such on them,
                    // we'll reuse the container element but replace its inner HTML.
                    // In rare cases there might be multiple copies of the element's HTML because
                    // it is present in multiple graph self.bars. TODO optimize templating in this case.
                    htmlArray.push(oldHtmlArray[index]);
                    oldHtmlArray[index].forEach(function (htmlElement) {
                        makeTemplate(template, item, htmlElement);
                    });
                } else {
                    htmlArray.push([makeTemplate(template, item)]);
                }
                canvasArray.push(undefined);
                sdimgArray.push(undefined);
                break;
            default:
                Seadragon2.Debug.warn(i18n.t("unrecognizedTemplateType"));
            }
        });

        // find and set the aspect ratio for the item. we assume that the aspect ratio
        // of all template levels will match (or at least approximate) the ratio of
        // the top level.
        if (self.templates.length) {
            var biggestTemplate = self.templates[self.templates.length - 1];
            item.normHeight = (biggestTemplate.height || biggestTemplate.width) / biggestTemplate.width;
        }
    }

    // Methods -- CONTENT, cont'd

    /**
     * Add an array of new items to the viewer, or modify existing items. You can mix new items with
     * existing items. An existing item is recognized by whether its id property matches the id of
     * any items already in the viewer.
     * @method addItems
     * @param newItems {Array} The items to add. Each item is an object, which can have any
     * combination of the following properties (all are optional):
     * <dl>
     * <dt>id</dt><dd>string - The unique identifier for the item. If you don't provide it, one will
     * be generated automatically. You should provide IDs either for all of your items or for none of
     * them, to avoid conflicting with auto-generated IDs.</dd>
     * <dt>name</dt><dd>string - The name of the item</dd>
     * <dt>description</dt><dd>string - Extra text information about the item</dd>
     * <dt>href</dt><dd>string - The URL associated with the item</dd>
     * <dt>img</dt><dd>string - The URL of the DZI or DZC image for the item</dd>
     * <dt>self.facets</dt><dd>object - Facet data. Property names are self.facet categories; property values
     * are arrays of values for that self.facet (strings, numbers, or dates, depending on the self.facet type).
     * Even if there is only one value for a particular self.facet, it must be in an array.
     * </dl>
     */
    self.addItems = function (newItems) {
        // if we're busy clearing a previous collection, wait until it's done before adding new items.
        // this helps protect against cases where IDs in the new collection collide with the old collection
        // and produce unintended results.
        if (!self.items.length && (self.activeItemsArr.length || self.rearrangingItemsArr.length)) {
            // delay it
            delayFunction(function () {
                self.addItems(newItems);
            });
            return;
        }

        var waitingItems = 1;
        var actuallyNewItems = []; // an array of items that were added, not updated
        function onLoad() {
            waitingItems--;
            if (!waitingItems) {
                // all items have loaded, add them to the view
                self.items = self.items.concat(actuallyNewItems);

                // set up templates for the new items, if necessary.
                // note that existing items may need their templates updated, since
                // their self.facets/descriptions/names may have changed.
                newItems.forEach(updateTemplate);

                // filter in all items and sort by the default self.facet.
                // TODO it should be possible to skip this step in cases where no items
                // were moved into or out of the current filters, and the current sort
                // order didn't change.
                self.filter();
            }
        }
        newItems.forEach(function (item) {
            // like anything else, we might have different sdimg representations of different zoom levels
            var sdimgs = item.sdimg = item.sdimg || [],
                sdimg;
            if (item.img) {
                sdimg = sdimgs[-1] = sdimgs[-1] || new Seadragon2.Image(sdimgOpts);
                sdimg.src = item.img;
                sdimg.update();
                if (!sdimg.state) {
                    // the image hasn't yet loaded; we must wait for it
                    waitingItems++;
                    sdimg.addEventListener("load", onLoad, false);
                    // TODO sdimg should also provide onerror, and we should respond to it.
                }
            }

            // check whether this item is new or updated
            var id = item.id;
            // if an ID wasn't provided, we must assign one
            if (!id && typeof id !== "number") {
                id = item.id = generateId();
            }
            // likewise, we should check that the other item properties exist
            if (!item.name) {
                item.name = "";
            }
            if (!item.description) {
                item.description = "";
            }
            if (!item.href) {
                item.href = "";
            }
            if (!item.facets) {
                item.facets = {};
            }
            if (!hasOwnProperty.call(allItemsById, id)) {
                allItemsById[id] = item;
                actuallyNewItems.push(item);
            }

            // refresh the details pane if necessary
            if (self.centerItem === item && self.zoomedIn && self.detailsEnabled) {
                self.trigger("hideDetails");
                self.trigger("showDetails", item, self.facets);
                self.trigger("filterItem", item, self.facets);
            }
        });
        // now check to see whether we can immediately add items
        onLoad();
    };

    /**
     * Set new templates for the viewer. Templates specify how items should be rendered in
     * the viewer, and can vary by zoom level. At any zoom level, the viewer will use the
     * smallest available template that is larger than the current item size, or the biggest
     * template if the current item size is larger than all templates. All templates should
     * have the same aspect ratio. This method can only be called when the viewer is empty,
     * which means before any calls to addItems or after the "itemsCleared" event has been
     * triggered in response to a clearItems call.
     * @method setTemplates
     * @param newTemplates {Array} The new templates. Each object in the array must have the
     * following properties:
     * <dl>
     * <dt>type</dt><dd>string - Either "html", "canvas", "sdimg", "color", or "img"</dd>
     * <dt>width</dt><dd>number - The template width in pixels</dd>
     * <dt>height</dt><dd>number - The template height in pixels</dd>
     * <dt>template</dt><dd>string or function - The template that specifies how to generate
     * visuals for an item in the collection at this level. To learn about specifying
     * templates, read the <a href="../../app/pivot/quickstart.html">developer's guide</a>.</dd>
     * </dl>
     */
    self.setTemplates = function (newTemplates) {
        // we disallow changing the template types while there are items in the view
        if (self.items.length || self.activeItemsArr.length || self.rearrangingItemsArr.length) {
            throw "You must set templates before adding items!";
        }

        // note that this does modify the input array
        self.templates = newTemplates.sort(function (a, b) {
            return a.width - b.width;
        });
        self.templates[-1] = { type: "sdimg" };

        // set up templates that draw directly on canvas
        self.templates.forEach(function (template) {
            if (template.type === "canvas") {
                template.func = makeTemplate(template);
            }
            if (template.type === "html" && template.renderer) {
                // internally, it's much easier to treat local HTML and
                // server-rendered HTML as two separate types.
                template.type = "fakehtml";
            }
        });

        // reset current level
        self.currentTemplateLevel = -1;
    };

    /**
     * Remove all items from the collection.
     * @method clearItems
     */
    self.clearItems = function () {
        self.items = [];
        allItemsById = {};

        self.filter();
    };

    /**
     * Look up an item by its unique identifier.
     * @method getItemById
     * @param id {string} the ID to find
     * @return {object} the object representing the item, in the format used by addItems
     */
    self.getItemById = function (id) {
        return allItemsById[id];
    };

    /**
     * Set the collection title.
     * @method setTitle
     * @param title {string} the new title
     */
    self.setTitle = function (title) {
        // just raise an event so the UI can update
        self.trigger("titleChange", title);
    };

    /**
     * Set legal info for the collection.
     * @method setCopyright
     * @param legalInfo {object} Contains two properties:
     * <dl>
     * <dt>name</dt><dd>string - The name to display</dd>
     * <dt>href</dt><dd>string - The URL for more information</dd>
     * </dl>
     */
    self.setCopyright = function (legalInfo) {
        // fire an event so the UI can update
        self.trigger("copyright", legalInfo);
    };

    /**
     * Get all items that are in based on all current filters except
     * the provided one. This is important for generating the counts
     * in the Pivot view's left rail.
     * @method runFiltersWithout
     * @param filter {function} the filter to not apply
     * @return {array} All items filtered in, excluding the given filter
     */
    self.runFiltersWithout = function (filter) {
        self.removeFilter(filter);
        var result = self.items.filter(function (item) {
            return filters.every(function (filter2) {
                return filter2(item);
            });
        });
        self.addFilter(filter);
        return result;
    };

    function countResult(results, str) {
        if (hasOwnProperty.call(results, str)) {
            results[str]++;
        } else {
            results[str] = 1;
        }
    }

    /**
     * Look for all self.facet values containing the given search term.
     * If the splitResults argument is true, this function
     * returns an object with two properties: front, which contains
     * matches where the search string matches the beginning of the
     * self.facet value, and rest, which contains other matches.
     * Otherwise, it returns only one object, with all matches.
     * @method runSearch
     * @param searchTerm {string} The string to find
     * @param splitResults {bool} Whether to split the results into two sets:
     * those where the beginning of the string matches, and those where any
     * substring matches.
     * @return {object} The results of the search. Property names are the
     * matching strings; property values are the number of matches with that string.
     */
    self.runSearch = function (searchTerm, splitResults) {
        var frontResults,
            restResults,
            result;
        if (splitResults) {
            frontResults = {};
            restResults = {};
            result = {
                front: frontResults,
                rest: restResults
            };
        } else {
            frontResults = restResults = {};
        }
        searchTerm = searchTerm.toLowerCase();
        function checkResult(value) {
            // deal with Link type
            value = value.content || value;
            // deal with Number and Date types
            if (typeof value === "number") {
                value = PivotNumber_format(value);
            } else if (value instanceof Date) {
                value = value.toLocaleDateString() + " " + value.toLocaleTimeString();
            }
            var match = value.toLowerCase().indexOf(searchTerm);
            if (match === 0) {
                countResult(frontResults, value);
            } else if (match > 0) {
                countResult(restResults, value);
            }
        }
        if (searchTerm) {
            self.items.forEach(function (item) {
                var facets = item.facets,
                    facetName;
                for (facetName in facets) {
                    if (hasOwnProperty.call(facets, facetName)) {
                        facets[facetName].forEach(checkResult);
                    }
                }
                checkResult(item.name);
            });
        }
        return result;
    };

    // Constructor

    initialize();

};