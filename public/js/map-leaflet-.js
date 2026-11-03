
const map = L.map( 'map' );

const icon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [ 32, 32 ],
    iconAnchor: [ 16, 32 ],
    popupAnchor: [ 0, -32 ]
})

const locais = [

    {
        icon:icon,
        nome: "Praça Central",
        urls: {
            google: `https://share.google/HpTn32b686Hx5Aeci`,
            maps: `https://maps.app.goo.gl/1WcELNENGEawoQJd6`,
        },
        lat: -26.23282955230355,
        lng: -51.08762808776898,
        descricao: "Ponto de coleta de lixo eletrônico na Praça Central.",
        endereco: `R. Carlos Cavalcante, 273 - Centro, União da Vitória - PR, 84600-130`,
    },

]

map.setView( [ -26.23282955230355, -51.08762808776898 ], 6 );

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }
).addTo( map );

locais.forEach(
    ( local ) => {

        const marker = L.marker( [ local.lat, local.lng ], { icon: local.icon } ).addTo( map );

        marker.bindPopup( `
            <b>${local.nome}</b><br>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${local.lat},${local.lng}"
                target="_blank"
                rel="noopener noreferrer"
            >Visualizar rotas</a>

            <a href="${local.urls.maps}"
                target="_blank"
                rel="noopener noreferrer"
            >Visualizar maps</a>

            <a href="${local.urls.google}"
                target="_blank"
                rel="noopener noreferrer"
            >Visualizar google</a>

        ` );

    }
);