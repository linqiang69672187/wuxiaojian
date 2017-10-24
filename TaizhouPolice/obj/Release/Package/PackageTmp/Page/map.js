$(function () {
    var map;
    var markers;
    var currentPopup;

    AutoSizeAnchored = OpenLayers.Class(OpenLayers.Popup.Anchored, {
        'autoSize': true
    });
    setboxsize();//重置地图高度
    init();

})

function setboxsize() {
    var _h = document.documentElement.clientHeight;
    var _boxDom = document.getElementById("mapdraw");
     _boxDom.style.height=_h-75+'px';
    //_boxDom.style.height = _h + 'px';
}

function init() {

    map = new OpenLayers.Map('mapdraw', {
        maxExtent: mapExtent,
        displayProjection: new OpenLayers.Projection("EPSG:4326"), // 设置此显示投影参数后，显示坐标皆为4326
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.MousePosition(),
            new OpenLayers.Control.OverviewMap()
        ]
    });

   
    var baseLayer = new OpenLayers.Layer.ArcGISCacheExtent('ArcGISCache', baseUrl, {
        tileOrigin: agsTileOrigin,
        resolutions: mapResolutions,
        sphericalMercator: true,
        //maxExtent: mapExtent,
        useArcGISServer: false,
        isBaseLayer: true,
        type: imageType,
        projection: proj,
        resolutionIndex: resolutionIndex
    });
    map.addLayers([baseLayer]);
 
    map.zoomToExtent(mapExtent);

    var coor = new OpenLayers.LonLat([121.41071, 28.49096]);
  
    //var coor = OpenLayers.proj.transform([121.30234, 28.51407], 'EPSG:4326', 'EPSG:3857');

    map.setCenter(coor.transform('EPSG:4326', 'EPSG:3857'),13);

  
   
    // ===创建用户自定义地标===
    markers = new OpenLayers.Layer.Markers("地标");
    map.addLayer(markers);
  

    // 增加鹰眼控件
    var overview = new OpenLayers.Control.OverviewMap({
        maximized: true
    });
    map.addControl(overview);

    // 增加鼠标实时坐标控件
    var mp = new OpenLayers.Control.MousePosition();
    map.addControl(mp);
    // 设置控件位置为左下角
    mp.div.style.bottom = "10px";
    mp.div.style.left = "10px";

    // 配置绘制的点线面样式
    

   // document.getElementById('noneToggle').checked = true;
}




