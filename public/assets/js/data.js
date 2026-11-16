// Carregamento dos arquivos de dados

const DATA_READY = Promise.all([
    fetch("./data/catalog.json").then(response => {
        if (!response.ok) throw new Error("Falha ao carregar catalogData: " + response.status);
        return response.json();
    }),
    fetch("./data/categories.json").then(response => {
        if (!response.ok) throw new Error("Falha ao carregar categoriesData: " + response.status);
        return response.json();
    }),
    fetch("./data/shortcuts.json").then(response => {
        if (!response.ok) throw new Error("Falha ao carregar shortcutsData: " + response.status);
        return response.json();
    }),
    fetch("./data/equipment.json").then(response => {
        if (!response.ok) throw new Error("Falha ao carregar equipmentData: " + response.status);
        return response.json();
    }),
    fetch("./data/collection-points.json").then(response => {
        if (!response.ok) throw new Error("Falha ao carregar collectionPointsData: " + response.status);
        return response.json();
    }),
    fetch("./data/checklists.json").then(response => {
        if (!response.ok) throw new Error("Falha ao carregar checklistsData: " + response.status);
        return response.json();
    }),
    fetch("./data/news.json").then(response => {
        if (!response.ok) throw new Error("Falha ao carregar newsData: " + response.status);
        return response.json();
    }),
    fetch("./data/campaigns.json").then(response => {
        if (!response.ok) throw new Error("Falha ao carregar campaignsData: " + response.status);
        return response.json();
    }),
    fetch("./data/references.json").then(response => {
        if (!response.ok) throw new Error("Falha ao carregar referencesData: " + response.status);
        return response.json();
    })
]).then(data => {
    catalogData = data[0];
    categoriesData = data[1];
    shortcutsData = data[2];
    equipmentData = data[3];
    collectionPointsData = data[4];
    checklistsData = data[5];
    newsData = data[6];
    campaignsData = data[7];
    referencesData = data[8];
}).catch(error => {
    console.error("Falha ao carregar os dados da aplicação:", error);
    throw error;
});
