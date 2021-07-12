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
        'Parroquia ' + props.PARROQUIA + '<br />' + 
        'Proyección población 2020 ' + props.Pob2020_Pr.toFixed(0)  + '<br />' +  '<br />' + 
        
        '<b>Vivienda </b>' + '<br />' +
        'Vivienda adecuada: ' + props.MAT_ADE.toFixed(0) + ' %' + '<br />' +
        'Espacio vital suficiente: ' + props.ESP_VIT.toFixed(0) + ' %' + '<br />' +
        'Agua mejorada: ' + props.A_ACU.toFixed(0) + ' %' + '<br />' +
        'Saneamiento: ' + props.A_ALC.toFixed(0) + ' %' + '<br />' +
        'Electricidad: ' + props.A_ELEC.toFixed(0) + ' %' + '<br />' +
        'Internet: 56.1 %' + '<br />' + 
        'Dependencia económica: ' + props.D_ECONO.toFixed(2)  + '<br />' +  '<br />' +  

        '<b>Salud</b>' + '<br />' +
        'Proximidad centros de salud: ' + props.DxP_Salud.toFixed(0) + ' m' + '<br />' +
        'Concentración de Pm10: ' + props.PM10.toFixed(2) + ' µg/m3' +  '<br />' +   
        'Contaminación residuos sólidos: ' + props.CON_SOL.toFixed(2) + ' %' + '<br />' + 
        'Esperanza de vida al nacer: 78.3 años' + '<br />' +  '<br />' +   
        
        '<b>Educación, cultura y diversidad </b>' + '<br />' +
        'Proximidad equipamientos culturales: ' + props.DxP_Cult.toFixed(0) + ' m' + '<br />' +
        'Proximidad equipamientos educativos: ' + props.DxP_Educa.toFixed(0) + ' m' + '<br />' +
        'Diversidad tenencia: ' + props.MIX_TENE.toFixed(2) + '/1.61' + '<br />' +
        'Diversidad nivel educativo: ' + props.MIX_EDU.toFixed(2) +'/1.61' +  '<br />' +
        'Diversidad edades: ' + props.MIX_EDAD.toFixed(2) + '/1.79' + '<br />' +
        'Diversidad etnias y razas: ' + props.MIX_ETNIA.toFixed(2) + '/2.08' +'<br />' +
        'Brecha género años promedio educación: ' + props.BRECHA_E.toFixed(2) + '<br />' +
        'Años promedio educación: ' + props.ESC_ANOS.toFixed(0) + ' años'+ '<br />' +  '<br />' +  
        
        '<b>Espacios públicos, seguridad y recreación </b>' + '<br />' +
        'Proximidad espacio público: ' + props.DxP_Parqu.toFixed(0) + ' m' + '<br />' +
        'M² per capita de espacio público: ' + props.M2_EP_CA.toFixed(2) + '<br />' +
        'Densidad poblacional: ' + props.Densid2020.toFixed(2) + '<br />' +
        'Tasa de hurtos x 100mil habitantes: ' + props.Tasa_Hurto.toFixed(1) + '<br />' +
        'Tasa de homicidios x 100mil habitantes: ' + props.Tasa_Homic.toFixed(1) + '<br />' +
        'Diversidad usos del suelo: ' + props.Shannon.toFixed(2) + '/1.61' +'<br />' + '<br />' +

        '<b>Oportunidades económicas </b>' + '<br />' +
        'Proximidad unidades servicios y comerciales: ' + props.DxP_Comer.toFixed(0) + ' m' + '<br />' +
        'Desempleo: ' + props.T_DESEMP.toFixed(0) + ' %' + '<br />' +
        'Empleo: ' + props.EMPLEO.toFixed(0) + ' %' + '<br />' +
        'Desempleo juvenil: ' + props.DESEM_JUVE.toFixed(0) + ' %' + '<br />' +
        'Brecha género desempleo: ' + props.BRECHA_D.toFixed(2)  : 'Seleccione una manzana');
  
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
        subtitle: "Distancia en metros con factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 300</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>301 - 500</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>501 - 1000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>1001 - 2000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>2001 - 3942</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Gobierno Abierto de Quito 2020",
    },
    DxP_Educa: {
        title: "Proximidad equipamientos de educación",
        subtitle: "Distancia en metros con factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 150</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>101 - 300</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>301 - 500</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>501 - 800</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>801 - 1882</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Gobierno Abierto de Quito 2020",
    },
    DxP_Parqu: {
        title: "Proximidad espacio público",
        subtitle: "Distancia en metros con factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 150</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>101 - 300</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>301 - 500</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>501 - 800</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>801 - 1812</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Gobierno Abierto de Quito 2020",
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
        elem8: "Secretaría de Ambiente de Quito Red Metropolitana de Monitoreo Ambiental REMMAQ 2020",
    },
    MAT_ADE: {
        title: "Vivienda adecuada",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>98 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>93 - 97</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>86 - 92</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>76 - 85</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>50 - 75</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    ESP_VIT: {
        title: "Espacio vital suficiente",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>98 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>96 - 97</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>92 - 95</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>86 - 91</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>72 - 85</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    A_ACU: {
        title: "Acceso a agua mejorada",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>99.88 - 100.00</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>99.43 - 99.87</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>98.51 - 99.42</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>95.73 - 98.50</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>93.26 - 95.72</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    A_ALC: {
        title: "Acceso a saneamiento",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>99.88 - 100.00</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>95.86 - 98.87</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>90.08 - 95.85</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>77.61 - 90.07</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>57.88 - 77.60</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    A_ELEC: {
        title: "Acceso a electricidad",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>99.60 - 100.00</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>98.81 - 99.59</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>97.51 - 99.80</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>95.52 - 97.50</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>92.88 - 95.51</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    D_ECONO: {
        title: "Dependencia económica",
        subtitle: "Población/Población ocupada",
        elem1: '<div><span  style= "color:#1a9641">▉</span>1.5 - 2.1</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>2.2 - 2.4</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>2.5 - 2.7</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>2.8 - 3.5</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>3.6 - 4.6</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    CON_SOL: {
        title: "Contaminación residuos sólidos",
        subtitle: "% de Viviendas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.00 - 0.24</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.25 - 0.88</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.89 - 1.89</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>1.90 - 3.48</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>3.49 - 6.98</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    DxP_Cult: {
        title: "Proximidad equipamientos culturales",
        subtitle: "Distancia en metros con factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 2000</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>2001 - 5000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>5001 - 10000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>10001 - 24370</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Gobierno Abierto de Quito 2020",
    },
    MIX_TENE: {
        title: "Diversidad tenencia",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por manzana",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.89 - 1.08</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.79 - 0.88</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.70 - 0.78</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.53 - 0.69</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.13 - 0.52</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    MIX_ETNIA: {
        title: "Diversidad etnias y razas",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por manzana",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.51 - 0.82</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.38 - 0.50</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.28 - 0.37</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.19 - 0.27</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.00 - 0.18</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    MIX_EDAD: {
        title: "Diversidad edades",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por manzana",
        elem1: '<div><span  style= "color:#1a9641">▉</span>1.47 - 1.65</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1.39 - 1.46</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>1.30 - 1.38</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>1.12 - 1.29</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.59 - 1.11</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    MIX_EDU: {
        title: "Diversidad nivel educativo",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por manzana",
        elem1: '<div><span  style= "color:#1a9641">▉</span>1.15 - 1.35</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1.06 - 1.14</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.98 - 1.05</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.88 - 0.97</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.57 - 0.87</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    BRECHA_E: {
        title: "Brecha género años promedio educación",
        subtitle: "Relación años promedio educación de mujeres y hombres", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.52 - 0.79</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.80 - 0.89</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.90 - 0.96</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.97 - 1.09</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>1.10 - 1.64</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    ESC_ANOS: {
        title: "Años promedio educación",
        subtitle: "Años",
        elem1: '<div><span  style= "color:#1a9641">▉</span>13.79 - 17.27</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>12.35 - 13.78</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>11.02 - 12.34</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>9.32 - 11.01</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>4.24 - 9.31</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    M2_EP_CA: {
        title: "M² per capita de espacio público",
        subtitle: "m²/habitante",
        elem1: '<div><span  style= "color:#1a9641">▉</span>Mayor 14</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>11 - 14</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>5 - 10</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3 - 4</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 2</div>',
        elem6: '',
        elem7: '',
        elem8: "Gobierno Abierto de Quito 2020",
    },
    Densid2020: {
        title: "Densidad residencial",
        subtitle: "Población proyectada año 2020 x hectárea", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 146</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>147 - 353</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>354 - 645</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>646 - 1830</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>1831 - 4593</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo de Población y Vivienda 2010",
    },
    Tasa_Hurto: {
        title: "Tasa de hurtos",
        subtitle: "Hurtos x 100mil habitantes",
        elem1: '<div><span  style= "color:#1a9641">▉</span>169.3 - 395.5</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>395.6 - 716.2</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>716.3 - 1256.4</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>1256.5 - 2357.0</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>2357.1 - 4856.9</div>',
        elem6: '',
        elem7: '',
        elem8: "Observatorio Metropolitano de Seguridad Ciudadana 2019",
    },
    Tasa_Homic: {
        title: "Tasa de homicidios",
        subtitle: "Homicidios x 100mil habitantes",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.0 - 1.5</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1.6 - 4.0</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>4.1 - 7.3</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>7.4 - 12.0</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>12.1 - 23.2</div>',
        elem6: '',
        elem7: '',
        elem8: "Observatorio Metropolitano de Seguridad Ciudadana 2019",
    },
    Shannon: {
        title: "Diversidad usos del suelo",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por manzana",
        elem1: '<div><span  style= "color:#1a9641">▉</span>1.15 - 1.79</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.94 - 1.14</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.75 - 0.93</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.52 - 0.74</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.00 - 0.51</div>',
        elem6: '',
        elem7: '',
        elem8: "Plan de Uso y Ocupación del Suelo 2020",
    },
    DxP_Comer: {
        title: "Proximidad zonas de interés económico (servicios y comercio)",
        subtitle: "Distancia en metros con factor de inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 1500</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>1501 - 3000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3001 - 5000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>5001 - 7920</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Licencia Metropolitana Única para el Ejercicio de Actividades Económicas 2020 - LUAE  es el permiso de funcionamiento que otorga el GAD del Distrito Metropolitano de Quito, al desarrollo de actividades económicas en un establecimiento ubicado en el Distrito Metropolitano de Quito.",
    },
    T_DESEMP: {
        title: "Tasa de desempleo",
        subtitle: "% Personas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 5</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>6 - 8</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>9 - 12</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>13 - 19</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>20 - 33</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    EMPLEO: {
        title: "Empleo",
        subtitle: "% Personas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>64 - 86</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>59 - 63</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>55 - 58</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>48 - 54</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>31 - 47</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    DESEM_JUVE: {
        title: "Desempleo juvenil",
        subtitle: "% Personas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 9</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>10 - 18</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>19 - 32</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>33 - 59</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>60 - 100</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    BRECHA_D: {
        title: "Brecha de género desempleo",
        subtitle: "Relación desempleo de mujeres y hombres",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.00 - 0.24</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.25 - 0.50</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.51 - 0.91</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.92 - 1.61</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>1.62 - 4.26</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
}

var indi = L.geoJson(Manzana, {
    style: legends.Densid2020,
}).addTo(map);

var currentStyle = 'Densid2020';

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
    else if (currentStyle === 'MAT_ADE') {
        return d > 97 ? '#1a9641' :
            d > 92 ? '#a6d96a' :
                d > 85 ? '#f4f466' :
                    d > 75 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'ESP_VIT') {
        return d > 97 ? '#1a9641' :
            d > 95 ? '#a6d96a' :
                d > 91 ? '#f4f466' :
                    d > 85 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'A_ACU') {
        return d > 99.87 ? '#1a9641' :
            d > 99.42 ? '#a6d96a' :
                d > 98.50 ? '#f4f466' :
                    d > 95.72 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'A_ALC') {
        return d > 99.87 ? '#1a9641' :
            d > 95.85 ? '#a6d96a' :
                d > 90.07 ? '#f4f466' :
                    d > 77.6 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'A_ELEC') {
        return d > 99.59 ? '#1a9641' :
            d > 98.80 ? '#a6d96a' :
                d > 97.50 ? '#f4f466' :
                    d > 95.51 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'D_ECONO') {
        return d > 3.5 ? '#d7191c' :
            d > 2.7 ? '#fdae61' :
                d > 2.4 ? '#f4f466' :
                    d > 2.1 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'PM10') {
        return d > 45 ? '#d7191c' :
            d > 43 ? '#fdae61' :
                d > 40 ? '#f4f466' :
                    d > 39 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'CON_SOL') {
        return d > 3.48 ? '#d7191c' :
            d > 1.89 ? '#fdae61' :
                d > 0.88 ? '#f4f466' :
                    d > 0.24 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'DxP_Cult') {
        return d > 10000 ? '#d7191c' :
            d > 5000 ? '#fdae61' :
                d > 2000 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'MIX_TENE') {
        return d > 0.88 ? '#1a9641' :
            d > 0.78 ? '#a6d96a' :
                d > 0.69 ? '#f4f466' :
                    d > 0.52 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'MIX_ETNIA') {
        return d > 0.50 ? '#1a9641' :
            d > 0.37 ? '#a6d96a' :
                d > 0.27 ? '#f4f466' :
                    d > 0.18 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'MIX_EDAD') {
        return d > 1.46 ? '#1a9641' :
            d > 1.38 ? '#a6d96a' :
                d > 1.29 ? '#f4f466' :
                    d > 1.11 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'MIX_EDU') {
        return d > 1.14 ? '#1a9641' :
            d > 1.05 ? '#a6d96a' :
                d > 0.97 ? '#f4f466' :
                    d > 0.87 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'BRECHA_E') {
        return d > 1.09 ?  '#d7191c':
            d > 0.96 ? '#fdae61' :
                d > 0.89 ? '#f4f466' :
                    d > 0.79 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'ESC_ANOS') {
        return d > 13.78 ? '#1a9641' :
            d > 12.34 ? '#a6d96a' :
                d > 11.01 ? '#f4f466' :
                    d > 9.31 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'M2_EP_CA') {
        return d > 14 ? '#1a9641' :
            d > 10 ? '#a6d96a' :
                d > 4 ? '#f4f466' :
                    d > 2 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'Densid2020') {
        return d > 1830 ?  '#d7191c':
            d > 645 ? '#fdae61' :
                d > 353 ? '#f4f466' :
                    d > 146 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'Tasa_Hurto') {
        return d > 2357 ?  '#d7191c':
            d > 1256.4 ? '#fdae61' :
                d > 716.2 ? '#f4f466' :
                    d > 395.5 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'Tasa_Homic') {
        return d > 12 ?  '#d7191c':
            d > 7.3 ? '#fdae61' :
                d > 4 ? '#f4f466' :
                    d > 1.5 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'Shannon') {
        return d > 1.14 ? '#1a9641' :
            d > 0.93 ? '#a6d96a' :
                d > 0.74 ? '#f4f466' :
                    d > 0.51 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'DxP_Comer') {
        return d > 5000 ?  '#d7191c':
            d > 3000 ? '#fdae61' :
                d > 1500 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'T_DESEMP') {
        return d > 19 ?  '#d7191c':
            d > 12 ? '#fdae61' :
                d > 8 ? '#f4f466' :
                    d > 5 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'EMPLEO') {
        return d > 63 ?  '#d7191c':
            d > 58 ? '#fdae61' :
                d > 54 ? '#f4f466' :
                    d > 47 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'DESEM_JUVE') {
        return d > 59 ?  '#d7191c':
            d > 32 ? '#fdae61' :
                d > 18 ? '#f4f466' :
                    d > 9 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'BRECHA_D') {
        return d > 1.61 ?  '#d7191c':
            d > 0.91 ? '#fdae61' :
                d > 0.50 ? '#f4f466' :
                    d > 0.24 ? '#a6d96a' :
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
changeIndi({value: 'Densid2020'});

function popupText(feature, layer) {
    layer.bindPopup('Parroquia ' + feature.properties.PARROQUIA + '<br />')
}
