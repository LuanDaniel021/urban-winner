
(async () => {
    await DATA_READY;

//#region : INTERFACE - MODAIS, PAINÉIS E OVERLAY


function cloneTemplate(id) {
    const template = document.getElementById(id);
    if (!template) throw new Error(`Template não encontrado: ${id}`);
    return template.content.cloneNode(true);
}

function normalizeText(value) {
    return String(value ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function getCatalogCategories() {
    return DATA_CATALOG.categoryIds.map(id => ({
        id,
        ...DATA_CATEGORIES.categories[id]
    }));
}

function getCategoryEquipment(categoryId) {
    const itemIds = new Set();

    DATA_CATEGORIES.categories[categoryId].shortcutIds.forEach(shortcutId => {
        DATA_SHORTCUTS.shortcuts[shortcutId].itemIds.forEach(id => itemIds.add(id));
    });

    return [...itemIds].map(id => ({
        id,
        ...DATA_EQUIPMENT.items[id]
    }));
}


function updateOverlay() {
    const active = Boolean(DRAWER || MODAL);
    OVERLAY.classList.toggle("open", active);
    document.body.style.overflow = active ? "hidden" : "";
}

function closeActive() {
    if (DRAWER) closeDrawer(DRAWER);
    if (MODAL) closeModal(MODAL);
}

function openDrawer(drawer) {
    closeActive();
    DRAWER = drawer;
    drawer.classList.add("open");
    updateOverlay();
}

function closeDrawer(drawer) {
    if (drawer !== DRAWER) return;
    drawer.classList.remove("open");
    DRAWER = null;
    updateOverlay();
}

function openModal(modal) {
    closeActive();
    MODAL = modal;
    modal.classList.add("open");
    updateOverlay();
}

function closeModal(modal) {
    if (modal !== MODAL) return;
    modal.classList.remove("open");
    const iframe = modal.querySelector("iframe");
    if (iframe) iframe.src = "";
    MODAL = null;
    updateOverlay();
}

document.querySelectorAll(".drawer").forEach(drawer => {
    drawer.querySelector(".drawer-close")?.addEventListener("click", () => closeDrawer(drawer));
});

document.querySelectorAll(".modal").forEach(modal => {
    modal.querySelector(".modal-close")?.addEventListener("click", () => closeModal(modal));
});

OVERLAY.addEventListener("click", closeActive);
document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeActive();
});
//#endregion

//#region : CATÁLOGO E DETALHES DE EQUIPAMENTOS
const selectedEquipmentItems = new Map();
{
    const search = document.getElementById("search");
    const detailDrawer = document.getElementById("equipmentDetailDrawer");
    const filters = document.querySelector(".filters");
    const grid = document.getElementById("equipmentGrid");
    const emptyState = document.getElementById("catalogEmptyState");
    const resultCount = document.getElementById("catalogResultCount");
    const simpleToggle = document.getElementById("catalogSimpleToggle");
    const catalogSelectionCount = document.getElementById("catalogSelectionCount");
    const sendCatalogSelection = document.getElementById("sendCatalogSelection");
    const catalogSelectionActions = document.querySelector(".catalog-selection-actions");
    let categories = [];
    let shortcuts = [];
    let activeFilter = "todos";
    let catalogMode = "simple";
    let shortcutFilterIds = null;
    let currentShortcut = null;

    function getGuidance(category) {
        return category.guidance || {
            emoji: category.emoji || "♻️",
            description: "Equipamentos elétricos e eletrônicos desta categoria.",
            tip: "Desligue o equipamento, desconecte cabos e confirme com o ponto de coleta se ele recebe esse tipo de item.",
            step: "Retire acessórios e componentes removíveis apenas quando isso for seguro. Não abra nem danifique baterias."
        };
    }

    function renderFilters() {
        filters.replaceChildren();
        const addFilter = (label, value, disabled = false) => {
            const button = cloneTemplate("filterButtonTemplate").querySelector(".filter");
            button.textContent = label;
            button.disabled = disabled;
            button.classList.toggle("active", activeFilter === value && catalogMode === "full");
            button.addEventListener("click", () => {
                catalogMode = "full";
                activeFilter = value;
                if (value !== "atalho") shortcutFilterIds = null;
                renderFilters();
                renderCatalog();
            });
            filters.append(button);
        };
        addFilter("Todos", "todos");
        categories.forEach(category => addFilter(category.name, category.id));
        addFilter(`Selecionados (${selectedEquipmentItems.size})`, "selecionados", selectedEquipmentItems.size === 0);
        if (shortcutFilterIds && activeFilter === "atalho") addFilter(currentShortcut?.name || "Atalho", "atalho");
        simpleToggle.classList.toggle("active", catalogMode === "simple");
        simpleToggle.setAttribute("aria-pressed", String(catalogMode === "simple"));
    }

    function renderCard(item, category, simple = false) {
        const selected = !simple && selectedEquipmentItems.has(item.id);
        const card = cloneTemplate("equipmentCardTemplate").querySelector(".equipment-card");
        card.classList.toggle("selected", selected);
        card.setAttribute("aria-pressed", String(selected));
        card.setAttribute("aria-label", simple ? `Ver orientações para ${item.name}` : `${selected ? "Desmarcar" : "Selecionar"} ${item.name}`);
        card.querySelector(".equipment-category").textContent = simple ? "Guia rápido" : category.name;
        card.querySelector(".equipment-emoji").textContent = simple ? item.emoji : category.emoji || "♻️";
        card.querySelector(".equipment-name").textContent = item.name;
        if (simple) {
            card.addEventListener("click", () => {
                currentShortcut = item;
                openEquipmentDetail(item, category, true);
            });
        } else {
            card.addEventListener("click", () => {
                if (selectedEquipmentItems.has(item.id)) selectedEquipmentItems.delete(item.id);
                else selectedEquipmentItems.set(item.id, item);
                document.dispatchEvent(new Event("equipment-selection-change"));
            });
        }
        grid.append(card);
    }

    function renderCatalog() {
        const query = normalizeText(search.value);
        grid.replaceChildren();
        if (catalogMode === "simple") {
            const items = shortcuts.filter(item => {
                const names = item.itemIds.map(id => DATA_EQUIPMENT.items[id].name);
                return normalizeText([item.name, item.description, ...names].join(" ")).includes(query);
            });
            items.forEach(item => renderCard(item, categories.find(c => c.id === item.categoryId) || categories[0], true));
            resultCount.textContent = `${items.length} atalhos de equipamentos`;
            emptyState.hidden = items.length > 0;
        } else {
            const items = categories.flatMap(category => getCategoryEquipment(category.id).map(item => ({...item, category}))).filter(item => {
                if (activeFilter === "selecionados" && !selectedEquipmentItems.has(item.id)) return false;
                if (activeFilter === "atalho" && !shortcutFilterIds?.has(item.id)) return false;
                if (!["todos","selecionados","atalho"].includes(activeFilter) && item.category.id !== activeFilter) return false;
                return normalizeText(`${item.name} ${item.category.name}`).includes(query);
            });
            items.forEach(item => renderCard(item, item.category));
            resultCount.textContent = `${items.length} equipamento${items.length === 1 ? "" : "s"} encontrado${items.length === 1 ? "" : "s"}`;
            emptyState.hidden = items.length > 0;
            if (!items.length) emptyState.textContent = activeFilter === "selecionados" ? "Nenhum equipamento selecionado. Selecione itens no catálogo para vê-los aqui." : "Nenhum equipamento encontrado.";
        }
        catalogSelectionCount.textContent = selectedEquipmentItems.size === 1 ? "1 selecionado" : `${selectedEquipmentItems.size} selecionados`;
        catalogSelectionActions.hidden = catalogMode !== "full";
        sendCatalogSelection.disabled = selectedEquipmentItems.size === 0;
    }

    function openEquipmentDetail(item, category, simple = false) {
        if (!item || !category) return;
        const linkedItems = simple ? item.itemIds.map(id => ({id, ...DATA_EQUIPMENT.items[id]})) : [];
        const guidance = item.guidance || {};
        document.getElementById("equipmentDetailTitle").textContent = item.name;
        document.getElementById("equipmentDetailCategory").textContent = simple ? `${linkedItems.length} equipamentos relacionados` : category.name;
        document.getElementById("equipmentDetailEmoji").textContent = simple ? item.emoji : category.emoji || "♻️";
        document.getElementById("equipmentDetailExamples").textContent = simple
            ? `${item.description} Inclui: ${linkedItems.slice(0,6).map(e => e.name).join(", ")}${linkedItems.length > 6 ? ` e outros ${linkedItems.length-6} itens` : ""}.`
            : item.description;
        document.getElementById("equipmentDetailTip").textContent = simple
            ? "Os equipamentos relacionados serão exibidos no catálogo para que você escolha individualmente quais deseja selecionar."
            : guidance.preparation || "Desligue o equipamento e desconecte-o da fonte de energia antes da entrega.";
        const steps = document.querySelectorAll("#equipmentDetailSteps [data-step]");
        steps[0].textContent = simple
            ? "Confira a descrição e os equipamentos relacionados a este atalho."
            : guidance.preparation || "Desligue e desconecte o equipamento antes da entrega.";
        steps[1].textContent = simple
            ? "Selecione individualmente os itens que correspondem ao equipamento que você deseja descartar."
            : guidance.care || "Proteja o equipamento durante o transporte e não danifique baterias ou componentes.";
        steps[2].textContent = "Acondicione o item para evitar danos e confirme com o ponto de coleta se ele recebe este equipamento.";
        document.getElementById("compatiblePointsHint").textContent = simple
            ? "Veja no catálogo os equipamentos que correspondem a esta descrição. A seleção poderá ser feita individualmente."
            : "A aceitação pode variar conforme o ponto de coleta. Consulte os localizadores oficiais e confirme antes de se deslocar.";
        openDrawer(detailDrawer);
    }

    simpleToggle.addEventListener("click", () => {
        catalogMode = "simple";
        activeFilter = "todos";
        shortcutFilterIds = null;
        currentShortcut = null;
        renderFilters();
        renderCatalog();
    });

    search.addEventListener("input", renderCatalog);

    document.getElementById("clear").addEventListener("click", () => {
        search.value = "";
        activeFilter = "todos";
        catalogMode = "simple";
        shortcutFilterIds = null;
        currentShortcut = null;
        renderFilters();
        renderCatalog();
    });

    document.getElementById("openChecklistFromEquipment").addEventListener("click", () => {
        closeDrawer(detailDrawer);
        openDrawer(document.getElementById("checklistDrawer"));
    });

    document.getElementById("showInCatalogButton").addEventListener("click", () => {
        if (!currentShortcut) return;
        shortcutFilterIds = new Set(currentShortcut.itemIds);
        catalogMode = "full";
        activeFilter = "atalho";
        search.value = "";
        closeDrawer(detailDrawer);
        renderFilters();
        renderCatalog();
        document.getElementById("guia").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    function sendSelectionToMap() {
        if (!selectedEquipmentItems.size) return;
        closeDrawer(document.getElementById("equipmentDrawer"));
        closeDrawer(detailDrawer);
        document.getElementById("mapa").scrollIntoView({ behavior: "smooth", block: "start" });
        showFeedback(`${selectedEquipmentItems.size} equipamento(s) enviado(s) para a consulta do mapa.`);
    }
    sendCatalogSelection.addEventListener("click", sendSelectionToMap);
    document.addEventListener("equipment-selection-change", () => {
        renderFilters();
        renderCatalog();
    });

    categories = getCatalogCategories();

    const shortcutIds = [...new Set(categories.flatMap(category => category.shortcutIds))];
    shortcuts = shortcutIds.map(id => ({
        id,
        ...DATA_SHORTCUTS.shortcuts[id],
        categoryId: categories.find(category => category.shortcutIds.includes(id)).id
    }));

    renderFilters();
    renderCatalog();
}
//#endregion

//#region : FEEDBACK
function showFeedback(message) {
    const feedback = document.getElementById("actionFeedback");
    feedback.textContent = message;
    feedback.classList.add("show");
    feedback.setAttribute("aria-hidden", "false");

    clearTimeout(showFeedback.timeout);
    showFeedback.timeout = setTimeout(() => {
        feedback.classList.remove("show");
        feedback.setAttribute("aria-hidden", "true");
    }, 3000);
}
//#endregion

//#region : CHECKLIST
{
    const tasks = [];

    const list = document.getElementById("checklistItems");
    const form = document.getElementById("checklistForm");
    const input = document.getElementById("checklistInput");
    const fileInput = document.getElementById("checklistFileInput");
    const progressBar = document.getElementById("checklistProgressBar");
    const progressText = document.getElementById("checklistProgressText");
    const progressLabel = document.getElementById("checklistProgressLabel");
    const modeToggle = document.getElementById("checklistModeToggle");
    let viewMode = true;

    function updateMode() {
        modeToggle.setAttribute("aria-pressed", String(viewMode));
        modeToggle.classList.toggle("active", viewMode);
        const modeIcon = modeToggle.querySelector("i");
        const modeLabel = modeToggle.querySelector("span");
        modeIcon.classList.toggle("fa-eye", viewMode);
        modeIcon.classList.toggle("fa-pen", !viewMode);
        modeLabel.textContent = viewMode ? "Modo de visualização" : "Modo de edição";

        form.hidden = viewMode;
        document.getElementById("resetChecks").hidden = viewMode;
        list.classList.toggle("checklist-view-mode", viewMode);
    }

    modeToggle.addEventListener("click", () => {
        viewMode = !viewMode;
        updateMode();
        renderTasks();
    });

    function updateProgress() {
        const completed = tasks.filter(task => task.done).length;
        const percent = tasks.length ? Math.round(completed / tasks.length * 100) : 0;

        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${completed} de ${tasks.length} etapas concluídas`;
        progressLabel.textContent = `${percent}%`;
    }

    function moveTask(index, direction) {
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= tasks.length) return;

        [tasks[index], tasks[nextIndex]] = [tasks[nextIndex], tasks[index]];
        renderTasks();
    }

    function renderTasks() {
        list.replaceChildren();

        tasks.forEach((task, index) => {
            const item = cloneTemplate("checklistTaskTemplate").querySelector(".checklist-task");
            const checkbox = item.querySelector('input[type="checkbox"]');
            const text = item.querySelector(".checklist-task-text");
            const [up, down, remove] = item.querySelectorAll("button");

            item.classList.toggle("completed", task.done);
            checkbox.checked = task.done;
            text.textContent = task.text;

            checkbox.addEventListener("change", () => {
                task.done = checkbox.checked;
                renderTasks();
            });

            up.disabled = index === 0;
            up.title = "Mover para cima";
            up.setAttribute("aria-label", `Mover para cima: ${task.text}`);
            up.addEventListener("click", () => moveTask(index, -1));

            down.disabled = index === tasks.length - 1;
            down.title = "Mover para baixo";
            down.setAttribute("aria-label", `Mover para baixo: ${task.text}`);
            down.addEventListener("click", () => moveTask(index, 1));

            remove.setAttribute("aria-label", `Remover etapa: ${task.text}`);
            remove.addEventListener("click", () => {
                tasks.splice(index, 1);
                renderTasks();
            });

            item.querySelector(".checklist-task-actions").hidden = viewMode;
            list.append(item);
        });

        updateProgress();
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        tasks.push({ text, done: false });
        input.value = "";
        renderTasks();
        input.focus();
    });

    document.getElementById("resetChecks").addEventListener("click", () => {
        tasks.forEach(task => task.done = false);
        renderTasks();
    });

    document.getElementById("exportChecklist").addEventListener("click", () => {
        const data = {
            version: 1,
            tasks: tasks.map(task => ({ text: task.text, done: task.done }))
        };
        const file = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json"
        });
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = "meu-checklist.json";
        link.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById("importChecklist").addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", async () => {
        const file = fileInput.files[0];
        if (!file) return;

        try {
            const data = JSON.parse(await file.text());
            const valid = data &&
                data.version === 1 &&
                Array.isArray(data.tasks) &&
                data.tasks.length <= 500 &&
                data.tasks.every(task =>
                    task &&
                    typeof task.text === "string" &&
                    task.text.trim().length > 0 &&
                    task.text.trim().length <= 120 &&
                    typeof task.done === "boolean"
                );

            if (!valid) {
                alert("Arquivo inválido. Selecione um checklist exportado por esta página.");
                return;
            }

            if (!confirm("Importar este arquivo vai substituir todas as etapas atuais. Deseja continuar?")) return;

            tasks.splice(0, tasks.length, ...data.tasks.map(task => ({
                text: task.text.trim(),
                done: task.done
            })));
            renderTasks();
            showFeedback("Checklist importado com sucesso!");
        } catch (error) {
            alert("Não foi possível ler o arquivo. Verifique se ele é um JSON válido.");
        } finally {
            fileInput.value = "";
        }
    });

    const initial = DATA_CHECKLISTS.default?.tasks || [];
    tasks.splice(0, tasks.length, ...initial.map(text => ({ text, done: false })));
    renderTasks();

    updateMode();
    renderTasks();
}
//#endregion

//#region : IMAGENS DO FOLDER

document.querySelectorAll(".brochure-preview-image").forEach(image => {
    image.addEventListener("error", () => {
        image.hidden = true;
        image.nextElementSibling.hidden = false;
    });
});

//#endregion

//#region : MAPA LEAFLET
{

    const map = L.map("map", {
        scrollWheelZoom: false
    }).setView([-26.25, -51.07], 7);

    const attribution = document.getElementById("mapAttributionTemplate").innerHTML;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution
    }).addTo(map);

    let collectionPoints = {};

    const pointDrawer = document.getElementById("collectionPointDrawer");

    function openCollectionPoint(pointId) {
        const point = collectionPoints[pointId];
        if (!point) return;

        document.getElementById("collectionPointTitle").textContent = point.name;
        document.getElementById("collectionPointSubtitle").textContent = "Porto União · Santa Catarina";
        openDrawer(pointDrawer);
    }

    collectionPoints = DATA_COLLECTION_POINTS.points || {};
    Object.entries(collectionPoints).forEach(([id, point]) => {
        const marker = L.marker(point.position).addTo(map);
        marker.bindTooltip(point.name);
        marker.on("click", () => openCollectionPoint(id));
    });

    document.querySelectorAll("[data-open-point]").forEach(button => {
        button.addEventListener("click", () => openCollectionPoint(button.dataset.openPoint));
    });

    document.getElementById("focusCollectionPoint").addEventListener("click", () => {
        const point = collectionPoints["ponto-demo"];
        closeDrawer(pointDrawer);
        document.getElementById("mapa").scrollIntoView({ behavior: "smooth" });
        map.setView(point.position, 13);
        setTimeout(() => map.invalidateSize(), 200);
    });

    const mapObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => map.invalidateSize(), 150);
            }
        });
    });

    mapObserver.observe(document.getElementById("map"));

}
//#endregion

//#region : FOLDER E COMPARTILHAMENTO
{
    const modal = document.getElementById("shareModal");
    const url = document.getElementById("shareUrl");

    function openShareModal() {
        url.value = window.location.href;
        openModal(modal);
    }

    document.querySelectorAll(".folder-share-button")
        .forEach(
            button => {
                button.addEventListener( "click", openShareModal );
            }
        );

    document.getElementById("copyShareUrl")
        .addEventListener( "click",
            async () => {
                try {
                    await navigator.clipboard.writeText( url.value );
                }
                catch (error) {
                    url.focus();
                    url.select();
                    try {
                        document.execCommand("copy");
                    }
                    catch (copyError) {}
                }
            }
        );
}
//#endregion

//#region : PAINÉIS LATERAIS

document.getElementById("explorerToggle").addEventListener("click", () => {
    openDrawer(document.getElementById("drawer"));
});

document.getElementById("checklistButton").addEventListener("click", () => {
    openDrawer(document.getElementById("checklistDrawer"));
});

document.getElementById("equipmentButton").addEventListener("click", () => {
    const drawerSearch = document.getElementById("sidebarSearch");
    drawerSearch.value = "";
    drawerSearch.dispatchEvent(new Event("input"));
    openDrawer(document.getElementById("equipmentDrawer"));
});

document.getElementById("mapButton").addEventListener("click", () => {
    openDrawer(document.getElementById("mapDrawer"));
});

//#endregion

//#region : CATÁLOGO SELECIONÁVEL DE EQUIPAMENTOS
{
    const tree = document.getElementById("equipmentTreeGuide");
    const search = document.getElementById("sidebarSearch");
    const selectionCount = document.getElementById("equipmentSelectionCount");
    const clearSelection = document.getElementById("clearEquipmentSelection");
    const searchMapButton = document.getElementById("searchSelectedEquipment");
    const mapSelection = document.getElementById("mapEquipmentSelection");
    const mapWorkspace = mapSelection.closest(".map-workspace");
    const mapEquipmentList = document.getElementById("mapEquipmentList");
    const mapEquipmentCount = document.getElementById("mapEquipmentCount");
    const clearMapSelection = document.getElementById("clearMapEquipmentSelection");
    const closeMapSelection = document.getElementById("closeMapEquipmentSelection");
    let categories = [];
    let mapSelectionDismissed = false;

    function normalize(value) {
        return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    function updateSelection() {
        const count = selectedEquipmentItems.size;
        selectionCount.textContent = count === 1 ? "1 selecionado" : `${count} selecionados`;
        clearSelection.disabled = count === 0;
        searchMapButton.disabled = count === 0;

        mapSelection.hidden = count === 0 || mapSelectionDismissed;
        mapWorkspace.classList.toggle("map-workspace-expanded", mapSelection.hidden);
        mapEquipmentCount.textContent = String(count);
        mapEquipmentList.replaceChildren();

        selectedEquipmentItems.forEach(item => {
            const li = cloneTemplate("mapEquipmentItemTemplate").querySelector("li");
            li.textContent = item.name;
            mapEquipmentList.append(li);
        });
    }

    function renderEquipmentTree(categories) {
        const query = normalizeText(search.value);
        tree.replaceChildren();
        let visibleCount = 0;

        categories.forEach((category, index) => {
            const categoryMatches = normalizeText(category.name).includes(query);
            const matches = getCategoryEquipment(category.id).filter(item =>
                categoryMatches || normalizeText(item.name).includes(query)
            );
            if (!matches.length) return;

            visibleCount += matches.length;
            const groupId = `equipment-category-${index}`;
            const group = cloneTemplate("equipmentCategoryTemplate");
            const toggle = group.querySelector(".tree-toggle");
            const children = group.querySelector(".equipment-category-items");

            toggle.dataset.tree = groupId;
            toggle.setAttribute("aria-expanded", String(Boolean(query)));
            toggle.querySelector(".equipment-category-name").textContent = category.name;
            toggle.querySelector(".equipment-category-total").textContent = String(matches.length);
            children.id = groupId;
            children.classList.toggle("open", Boolean(query));

            matches.forEach(item => {
                const label = cloneTemplate("equipmentSelectionItemTemplate").querySelector(".equipment-select-item");
                const checkbox = label.querySelector("input");
                checkbox.value = item.id;
                checkbox.checked = selectedEquipmentItems.has(item.id);
                label.querySelector(".equipment-select-name").textContent = item.name;
                checkbox.addEventListener("change", () => {
                    if (checkbox.checked) selectedEquipmentItems.set(item.id, item);
                    else selectedEquipmentItems.delete(item.id);
                    mapSelectionDismissed = false;
                    document.dispatchEvent(new Event("equipment-selection-change"));
                    updateSelection();
                });
                children.append(label);
            });

            toggle.addEventListener("click", () => {
                const isOpen = children.classList.toggle("open");
                toggle.setAttribute("aria-expanded", String(isOpen));
            });

            tree.append(group);
        });

        if (!visibleCount) {
            const empty = cloneTemplate("equipmentTreeEmptyTemplate").querySelector(".tree-empty");
            empty.textContent = "Nenhum equipamento encontrado.";
            tree.append(empty);
        }
    }

    search.addEventListener("input", () => {
        if (categories.length) renderEquipmentTree(categories);
    });

    document.addEventListener("equipment-selection-change", () => {
        if (categories.length) renderEquipmentTree(categories);
        updateSelection();
    });

    clearMapSelection.addEventListener("click", () => {
        selectedEquipmentItems.clear();
        mapSelectionDismissed = false;
        if (categories.length) renderEquipmentTree(categories);
        document.dispatchEvent(new Event("equipment-selection-change"));
        updateSelection();
    });

    closeMapSelection.addEventListener("click", () => {
        mapSelectionDismissed = true;
        mapSelection.hidden = true;
        mapWorkspace.classList.add("map-workspace-expanded");
    });

    clearSelection.addEventListener("click", () => {
        selectedEquipmentItems.clear();
        if (categories.length) renderEquipmentTree(categories);
        document.dispatchEvent(new Event("equipment-selection-change"));
        updateSelection();
    });

    searchMapButton.addEventListener("click", () => {
        if (!selectedEquipmentItems.size) return;
        mapSelectionDismissed = false;
        updateSelection();
        closeDrawer(document.getElementById("equipmentDrawer"));
        document.getElementById("mapa").scrollIntoView({ behavior: "smooth", block: "start" });
        showFeedback(`${selectedEquipmentItems.size} equipamento(s) enviado(s) para a consulta do mapa.`);
    });

    categories = getCatalogCategories();
    renderEquipmentTree(categories);
    updateSelection();
}
//#endregion

//#region : MODAIS INFORMATIVOS
document.querySelectorAll(".step[data-modal]")
    .forEach(card => {
        card.addEventListener("click", () => {
            openModal(document.getElementById(card.dataset.modal));
        });
    });
//#endregion

//#region : MENU MOBILE
{
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    function closeMenu() {
        mainNav.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = !mainNav.classList.contains("open");
        mainNav.classList.toggle("open", isOpen);
        menuToggle.classList.toggle("open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
        if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });

    const navigationSections = [
        "inicio", "consciente", "checklist", "guia", "mapa", "noticias", "referencias"
    ].map(id => document.getElementById(id)).filter(Boolean);

    const navObserver = new IntersectionObserver(entries => {
        const current = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!current) return;

        mainNav.querySelectorAll("a").forEach(link => {
            const active = link.getAttribute("href") === `#${current.target.id}`;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    }, { rootMargin: "-20% 0px -55% 0px", threshold: 0 });

    navigationSections.forEach(section => navObserver.observe(section));
}
//#endregion

//#region : PROGRESSO DA PÁGINA
{
    const pageProgressValue = document.getElementById("pageProgressValue");
    const pageProgressBar = document.getElementById("pageProgressBar");
    const pageProgressContainer = document.getElementById("pageProgressContainer");
    const quickActionsContainer = document.getElementById("quickActionsContainer");
    const progressiveActions = [...quickActionsContainer.querySelectorAll(".quick-action[data-section]")];
    const quickActionsToggle = document.getElementById("quickActionsToggle");

    quickActionsToggle.addEventListener("click", () => {
        const collapsed = quickActionsContainer.classList.toggle("collapsed");
        quickActionsToggle.setAttribute("aria-expanded", String(!collapsed));
        quickActionsToggle.setAttribute(
            "aria-label",
            collapsed ? "Mostrar opções flutuantes" : "Esconder opções flutuantes"
        );
        quickActionsToggle.title = collapsed ? "Mostrar opções" : "Esconder opções";
        const toggleIcon = quickActionsToggle.querySelector("i");
        toggleIcon.classList.toggle("fa-chevron-up", collapsed);
        toggleIcon.classList.toggle("fa-chevron-down", !collapsed);
    });

    function revealProgressiveActions() {
        const revealLine = window.scrollY + window.innerHeight * 0.65;

        progressiveActions.forEach(button => {
            const section = document.getElementById(button.dataset.section);
            if (section && revealLine >= section.offsetTop) {
                button.classList.add("revealed");
            }
        });
    }

    function progress() {
        const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
        const explored = scrollable > 0
            ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
            : 0;
        const percent = Math.round(explored);
        const distanceFromBottom = document.documentElement.scrollHeight - (window.innerHeight + window.scrollY);

        pageProgressValue.textContent = `${percent}%`;
        pageProgressBar.style.width = `${percent}%`;
        revealProgressiveActions();

        pageProgressContainer.classList
            .toggle(
                "visible", window.scrollY > window.innerHeight * 0.10
            );

        const screenWidth = window.innerWidth;
        const footerClearance = screenWidth <= 410
            ? { distance: 410, factor: 0.3 }
            : screenWidth <= 600
                ? { distance: 350, factor: 0.3 }
                : { distance: 300, factor: 0.2 };

        if (distanceFromBottom < footerClearance.distance) {
            const extraMargin = footerClearance.distance - distanceFromBottom;
            const offset = extraMargin * footerClearance.factor;
            pageProgressContainer.style.transform = `translateY(-${offset}px)`;
            quickActionsContainer.style.transform = `translateY(-${offset}px)`;
        } else {
            pageProgressContainer.style.transform = "translateY(0px)";
            quickActionsContainer.style.transform = "translateY(0px)";
        }
    }

    window.addEventListener("scroll", progress, { passive: true });

    window.addEventListener("resize", progress);

    document.getElementById("backToTop")
        .addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

    progress();
}
//#endregion

//#region : HEADER: ESCONDE AO DESCER
{
    const header = document.getElementById("header");
    let previousY = window.scrollY;

    window.addEventListener( "scroll",
        () => {
            const current = window.scrollY;
            const difference = current - previousY;

            if (document.getElementById("mainNav").classList.contains("open") || current < 80 || difference < -4) {
                header.classList.remove("hidden");
            }
            else if (difference > 4) {
                header.classList.add("hidden");
            }

            previousY = current;
        }, { passive: true }
    );
}
//#endregion

//#region : MODAL DE VÍDEO NO FOOTER
{
    const src = "https://www.youtube.com/embed/egYTYpleY0U?autoplay=1";
    const modal = document.getElementById("videoModal");
    const iframe = document.getElementById("videoIframe");

    function openVideoModal() {
        openModal(modal);
        iframe.src = src;
    }

    document.getElementById("videoModalTrigger")
        .addEventListener( "click", openVideoModal);

}
//#endregion

//#region : CONTEÚDO DINÂMICO
function renderDataCards(containerId, records, className) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.replaceChildren();
    records.forEach(record => {
        const article = cloneTemplate("contentCardTemplate").querySelector("article");
        article.classList.add(className);
        article.querySelector("small").textContent = record.category || record.type || "";
        article.querySelector("h3").textContent = record.title || record.name || "";
        article.querySelector("p").textContent = record.description || "";

        const link = article.querySelector("a");
        link.href = record.url || record.href || "#referencias";
        link.textContent = record.linkText || "Saiba mais →";
        if (record.url) {
            link.target = "_blank";
            link.rel = "noopener";
        }

        container.append(article);
    });
}

renderDataCards("newsGrid", DATA_NEWS.items || [], "news-card");
renderDataCards("campaignsGrid", DATA_CAMPAIGNS.items || [], "social-card");
renderDataCards("referencesGrid", DATA_REFERENCES.items || [], "reference-card");
//#endregion

})();
