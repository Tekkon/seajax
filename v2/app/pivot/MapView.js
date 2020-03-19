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
    this.multipleClusterColors = PIVOT_PARAMETERS.map.multipleClusterColors;
    this.clusterRadius = PIVOT_PARAMETERS.map.clusterRadius;
    this.startClusterLimit = PIVOT_PARAMETERS.map.startClusterLimit;
    this.sourceURL = PIVOT_PARAMETERS.map.sourceURL;
    this.detailsEnabled = PIVOT_PARAMETERS.detailsEnabled;
    this.filterElement = PIVOT_PARAMETERS.filterElement;
    this.activeItems = {};
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

        L.control.layers(baseMaps, null, { position: 'bottomleft' }).addTo(map);

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
        self.rearrange(_items);
        self.activeItems = _items;
    } else {
        self.showSelectedItems();
    }
}

MapView.prototype.filter = function (filterData) {
    this.container.selectedItems = [];
    this.rearrange(filterData);
}

MapView.prototype.rearrange = function (filterData) {
    this.setMarkers(filterData);
}

MapView.prototype.showSelectedItems = function () {
    var self = this;

    self.resetHighlightedMarkers();
    self.container.selectedItems.forEach(function (item, index) {
        var clickedMarker = self.markers.filter(function (marker) {
            return item.facets === marker.options.dataRow;
})[0];
        self.setMarkerIcon(clickedMarker, 'highlightedMarker');
        self.highlightedMarkers.push(clickedMarker);
        self.map.setView([clickedMarker._latlng.lat, clickedMarker._latlng.lng], 20);
});
}

MapView.prototype.resetHighlightedMarkers = function () {
    var self = this;

    for (var i = 0; i < self.highlightedMarkers.length; i++) {
        self.setMarkerIcon(self.highlightedMarkers[i], 'mapMarker');
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

MapView.prototype.setMarkerIcon = function (marker, className) {
    marker.setIcon(new L.Icon({
    iconUrl: className === 'mapMarker' ? 'Content/images/icon-point-gas.png' : 'Content/images/icon-point-gas-inverted.png',
    className: className,
    iconAnchor: [12, 41],
    popupAnchor: [0, -41]
}));
}

MapView.prototype.setMarkers = function (_items) {
    var self = this;

    if (this.map != null) {
        this.markers = [];
        var filteredData = [];

        if (typeof _items === "object") {
            filteredData = Object.values(_items);
} else if (Array.isArray(values)) {
            filteredData = _items;
}

        function getFacet(dataRow, facetName) {
            return dataRow.facets[facetName] != undefined ? dataRow.facets[facetName][0] : undefined;
}

        filteredData.forEach(function (dataRow) {
            var latitude = getFacet(dataRow, "LATITUDE") || getFacet(dataRow, "LAT") || getFacet(dataRow, "Широта") || getFacet(dataRow, "ШИРОТА");
            var longitude = getFacet(dataRow, "LONGITUDE") || getFacet(dataRow, "LONG") || getFacet(dataRow, "Долгота") || getFacet(dataRow, "ДОЛГОТА");
            var label = getFacet(dataRow, "NAME") || getFacet(dataRow, "FULLNAME") || getFacet(dataRow, "SHORTNAME") || getFacet(dataRow, "FULL_NAME") || getFacet(dataRow, "SHORT_NAME")
                || getFacet(dataRow, "Наименование") || getFacet(dataRow, "Короткое наименование");
            var hint = label;

            if (typeof latitude != 'undefined' && latitude != null && latitude != 0 &&
                typeof longitude != 'undefined' && longitude != null && longitude != 0) {

                var marker = new L.marker([latitude, longitude]);

                if (self.popupHTML != undefined && self.popupHTML != "") {
                    marker.bindPopup(self.substituteValues(self.popupHTML, [label, hint]));
} else if (self.popupURL != undefined && self.popupURL != "") {
                    var template = '<iframe style="width:300px;height:300px;" src="' + self.popupURL + '" />"';
                    marker.bindPopup(self.substituteValues(template, [label, hint]));
} else {
                    marker.bindPopup(hint);
}

                self.setMarkerIcon(marker, 'mapMarker');
                marker.options.dataRow = dataRow.facets;

                self.markers.push(marker);
}
});

        if (self.markerLayer != null) {
            self.map.removeLayer(self.markerLayer);
}

        if (self.enableClustering && self.markers.length >= self.startClusterLimit) {
            self.markerLayer = L.markerClusterGroup();
            self.markerLayer.options.maxClusterRadius = self.clusterRadius;
} else {
            self.markerLayer = new L.featureGroup(self.markers);
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

                self.setMarkerIcon(m, 'mapMarker');

                self.markerLayer.addLayer(m);

                self.mLayers.push(m);
} else {
                self.markerLayer.addLayer(self.markers[i]);
}
}

        self.map.addLayer(self.markerLayer);

        if (self.markers.length > 0) {
            setTimeout(function () { self.map.fitBounds(self.markerLayer.getBounds()); setTimeout(function () { self.showSelectedItems(); }.bind(self), 100); }.bind(self), 100);
}

        if (self.markers.length == 0) {
            self.map.setView([0, 0], 2);
}

        self.isExecuteSelectItem = true;
        self.markerLayer.on("click", function (event) {
            var clickedMarker = event.layer;

            self.resetHighlightedMarkers();
            self.setMarkerIcon(clickedMarker, 'highlightedMarker');
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
});

        self.markerLayer.on("mouseover", function (event) {
            event.layer.openPopup();
});
}
}

MapView.prototype.clearFilter = function () {
    var self = this;

    self.rearrange(self.activeItems);
}