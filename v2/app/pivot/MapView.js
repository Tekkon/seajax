var MapView = function (container, isSelected) {
    BaseView.call(this, container, isSelected);
}

MapView.prototype = Object.create(BaseView.prototype);
MapView.prototype.constructor = MapView;

MapView.prototype.createView = function (options) {
    options.mapLayer.style = "visibility: visible;"

    if (this.map == null) {
        var div = makeElement("div", "", options.mapLayer);
        
        function setMapLayerStyle() {
            var width = window.innerWidth - 220;
            var height = window.innerHeight - 41;
            div.style = "width: " + width + "px; height:" + height + "px; position: relative; margin-left: 215px; margin-top: 6px;";
        }
        setMapLayerStyle();

        //div.style = "width: 88.5%; height: 98.8%; position: relative; margin-left: 215px; margin-top: 0.25%;";

        window.addEventListener("optimizedResize", function () {
            setMapLayerStyle();
        });
        
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

        var map = L.map(div, { layers: [googleMap] }).setView([0, 0], 2);

        L.Map.prototype.setCrs = function (newCrs) {
            this.options.crs = newCrs;
        }

        var baseMaps = {
            //"Яндекс": yndx,
            //"Яндекс спутник": ysat,
            //"Яндекс пробки": ytraffic,
            "Google": googleMap,
            "Google спутник": googleMapSat,
            "Open Streets": openStreetsMap
        };

        function setLayer(layer) {
            var centerPoint = map.getCenter();

            if (typeof layer.layer.options.crs != 'undefined') {
                map.setCrs(layer.layer.options.crs);
            }
            else {
                map.setCrs(L.CRS.EPSG3857);
            }
            map.setView(centerPoint, map.getZoom());
        }

        map.on('baselayerchange', setLayer);

        L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(map);

        this.map = map;         

        var markers = [];
        var mLayers = [];
        var iconHTML = ""; //this.getPropertyValue('markerProperty');
        var higligtedIconHTML = ""; //this.getPropertyValue('higlightedMarkerProperty');
        var popupHTML = ""; //this.getPropertyValue('popupProperty');
        var popupURL = ""; //this.getPropertyValue('popupURLProperty');
        var enableClustering = true; // this.getPropertyValue('enableClustering') == 'Include';
        var multipleClusterColors = false; // this.getPropertyValue('multipleClusterColors') == 'Include';
        var clusterRadius = 50; // this.getPropertyValue('clusterRadius');
        var startClusterLimit = 10; // this.getPropertyValue('startClusterLimit');

        var myURL = ""; //jQuery('script[src$="mapExtension.js"]').attr('src').replace('Scripts/dbe/mapExtension.js', '');
        var markerIconURL = "Content/images/icon-point-gas.png"; // this.getPropertyValue('markerURL');
        var highlightedMarkerIconURL = "Content/images/icon-point-gas-inverted.png"; //this.getPropertyValue('higlightedMarkerURL');
        var shadowURL = "Content/images/marker-shadow.png"; // this.getPropertyValue('markerShadowURL');

        var highlightedMarkers = [];

        var substituteValues = function (s, params) {
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

        var setMarkerIcon = function (marker, iconURL) {
            marker.setIcon(new L.Icon({
                iconUrl: iconURL,
                //iconSize: [25, 25],
                //shadowUrl: shadowURL,
                iconAnchor: [12, 41],
                popupAnchor: [0, -41]
                //shadowSize: [25, 10]            
            }));
        }

        var resetHighlightedMarkers = function () {
            for (var i = 0; i < highlightedMarkers.length; i++) {
                setMarkerIcon(highlightedMarkers[i], markerIconURL);
            }

            highlightedMarkers = [];
        }

        var loadjscssfile = function (filename, filetype) {
            if (filetype == "js") { //if filename is a external JavaScript file
                var fileref = document.createElement('script')
                fileref.setAttribute("type", "text/javascript")
                fileref.setAttribute("src", myURL + filename)
            }
            else if (filetype == "css") { //if filename is an external CSS file
                var fileref = document.createElement("link")
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", myURL + filename)
            }
            if (typeof fileref != "undefined")
                document.getElementsByTagName("head")[0].appendChild(fileref)
        }

        if (multipleClusterColors) {
            loadjscssfile("Content/MarkerCluster.Default.css", "css");
        } else {
            loadjscssfile("Content/MarkerCluster.Redefined.css", "css");
        }

        data.forEach(function (dataRow) {
            var latitude = dataRow.LATITUDE;
            var longitude = dataRow.LONGITUDE;
            var label = dataRow.ORG_NAME; // getPropertyValue(dataRow, 'customBindingLabel');
            var hint = dataRow.ORG_NAME; //getPropertyValue(dataRow, 'customBindingHint');
            //var extDims = getPropertyValue(dataRow, 'customBindingDimensions');

            if (typeof latitude != 'undefined' && latitude != null &&
                typeof longitude != 'undefined' && longitude != null) {

                marker = new L.marker([latitude, longitude]);

                if (popupHTML != "") {
                    marker.bindPopup(substituteValues(popupHTML, [label, hint]));
                } else if (popupURL != "") {
                    var template = '<iframe style="width:300px;height:300px;" src="' + popupURL + '" />"';
                    marker.bindPopup(substituteValues(template, [label, hint]));
                } else {
                    marker.bindPopup(hint);
                }

                setMarkerIcon(marker, markerIconURL);
                marker.options.dataRow = dataRow;

                markers.push(marker);
            }
        });

        if (this.markerLayer != null) {
            map.removeLayer(this.markerLayer);
        }

        if (enableClustering && markers.length >= startClusterLimit) {
            this.markerLayer = L.markerClusterGroup();
            this.markerLayer.options.maxClusterRadius = clusterRadius;
        } else {
            this.markerLayer = new L.featureGroup(markers);
        }

        for (var i = 0; i < markers.length; ++i) {
            if (iconHTML != "") {
                var popup = undefined;

                if (markers[i]._popup != undefined) {
                    popup = markers[i]._popup._content;
                }

                var m = L.marker([markers[i]._latlng.lat, markers[i]._latlng.lng], { dataRow: markers[i].options.dataRow });

                if (popup != undefined) {
                    m.bindPopup(popup);
                }

                setMarkerIcon(m, markerIconURL);

                this.markerLayer.addLayer(m);

                mLayers.push(m);
            } else {
                this.markerLayer.addLayer(markers[i]);
            }
        }

        map.addLayer(this.markerLayer);

        if (markers.length > 0) {
            setTimeout(function () { map.fitBounds(this.markerLayer.getBounds()); }.bind(this), 100);
        }

        if (markers.length == 0) {
            map.setView([0, 0], 2);
        }

        this.markerLayer.on("click", function (event) {
            var clickedMarker = event.layer;

            resetHighlightedMarkers();
            setMarkerIcon(clickedMarker, highlightedMarkerIconURL);
            highlightedMarkers.push(clickedMarker);
        });

        this.markerLayer.on("mouseover", function (event) {
            event.layer.openPopup();
        });
    }
}

/*MapView.prototype.createView = function (options) {
    var map = null;
    var markerLayer = null;
    var changeExisting = true;

    //var self = this;

    var map = this.map;

    if (this.map == null) {
        //options.frontLayer.empty();
        //options.frontLayer.height(this.contentHeight());
        //options.frontLayer.width(this.contentWidth());

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

        L.Map.prototype.setCrs = function (newCrs) {
            this.options.crs = newCrs;
        }

        /*var yndx = new L.Yandex();
        var ytraffic = new L.Yandex("null", { traffic: true, opacity: 1, overlay: false });
        var ysat = new L.Yandex("hybrid");
        var ypublic = new L.Yandex("publicMap");*/

        /*if (!changeExisting) {
            map = new L.map(options.frontLayer, { layers: [yndx] });
            this.map = map;
        }*/

        /*var baseMaps = {
            //"Яндекс": yndx,
            //"Яндекс спутник": ysat,
            //"Яндекс пробки": ytraffic,
            "Google": googleMap,
            "Google спутник": googleMapSat,
            "Open Streets": openStreetsMap
        };

        map.on('baselayerchange', function (layer) {
            var centerPoint = map.getCenter();

            if (typeof layer.layer.options.crs != 'undefined') {
                map.setCrs(layer.layer.options.crs);
            }
            else {
                map.setCrs(L.CRS.EPSG3857);
            }
            map.setView(centerPoint, map.getZoom());

        });

        L.control.layers(baseMaps, null, { position: 'bottomright' }).addTo(map);
    }

    var markers = [];
    var mLayers = [];
    var iconHTML = ""; //this.getPropertyValue('markerProperty');
    var higligtedIconHTML = ""; //this.getPropertyValue('higlightedMarkerProperty');
    var popupHTML = ""; //this.getPropertyValue('popupProperty');
    var popupURL = ""; //this.getPropertyValue('popupURLProperty');
    var enableClustering = true; // this.getPropertyValue('enableClustering') == 'Include';
    var multipleClusterColors = true; // this.getPropertyValue('multipleClusterColors') == 'Include';
    var clusterRadius = 50; // this.getPropertyValue('clusterRadius');
    var startClusterLimit = 10; // this.getPropertyValue('startClusterLimit');

    var myURL = ""; //jQuery('script[src$="mapExtension.js"]').attr('src').replace('Scripts/dbe/mapExtension.js', '');
    var markerIconURL = "Content/images/icon-point-gas.png"; // this.getPropertyValue('markerURL');
    var highlightedMarkerIconURL = "Content/images/icon-point-gas-inverted.png"; //this.getPropertyValue('higlightedMarkerURL');
    var shadowURL = "Content/images/marker-shadow.png"; // this.getPropertyValue('markerShadowURL');

    var highlightedMarkers = [];

    if (changeExisting) {
        this.clearMasterFilter.fire(this.model.componentName());
    }

    var substituteValues = function (s, params) {
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

    var setMarkerIcon = function (marker, iconURL) {
        marker.setIcon(new L.Icon({
            iconUrl: iconURL,
            //iconSize: [25, 25],
            //shadowUrl: shadowURL,
            iconAnchor: [12, 41],
            popupAnchor: [0, -41]
            //shadowSize: [25, 10]            
        }));
    }

    var resetHighlightedMarkers = function () {
        for (var i = 0; i < highlightedMarkers.length; i++) {
            setMarkerIcon(highlightedMarkers[i], markerIconURL);
        }

        highlightedMarkers = [];
    }

    var loadjscssfile = function (filename, filetype) {
        if (filetype == "js") { //if filename is a external JavaScript file
            var fileref = document.createElement('script')
            fileref.setAttribute("type", "text/javascript")
            fileref.setAttribute("src", myURL + filename)
        }
        else if (filetype == "css") { //if filename is an external CSS file
            var fileref = document.createElement("link")
            fileref.setAttribute("rel", "stylesheet")
            fileref.setAttribute("type", "text/css")
            fileref.setAttribute("href", myURL + filename)
        }
        if (typeof fileref != "undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref)
    }

    if (multipleClusterColors) {
        loadjscssfile("Content/images/MarkerCluster.Default.css", "css");
    } else {
        loadjscssfile("Content/images/MarkerCluster.Redefined.css", "css");
    }

    this.iterateData(function (dataRow) {
        var latitude = getPropertyValue(dataRow, 'customBindingLatitude');
        var longitude = getPropertyValue(dataRow, 'customBindingLongitude');
        var label = getPropertyValue(dataRow, 'customBindingLabel');
        var hint = getPropertyValue(dataRow, 'customBindingHint');
        var extDims = getPropertyValue(dataRow, 'customBindingDimensions');

        if (typeof latitude != 'undefined' && latitude != null &&
            typeof longitude != 'undefined' && longitude != null) {

            marker = new L.marker([latitude, longitude]);

            if (popupHTML != "") {
                marker.bindPopup(substituteValues(popupHTML, [label, hint, null, extDims]));
            } else if (popupURL != "") {
                var template = '<iframe style="width:300px;height:300px;" src="' + popupURL + '" />"';
                marker.bindPopup(substituteValues(template, [label, hint, null, extDims]));
            } else {
                marker.bindPopup(hint);
            }

            setMarkerIcon(marker, markerIconURL);
            marker.options.dataRow = dataRow;

            markers.push(marker);
        }
    });

    if (this.markerLayer != null) {
        map.removeLayer(this.markerLayer);
    }

    if (enableClustering && markers.length >= startClusterLimit) {
        this.markerLayer = L.markerClusterGroup();
        this.markerLayer.options.maxClusterRadius = clusterRadius;
    } else {
        this.markerLayer = new L.featureGroup(markers);
    }

    for (var i = 0; i < markers.length; ++i) {
        if (iconHTML != "") {
            var popup = undefined;

            if (markers[i]._popup != undefined) {
                popup = markers[i]._popup._content;
            }

            var m = L.marker([markers[i]._latlng.lat, markers[i]._latlng.lng], { dataRow: markers[i].options.dataRow });

            if (popup != undefined) {
                m.bindPopup(popup);
            }

            setMarkerIcon(m, markerIconURL);

            this.markerLayer.addLayer(m);

            mLayers.push(m);
        } else {
            this.markerLayer.addLayer(markers[i]);
        }
    }

    map.addLayer(this.markerLayer);

    if (markers.length > 0) {
        setTimeout(function () { map.fitBounds(this.markerLayer.getBounds()); }.bind(this), 100);
    }

    if (markers.length == 0) {
        map.setView([0, 0], 2);
    }

    this.markerLayer.on("click", function (event) {
        var clickedMarker = event.layer;

        resetHighlightedMarkers();
        setMarkerIcon(clickedMarker, highlightedMarkerIconURL);
        highlightedMarkers.push(clickedMarker);
    });

    this.markerLayer.on("mouseover", function (event) {
        event.layer.openPopup();
    });
}*/