//#region : INTERFACE - MODAIS, PAINÉIS E OVERLAY
const overlay = document.getElementById("overlay");
let _drawer = null;
let _modal = null;

function updateOverlay() {
    const active = Boolean(_drawer || _modal);
    overlay.classList.toggle("open", active);
    document.body.style.overflow = active ? "hidden" : "";
}

function closeActive() {
    if (_drawer) closeDrawer(_drawer);
    if (_modal) closeModal(_modal);
}

function openDrawer(drawer) {
    closeActive();
    _drawer = drawer;
    drawer.classList.add("open");
    updateOverlay();
}

function closeDrawer(drawer) {
    if (drawer !== _drawer) return;
    drawer.classList.remove("open");
    _drawer = null;
    updateOverlay();
}

function openModal(modal) {
    closeActive();
    _modal = modal;
    modal.classList.add("open");
    updateOverlay();
}

function closeModal(modal) {
    if (modal !== _modal) return;
    modal.classList.remove("open");
    const iframe = modal.querySelector("iframe");
    if (iframe) iframe.src = "";
    _modal = null;
    updateOverlay();
}

document.querySelectorAll(".drawer").forEach(drawer => {
    drawer.querySelector(".drawer-close")?.addEventListener("click", () => closeDrawer(drawer));
});

document.querySelectorAll(".modal").forEach(modal => {
    modal.querySelector(".modal-close")?.addEventListener("click", () => closeModal(modal));
});

overlay.addEventListener("click", closeActive);
document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeActive();
});
//#endregion

//#region : CATÁLOGO E DETALHES DE EQUIPAMENTOS
{
    const equipment = {
        celulares: { name:"Celulares e smartphones", category:"Informática", cat:"informatica", emoji:"📱", examples:"Celulares, smartphones, tablets e acessórios.", tip:"Apague os dados pessoais e remova chip e cartão de memória." },
        computadores: { name:"Computadores e periféricos", category:"Informática", cat:"informatica", emoji:"💻", examples:"Computadores, notebooks, teclados e mouses.", tip:"Faça backup e apague os dados antes da entrega." },
        impressoras: { name:"Impressoras e scanners", category:"Informática", cat:"informatica", emoji:"🖨️", examples:"Impressoras, scanners e equipamentos semelhantes.", tip:"Confirme se o ponto recebe equipamentos de maior porte." },
        cabos: { name:"Cabos e carregadores", category:"Informática", cat:"informatica", emoji:"🔌", examples:"Cabos, carregadores, adaptadores e conectores.", tip:"Agrupe os acessórios para facilitar o transporte." },
        televisores: { name:"Televisores e monitores", category:"Imagem e áudio", cat:"imagem", emoji:"📺", examples:"Televisores, monitores e telas eletrônicas.", tip:"Evite impactos e confirme os limites de tamanho do ponto." },
        audio: { name:"Áudio e vídeo", category:"Imagem e áudio", cat:"imagem", emoji:"🎧", examples:"Rádios, caixas de som, fones e amplificadores.", tip:"Separe controles e cabos e confirme a aceitação." },
        videogames: { name:"Videogames", category:"Imagem e áudio", cat:"imagem", emoji:"🎮", examples:"Consoles, controles e acessórios de jogos.", tip:"Remova contas e dados pessoais antes da entrega." },
        geladeiras: { name:"Geladeiras e refrigeradores", category:"Casa", cat:"casa", emoji:"🧊", examples:"Geladeiras, frigobares e refrigeradores domésticos.", tip:"Consulte opções de coleta para equipamentos volumosos." },
        lavadoras: { name:"Lavadoras e cuidados com roupas", category:"Casa", cat:"casa", emoji:"🧺", examples:"Máquinas de lavar, secadoras e ferros elétricos.", tip:"Confirme previamente o recebimento de eletrodomésticos grandes." },
        cozinha: { name:"Cozinha e preparo de alimentos", category:"Casa", cat:"casa", emoji:"🍳", examples:"Liquidificadores, cafeteiras, torradeiras e micro-ondas.", tip:"Desligue e retire alimentos ou líquidos." },
        limpeza: { name:"Limpeza doméstica", category:"Casa", cat:"casa", emoji:"🧹", examples:"Aspiradores de pó e equipamentos elétricos de limpeza.", tip:"Esvazie reservatórios e acondicione acessórios separadamente." },
        ventilacao: { name:"Ventilação e climatização", category:"Casa", cat:"casa", emoji:"❄️", examples:"Ventiladores, ar-condicionado e aquecedores.", tip:"Equipamentos grandes podem exigir logística específica." },
        pessoal: { name:"Cuidados pessoais", category:"Cuidados pessoais", cat:"pessoal", emoji:"🪒", examples:"Barbeadores, depiladores e secadores.", tip:"Separe pilhas removíveis e proteja partes cortantes." },
        ferramentas: { name:"Ferramentas elétricas", category:"Ferramentas", cat:"ferramentas", emoji:"🛠️", examples:"Furadeiras, parafusadeiras e ferramentas elétricas.", tip:"Retire baterias somente quando isso for seguro." },
        jardim: { name:"Jardim e área externa", category:"Ferramentas", cat:"ferramentas", emoji:"🌱", examples:"Aparadores de grama e equipamentos elétricos de jardim.", tip:"Confirme o porte aceito pelo ponto de coleta." }
    };

    const search = document.getElementById("search");
    const detailDrawer = document.getElementById("equipmentDetailDrawer");
    const collectionPoints = [];
    let activeFilter = "todos";
    let selectedEquipment = null;

    function renderCatalog() {
        const query = search.value.toLowerCase().trim();
        const cards = [...document.querySelectorAll("[data-catalog-category]")];
        cards.forEach(card => {
            const category = card.dataset.catalogCategory;
            const items = Object.values(equipment).filter(item => item.cat === category);
            const matchesQuery = !query || items.some(item =>
                `${item.name} ${item.examples} ${item.tip}`.toLowerCase().includes(query)
            ) || card.textContent.toLowerCase().includes(query);
            const matchesFilter = activeFilter === "todos" || category === activeFilter;
            card.hidden = !(matchesQuery && matchesFilter);
        });
        document.getElementById("catalogEmptyState").hidden = cards.some(card => !card.hidden);
    }

    function openEquipmentDetail(item) {
        if (!item) return;
        selectedEquipment = item;
        document.getElementById("equipmentDetailTitle").textContent = item.name;
        document.getElementById("equipmentDetailCategory").textContent = item.category;
        document.getElementById("equipmentDetailEmoji").textContent = item.emoji;
        document.getElementById("equipmentDetailExamples").textContent = item.examples;
        document.getElementById("equipmentDetailTip").textContent = item.tip;

        const steps = document.querySelectorAll("#equipmentDetailSteps [data-step]");
        steps[1].textContent = item.cat === "informatica"
            ? "Faça backup e remova dados pessoais, chips e cartões de memória."
            : "Retire acessórios e componentes removíveis apenas quando isso for seguro.";

        document.getElementById("compatiblePointsHint").textContent =
            "O mapa será aberto para consultar os pontos de coleta. Confirme a aceitação diretamente com o localizador.";
        highlightCompatiblePoints(false);
        openDrawer(detailDrawer);
    }

    function highlightCompatiblePoints(showMessage = true) {
        if (!selectedEquipment || !collectionPoints.length) {
            if (showMessage) showFeedback("Ainda não há pontos cadastrados para filtrar por equipamento. Consulte os localizadores oficiais.");
            return;
        }
        const compatible = collectionPoints.filter(point =>
            (point.acceptedCategories || []).includes(selectedEquipment.cat)
        );
        collectionPoints.forEach(point => {
            if (point.marker) point.marker.setOpacity(compatible.includes(point) ? 1 : 0.25);
        });
        if (showMessage) showFeedback(compatible.length
            ? `${compatible.length} ponto(s) compatível(is) destacado(s).`
            : "Nenhum ponto cadastrado recebe esta categoria.");
    }

    search.addEventListener("input", renderCatalog);
    document.querySelectorAll(".filter").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".filter.active")?.classList.remove("active");
            button.classList.add("active");
            activeFilter = button.dataset.filter;
            renderCatalog();
        });
    });

    document.getElementById("clear").addEventListener("click", () => {
        search.value = "";
        activeFilter = "todos";
        document.querySelectorAll(".filter").forEach(button => {
            button.classList.toggle("active", button.dataset.filter === "todos");
        });
        renderCatalog();
    });

    document.querySelectorAll("[data-catalog-category]").forEach(card => {
        card.addEventListener("click", () => {
            const drawerSearch = document.getElementById("sidebarSearch");
            drawerSearch.value = "";
            drawerSearch.dispatchEvent(new Event("input"));
            openDrawer(document.getElementById("equipmentDrawer"));
        });
    });

    document.getElementById("openChecklistFromEquipment").addEventListener("click", () => {
        closeDrawer(detailDrawer);
        openDrawer(document.getElementById("checklistDrawer"));
    });

    document.getElementById("compatiblePointsButton").addEventListener("click", () => {
        closeDrawer(detailDrawer);
        openDrawer(document.getElementById("mapDrawer"));
        document.getElementById("mapa").scrollIntoView({ behavior: "smooth" });
        highlightCompatiblePoints();
    });

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
    const tasks = [
        { text: "Verificar o estado do equipamento", done: false },
        { text: "Desligar e desconectar", done: false },
        { text: "Separar acessórios e componentes", done: false },
        { text: "Proteger informações pessoais", done: false },
        { text: "Confirmar o destino de entrega", done: false }
    ];

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
        modeToggle.innerHTML = viewMode
            ? '<i class="fa-solid fa-eye"></i><span>Modo de visualização</span>'
            : '<i class="fa-solid fa-pen"></i><span>Modo de edição</span>';

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
            const item = document.createElement("div");
            item.className = "checklist-task";
            item.classList.toggle("completed", task.done);

            const label = document.createElement("label");
            label.className = "checklist-task-label";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.done;
            checkbox.addEventListener("change", () => {
                task.done = checkbox.checked;
                renderTasks();
            });

            const text = document.createElement("span");
            text.textContent = task.text;
            label.append(checkbox, text);

            const actions = document.createElement("div");
            actions.className = "checklist-task-actions";

            const up = document.createElement("button");
            up.type = "button";
            up.className = "checklist-task-move";
            up.disabled = index === 0;
            up.title = "Mover para cima";
            up.setAttribute("aria-label", `Mover para cima: ${task.text}`);
            up.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
            up.addEventListener("click", () => moveTask(index, -1));

            const down = document.createElement("button");
            down.type = "button";
            down.className = "checklist-task-move";
            down.disabled = index === tasks.length - 1;
            down.title = "Mover para baixo";
            down.setAttribute("aria-label", `Mover para baixo: ${task.text}`);
            down.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
            down.addEventListener("click", () => moveTask(index, 1));

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "checklist-task-remove";
            remove.setAttribute("aria-label", `Remover etapa: ${task.text}`);
            remove.innerHTML = '<i class="fa-solid fa-trash"></i>';
            remove.addEventListener("click", () => {
                tasks.splice(index, 1);
                renderTasks();
            });

            actions.append(up, down, remove);
            actions.hidden = viewMode;
            item.append(label, actions);
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

    updateMode();
    renderTasks();
}
//#endregion

//#region : IMAGENS DO FOLDER
{
    document.querySelectorAll(".brochure-preview-image").forEach(image => {
        image.addEventListener("error", () => {
            image.hidden = true;
            image.nextElementSibling.hidden = false;
        });
    });
}
//#endregion

//#region : MAPA LEAFLET
{

    const map = L.map("map", {
        scrollWheelZoom: false
    }).setView([-26.25, -51.07], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Ponto fictício para demonstrar a interação com os drawers.
    const collectionPoints = {
        "ponto-demo": {
            name: "Ponto demonstrativo",
            position: [-26.24, -51.08]
        }
    };

    const pointDrawer = document.getElementById("collectionPointDrawer");

    function openCollectionPoint(pointId) {
        const point = collectionPoints[pointId];
        if (!point) return;

        document.getElementById("collectionPointTitle").textContent = point.name;
        document.getElementById("collectionPointSubtitle").textContent = "Porto União · Santa Catarina";
        openDrawer(pointDrawer);
    }

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

document.getElementById("equipmentButton").addEventListener("click", () => {
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
    const mapEquipmentList = document.getElementById("mapEquipmentList");
    const mapEquipmentCount = document.getElementById("mapEquipmentCount");
    const selectedItems = new Map();

    function normalize(value) {
        return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    function updateSelection() {
        const count = selectedItems.size;
        selectionCount.textContent = count === 1 ? "1 selecionado" : `${count} selecionados`;
        clearSelection.disabled = count === 0;
        searchMapButton.disabled = count === 0;

        mapSelection.hidden = count === 0;
        mapEquipmentCount.textContent = String(count);
        mapEquipmentList.replaceChildren();

        selectedItems.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item.name;
            mapEquipmentList.append(li);
        });
    }

    function renderEquipmentTree(categories) {
        const query = normalize(search.value);
        tree.replaceChildren();
        let visibleCount = 0;

        categories.forEach((category, index) => {
            const categoryMatches = normalize(category.name).includes(query);
            const matches = category.items.filter(item =>
                categoryMatches || normalize(item.name).includes(query)
            );
            if (!matches.length) return;

            visibleCount += matches.length;
            const groupId = `equipment-category-${index}`;

            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "tree-toggle";
            toggle.dataset.tree = groupId;
            toggle.setAttribute("aria-expanded", String(Boolean(query)));

            const folderIcon = document.createElement("i");
            folderIcon.className = "fa-solid fa-folder";
            const label = document.createElement("span");
            label.textContent = category.name;
            const total = document.createElement("small");
            total.className = "equipment-category-total";
            total.textContent = String(matches.length);
            const arrow = document.createElement("i");
            arrow.className = "fa-solid fa-chevron-down tree-arrow";
            toggle.append(folderIcon, label, total, arrow);

            const children = document.createElement("div");
            children.id = groupId;
            children.className = "tree-children equipment-category-items";
            if (query) children.classList.add("open");

            matches.forEach(item => {
                const label = document.createElement("label");
                label.className = "equipment-select-item";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = item.id;
                checkbox.checked = selectedItems.has(item.id);
                checkbox.addEventListener("change", () => {
                    if (checkbox.checked) selectedItems.set(item.id, item);
                    else selectedItems.delete(item.id);
                    updateSelection();
                });

                const name = document.createElement("span");
                name.textContent = item.name;
                label.append(checkbox, name);
                children.append(label);
            });

            toggle.addEventListener("click", () => {
                const isOpen = children.classList.toggle("open");
                toggle.setAttribute("aria-expanded", String(isOpen));
            });

            tree.append(toggle, children);
        });

        if (!visibleCount) {
            const empty = document.createElement("p");
            empty.className = "tree-empty";
            empty.textContent = "Nenhum equipamento encontrado.";
            tree.append(empty);
        }
    }

    search.addEventListener("input", () => {
        if (tree.dataset.loaded === "true") {
            renderEquipmentTree(JSON.parse(tree.dataset.categories));
        }
    });

    clearSelection.addEventListener("click", () => {
        selectedItems.clear();
        if (tree.dataset.loaded === "true") {
            renderEquipmentTree(JSON.parse(tree.dataset.categories));
        }
        updateSelection();
    });

    searchMapButton.addEventListener("click", () => {
        if (!selectedItems.size) return;
        updateSelection();
        closeDrawer(document.getElementById("equipmentDrawer"));
        openDrawer(document.getElementById("mapDrawer"));
        document.getElementById("mapa").scrollIntoView({ behavior: "smooth" });
        showFeedback(`${selectedItems.size} equipamento(s) enviado(s) para a consulta do mapa.`);
    });

    fetch("./data/equipment-catalog.json")
        .then(response => {
            if (!response.ok) throw new Error("Não foi possível carregar o catálogo.");
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data.categories)) throw new Error("Formato de catálogo inválido.");
            tree.dataset.categories = JSON.stringify(data.categories);
            tree.dataset.loaded = "true";
            renderEquipmentTree(data.categories);
            updateSelection();
        })
        .catch(() => {
            tree.replaceChildren();
            const error = document.createElement("p");
            error.className = "tree-empty";
            error.textContent = "Não foi possível carregar os equipamentos.";
            tree.append(error);
        });
}
//#endregion

//#region : MODAIS INFORMATIVOS
{
     document.querySelectorAll(".step[data-modal]")
        .forEach(card => {
            card.addEventListener("click", () => {
                openModal(document.getElementById(card.dataset.modal));
            });
        });
}
//#endregion

//#region : AÇÕES CONTEXTUAIS
{
    const contextualButtons = document.querySelectorAll(
        ".quick-action[data-section]"
    );

    const observedSections = [
        "inicio",
        "ciclo",
        "checklist",
        "guia",
        "mapa",
        "consciente",
        "noticias"
    ].map(id => document.getElementById(id));

    function showSectionAction(sectionId) {
        contextualButtons.forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.section === sectionId
            );
        });
    }

    const sectionObserver = new IntersectionObserver(entries => {
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) {
            showSectionAction(visible[0].target.id);
        }
    }, {
        threshold: [0.2, 0.4, 0.6]
    });

    observedSections.forEach(section => {
        if (section) sectionObserver.observe(section);
    });

    document.getElementById("checklistButton").addEventListener("click", () => {
        openDrawer(document.getElementById("checklistDrawer"));
    });
}
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

    function progress() {
        const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
        const explored = scrollable > 0
            ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
            : 0;
        const percent = Math.round(explored);
        const distanceFromBottom = document.documentElement.scrollHeight - (window.innerHeight + window.scrollY);

        pageProgressValue.textContent = `${percent}%`;
        pageProgressBar.style.width = `${percent}%`;

        pageProgressContainer.classList
            .toggle(
                "visible", window.scrollY > window.innerHeight * 0.10
            );

        if (distanceFromBottom < 300) {
            const extraMargin = 300 - distanceFromBottom;
            pageProgressContainer.style.transform = `translateY(-${extraMargin * 0.2}px)`;
            quickActionsContainer.style.transform = `translateY(-${extraMargin * 0.2}px)`;
        }
        else {
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
    const header = document.getElementById("topbar");
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
