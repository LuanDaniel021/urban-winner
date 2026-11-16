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
]).then(([catalogData, categoriesData, shortcutsData, equipmentData, collectionPointsData, checklistsData, newsData, campaignsData, referencesData]) => {
    catalogData = catalogData;
    categoriesData = categoriesData;
    shortcutsData = shortcutsData;
    equipmentData = equipmentData;
    collectionPointsData = collectionPointsData;
    checklistsData = checklistsData;
    newsData = newsData;
    campaignsData = campaignsData;
    referencesData = referencesData;
}).catch(error => {
    console.error("Falha ao carregar os dados da aplicação:", error);
    throw error;
});
