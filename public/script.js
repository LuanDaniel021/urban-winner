
//#region : interface
{}
//#endregion

//#region : overlay

const overlay = document.getElementById("overlay");

function overlayOpen() {
    if ( !overlay.classList.contains("open") ) {
        overlay.classList.add("open");
    }
}

function overlayClose() {
    if ( overlay.classList.contains("open") ) {
        overlay.classList.remove("open");
    }
}

function overlayToggle() {
    overlay.classList.toggle("open");
}

//#endregion

//#region : drawers

function openDrawer(drawer) {
    overlayOpen();
    drawer.classList.add("open");
    document.body.style.overflow = "hidden";
}

document.querySelectorAll(".drawer")
    .forEach(
        drawer => {
            drawer.querySelector(".drawer-close")
                .addEventListener( "click",
                    () => {
                        overlayClose();
                        drawer.classList.toggle("open");
                        document.body.style.overflow = "";
                    }
                );
        }
    );

//#endregion

//#region : modals

document.querySelectorAll(".modal")
    .forEach(
        modal => {
            modal.querySelector(".modal-close")
                .addEventListener( "click",
                    () => {
                        overlayToggle();
                        modal.classList.toggle("open");
                        document.body.style.overflow = "";
                    }
                );
        }
    );

//#endregion

//#region : BASE PARA EQUIPAMENTOS

const category = {
    informatica: "Informática",
    imagem: "Imagem e áudio",
    casa: "Casa",
    pessoal: "Cuidados pessoais",
    ferramentas: "Ferramentas"
};
const equipment = [
    {
        name: "Celulares e smartphones",
        cat: category.informatica,
        emoji: "📱",
        examples: "Celulares, smartphones, tablets e acessórios.",
        tip: "Apague os dados pessoais e remova chip e cartão de memória."
    },
    {
        name: "Computadores e periféricos",
        cat: category.informatica,
        emoji: "💻",
        examples: "Computadores, notebooks, teclados e mouses.",
        tip: "Faça backup e apague os dados antes da entrega."
    },
    {
        name: "Impressoras e scanners",
        cat: category.informatica,
        emoji: "🖨️",
        examples: "Impressoras, scanners e equipamentos semelhantes.",
        tip: "Confirme se o ponto recebe equipamentos de maior porte."
    },
    {
        name: "Cabos e carregadores",
        cat: category.informatica,
        emoji: "🔌",
        examples: "Cabos, carregadores, adaptadores e conectores.",
        tip: "Agrupe os acessórios para facilitar o transporte."
    },
    {
        name: "Televisores e monitores",
        cat: category.imagem,
        emoji: "📺",
        examples: "Televisores, monitores e telas eletrônicas.",
        tip: "Evite impactos e confirme os limites de tamanho do ponto."
    },
    {
        name: "Áudio e vídeo",
        cat: category.imagem,
        emoji: "🎧",
        examples: "Rádios, caixas de som, fones e amplificadores.",
        tip: "Separe controles e cabos e confirme a aceitação."
    },
    {
        name: "Videogames",
        cat: category.imagem,
        emoji: "🎮",
        examples: "Consoles, controles e acessórios de jogos.",
        tip: "Remova contas e dados pessoais antes da entrega."
    },
    {
        name: "Geladeiras e refrigeradores",
        cat: category.casa,
        emoji: "🧊",
        examples: "Geladeiras, frigobares e refrigeradores domésticos.",
        tip: "Consulte opções de coleta para equipamentos volumosos."
    },
    {
        name: "Lavadoras e cuidados com roupas",
        cat: category.casa,
        emoji: "🧺",
        examples: "Máquinas de lavar, secadoras e ferros elétricos.",
        tip: "Confirme previamente o recebimento de eletrodomésticos grandes."
    },
    {
        name: "Cozinha e preparo de alimentos",
        cat: category.casa,
        emoji: "🍳",
        examples: "Liquidificadores, cafeteiras, torradeiras e micro-ondas.",
        tip: "Desligue e retire alimentos ou líquidos."
    },
    {
        name: "Limpeza doméstica",
        cat: category.casa,
        emoji: "🧹",
        examples: "Aspiradores de pó e equipamentos elétricos de limpeza.",
        tip: "Esvazie reservatórios e acondicione acessórios separadamente."
    },
    {
        name: "Ventilação e climatização",
        cat: category.casa,
        emoji: "❄️",
        examples: "Ventiladores, ar-condicionado e aquecedores.",
        tip: "Equipamentos grandes podem exigir logística específica."
    },
    {
        name: "Cuidados pessoais",
        cat: category.pessoal,
        emoji: "🪒",
        examples: "Barbeadores, depiladores e secadores.",
        tip: "Separe pilhas removíveis e proteja partes cortantes."
    },
    {
        name: "Ferramentas elétricas",
        cat: category.ferramentas,
        emoji: "🛠️",
        examples: "Furadeiras, parafusadeiras e ferramentas elétricas.",
        tip: "Retire baterias somente quando isso for seguro."
    },
    {
        name: "Jardim e área externa",
        cat: category.ferramentas,
        emoji: "🌱",
        examples: "Aparadores de grama e equipamentos elétricos de jardim.",
        tip: "Confirme o porte aceito pelo ponto de coleta."
    }
];

//#endregion

//#region : RENDERIZAÇÃO DO CATÁLOGO
{
    const grid = document.getElementById("equipmentGrid");
    const search = document.getElementById("search");

    let activeFilter = "todos";

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
                category[item.cat] || "Equipamento";
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
    // renderEquipmentTree();
}
//#endregion

//#region : CHECKLIST
{
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

}
//#endregion

//#region : FOLDER E COMPARTILHAMENTO
{
    const shareModal = document.getElementById("share-modal");
    const shareUrl = document.getElementById("shareUrl");

    function openShareModal() {
        overlayOpen();
        shareUrl.value = location.href;
        shareModal.classList.toggle("open");
        document.body.style.overflow = "hidden";
    }

    document.getElementById("shareButton").addEventListener("click", openShareModal);
    document.getElementById("folderShareButton").addEventListener("click", openShareModal);

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

//#region : DETALHES E CONEXÃO EQUIPAMENTO ↔ MAPA
{
    let selectedEquipment = null;

    // A lista permanece vazia até que os pontos reais sejam fornecidos.
    // Cada futuro ponto pode informar: name, lat, lng, address e acceptedCategories.
    const collectionPoints = [];

    function openEquipmentDetail(item) {
        selectedEquipment = item;

        document.getElementById("equipmentDetailTitle").textContent = item.name;
        document.getElementById("equipmentDetailCategory").textContent =
            category[item.cat] || "Equipamento";
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
        // renderSidebar(sidebarSearch.value);
        renderEquipment();
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
}
//#endregion

//#region : CATÁLOGO NA SIDEBAR
{
    // const sidebarList = document.getElementById("sidebarList");
    // const sidebarSearch = document.getElementById("sidebarSearch");

    // function renderSidebar(query = "") {
    //     const normalized = query.toLowerCase().trim();

    //     const filtered = equipment.filter(item => {
    //         return [
    //             item.name,
    //             item.examples,
    //             item.tip,
    //             item.cat
    //         ].join(" ").toLowerCase().includes(normalized);
    //     });

    //     sidebarList.replaceChildren();

    //     if (!filtered.length) {
    //         const empty = document.createElement("p");
    //         empty.className = "empty-state";
    //         empty.textContent = "Nenhum equipamento encontrado.";
    //         sidebarList.appendChild(empty);
    //         return;
    //     }

    //     filtered.forEach(item => {
    //         const card = document.createElement("button");
    //         card.type = "button";
    //         card.className = "drawer-item explorer-equipment-item";

    //         const category = document.createElement("span");
    //         category.className = "equipment-category";
    //         category.textContent = category[item.cat] || "Equipamento";

    //         const title = document.createElement("strong");
    //         title.textContent = `${item.emoji} ${item.name}`;

    //         card.append(category, title);
    //         card.addEventListener("click", () => openEquipmentDetail(item));
    //         sidebarList.appendChild(card);
    //     });
    // }

    // sidebarSearch.addEventListener("input", event => {
    //     renderSidebar(event.target.value);
    // });
}
//#endregion

//#region : ÁRVORE DO EXPLORADOR
{
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
}
//#endregion

//#region : MODAIS INFORMATIVOS
{
     document.querySelectorAll(".step[data-modal]")
        .forEach(
            card => {

                const modal = document.getElementById( card.dataset.modal );

                card.addEventListener("click",
                    () => {
                        overlayToggle();
                        modal.classList.toggle("open");
                        document.body.style.overflow = "hidden";
                    }
                );

            }
        );
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

    document.getElementById("equipmentButton").addEventListener("click", () => {
        // renderSidebar();
        openDrawer(document.getElementById("equipmentDrawer"));
    });

    document.getElementById("checklistButton").addEventListener("click", () => {
        document.getElementById("checklist").scrollIntoView({
            behavior: "smooth"
        });
    });
}
//#endregion

//#region : MENU MOBILE, SEÇÃO ATIVA E PROGRESSO DA PÁGINA
{
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

        pageProgressContainer.classList
            .toggle(
                "visible", window.scrollY > window.innerHeight * 0.10
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

}
//#endregion

//#region : HEADER: ESCONDE AO DESCER
{
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
}
//#endregion

//#region : MODAL DE VÍDEO NO FOOTER
{
    const videoModalOverlay = document.getElementById("videoModalOverlay");
    const openVideoModalBtn = document.getElementById("rafaelVideoTrigger");
    const videoIframe = document.getElementById("videoIframe");

    function openVideoModal() {
        overlayOpen();
        videoIframe.src = "https://www.youtube.com/embed/egYTYpleY0U?autoplay=1";
        videoModalOverlay.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    openVideoModalBtn.addEventListener("click", openVideoModal);

}
//#endregion

//#region : TECLA ESC

document.addEventListener("keydown",
    event => {
        if (event.key !== "Escape") return;
    }
);

//#endregion