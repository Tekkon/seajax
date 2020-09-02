var MapView = function (container, isSelected) {
    BaseView.call(this, container, isSelected);
    var self = this;    

    self.markers = [];
    self.mLayers = [];
    self.highlightedMarkers = [];
    self.button = new Button("div", "pivot_sorttools mapButton pivot_activesort", $('.pivot_topbar')[0], i18n.t("mapView"));
    self.button.htmlElement.onclick = function () {
        self.select();

        $('.frontLayer')[0].style.visibility = "hidden";
        $('.behindLayer')[0].style.visibility = "hidden";
        $('.mapLayer')[0].style.visibility = "visible";
        $('.tableLayer')[0].style.visibility = "hidden";
    }

    this.enableClustering = PIVOT_PARAMETERS.map.enableClustering;
    this.highlightMarkersOnFilter = PIVOT_PARAMETERS.map.highlightMarkersOnFilter;
    this.multipleClusterColors = PIVOT_PARAMETERS.map.multipleClusterColors;
    this.clusterRadius = PIVOT_PARAMETERS.map.clusterRadius;
    this.startClusterLimit = PIVOT_PARAMETERS.map.startClusterLimit;
    this.sourceURL = PIVOT_PARAMETERS.map.sourceURL;
    this.markerUrl = PIVOT_PARAMETERS.map.markerUrl;
    this.highlightedMarkerUrl = PIVOT_PARAMETERS.map.highlightedMarkerUrl;
    this.filteredMarkerUrl = PIVOT_PARAMETERS.map.filteredMarkerUrl;

    this.detailsEnabled = PIVOT_PARAMETERS.detailsEnabled;
    this.filterElement = PIVOT_PARAMETERS.filterElement;
    
    this.activeItems = {};

    this.defaultIcon = new L.Icon({
        iconUrl: this.markerUrl,
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
    });

    this.highlightedIcon = new L.Icon({
        iconUrl: this.highlightedMarkerUrl,
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
    });

    this.filteredIcon = new L.Icon({
        iconUrl: this.filteredMarkerUrl,
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
    });

    img = document.createElement('img');
    img.src = this.highlightedMarkerUrl

    img1 = document.createElement('img');
    img1.src = this.filteredMarkerUrl;
}

MapView.prototype = Object.create(BaseView.prototype);
MapView.prototype.constructor = MapView;

MapView.prototype.createView = function (options) {
    var self = this;

    if (this.map == null) {
        var div = makeElement("div", "mapDiv", options.mapLayer);
        var width = options.canvas.clientWidth - options.leftRailWidth - 11;
        var height = options.canvas.clientHeight - 12;

        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.mapDiv { ' + "width: " + width + "px; height:" + height + "px; position: relative; margin-left: " + (options.leftRailWidth + 5) + "px; margin-top: 6px;margin-right: 6px;"; + ' }';
        document.getElementsByTagName('head')[0].appendChild(style);

        var setLayer = function (layer) {
            var centerPoint = self.map.getCenter();

            if (typeof layer.layer.options.crs != 'undefined') {
                self.map.setCrs(layer.layer.options.crs);
            }
            else {
                self.map.setCrs(L.CRS.EPSG3857);
            }
            self.map.setView(centerPoint, self.map.getZoom());
        }

        var getPropertyValue = function (dataRow, property) {
            return dataRow.getValue(property)[0] != undefined ? dataRow.getValue(property)[0] : "";
        }

        var setMarkerDivIcon = function (marker, template) {
            marker.setIcon(new L.DivIcon({
                className: 'my-div-icon',
                html: template,
                iconSize: new L.Point(25, 10)
            }));
        }

        var loadjscssfile = function (filename, filetype) {
            if (filetype == "js") {
                var fileref = document.createElement('script')
                fileref.setAttribute("type", "text/javascript")
                fileref.setAttribute("src", self.sourceURL + filename)
            }
            else if (filetype == "css") {
                var fileref = document.createElement("link")
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", self.sourceURL + filename)
            }
            if (typeof fileref != "undefined")
                document.getElementsByTagName("head")[0].appendChild(fileref)
        }

        var googleMap =
           L.tileLayer('http://mt{s}.google.com/vt/lyrs=m&z={z}&x={x}&y={y}&lang=ru_RU', {
               subdomains: ['0', '1', '2', '3'],
               attribution: '<a http="google.ru" target="_blank">Google</a>',
               reuseTiles: true,
               updateWhenIdle: false
           });

        var googleMapSat =
            L.tileLayer('http://mt{s}.google.com/vt/lyrs=y&z={z}&x={x}&y={y}&lang=ru_RU', {
                subdomains: ['0', '1', '2', '3'],
                attribution: '<a http="google.ru" target="_blank">Google</a>',
                reuseTiles: true,
                updateWhenIdle: false
            });

        var openStreetsMap =
            L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '<a http="google.ru" target="_blank">Open Streets</a>',
                reuseTiles: true,
                updateWhenIdle: false
            });

        var yndx = new L.Yandex();
        var ytraffic = new L.Yandex("null", { traffic: true, opacity: 1, overlay: false });
        var ysat = new L.Yandex("hybrid");
        var ypublic = new L.Yandex("publicMap");

        var map = L.map(div, { layers: [yndx] }).setView([0, 0], 2);
        this.map = map;

        L.Map.prototype.setCrs = function (newCrs) {
            this.options.crs = newCrs;
        }

        var baseMaps = {
            "Яндекс": yndx,
            "Яндекс спутник": ysat,
            "Яндекс пробки": ytraffic,
            "Google": googleMap,
            "Google спутник": googleMapSat,
            "Open Streets": openStreetsMap
        }

        map.on('baselayerchange', setLayer);

        map.on('click', function (event) {
            self.resetHighlightedMarkers();
            //self.container.trigger("clearFilter");
            self.container.trigger("filterSet", self.container.activeItemsArr);

            if (event.originalEvent.target.classList[0] == "route-input") {
                setTimeout(function () {
                    event.originalEvent.target.focus();
                }, 10);
            };
        });

        L.control.layers(baseMaps, null, { position: 'bottomleft' }).addTo(map);
        
        L.Control.RouteInput = L.Control.extend({
            onAdd: function (map) {
                var div = L.DomUtil.create('div');
                div.classList.add("route-control");
                div.innerHTML = "<h7>Маршрут</h7><br/>" +
                                "<label for='routeInputA' class='route-label'>Точка A</label><input id='routeInputA' type='text' class='route-input' /><br />" +
                                "<label for='routeInputB' class='route-label'>Точка B</label><input id='routeInputB' type='text' class='route-input' /><br />" +
                                "<input id='routeSubmit' type='button' value='OK' />" +
                                "<br /><br />" + 
                                "<label for='routeDistance' class='route-label'>Расстояние:</label><span class='route-input' id='routeDistance'></span>" ;
                return div;
            },
            onRemove: function (map) {
            }
        });

        L.control.routeInput = function (opts) {
            return new L.Control.RouteInput(opts);
        }

        L.control.routeInput({ position: 'topright' }).addTo(map);

        var routeLayer;
        function createRoute(locations) {
            var dir = MQ.routing.directions()
                .on('success', function (data) {
                    if (data.route.distance != undefined) {
                        $('#routeDistance')[0].textContent = Number((data.route.distance * 1.609).toFixed(2)) + " км";
                    }
                });

            dir.route({
                locations: locations
            });

            if (routeLayer != undefined) {
                map.removeLayer(routeLayer);
            }

            routeLayer = MQ.routing.routeLayer({
                directions: dir,
                fitBounds: true
            });

            map.addLayer(routeLayer);
        }

        var timer;
        //$(".route-input").on("input", function (e) {
        $('#routeSubmit').click(function(e) {
            /*var value = $(this).val();
            if ($(this).data("lastval") != value) {
                $(this).data("lastval", value);
                clearTimeout(timer);

                timer = setTimeout(function () {
                    if ($('#routeInputA').val().length > 0 && $('#routeInputB').val().length > 0) {
                        createRoute([$('#routeInputA').val(), $('#routeInputB').val()]);
                    }                    
                }, 500);
            };*/

            if ($('#routeInputA').val().length > 0 && $('#routeInputB').val().length > 0) {
                createRoute([$('#routeInputA').val(), $('#routeInputB').val()]);
            }
        });

        if (this.multipleClusterColors) {
            loadjscssfile("Content/MarkerCluster.Default.css", "css");
        } else {
            loadjscssfile("Content/MarkerCluster.Redefined.css", "css");
        }
    }

    var _items = {};
    if (options.activeItems !== {}) {
        _items = options.activeItems;
    } else {
        _items = options.items;
    }

    if (Object.entries(self.activeItems).length !== Object.entries(_items).length) {
        self.rearrange(_items, false);
        self.activeItems = _items;
    } else {
        self.showSelectedItems();
    }    
}

MapView.prototype.filter = function (filterData) {
    this.container.selectedItems = [];
    this.rearrange(filterData, true);
}

MapView.prototype.rearrange = function (filterData, isFiltering) {
    this.setMarkers(filterData, isFiltering);
}

MapView.prototype.showSelectedItems = function () {
    var self = this;

    self.resetHighlightedMarkers();
    self.container.selectedItems.forEach(function (item, index) {
        if (item != undefined) {
            var clickedMarker = self.markers.filter(function (marker) {
                return item.facets === marker.options.dataRow;
            })[0];
            self.setMarkerIcon(clickedMarker, self.highlightedIcon);
            self.highlightedMarkers.push(clickedMarker);
        }
    });
}

MapView.prototype.resetHighlightedMarkers = function () {
    var self = this;

    for (var i = 0; i < self.highlightedMarkers.length; i++) {
        if (self.highlightMarkersOnFilter) {
            var filteredMarker = self.filteredMarkers.filter(function (marker) { return marker.options.dataRow == self.highlightedMarkers[i].options.dataRow })[0];
            if (filteredMarker != undefined) {
                self.setMarkerIcon(self.highlightedMarkers[i], self.filteredIcon);
            } else {
                self.setMarkerIcon(self.highlightedMarkers[i], self.defaultIcon);
            }
        } else {
            self.setMarkerIcon(self.highlightedMarkers[i], self.defaultIcon);
        }        
    }

    self.highlightedMarkers = [];
}

MapView.prototype.substituteValues = function (s, params) {
    var ret = s;

    if (params[0] != null && params[0] != undefined) {
        ret = ret.replace('{LABEL}', params[0]);
    }

    if (params[1] != null && params[1] != undefined) {
        ret = ret.replace('{HINT}', params[1]);
    }

    if (params[2] != null && params[2] != undefined) {
        ret = ret.replace('{URL}', params[2]);
    }

    if (params[3] != null && params[3] != undefined) {
        if (Array.isArray(params[3])) {
            params[3].forEach(function (d, i) {
                ret = ret.replace('{DIM' + i + '}', d);
            });
        }
    }

    return ret;
}

MapView.prototype.setMarkerIcon = function (marker, icon) {
    marker.setIcon(icon);
}

MapView.prototype.setMarkers = function (_items, isFiltering) {
    var self = this;

    if (self.map != null) {
        function createMarker(latitude, longitude, dataRow, label, hint) {
            var marker = new L.marker([latitude, longitude]);

            if (self.popupHTML != undefined && self.popupHTML != "") {
                marker.bindPopup(self.substituteValues(self.popupHTML, [label, hint]));
            } else if (self.popupURL != undefined && self.popupURL != "") {
                var template = '<iframe style="width:300px;height:300px;" src="' + self.popupURL + '" />"';
                marker.bindPopup(self.substituteValues(template, [label, hint]));
            } else {
                marker.bindPopup(hint);
            }

            self.setMarkerIcon(marker, self.defaultIcon);
            marker.options.dataRow = dataRow.facets;

            self.markers.push(marker);

            return marker;
        }

        var filteredData = [];

        if (typeof _items === "object") {
            filteredData = Object.values(_items);
        } else if (Array.isArray(values)) {
            filteredData = _items;
        }

        function getFacet(dataRow, facetName) {
            return dataRow.facets[facetName] != undefined ? dataRow.facets[facetName][0] : undefined;
        }
       
        if (self.highlightMarkersOnFilter) {
            self.markers.forEach(function (marker) {
                self.setMarkerIcon(marker, self.defaultIcon);
            });            
        } else {
            self.markers = [];
        }

        self.filteredMarkers = [];
        filteredData.forEach(function (dataRow) {
            var latitude = getFacet(dataRow, "LATITUDE") || getFacet(dataRow, "LAT") || getFacet(dataRow, "Широта") || getFacet(dataRow, "ШИРОТА");
            var longitude = getFacet(dataRow, "LONGITUDE") || getFacet(dataRow, "LONG") || getFacet(dataRow, "Долгота") || getFacet(dataRow, "ДОЛГОТА");
            var label = getFacet(dataRow, "NAME") || getFacet(dataRow, "FULLNAME") || getFacet(dataRow, "SHORTNAME") || getFacet(dataRow, "FULL_NAME") || getFacet(dataRow, "SHORT_NAME")
                || getFacet(dataRow, "Наименование") || getFacet(dataRow, "Короткое наименование");
            var hint = label;

            if (typeof latitude != 'undefined' && latitude != null && latitude != 0 &&
                typeof longitude != 'undefined' && longitude != null && longitude != 0) {

                if (self.highlightMarkersOnFilter) {
                    var marker = self.markers.filter(function (marker) {
                        return marker.options.dataRow === dataRow.facets
                    })[0];

                    if (marker != undefined) {
                        self.setMarkerIcon(marker, self.filteredIcon);
                        self.filteredMarkers.push(marker);
                    } else {
                        createMarker(latitude, longitude, dataRow, label, hint);
                    }
                } else {
                    createMarker(latitude, longitude, dataRow, label, hint);
                }
            }
        });

        if (self.markerLayer != null) {
            self.markerLayer.removeEventListener('click', clickListener, false);
            self.markerLayer.removeEventListener("mouseover", mouseoverListener, false);
            self.markerLayer.removeEventListener("mouseout", mouseoutListener, false);
            self.map.removeLayer(self.markerLayer);
        }

        if (self.enableClustering && self.markers.length >= self.startClusterLimit) {
            self.markerLayer = L.markerClusterGroup();
            self.markerLayer.options.maxClusterRadius = self.clusterRadius;
        } else {
            self.markerLayer = new L.featureGroup(self.markers);
        }

        if (self.highlightMarkersOnFilter) {
            self.filteredMarkersLayer = new L.featureGroup(self.filteredMarkers);
        }

        for (var i = 0; i < self.markers.length; ++i) {
            if (self.iconHTML != undefined && self.iconHTML != "") {
                var popup = undefined;

                if (self.markers[i]._popup != undefined) {
                    popup = self.markers[i]._popup._content;
                }

                var m = L.marker([self.markers[i]._latlng.lat, self.markers[i]._latlng.lng], { dataRow: self.markers[i].options.dataRow });

                if (popup != undefined) {
                    m.bindPopup(popup);
                }

                self.setMarkerIcon(m, self.defaultIcon)

                self.markerLayer.addLayer(m);

                self.mLayers.push(m);
            } else {
                self.markerLayer.addLayer(self.markers[i]);
            }
        }

        self.map.addLayer(self.markerLayer);

        if (self.highlightMarkersOnFilter) {
            if (self.filteredMarkers.length > 0) {
                setTimeout(function () { self.map.fitBounds(self.filteredMarkersLayer.getBounds()); setTimeout(function () { self.showSelectedItems(); }.bind(self), 100); }.bind(self), 100);
            }
        } else {
            if (self.markers.length > 0) {
                setTimeout(function () { self.map.fitBounds(self.markerLayer.getBounds()); setTimeout(function () { self.showSelectedItems(); }.bind(self), 100); }.bind(self), 100);
            }
        }        

        if (self.markers.length == 0) {
            self.map.setView([0, 0], 2);
        }

        self.isExecuteSelectItem = true;

        var clickListener = function (event) {
            var clickedMarker = event.layer;

            self.resetHighlightedMarkers();
            self.setMarkerIcon(clickedMarker, self.highlightedIcon);
            self.highlightedMarkers.push(clickedMarker);

            var itemsArr;
            if (typeof _items === "object") {
                itemsArr = Object.values(_items);
            } else {
                itemsArr = _items;
            }

            var clickedItem = itemsArr.filter(function (item) {
                return item.facets === clickedMarker.options.dataRow;
            })[0];

            if (self.detailsEnabled) {
                self.container.trigger("showDetails", clickedItem, self.container.facets);
                self.container.trigger("showInfoButton");
            }
            self.container.trigger("filterItem", clickedItem, self.container.facets);

            self.container.selectedItems = [];
            self.container.selectedItems.push(clickedItem);
        }

        var mouseoverListener = function (event) {
            event.layer.openPopup();
        }

        var mouseoutListener = function (event) {
            event.layer.closePopup();
        }

        self.markerLayer.addEventListener('click', clickListener, false);
        self.markerLayer.addEventListener("mouseover", mouseoverListener, false);
        self.markerLayer.addEventListener("mouseout", mouseoutListener, false);
    }
}

MapView.prototype.clearFilter = function () {
    var self = this;

    self.rearrange(self.activeItems, false);
}