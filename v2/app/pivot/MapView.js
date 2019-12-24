﻿var MapView = function (container, isSelected) {
    BaseView.call(this, container, isSelected);

    this.markers = [];
    this.mLayers = [];
    this.iconHTML = "";
    this.higligtedIconHTML = "";
    this.popupHTML = "";
    this.popupURL = "";
    this.enableClustering = true;
    this.multipleClusterColors = false;
    this.clusterRadius = 50;
    this.startClusterLimit = 10;
    this.myURL = "";
    this.markerIconURL = "Content/images/icon-point-gas.png";
    this.highlightedMarkerIconURL = "Content/images/icon-point-gas-inverted.png";
    this.shadowURL = "Content/images/marker-shadow.png";
    this.highlightedMarkers = [];
}

MapView.prototype = Object.create(BaseView.prototype);
MapView.prototype.constructor = MapView;

MapView.prototype.createView = function (options) {
    options.mapLayer.style = "visibility: visible;"
    var self = this;

    if (this.map == null) {
        var div = makeElement("div", "", options.mapLayer);
        
        function setMapLayerStyle() {
            var width = window.innerWidth - 220;
            var height = window.innerHeight - 41;
            div.style = "width: " + width + "px; height:" + height + "px; position: relative; margin-left: 215px; margin-top: 6px;";
        }
        setMapLayerStyle();

        window.addEventListener("optimizedResize", function () {
            setMapLayerStyle();
        });

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
                fileref.setAttribute("src", self.myURL + filename)
            }
            else if (filetype == "css") {
                var fileref = document.createElement("link")
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", self.myURL + filename)
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
        };

        map.on('baselayerchange', setLayer);

        L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(map);

        if (this.multipleClusterColors) {
            loadjscssfile("Content/MarkerCluster.Default.css", "css");
        } else {
            loadjscssfile("Content/MarkerCluster.Redefined.css", "css");
        }

        this.setMarkers(data);
    }
}

MapView.prototype.filter = function (filterData) {
    this.setMarkers(filterData);
}

MapView.prototype.clearFilter = function () {
    this.setMarkers(data);
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

MapView.prototype.setMarkerIcon = function (marker, iconURL) {
    marker.setIcon(new L.Icon({
        iconUrl: iconURL,
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
    }));
}

MapView.prototype.setMarkers = function (values) {
    var self = this;

    if (this.map != null) {
        this.markers = [];
        var filteredData = [];

        if (typeof values === "object") {
            values = Object.values(values).map(function (val) { return val.id !== undefined ? val.id : val.ID; })
            filteredData = data.filter(function (elem) {
                return values.includes(elem.ID);
            });
        } else if (Array.isArray(values)) {
            filteredData = data;
        }

        filteredData.forEach(function (dataRow) {
            var latitude = dataRow.LATITUDE;
            var longitude = dataRow.LONGITUDE;
            var label = dataRow.ORG_NAME;
            var hint = dataRow.ORG_NAME;

            if (typeof latitude != 'undefined' && latitude != null &&
                typeof longitude != 'undefined' && longitude != null) {

                var marker = new L.marker([latitude, longitude]);

                if (self.popupHTML != "") {
                    marker.bindPopup(self.substituteValues(self.popupHTML, [label, hint]));
                } else if (self.popupURL != "") {
                    var template = '<iframe style="width:300px;height:300px;" src="' + self.popupURL + '" />"';
                    marker.bindPopup(self.substituteValues(template, [label, hint]));
                } else {
                    marker.bindPopup(hint);
                }

                self.setMarkerIcon(marker, self.markerIconURL);
                marker.options.dataRow = dataRow;

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
            if (self.iconHTML != "") {
                var popup = undefined;

                if (self.markers[i]._popup != undefined) {
                    popup = self.markers[i]._popup._content;
                }

                var m = L.marker([self.markers[i]._latlng.lat, self.markers[i]._latlng.lng], { dataRow: self.markers[i].options.dataRow });

                if (popup != undefined) {
                    m.bindPopup(popup);
                }

                self.setMarkerIcon(m, self.markerIconURL);

                self.markerLayer.addLayer(m);

                self.mLayers.push(m);
            } else {
                self.markerLayer.addLayer(self.markers[i]);
            }
        }

        self.map.addLayer(self.markerLayer);

        if (self.markers.length > 0) {
            setTimeout(function () { self.map.fitBounds(self.markerLayer.getBounds()); }.bind(self), 100);
        }

        if (self.markers.length == 0) {
            self.map.setView([0, 0], 2);
        }

        var resetHighlightedMarkers = function () {
            for (var i = 0; i < self.highlightedMarkers.length; i++) {
                self.setMarkerIcon(self.highlightedMarkers[i], self.markerIconURL);
            }

            self.highlightedMarkers = [];
        }

        self.markerLayer.on("click", function (event) {
            var clickedMarker = event.layer;

            resetHighlightedMarkers();
            self.setMarkerIcon(clickedMarker, self.highlightedMarkerIconURL);
            self.highlightedMarkers.push(clickedMarker);
        });

        self.markerLayer.on("mouseover", function (event) {
            event.layer.openPopup();
        });
    }
}