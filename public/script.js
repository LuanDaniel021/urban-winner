
/* =========================================
   BASE DE EQUIPAMENTOS
========================================= */

const equipment = [
    {
        name: "Celulares e smartphones",
        cat: "informatica",
        emoji: "📱",
        examples: "Celulares, smartphones, tablets e acessórios.",
        tip: "Apague os dados pessoais e remova chip e cartão de memória."
    },
    {
        name: "Computadores e periféricos",
        cat: "informatica",
        emoji: "💻",
        examples: "Computadores, notebooks, teclados e mouses.",
        tip: "Faça backup e apague os dados antes da entrega."
    },
    {
        name: "Impressoras e scanners",
        cat: "informatica",
        emoji: "🖨️",
        examples: "Impressoras, scanners e equipamentos semelhantes.",
        tip: "Confirme se o ponto recebe equipamentos de maior porte."
    },
    {
        name: "Cabos e carregadores",
        cat: "informatica",
        emoji: "🔌",
        examples: "Cabos, carregadores, adaptadores e conectores.",
        tip: "Agrupe os acessórios para facilitar o transporte."
    },
    {
        name: "Televisores e monitores",
        cat: "imagem",
        emoji: "📺",
        examples: "Televisores, monitores e telas eletrônicas.",
        tip: "Evite impactos e confirme os limites de tamanho do ponto."
    },
    {
        name: "Áudio e vídeo",
        cat: "imagem",
        emoji: "🎧",
        examples: "Rádios, caixas de som, fones e amplificadores.",
        tip: "Separe controles e cabos e confirme a aceitação."
    },
    {
        name: "Videogames",
        cat: "imagem",
        emoji: "🎮",
        examples: "Consoles, controles e acessórios de jogos.",
        tip: "Remova contas e dados pessoais antes da entrega."
    },
    {
        name: "Geladeiras e refrigeradores",
        cat: "casa",
        emoji: "🧊",
        examples: "Geladeiras, frigobares e refrigeradores domésticos.",
        tip: "Consulte opções de coleta para equipamentos volumosos."
    },
    {
        name: "Lavadoras e cuidados com roupas",
        cat: "casa",
        emoji: "🧺",
        examples: "Máquinas de lavar, secadoras e ferros elétricos.",
        tip: "Confirme previamente o recebimento de eletrodomésticos grandes."
    },
    {
        name: "Cozinha e preparo de alimentos",
        cat: "casa",
        emoji: "🍳",
        examples: "Liquidificadores, cafeteiras, torradeiras e micro-ondas.",
        tip: "Desligue e retire alimentos ou líquidos."
    },
    {
        name: "Limpeza doméstica",
        cat: "casa",
        emoji: "🧹",
        examples: "Aspiradores de pó e equipamentos elétricos de limpeza.",
        tip: "Esvazie reservatórios e acondicione acessórios separadamente."
    },
    {
        name: "Ventilação e climatização",
        cat: "casa",
        emoji: "❄️",
        examples: "Ventiladores, ar-condicionado e aquecedores.",
        tip: "Equipamentos grandes podem exigir logística específica."
    },
    {
        name: "Cuidados pessoais",
        cat: "pessoal",
        emoji: "🪒",
        examples: "Barbeadores, depiladores e secadores.",
        tip: "Separe pilhas removíveis e proteja partes cortantes."
    },
    {
        name: "Ferramentas elétricas",
        cat: "ferramentas",
        emoji: "🛠️",
        examples: "Furadeiras, parafusadeiras e ferramentas elétricas.",
        tip: "Retire baterias somente quando isso for seguro."
    },
    {
        name: "Jardim e área externa",
        cat: "ferramentas",
        emoji: "🌱",
        examples: "Aparadores de grama e equipamentos elétricos de jardim.",
        tip: "Confirme o porte aceito pelo ponto de coleta."
    }
];


/* =========================================
   RENDERIZAÇÃO DO CATÁLOGO
========================================= */

const grid = document.getElementById("equipmentGrid");
const search = document.getElementById("search");

let activeFilter = "todos";

const categoryNames = {
    informatica: "Informática",
    imagem: "Imagem e áudio",
    casa: "Casa",
    pessoal: "Cuidados pessoais",
    ferramentas: "Ferramentas"
};

const equipmentTree = document.getElementById("treeGuide");

function renderEquipmentTree() {
    if (!equipmentTree) return;

    equipmentTree.replaceChildren();

    Object.entries(categoryNames).forEach(([category, label]) => {
        const categoryToggle = document.createElement("button");
        categoryToggle.type = "button";
        categoryToggle.className = "tree-toggle";
        categoryToggle.dataset.tree = `tree-${category}`;
        categoryToggle.innerHTML = `
            <i class="fa-solid fa-folder-open"></i>
            ${label}
            <i class="fa-solid fa-chevron-down"></i>
        `;

        const childGroup = document.createElement("div");
        childGroup.id = `tree-${category}`;
        childGroup.className = "tree-children";

        equipment
            .filter(item => item.cat === category)
            .forEach(item => {
                const itemLink = document.createElement("button");
                itemLink.type = "button";
                itemLink.className = "tree-link";
                itemLink.innerHTML = `<i class="fa-solid fa-microchip"></i> ${item.name}`;
                itemLink.addEventListener("click", () => {
                    openEquipmentDetail(item);
                    closeDrawer();
                });
                childGroup.appendChild(itemLink);
            });

        equipmentTree.append(categoryToggle, childGroup);
    });

}

function renderEquipment() {
    const query = search.value.toLowerCase().trim();

    const filtered = equipment.filter(item => {
        const categoryMatch =
            activeFilter === "todos" ||
            item.cat === activeFilter;

        const searchMatch = [
            item.name,
            item.examples,
            item.tip,
            item.cat
        ].join(" ").toLowerCase().includes(query);

        return categoryMatch && searchMatch;
    });

    grid.replaceChildren();

    if (!filtered.length) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "Nenhum equipamento encontrado.";
        grid.appendChild(empty);
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "equipment-card";
        card.setAttribute("aria-label", `Ver orientações para ${item.name}`);
        card.innerHTML = `
            <span class="equipment-category"></span>
            <span class="equipment-card-main">
                <span class="equipment-emoji"></span>
                <strong class="equipment-name"></strong>
                <i class="fa-solid fa-chevron-right"></i>
            </span>
        `;

        card.querySelector(".equipment-category").textContent =
            categoryNames[item.cat] || "Equipamento";
        card.querySelector(".equipment-emoji").textContent = item.emoji;
        card.querySelector(".equipment-name").textContent = item.name;
        card.addEventListener("click", () => openEquipmentDetail(item));

        grid.appendChild(card);
    });
}

search.addEventListener("input", renderEquipment);

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        activeFilter = button.dataset.filter;
        renderEquipment();
    });
});

document.getElementById("clear").addEventListener("click", () => {
    search.value = "";
    activeFilter = "todos";

    document.querySelectorAll(".filter").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === "todos"
        );
    });

    renderEquipment();
});

renderEquipment();
renderEquipmentTree();


/* =========================================
   CHECKLIST
========================================= */

const checks = [
    ...document.querySelectorAll(
        '#checklist input[type="checkbox"]'
    )
];

function updateProgress() {
    const completed = checks.filter(item => item.checked).length;
    const percent = Math.round(completed / checks.length * 100);

    document.getElementById("progress").textContent =
        `${completed} de ${checks.length} concluídos`;

    document.getElementById("progressLabel").textContent =
        `${percent}%`;

    document.getElementById("progressBar").style.width =
        `${percent}%`;
}

checks.forEach(check => {
    check.addEventListener("change", updateProgress);
});

document.getElementById("resetChecks").addEventListener("click", () => {
    checks.forEach(check => check.checked = false);
    updateProgress();
});

updateProgress();


/* =========================================
   MAPA LEAFLET
========================================= */

const map = L.map("map", {
    scrollWheelZoom: false
}).setView([-26.25, -51.07], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Nenhum ponto fictício.
// Os pontos reais serão cadastrados futuramente em collectionPoints.
// A estrutura de filtros/compatibilidade já está preparada para acceptedCategories.


const mapObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => map.invalidateSize(), 150);
        }
    });
});

mapObserver.observe(document.getElementById("map"));


/* =========================================
   FOLDER E COMPARTILHAMENTO
========================================= */

const shareModalOverlay = document.getElementById("shareModalOverlay");
const shareModalClose = document.getElementById("shareModalClose");
const shareUrl = document.getElementById("shareUrl");

function openShareModal() {
    shareUrl.value = location.href;
    shareModalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    shareModalClose.focus();
}

function closeShareModal() {
    shareModalOverlay.classList.remove("open");

    if (!activeDrawer && !modalOverlay.classList.contains("open")) {
        document.body.style.overflow = "";
    }
}

document.getElementById("shareButton").addEventListener("click", openShareModal);
document.getElementById("folderShareButton").addEventListener("click", openShareModal);
shareModalClose.addEventListener("click", closeShareModal);

shareModalOverlay.addEventListener("click", event => {
    if (event.target === shareModalOverlay) closeShareModal();
});

document.getElementById("copyShareUrl").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(shareUrl.value);
        showFeedback("Link copiado!");
    } catch (error) {
        shareUrl.focus();
        shareUrl.select();
        try {
            document.execCommand("copy");
            showFeedback("Link copiado!");
        } catch (copyError) {
            showFeedback("Selecione e copie o link manualmente.");
        }
    }
});

/* =========================================
   FEEDBACK
========================================= */

const feedback = document.getElementById("feedback");
let feedbackTimer;

function showFeedback(message) {
    feedback.textContent = message;
    feedback.classList.add("show");

    clearTimeout(feedbackTimer);

    feedbackTimer = setTimeout(() => {
        feedback.classList.remove("show");
    }, 2500);
}




/* =========================================
   PAINÉIS LATERAIS
========================================= */

const overlay = document.getElementById("overlay");

const drawers = [
    document.getElementById("drawer"),
    document.getElementById("equipmentDrawer"),
    document.getElementById("equipmentDetailDrawer"),
    document.getElementById("mapDrawer")
];

let activeDrawer = null;

function openDrawer(drawer) {
    closeDrawer();

    activeDrawer = drawer;
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeDrawer() {
    drawers.forEach(drawer => drawer.classList.remove("open"));

    overlay.classList.remove("open");
    activeDrawer = null;

    if (!document.getElementById("modalOverlay").classList.contains("open")) {
        document.body.style.overflow = "";
    }
}

document.getElementById("explorerToggle").addEventListener("click", () => {
    openDrawer(document.getElementById("drawer"));
});

document.getElementById("equipmentButton").addEventListener("click", () => {
    renderSidebar();
    openDrawer(document.getElementById("equipmentDrawer"));
});

document.getElementById("mapButton").addEventListener("click", () => {
    openDrawer(document.getElementById("mapDrawer"));
});

document.getElementById("closeDrawer").addEventListener("click", closeDrawer);

document.querySelectorAll("[data-close-drawer]").forEach(button => {
    button.addEventListener("click", closeDrawer);
});

overlay.addEventListener("click", closeDrawer);


/* =========================================
   DETALHES E CONEXÃO EQUIPAMENTO ↔ MAPA
========================================= */

let selectedEquipment = null;

// A lista permanece vazia até que os pontos reais sejam fornecidos.
// Cada futuro ponto pode informar: name, lat, lng, address e acceptedCategories.
const collectionPoints = [];

function openEquipmentDetail(item) {
    selectedEquipment = item;

    document.getElementById("equipmentDetailTitle").textContent = item.name;
    document.getElementById("equipmentDetailCategory").textContent =
        categoryNames[item.cat] || "Equipamento";
    document.getElementById("equipmentDetailEmoji").textContent = item.emoji;
    document.getElementById("equipmentDetailExamples").textContent = item.examples;
    document.getElementById("equipmentDetailTip").textContent = item.tip;

    const steps = [
        "Desligue o equipamento e desconecte os cabos.",
        item.cat === "informatica"
            ? "Faça backup e remova dados pessoais, chips e cartões de memória."
            : "Retire acessórios e componentes removíveis apenas quando isso for seguro.",
        "Proteja o equipamento durante o transporte e confirme o que o ponto recebe."
    ];

    const list = document.getElementById("equipmentDetailSteps");
    list.replaceChildren();
    steps.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        list.appendChild(li);
    });

    const hint = document.getElementById("compatiblePointsHint");
    hint.textContent = collectionPoints.length
        ? "Os pontos compatíveis serão destacados no mapa."
        : "Ainda não há pontos fixos cadastrados. Quando forem adicionados, os locais compatíveis serão destacados no mapa.";

    // A seleção já prepara o destaque; o botão abaixo leva o usuário até o mapa.
    highlightCompatiblePoints(false);
    openDrawer(document.getElementById("equipmentDetailDrawer"));
}

document.getElementById("backToEquipmentList").addEventListener("click", () => {
    renderSidebar(sidebarSearch.value);
    openDrawer(document.getElementById("equipmentDrawer"));
});

document.getElementById("compatiblePointsButton").addEventListener("click", () => {
    closeDrawer();
    document.getElementById("mapa").scrollIntoView({ behavior: "smooth" });
    highlightCompatiblePoints();
});

function highlightCompatiblePoints(showMessage = true) {
    if (!selectedEquipment || !collectionPoints.length) {
        if (showMessage) {
            showFeedback("Os pontos de coleta serão adicionados ao mapa posteriormente.");
        }
        return;
    }

    const compatible = collectionPoints.filter(point =>
        (point.acceptedCategories || []).includes(selectedEquipment.cat)
    );

    collectionPoints.forEach(point => {
        if (point.marker) {
            const isCompatible = compatible.includes(point);
            point.marker.setOpacity(isCompatible ? 1 : 0.25);
            if (isCompatible) {
                const element = point.marker.getElement();
                if (element) {
                    element.classList.remove("marker-highlight");
                    void element.offsetWidth;
                    element.classList.add("marker-highlight");
                }
            }
        }
    });

    if (showMessage) {
        showFeedback(
            compatible.length
                ? `${compatible.length} ponto(s) compatível(is) destacado(s).`
                : "Nenhum ponto cadastrado recebe esta categoria."
        );
    }
}

/* =========================================
   CATÁLOGO NA SIDEBAR
========================================= */

const sidebarList = document.getElementById("sidebarList");
const sidebarSearch = document.getElementById("sidebarSearch");

function renderSidebar(query = "") {
    const normalized = query.toLowerCase().trim();

    const filtered = equipment.filter(item => {
        return [
            item.name,
            item.examples,
            item.tip,
            item.cat
        ].join(" ").toLowerCase().includes(normalized);
    });

    sidebarList.replaceChildren();

    if (!filtered.length) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Nenhum equipamento encontrado.";
        sidebarList.appendChild(empty);
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "drawer-item explorer-equipment-item";

        const category = document.createElement("span");
        category.className = "equipment-category";
        category.textContent = categoryNames[item.cat] || "Equipamento";

        const title = document.createElement("strong");
        title.textContent = `${item.emoji} ${item.name}`;

        card.append(category, title);
        card.addEventListener("click", () => openEquipmentDetail(item));
        sidebarList.appendChild(card);
    });
}

sidebarSearch.addEventListener("input", event => {
    renderSidebar(event.target.value);
});


/* =========================================
   ÁRVORE DO EXPLORADOR
========================================= */

document.querySelectorAll(".tree-toggle").forEach(button => {
    button.addEventListener("click", () => {
        const tree = document.getElementById(button.dataset.tree);
        if (tree) {
            tree.classList.toggle("open");
        }
    });
});

document.querySelectorAll(".tree-link").forEach(link => {
    link.addEventListener("click", () => {
        if (link.getAttribute("href")?.startsWith("#")) {
            closeDrawer();
        }
    });
});


/* =========================================
   MODAIS INFORMATIVOS
========================================= */

const modalData = {
    prepare: {
        title: "Prepare seu equipamento",
        description:
            "Alguns cuidados ajudam a proteger seus dados e facilitam o processo de descarte.",
        content: `
            <h3>1. Proteja seus dados</h3>
            <p>Faça backup dos arquivos importantes. Em celulares e computadores, restaure as configurações de fábrica ou apague os dados pessoais de forma segura.</p>

            <h3>2. Separe os componentes</h3>
            <p>Remova chips e cartões de memória. Pilhas e baterias removíveis devem ser encaminhadas conforme as orientações específicas de recebimento.</p>

            <h3>3. Organize os equipamentos</h3>
            <p>Junte cabos e acessórios relacionados para facilitar a identificação e o transporte.</p>

            <h3>Antes de continuar</h3>
            <p>Não desmonte equipamentos perigosos ou componentes que você não saiba manusear com segurança.</p>
        `
    },

    entregue: {
        title: "Entregue no local correto",
        description:
            "O encaminhamento correto evita o descarte inadequado e permite que os resíduos recebam tratamento apropriado.",
        content: `
            <h3>1. Encontre um ponto de coleta</h3>
            <p>Consulte os localizadores oficiais da ABREE e da Green Eletron.</p>

            <h3>2. Confirme o que é aceito</h3>
            <p>Nem todos os pontos recebem todos os tipos de equipamentos. Verifique categorias, horários e restrições.</p>

            <h3>3. Transporte com cuidado</h3>
            <p>Proteja telas e componentes frágeis. Equipamentos grandes podem exigir uma modalidade específica de coleta.</p>

            <h3>Importante</h3>
            <p>Não abandone eletrônicos em calçadas, terrenos ou locais sem autorização.</p>
        `
    },

    reaproveite: {
        title: "Reaproveite sempre que possível",
        description:
            "Nem todo equipamento sem uso precisa ser descartado imediatamente.",
        content: `
            <h3>1. Avalie se ainda funciona</h3>
            <p>Um equipamento em boas condições pode continuar sendo utilizado por outra pessoa.</p>

            <h3>2. Considere reparar</h3>
            <p>Quando for viável e seguro, avalie a possibilidade de conserto.</p>

            <h3>3. Doe ou compartilhe</h3>
            <p>Equipamentos funcionais podem ser doados ou destinados a projetos que aproveitem seus componentes.</p>

            <h3>4. Recicle quando necessário</h3>
            <p>Quando não houver possibilidade de reutilização, encaminhe o equipamento para um sistema adequado de logística reversa.</p>
        `
    }
};

const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");

let lastFocused = null;

function openModal(type, card) {
    const data = modalData[type];
    if (!data) return;

    lastFocused = card || document.activeElement;

    document.getElementById("modalTitle").textContent = data.title;
    document.getElementById("modalDescription").textContent = data.description;
    document.getElementById("modalContent").innerHTML = data.content;

    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    modalClose.focus();
}

function closeModal() {
    modalOverlay.classList.remove("open");

    if (!activeDrawer && !shareModalOverlay.classList.contains("open")) {
        document.body.style.overflow = "";
    }

    if (lastFocused?.focus) {
        lastFocused.focus();
    }
}

document.querySelectorAll(".step[data-modal]").forEach(card => {
    card.addEventListener("click", () => {
        openModal(card.dataset.modal, card);
    });

    card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openModal(card.dataset.modal, card);
        }
    });
});

modalClose.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", event => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});


/* =========================================
   AÇÕES CONTEXTUAIS
========================================= */

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

document.getElementById("equipmentButton").addEventListener("click", () => {
    renderSidebar();
    openDrawer(document.getElementById("equipmentDrawer"));
});

document.getElementById("checklistButton").addEventListener("click", () => {
    document.getElementById("checklist").scrollIntoView({
        behavior: "smooth"
    });
});


/* =========================================
   MENU MOBILE, SEÇÃO ATIVA E PROGRESSO DA PÁGINA
========================================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

const navigationSections = [
    "inicio", "ciclo", "checklist", "guia", "mapa", "consciente", "noticias"
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
}, { threshold: [0.25, 0.5, 0.7] });

navigationSections.forEach(section => navObserver.observe(section));

const pageProgressValue = document.getElementById("pageProgressValue");
const pageProgressLabel = document.getElementById("pageProgressLabel");
const pageProgressBar = document.getElementById("pageProgressBar");
const pageProgress = document.getElementById("pageProgress");
const backToTop = document.getElementById("backToTop");
const pageProgressContainer = document.getElementById("pageProgressContainer");
const quickActionsContainer = document.getElementById("quickActionsContainer");


function updatePageProgress() {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const explored = scrollable > 0
        ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
        : 0;
    const percent = Math.round(explored);
    
    // Distância atual até o fundo da página (em pixels)
    const distanceFromBottom = document.documentElement.scrollHeight - (window.innerHeight + window.scrollY);
    const nearBottom = distanceFromBottom <= 120;

    // Comportamento normal
    pageProgressLabel.textContent = "explorado";
    pageProgressValue.textContent = `${percent}%`;
    pageProgressBar.style.width = `${percent}%`;

    pageProgressContainer.classList.toggle(
        "visible", window.scrollY > window.innerHeight * 0.7
    );

    // Se estiver a menos de 300px do fim, começa a empurrar o elemento para cima de forma dinâmica
    if (distanceFromBottom < 300) {
        // Quanto mais perto do 0 o distanceFromBottom fica, maior o incremento na margem
        const extraMargin = 300 - distanceFromBottom; 
        pageProgressContainer.style.transform = `translateY(-${extraMargin * 0.2}px)`; 
        quickActionsContainer.style.transform = `translateY(-${extraMargin * 0.2}px)`; 
        
        // Ou você pode manipular o style.marginBottom se preferir
    } else {
        pageProgressContainer.style.transform = "translateY(0px)";
        quickActionsContainer.style.transform = "translateY(0px)";
    }
}

window.addEventListener("scroll", updatePageProgress, { passive: true });
window.addEventListener("resize", updatePageProgress);
backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
updatePageProgress();


backToTop.classList.toggle(
        "visible", window.scrollY > window.innerHeight * 0.7 && !nearBottom);

/* =========================================
   HEADER: ESCONDE AO DESCER
========================================= */

const topbar = document.getElementById("topbar");
let previousScroll = window.scrollY;

window.addEventListener("scroll", () => {
    const current = window.scrollY;
    const difference = current - previousScroll;

    if (current < 80) {
        topbar.classList.remove("hidden");
    } else if (difference > 4) {
        topbar.classList.add("hidden");
    } else if (difference < -4) {
        topbar.classList.remove("hidden");
    }

    previousScroll = current;
}, { passive: true });


/* =========================================
   TECLA ESC
========================================= */

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    if (shareModalOverlay.classList.contains("open")) {
        closeShareModal();
        return;
    }

    if (modalOverlay.classList.contains("open")) {
        closeModal();
        return;
    }

    if (activeDrawer) {
        closeDrawer();
    }
});

/* =========================================
    MODAL DE VÍDEO NO FOOTER
========================================= */

const videoModalOverlay = document.getElementById("videoModalOverlay");
const openVideoModalBtn = document.getElementById("rafaelVideoTrigger");
const videoModalClose = document.getElementById("videoModalClose");
const videoIframe = document.getElementById("videoIframe");

// URL de exibição embutida (Embed) do vídeo do YouTube Shorts
const videoUrl = "https://www.youtube.com/embed/egYTYpleY0U?autoplay=1";

function openVideoModal() {
    videoIframe.src = videoUrl;
    videoModalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    videoModalClose.focus();
}

function closeVideoModal() {
    videoIframe.src = ""; // Interrompe a reprodução do áudio/vídeo ao fechar
    videoModalOverlay.classList.remove("open");

    if (!activeDrawer && !shareModalOverlay.classList.contains("open") && !modalOverlay.classList.contains("open")) {
        document.body.style.overflow = "";
    }
}

if (openVideoModalBtn) {
    openVideoModalBtn.addEventListener("click", openVideoModal);
}

if (videoModalClose) {
    videoModalClose.addEventListener("click", closeVideoModal);
}

if (videoModalOverlay) {
    videoModalOverlay.addEventListener("click", event => {
        if (event.target === videoModalOverlay) closeVideoModal();
    });
}

// Suporte para fechar com a tecla ESC
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && videoModalOverlay.classList.contains("open")) {
        closeVideoModal();
    }
});
