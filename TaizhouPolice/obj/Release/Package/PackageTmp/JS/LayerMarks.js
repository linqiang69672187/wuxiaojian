$(function () {
   

    
   // setInterval("loadmarks()", 1500);



});

function loadmarks() {
    var bounds = ol.proj.transformExtent(map.getView().calculateExtent(map.getSize()), 'EPSG:3857', 'EPSG:4326').toString();

    $.ajax({
        type: "POST",
        url: "../Handle/GetaMarksbyBound.ashx",
        data: { 'bounds': bounds },
        dataType: "json",
        success: function (data) {
            if (data.r == "0") {
                addmarks(data.result);
               
            }
        },
        error: function (msg) {
            console.debug("错误:ajax");
            
        }
    });

}
var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point([0,0]),   //121.41071, 28.49096
    name: 'Null Island',
    population: 4000,
    rainfall: 500
});

var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'https://openlayers.org/en/v4.1.0/examples/data/icon.png'
    }))
});


iconFeature.setStyle(iconStyle);
var vectorSource = new ol.source.Vector({
    features: [iconFeature] //add an array of features
});



var vectorLayer = new ol.layer.Vector({
    source: vectorSource

});

map.addLayer(vectorLayer);


map.on('click', function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
            return feature;
        });
    if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        var pixel = map.getPixelFromCoordinate(coordinates);
      
        $(".zq1").show();
        $(".zq1").css("left", pixel[0] + "px");
        $(".zq1").css("top", pixel[1] + "px");
     
    } else {
    
        $(".zq1").hide();
        $(".table .localtd").removeClass("localtd"); //移出定位
    }
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
    if (e.dragging) {
        $(".zq1").hide();
        $(".table .localtd").removeClass("localtd"); //移出定位
       return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});




function addmarks(points) {
    var features = vectorLayer.getSource().getFeatures();
    var featurein = false;
    for (var f = 0; f < features.length; f++) {
        featurein = false
        feature = features[f];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            
            if (feature.getId() == point.ID) {
                feature.setGeometry(new ol.geom.Point(ol.proj.transform([parseFloat(point.La), parseFloat(point.Lo)], 'EPSG:4326', 'EPSG:3857')));
                featurein = true;
               
               points.splice(i, 1);
                i = points.length;
            }
        }
        if (!featurein) { vectorLayer.getSource().removeFeature(features[f]); }

    }

    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([parseFloat(point.La), parseFloat(point.Lo)], 'EPSG:4326', 'EPSG:3857')),
            name:point.ID
        });
        iconFeature.setStyle(iconStyle);
        iconFeature.setId(point.ID);
        iconFeature.on()

        vectorLayer.getSource().addFeature(iconFeature);

    }

}