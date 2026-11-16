// Configuração e carregamento dos arquivos de dados

const DATA_SOURCE = "./data";
const DATA_FILES = [
    "catalog.json",
    "categories.json",
    "shortcuts.json",
    "equipment.json",
    "collection-points.json",
    "checklists.json",
    "news.json",
    "campaigns.json",
    "references.json"
];

const DATA_READY = Promise.all(
    DATA_FILES.map(file =>
        fetch(`${DATA_SOURCE}/${file}`).then(response => {
            if (!response.ok) throw new Error(`Falha ao carregar ${file}: ${response.status}`);
            return response.json();
        })
    )
).then(data => {
    DATA_CATALOG = data[0];
    DATA_CATEGORIES = data[1];
    DATA_SHORTCUTS = data[2];
    DATA_EQUIPMENT = data[3];
    DATA_COLLECTION_POINTS = data[4];
    DATA_CHECKLISTS = data[5];
    DATA_NEWS = data[6];
    DATA_CAMPAIGNS = data[7];
    DATA_REFERENCES = data[8];
}).catch(error => {
    console.error("Falha ao carregar os dados da aplicação:", error);
    throw error;
});
