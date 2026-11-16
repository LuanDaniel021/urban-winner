const DATA_READY = Promise.all(
    DATA_FILES.map(async file => {
        const response = await fetch(`${DATA_SOURCE}/${file}`);
        if (!response.ok) {
            throw new Error(`Falha ao carregar ${file}: ${response.status}`);
        }
        return [file, await response.json()];
    })
)
.then(
    files => {
        const data = Object.fromEntries(files);

        DATA_CATALOG           = data["catalog.json"];
        DATA_CATEGORIES        = data["categories.json"];
        DATA_SHORTCUTS         = data["shortcuts.json"];
        DATA_EQUIPAMENT        = data["equipment.json"];
        DATA_COLLECTION_POINTS = data["collection-points.json"];
        DATA_CHECKLISTS        = data["checklists.json"];
        DATA_NEWS              = data["news.json"];
        DATA_CAMPAIGNS         = data["campaigns.json"];
        DATA_REFERENCES        = data["references.json"];
    }
)
.catch(
    error => {
        console.error(
            "Falha ao carregar os dados da aplicação:", error
        );
        throw error;
    }
);
