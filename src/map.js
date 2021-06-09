// Create variable to hold map element, give initial settings to map
var map = L.map('map', {
    center: [-0.22, -78.51],
    zoom: 11,
    minZoom: 11,
    scrollWheelZoom: false,
});

map.once('focus', function() { map.scrollWheelZoom.enable(); });

L.easyButton('<img src="images/fullscreen.png">', function (btn, map) {
    var cucu = [-0.22, -78.51];
    map.setView(cucu, 11);
}).addTo(map);

var esriAerialUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services' +
    '/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var esriAerialAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, ' +
    'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the' +
    ' GIS User Community';
var esriAerial = new L.TileLayer(esriAerialUrl,
    {maxZoom: 18, attribution: esriAerialAttrib}).addTo(map);


var opens = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
});


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = (props ?
        'Parroquia ' + props.PARROQUI_1 + '<br />' + 
        'Personas '+ props.PARROQUI_1 +': '+ props.POB_2019 + '<br />' +  '<br />' + 

        '<b>Salud</b>' + '<br />' +
        'Proximidad centros de salud: ' + props.DxP_Salud.toFixed(0) + ' m' + '<br />' +
        'Concentración de Pm10: ' + props.PM10.toFixed(0) + ' µg/m3' +  '<br />' + '<br />' +      
        
        '<b>Educación, cultura y diversidad </b>' + '<br />' +
        'Proximidad equipamientos educativos: ' + props.DxP_Educa.toFixed(0) + ' m' + '<br />' +   '<br />' + 
        
        '<b>Espacios públicos, seguridad y recreación </b>' + '<br />' +
        'Proximidad espacio público: ' + props.DxP_Parqu.toFixed(0) + ' m' + '<br />' +
        'Densidad poblacional '+ props.PARROQUI_1 +': ' + props.DenPob2019.toFixed(0)  : 'Seleccione una manzana');
};
info.addTo(map);

function stylec(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0,
        dashArray: '3',
    };
}

var loc = L.geoJson(localidad, {
    style: stylec,
    onEachFeature: popupText,
}).addTo(map);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'black',
        dashArray: '',
        fillColor: false
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var manzanas;

function resetHighlight(e) {
    manzanas.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function style(feature) {
    return {
        weight: 0.6,
        opacity: 0.5,
        color: '#ffffff00',
        fillOpacity: 0,
    };
}


function changeLegend(props) {
    var _legend = document.getElementById('legend'); // create a div with a class "info"
    _legend.innerHTML = (props ?
        `<p style="font-size: 11px"><strong>${props.title}</strong></p>
            <p>${props.subtitle}</p>
            <p id='colors'>
                ${props.elem1}
                ${props.elem2}
                ${props.elem3}
                ${props.elem4}
                ${props.elem5}
                ${props.elem6}
                ${props.elem7}<br>
                <span style='color:#000000'>Fuente: </span>${props.elem8}<br>
            </p>` :
        `<p style="font-size: 12px"><strong>Área urbana</strong></p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>Manzanas<br>
            </p>`);
}

var legends = {
    DxP_Salud: {
        title: "Proximidad equipamientos de salud",
        subtitle: "Distancia en m x Factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 300</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>301 - 500</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>501 - 1000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>1001 - 2000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>2001 - 3942</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Gobierno Abierto de Quito",
    },
    DxP_Educa: {
        title: "Proximidad equipamientos de educación",
        subtitle: "Distancia en m x Factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 150</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>101 - 300</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>301 - 500</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>501 - 800</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>801 - 1882</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Gobierno Abierto de Quito",
    },
    DxP_Parqu: {
        title: "Proximidad espacio público",
        subtitle: "Distancia en m x Factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 150</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>101 - 300</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>301 - 500</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>501 - 800</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>801 - 1812</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Gobierno Abierto de Quito",
    },
    PM10: {
        title: "Concentración Pm10",
        subtitle: "µg/m3",
        elem1: '<div><span  style= "color:#1a9641">▉</span>37 - 38</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>39 - 40</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>41 - 42</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>43 - 44</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>45 - 46</div>',
        elem6: ' ',
        elem7: ' ',
        elem8: "Gobierno Abierto de Quito",
    },
    DenPob2019: {
        title: "Densidad poblacional",
        subtitle: "Población x km2", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>1928 - 5000</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>5001 - 6500</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>6501 - 7000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>7001 - 15000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>15001 - 21574</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Proyección de Población 2019",
    },
}

var indi = L.geoJson(Manzana, {
    style: legends.DxP_Salud,
}).addTo(map);

var currentStyle = 'DxP_Salud';

manzanas = L.geoJson(Manzana, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


function setProColor(d) {
    if (currentStyle === 'DxP_Salud') {
        return d > 2000 ? '#d7191c' :
            d > 1000 ? '#fdae61' :
                d > 500 ? '#f4f466' :
                    d > 300 ? '#a6d96a' :
                    '#1a9641';
    }else if (currentStyle === 'DxP_Educa') {
        return d > 800 ? '#d7191c' :
            d > 500 ? '#fdae61' :
                d > 300 ? '#f4f466' :
                    d > 150 ? '#a6d96a' :
                    '#1a9641';
    } 
    else if (currentStyle === 'DxP_Parqu') {
        return d > 800 ? '#d7191c' :
            d > 500 ? '#fdae61' :
                d > 300 ? '#f4f466' :
                    d > 150 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'DenPob2019') {
        return d > 15000 ? '#d7191c' :
            d > 7000 ? '#fdae61' :
                d > 6500 ? '#f4f466' :
                    d > 5000 ? '#a6d96a' :
                    '#1a9641';
    }
    else {
        return d > 44 ? '#d7191c' :
            d > 42 ? '#fdae61' :
                d > 40 ? '#f4f466' :
                    d > 38 ? '#a6d96a' :
                    '#1a9641';
    }

}


function fillColor(feature) {
    return {
        fillColor:  setProColor(feature.properties[currentStyle]),
        weight: 0.6,
        opacity: 0.1,
        color: (currentStyle) ? '#ffffff00' : '#c3bfc2', 
        fillOpacity: (currentStyle) ? 0.9 : 0.5,
    };
}

function changeIndi(style) {
    currentStyle = style.value;
    indi.setStyle(fillColor);
    changeLegend((style.value && legends[style.value]) ? legends[style.value] :
        {
            
        });
}

var baseMaps = {
    'Esri Satellite': esriAerial,
    'Open Street Map': opens

};

// Defines the overlay maps. For now this variable is empty, because we haven't created any overlay layers
var overlayMaps = {
    //'Comunas': comu,
    //'Límite fronterizo con Venezuela': lim
};

// Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {
    collapsed: true,
});
map.addControl(layersControl);
changeIndi({value: 'DxP_Salud'});

function popupText(feature, layer) {
    layer.bindPopup('Municipio ' + feature.properties.NAME + '<br />')
}
