var MapView = function (container, isSelected) {
    BaseView.call(this, container, isSelected);
    var self = this;    

    self.markers = [];
    self.isCreated = false;
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
    this.filtered2ndMarkerUrl = PIVOT_PARAMETERS.map.filtered2ndMarkerUrl;
    this.routeMarkerUrl = PIVOT_PARAMETERS.map.routeMarkerUrl;
    this.routeMarkerShadowUrl = PIVOT_PARAMETERS.map.routeMarkerShadowUrl;

    this.detailsEnabled = PIVOT_PARAMETERS.detailsEnabled;
    this.filterElement = PIVOT_PARAMETERS.filterElement;
    
    this.activeItems = {};

    this.defaultIcon = new L.Icon({
        iconUrl: this.markerUrl,
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
        iconSize: [32, 32]
    });

    this.highlightedIcon = new L.Icon({
        iconUrl: this.highlightedMarkerUrl,
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
        iconSize: [32, 32]
    });

    this.filteredIcon = new L.Icon({
        iconUrl: this.filteredMarkerUrl,
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
        iconSize: [32, 32]
    });

    this.filtered2ndIcon = new L.Icon({
        iconUrl: this.filtered2ndMarkerUrl,
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
        iconSize: [32, 32]
    });

    this.routeIcon = new L.Icon({
        iconUrl: this.routeMarkerUrl,
        shadowUrl: this.routeMarkerShadowUrl,
        iconAnchor: [12, 41]
    });

    img = document.createElement('img');
    img.src = this.highlightedMarkerUrl

    img1 = document.createElement('img');
    img1.src = this.filteredMarkerUrl;

    img2 = document.createElement('img');
    img2.src = this.routeMarkerUrl

    img3 = document.createElement('img');
    img3.src = this.routeMarkerShadowUrl;

    img4 = document.createElement('img');
    img4.src = this.filtered2ndMarkerUrl;

    self.isRouteHeaderClicked = false;
}

MapView.prototype = Object.create(BaseView.prototype);
MapView.prototype.constructor = MapView;

MapView.prototype.createView = function (options) {
    var self = this;

    if (!self.isCreated) {
        self.isCreated = true;

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
        //var ytraffic = new L.Yandex("null", { traffic: true, opacity: 1, overlay: false });
        var ysat = new L.Yandex("hybrid");
        var ypublic = new L.Yandex("publicMap");

        self.mapDiv = makeElement("div", "mapDiv", options.mapLayer);

        var map = L.map(self.mapDiv, { layers: [yndx], preferCanvas: true });
        self.map = map;

        L.Map.prototype.setCrs = function (newCrs) {
            this.options.crs = newCrs;
        }

        var baseMaps = {
            "Яндекс": yndx,
            "Яндекс спутник": ysat,
            //"Яндекс пробки": ytraffic,
            "Google": googleMap,
            "Google спутник": googleMapSat,
            "Open Streets": openStreetsMap
        }

        map.on('baselayerchange', setLayer);

        map.on('click', function (event) {
            if (!self.isRouteHeaderClicked) {
                resetHighlightedMarkers(self);
                self.container.trigger("filterSet", self.container.activeItemsArr);
            }
            self.isRouteHeaderClicked = false;
        });

        self.container.addListener('resize', function () {
            invalidateSize(self);
        });

        L.control.layers(baseMaps, null, { position: 'bottomleft' }).addTo(self.map);

        /*if (this.multipleClusterColors) {
            loadjscssfile(self, "Content/MarkerCluster.Default.css", "css");
        } else {
            loadjscssfile(self, "Content/MarkerCluster.Redefined.css", "css");
        }*/

        addRouting(self);
    }
}

MapView.prototype.filter = function (filterData) {
    this.container.selectedItems = [];
    this.rearrange(filterData);
}

MapView.prototype.clearFilter = function () {
    var self = this;
    //self.rearrange(self.activeItems);
}

MapView.prototype.rearrange = function (filterData) {
    setMarkers(this, filterData);
}

MapView.prototype.getPropertyValue = function (dataRow, property) {
    var self = this;
    return dataRow.getValue(property)[0] != undefined ? dataRow.getValue(property)[0] : "";
}

/**** Secondary Functions ****/
function showSelectedItems(self) {
    resetHighlightedMarkers(self);
    self.container.selectedItems.forEach(function (item, index) {
        if (item != undefined) {
            var clickedMarker = self.markers.filter(function (marker) {
                return item.facets === marker.options.dataRow;
            })[0];
            setMarkerIcon(clickedMarker, self.highlightedIcon);
            self.highlightedMarkers.push(clickedMarker);
        }
    });
}

function resetHighlightedMarkers(self) {
    for (var i = 0; i < self.highlightedMarkers.length; i++) {
        if (self.highlightMarkersOnFilter) {
            var filteredMarker = self.filteredMarkers.filter(function (marker) { return marker.options.dataRow == self.highlightedMarkers[i].options.dataRow })[0];
            if (filteredMarker != undefined) {
                setMarkerIcon(self.highlightedMarkers[i], self.filteredIcon);
            } else {
                setMarkerIcon(self.highlightedMarkers[i], self.defaultIcon);
            }
        } else {
            setMarkerIcon(self.highlightedMarkers[i], self.defaultIcon);
        }        
    }

    self.selectedMarker = undefined;
    self.highlightedMarkers = [];
}

function substituteValues(s, params) {
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

function setMarkerIcon(marker, icon) {
    marker.setIcon(icon);
}

function createMarker(self, latitude, longitude, dataRow, label, hint) {
    var marker = new L.marker([latitude, longitude]);

    if (self.popupHTML != undefined && self.popupHTML != "") {
        marker.bindPopup(substituteValues(self.popupHTML, [label, hint]));
    } else if (self.popupURL != undefined && self.popupURL != "") {
        var template = '<iframe style="width:300px;height:300px;" src="' + self.popupURL + '" />"';
        marker.bindPopup(substituteValues(template, [label, hint]));
    } else {
        marker.bindPopup(hint);
    }

    if (self.highlightMarkersOnFilter) {
        setMarkerIcon(marker, self.filteredIcon);
    } else {
        setMarkerIcon(marker, self.defaultIcon);
    }

    marker.options.dataRow = dataRow.facets;
    self.markers.push(marker);

    return marker;
}

function setMarkers(self, _items) {
    if (self.map != null && self.map != undefined) {    
        var filteredData = [];
        if (typeof _items === "object") {
            filteredData = Object.values(_items);            
        } else if (Array.isArray(values)) {
            filteredData = _items;
        }

        var clickListener = function (event) {
            var clickedMarker = event.layer;
            if (self.filteredMarkers.includes(clickedMarker)) {
                resetHighlightedMarkers(self);
                setMarkerIcon(clickedMarker, self.highlightedIcon);
                self.highlightedMarkers.push(clickedMarker);
                self.selectedMarker = clickedMarker;
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
        }

        var mouseoverListener = function (event) {
            event.layer.openPopup();
        }

        var mouseoutListener = function (event) {
            event.layer.closePopup();
        }

        evaluateMarkers(self, filteredData);

        removeLayersAndListeners(self, self.markerLayer, clickListener, mouseoverListener, mouseoutListener);
        removeLayersAndListeners(self, self.commonClusterLayer, clickListener, mouseoverListener, mouseoutListener);
        removeLayersAndListeners(self, self.filteredClusterLayer, clickListener, mouseoverListener, mouseoutListener);

        createLayers(self);

        addLayerListeners(self, self.markerLayer, clickListener, mouseoverListener, mouseoutListener);
        addLayerListeners(self, self.commonClusterLayer, clickListener, mouseoverListener, mouseoutListener);
        addLayerListeners(self, self.filteredClusterLayer, clickListener, mouseoverListener, mouseoutListener);

        fitBoundsOnTimeout(self);       
        showSelectedItems(self);
    }
}

function evaluateMarkers(self, filteredData) {
    if (self.highlightMarkersOnFilter) {
        self.markers.forEach(function (marker) {
            setMarkerIcon(marker, self.defaultIcon);
        });
    } else {
        self.markers = [];
    }

    function getFacet(dataRow, facetName) {
        return dataRow.facets[facetName] != undefined ? dataRow.facets[facetName][0] : undefined;
    }

    self.filteredMarkers = [];
    filteredData.forEach(function (dataRow) {
        var latitude = getFacet(dataRow, "LATITUDE") || getFacet(dataRow, "LAT") || getFacet(dataRow, "Широта") || getFacet(dataRow, "ШИРОТА");
        var longitude = getFacet(dataRow, "LONGITUDE") || getFacet(dataRow, "LONG") || getFacet(dataRow, "Долгота") || getFacet(dataRow, "ДОЛГОТА");
        var label = getFacet(dataRow, "NAME") || getFacet(dataRow, "FULLNAME") || getFacet(dataRow, "SHORTNAME") || getFacet(dataRow, "FULL_NAME") || getFacet(dataRow, "SHORT_NAME")
            || getFacet(dataRow, "Наименование") || getFacet(dataRow, "Короткое наименование") || getFacet(dataRow, PIVOT_PARAMETERS.nameElement);
        var label2 = getFacet(dataRow, "LABEL2");

        var hint = label;

        if (typeof latitude != 'undefined' && latitude != null && latitude != 0 &&
            typeof longitude != 'undefined' && longitude != null && longitude != 0) {

            if (self.highlightMarkersOnFilter) {
                var marker = self.markers.filter(function (marker) {
                    return marker.options.dataRow[self.filterElement] === dataRow.facets[self.filterElement]
                })[0];

                if (marker != undefined) {
                    if (label2 != undefined && (label2 === 1 || label2 === "1")) {
                        setMarkerIcon(marker, self.filtered2ndIcon);
                    } else {
                        setMarkerIcon(marker, self.filteredIcon);
                    }
                } else {
                    marker = createMarker(self, latitude, longitude, dataRow, label, hint);
                }

                self.filteredMarkers.push(marker);
            } else {
                createMarker(self, latitude, longitude, dataRow, label, hint);
            }
        }
    });
}

function createLayers(self) {
    if (self.enableClustering && self.markers.length >= self.startClusterLimit) {
        self.commonClusterLayer = L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
                var icon = self.commonClusterLayer._defaultIconCreateFunction(cluster);
                icon.options.className += ' common-group';
                return icon;
            },
            maxClusterRadius: self.clusterRadius
        });

        self.filteredClusterLayer = L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
                var icon = self.commonClusterLayer._defaultIconCreateFunction(cluster);
                icon.options.className += ' filtered-group';
                return icon;
            },
            maxClusterRadius: self.clusterRadius
        });

        if (self.filteredMarkers.length == self.markers.length) {
            for (var i = 0; i < self.markers.length; ++i) {
                self.filteredClusterLayer.addLayer(self.markers[i]);
            }
        } else {
            for (var i = 0; i < self.filteredMarkers.length; ++i) {
                self.filteredClusterLayer.addLayer(self.filteredMarkers[i]);
            }

            for (var i = 0; i < self.markers.length; ++i) {
                if (!self.filteredMarkers.includes(self.markers[i])) {
                    self.commonClusterLayer.addLayer(self.markers[i]);
                }
            }
        }

        self.map.addLayer(self.filteredClusterLayer);
        self.map.addLayer(self.commonClusterLayer);
    } else {
        self.markerLayer = new L.featureGroup(self.markers);
        self.map.addLayer(self.markerLayer);
    }

    if (self.highlightMarkersOnFilter) {
        self.filteredMarkersLayer = new L.featureGroup(self.filteredMarkers);
    }
}

function fitBoundsOnTimeout(self) {
    setTimeout(function () {
        if (self.highlightMarkersOnFilter) {
            if (self.filteredMarkers.length > 0) {
                fitBounds(self, self.filteredMarkersLayer);
            } else if (self.markers.length > 0) {
                fitBounds(self, self.markerLayer);
            }
        } else {
            if (self.markers.length > 0) {
                fitBounds(self, self.markerLayer);
            }
        }
    }, 100);
}

function fitBounds(self, layer) {
    self.map.fitBounds(layer.getBounds());
}

function invalidateSize(self) {
    setTimeout(self.map.invalidateSize(), 100);
}

function removeLayersAndListeners(self, layer, clickListener, mouseoverListener, mouseoutListener) {
    if (layer != null && layer != undefined) {
        layer.removeEventListener('click', clickListener, false);
        layer.removeEventListener("mouseover", mouseoverListener, false);
        layer.removeEventListener("mouseout", mouseoutListener, false);
        self.map.removeLayer(layer);
    }
}

function addLayerListeners(self, layer, clickListener, mouseoverListener, mouseoutListener) {
    if (layer != null && layer != undefined) {
        layer.addEventListener('click', clickListener, false);
        layer.addEventListener("mouseover", mouseoverListener, false);
        layer.addEventListener("mouseout", mouseoutListener, false);
    }
}

// ***** Routing *****
function addRouting(self) {
    L.Control.RouteInput = L.Control.extend({
        onAdd: function (map) {
            var div = L.DomUtil.create('div');
            div.classList.add("route-control");
            div.innerHTML = "<div id='routeHeader'><h7>Маршрут</h7><img id='toggleImage' src='" + PIVOT_PARAMETERS.map.toggleDownImage + "' class='toggleImage' /></div></div>";
            return div;
        },
        onRemove: function (map) {
        }
    });

    L.control.routeInput = function (opts) {
        return new L.Control.RouteInput(opts);
    }

    var routeInput = L.control.routeInput({ position: 'topright' }).addTo(self.map);

    var routeControl;
    function createRoute(locations) {
        if (routeControl != undefined) {
            removeRouteControl();
        }

        routeControl = L.Routing.control({
            waypoints: [
                L.latLng(locations[0].latLng.lat, locations[0].latLng.lng),
                L.latLng(locations[1].latLng.lat, locations[1].latLng.lng)
            ],
            createMarker: function (i, wp, nWps) {
                var m = L.marker(wp.latLng);
                m.setForceZIndex(2000);
                m.options.draggable = true;
                m.options.icon = self.routeIcon;
                return m;
            },
            routeWhileDragging: true,
            geocoder: L.Control.Geocoder.nominatim(),
            language: 'ru',
            fitSelectedRoutes: false
        }).addTo(self.map);

        routeControl.on('routesfound', function (e) {
            var routes = e.routes;
            var summary = routes[0].summary;
            addLeafletRoutingGeocoderOnClick();
            addLeafletRoutingAddWaypointOnClick();
        });
    }

    var removeRouteControl = function () {
        routeControl.spliceWaypoints(0, 2);
        $(".leaflet-routing-container").remove();
    }

    function getValue(dataRow, facetName) {
        return dataRow[facetName] != undefined ? dataRow[facetName][0] : undefined;
    }

    function addLeafletRoutingGeocoderOnClick() {
        $('.leaflet-routing-geocoder').find("input").off();
        $('.leaflet-routing-geocoder').find("input").on("click", function (event) {
            setTimeout(function () { event.originalEvent.target.focus(); }, 10);
        });
    }

    function addLeafletRoutingAddWaypointOnClick() {
        $('.leaflet-routing-add-waypoint').off();
        $('.leaflet-routing-add-waypoint').click(function (event) {
            addLeafletRoutingGeocoderOnClick();
        });
    }

    function getLatitude(marker) {
        var val = getValue(marker.options.dataRow, "LATITUDE") || getValue(marker.options.dataRow, "LAT") || getValue(marker.options.dataRow, "Широта") || getValue(marker.options.dataRow, "ШИРОТА");
        return getFloat(val);
    }

    function getLongitude(marker) {
        val = getValue(marker.options.dataRow, "LONGITUDE") || getValue(marker.options.dataRow, "LONG") || getValue(marker.options.dataRow, "Долгота") || getValue(marker.options.dataRow, "ДОЛГОТА");
        return getFloat(val);
    }

    function getFloat(val) {
        if (typeof (val) === 'string') {
            return parseFloat(val);
        }

        return val;
    }

    $('#routeHeader').click(function (e) {
        self.isRouteHeaderClicked = true;

        if ($('#toggleImage')[0].src.includes('toggle-down.png')) {
            $('#toggleImage')[0].src = PIVOT_PARAMETERS.map.toggleUpImage;

            var latitudeA;
            var longitudeA
            var latitudeB;
            var longitudeB;

            if (self.selectedMarker != undefined) {
                latitudeA = getLatitude(self.selectedMarker);
                longitudeA = getLongitude(self.selectedMarker);
            } else {
                var mapCenter = self.map.getCenter();
                latitudeA = mapCenter.lat;
                longitudeA = mapCenter.lng;
            }

            latitudeB = latitudeA + 0.1;
            longitudeB = longitudeA + 0.1

            var locations = [
                {
                    latLng: {
                        lat: latitudeA,
                        lng: longitudeA
                    }
                },
                {
                    latLng: {
                        lat: latitudeB,
                        lng: longitudeB
                    }
                }
            ]

            createRoute(locations);
        } else {
            $('#toggleImage')[0].src = PIVOT_PARAMETERS.map.toggleDownImage;
            removeRouteControl();
        }
    });
}

function setMarkerDivIcon(marker, template) {
    marker.setIcon(new L.DivIcon({
        className: 'my-div-icon',
        html: template,
        iconSize: new L.Point(25, 10)
    }));
}

function loadjscssfile(self, filename, filetype) {
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

function toggleShow(name) {
    document.getElementById(name).classList.toggle("show");
}

function toggleInvisible(name) {
    document.getElementById(name).classList.toggle("invisible");
}

function makeVisible(name) {
    var classList = document.getElementById(name).classList;
    var isIncludes = false;

    for (var i = 0; i < classList.length; i++) {
        if (classList[i] == "invisible") {
            isIncludes = true;
        }
    }

    if (isIncludes) {
        toggleInvisible(name);
    }
}

function makeInvisible(name) {
    var classList = document.getElementById(name).classList;
    var isIncludes = false;

    for (var i = 0; i < classList.length; i++) {
        if (classList[i] == "invisible") {
            isIncludes = true;
        }
    }

    if (!isIncludes) {
        toggleInvisible(name);
    }
}

function filterDropdown(dropdownName, inputName) {
    var input, filter, ul, li, a, i;
    input = document.getElementById(inputName);
    filter = input.value.toUpperCase();
    div = document.getElementById(dropdownName);
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

function dropdownRowClick(row, dropdownName, inputName) {
    input = document.getElementById(inputName);
    input.value = row.text;
    toggleShow(dropdownName);
}

function toggleDropdownA() {
    toggleShow("dropdownA");
}

function toggleDropdownB() {
    toggleShow("dropdownB");
}

function filterDropdownA() {
    filterDropdown("dropdownA", "routeInputA");
}

function filterDropdownB() {
    filterDropdown("dropdownB", "routeInputB");
}

function dropdownArowClick(row) {
    dropdownRowClick(row, "dropdownA", "routeInputA");
}

function dropdownBrowClick(row) {
    dropdownRowClick(row, "dropdownB", "routeInputB");
}