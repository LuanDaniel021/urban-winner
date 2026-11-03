# Mapa de pontos de coleta

Este documento descreve o uso de `public/js/map-leaflet-.js`. Ele cria um mapa Leaflet e adiciona um marcador para cada ponto definido no próprio arquivo.

## Pré-requisitos

- O Leaflet 1.9.4 deve estar carregado antes do script do mapa. O script espera encontrar a variável global `L`.
- A página deve conter um elemento com `id="map"`.
- O elemento do mapa precisa ter largura e altura definidas. O estilo atual em `public/style.css` dá ao `#map` altura de 500 px e largura de 100%.
- A página precisa de acesso à internet para carregar a biblioteca, os ícones externos e os tiles do OpenStreetMap.
- O Leaflet documenta que algumas credenciais devem ser usadas por sergurança, sem elas pode ocorrer alguns bugs, elas ja estao presentes no `index.html`.

## Como usar

No HTML, coloque o contêiner do mapa no ponto da página em que ele deve aparecer:

```html
<div id="map"></div>
```

Carregue o script do mapa depois do Leaflet. Com `defer`, mantenha a ordem dos scripts:

```html
<script defer src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script defer src="js/map-leaflet-.js"></script>
```

Abra a página por um servidor HTTP estático na pasta `public`. Depois que os scripts carregarem, o mapa e os marcadores são criados automaticamente; não é necessário chamar uma função de inicialização.

## Pontos de coleta

Os dados são mantidos no array `locais`, dentro de `public/js/map-leaflet-.js`. Para incluir ou editar um ponto, use um objeto com esta estrutura:

```js
{
	icon: icon,
	nome: "Nome do ponto",
	urls: {
		google: "https://exemplo.com/link-google",
		maps: "https://exemplo.com/link-maps"
	},
	lat: -26.2328,
	lng: -51.0876,
	endereco: "Rua, número, bairro, cidade - UF"
}
```

Use coordenadas geográficas em graus decimais: `lat` é a latitude e `lng` é a longitude (o `endereco` tambem pode ser usado, mas precisa passar para formato de url). O campo `icon` deve ser um ícone criado pelo Leaflet, como o `icon` já configurado no início do arquivo. `urls.google` e `urls.maps` são usados diretamente nos links do popup e devem estar definidos.

Atualmente, o popup mostra o nome do ponto e links para gerar rotas pelo Google Maps, abrir o link de `urls.maps` e abrir o link de `urls.google`. Embora `descricao` e `endereco` estejam nos dados do ponto atual, eles ainda não são exibidos. Os textos dos locais são interpolados em HTML; mantenha-os como conteúdo confiável.

## Comportamento atual

- O mapa começa centralizado nas coordenadas do ponto atual da Praça Central, com zoom 6.
- O fundo usa tiles do OpenStreetMap, com zoom máximo 19 e atribuição visível.
- Cada item de `locais` recebe um marcador e um popup com links externos, abertos em outra aba.
- Os dados e a inicialização estão no escopo global do script. O arquivo não exporta funções nem oferece uma API para atualizar os pontos depois da carga.

