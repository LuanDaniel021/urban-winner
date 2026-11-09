
/* FOLDER INDEPENDENTE — IMPRIMIR OU SALVAR COMO PDF */
document.getElementById("downloadBrochure")?.addEventListener("click", () => {
  window.print();
});

/* EQUIPAMENTOS */

const equipment = [
  {
    name: "Celulares e smartphones",
    cat: "informatica",
    emoji: "📱",
    examples: "Celular, smartphone, tablet e acessórios de informática.",
    tip: "Apague os dados pessoais e remova o chip e o cartão de memória."
  },
  {
    name: "Computadores e periféricos",
    cat: "informatica",
    emoji: "💻",
    examples: "Computador, notebook, teclado, mouse e acessórios.",
    tip: "Faça backup e apague os dados antes da entrega."
  },
  {
    name: "Impressoras e scanners",
    cat: "informatica",
    emoji: "🖨️",
    examples: "Impressora, scanner e equipamentos semelhantes.",
    tip: "Confirme se o ponto recebe equipamentos de maior porte."
  },
  {
    name: "Cabos, carregadores e adaptadores",
    cat: "informatica",
    emoji: "🔌",
    examples: "Carregador, cabo, adaptador e adaptador wireless USB.",
    tip: "Junte cabos soltos para facilitar o transporte."
  },
  {
    name: "Televisores e monitores",
    cat: "imagem",
    emoji: "📺",
    examples: "Aparelho de televisão e telas eletrônicas.",
    tip: "Evite impactos e confirme limites de tamanho do ponto."
  },
  {
    name: "Áudio e vídeo",
    cat: "imagem",
    emoji: "🎧",
    examples: "Rádio, caixa de som, amplificador, Blu-ray e videogame.",
    tip: "Separe controles e cabos; confirme a aceitação de cada item."
  },
  {
    name: "Geladeiras e refrigeradores",
    cat: "casa",
    emoji: "🧊",
    examples: "Geladeira, frigobar e outros equipamentos de refrigeração doméstica.",
    tip: "Por ser volumoso, consulte opções de coleta ou entrega antes."
  },
  {
    name: "Lavadoras e cuidados com roupas",
    cat: "casa",
    emoji: "🧺",
    examples: "Máquina de lavar, secadora e aparelhos elétricos para engomar.",
    tip: "Confirme previamente se o local recebe eletrodomésticos grandes."
  },
  {
    name: "Cozinha e preparo de alimentos",
    cat: "casa",
    emoji: "🍳",
    examples: "Liquidificador, batedeira, cafeteira, torradeira e micro-ondas.",
    tip: "O equipamento deve estar desligado e sem alimentos ou líquidos."
  },
  {
    name: "Limpeza doméstica",
    cat: "casa",
    emoji: "🧹",
    examples: "Aspirador de pó e aspirador de janela.",
    tip: "Esvazie reservatórios e acondicione acessórios separadamente."
  },
  {
    name: "Cuidados pessoais",
    cat: "pessoal",
    emoji: "🪒",
    examples: "Aparelho de barbear, aparador de barba, depilador e secador.",
    tip: "Separe pilhas removíveis e proteja lâminas ou partes cortantes."
  },
  {
    name: "Ferramentas elétricas",
    cat: "ferramentas",
    emoji: "🛠️",
    examples: "Ferramentas elétricas domésticas e seus acessórios.",
    tip: "Retire bateria removível somente se isso for seguro e simples."
  },
  {
    name: "Jardim e área externa",
    cat: "ferramentas",
    emoji: "🌱",
    examples: "Aparador de grama, bomba de jardim e equipamentos elétricos domésticos.",
    tip: "Limpe sujeira superficial e confirme o porte aceito pelo ponto."
  },
  {
    name: "Ventilação e climatização",
    cat: "casa",
    emoji: "❄️",
    examples: "Ar-condicionado, aparelho de aquecimento e ventilador.",
    tip: "Equipamentos grandes podem exigir logística específica; não desinstale sistemas por conta própria."
  },
  {
    name: "Pequenos aparelhos e balanças",
    cat: "casa",
    emoji: "⚖️",
    examples: "Balança, abridor elétrico, adega e outros aparelhos domésticos.",
    tip: "Consulte o localizador pelo nome do produto para confirmar a aceitação."
  }
];

let active = "todos";

const equipmentGrid = document.getElementById("equipmentGrid");
const searchInput = document.getElementById("search");

function render() {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = equipment.filter(item => {
    const matchesCategory =
      active === "todos" || item.cat === active;

    const matchesSearch = [
      item.name,
      item.examples,
      item.tip,
      item.cat
    ].join(" ").toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  equipmentGrid.replaceChildren();

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nenhum equipamento encontrado.";
    equipmentGrid.appendChild(empty);
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "equipment-card";

    const emoji = document.createElement("div");
    emoji.className = "equipment-emoji";
    emoji.textContent = item.emoji;

    const title = document.createElement("h3");
    title.textContent = item.name;

    const examples = document.createElement("p");
    examples.textContent = item.examples;

    const tip = document.createElement("p");
    tip.className = "equipment-tip";
    tip.textContent = item.tip;

    card.append(emoji, title, examples, tip);
    equipmentGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", render);

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    active = button.dataset.filter;
    render();
  });
});

document.getElementById("clear").addEventListener("click", () => {
  searchInput.value = "";
  active = "todos";

  document.querySelectorAll(".filter").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.filter === "todos"
    );
  });

  render();
});

render();


/* CHECKLIST */

const checks = [...document.querySelectorAll(
  '#checklist input[type="checkbox"]'
)];

function updateProgress() {
  const completed = checks.filter(check => check.checked).length;
  const percentage = Math.round((completed / checks.length) * 100);

  document.getElementById("progress").textContent =
    `${completed} de ${checks.length} concluídos`;

  document.getElementById("progressLabel").textContent =
    `${percentage}%`;

  document.getElementById("progressBar").style.width =
    `${percentage}%`;
}

checks.forEach(check => {
  check.addEventListener("change", updateProgress);
});

document.getElementById("resetChecks").addEventListener("click", () => {
  checks.forEach(check => check.checked = false);
  updateProgress();
});

updateProgress();


/* LEAFLET */

const map = L.map("map", {
  scrollWheelZoom: false
}).setView([-26.25, -51.07], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Não foram adicionados marcadores fictícios.
// Pontos reais poderão ser inseridos quando verificados.


/* FEEDBACK */

const feedback = document.getElementById("actionFeedback");
let feedbackTimeout;

function showActionFeedback(message) {
  feedback.textContent = message;
  feedback.classList.add("show");

  clearTimeout(feedbackTimeout);

  feedbackTimeout = setTimeout(() => {
    feedback.classList.remove("show");
  }, 2600);
}


/* COMPARTILHAMENTO FIXO */

document.getElementById("shareButton").addEventListener("click", async () => {
  const shareData = {
    title: "Descarte Certo",
    text: "Aprenda a descartar corretamente seus equipamentos eletrônicos.",
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      showActionFeedback("Link copiado!");
    } else {
      showActionFeedback("Compartilhamento indisponível neste navegador.");
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      showActionFeedback("Não foi possível compartilhar.");
    }
  }
});


/* SIDEBARS DIREITAS */

const sideOverlay = document.getElementById("sideOverlay");
const equipmentSidebar = document.getElementById("equipmentSidebar");
const mapSidebar = document.getElementById("mapSidebar");

let activeSidebar = null;

function openRightSidebar(sidebar) {
  closeRightSidebar();

  activeSidebar = sidebar;
  sidebar.classList.add("open");
  sideOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeRightSidebar() {
  equipmentSidebar.classList.remove("open");
  mapSidebar.classList.remove("open");
  sideOverlay.classList.remove("open");

  activeSidebar = null;

  if (!document.getElementById("stepModal").classList.contains("open") &&
      !document.getElementById("pageExplorer").classList.contains("open")) {
    document.body.style.overflow = "";
  }
}

document.getElementById("mapPointsButton").addEventListener("click", () => {
  openRightSidebar(mapSidebar);
});

document.getElementById("equipmentButton").addEventListener("click", () => {
  renderSidebarEquipment();
  openRightSidebar(equipmentSidebar);
});

document.getElementById("closeMapSidebar").addEventListener(
  "click",
  closeRightSidebar
);

document.getElementById("closeEquipmentSidebar").addEventListener(
  "click",
  closeRightSidebar
);

sideOverlay.addEventListener("click", closeRightSidebar);


/* CATÁLOGO NA SIDEBAR */

const sidebarEquipmentList =
  document.getElementById("sidebarEquipmentList");

const sidebarEquipmentSearch =
  document.getElementById("sidebarEquipmentSearch");

function renderSidebarEquipment(query = "") {
  const normalized = query.toLowerCase().trim();

  const filtered = equipment.filter(item => {
    return [
      item.name,
      item.examples,
      item.tip,
      item.cat
    ].join(" ").toLowerCase().includes(normalized);
  });

  sidebarEquipmentList.replaceChildren();

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Nenhum equipamento encontrado.";
    sidebarEquipmentList.appendChild(empty);
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "equipment-sidebar-item";

    const title = document.createElement("h3");
    title.textContent = `${item.emoji} ${item.name}`;

    const description = document.createElement("p");
    description.textContent = item.examples;

    const tip = document.createElement("p");
    tip.className = "item-tip";
    tip.textContent = item.tip;

    card.append(title, description, tip);

    card.addEventListener("click", () => {
      searchInput.value = item.name;
      active = "todos";

      document.querySelectorAll(".filter").forEach(button => {
        button.classList.toggle(
          "active",
          button.dataset.filter === "todos"
        );
      });

      render();
      closeRightSidebar();

      document.getElementById("guia").scrollIntoView({
        behavior: "smooth"
      });
    });

    sidebarEquipmentList.appendChild(card);
  });
}

sidebarEquipmentSearch.addEventListener("input", event => {
  renderSidebarEquipment(event.target.value);
});


/* EXPLORADOR DA PÁGINA - ESQUERDA */

const pageExplorer = document.getElementById("pageExplorer");
const explorerOverlay = document.getElementById("explorerOverlay");

function openExplorer() {
  closeExplorer();

  pageExplorer.classList.add("open");
  explorerOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeExplorer() {
  pageExplorer.classList.remove("open");
  explorerOverlay.classList.remove("open");

  if (!document.getElementById("stepModal").classList.contains("open") &&
      !activeSidebar) {
    document.body.style.overflow = "";
  }
}

document.getElementById("explorerToggle").addEventListener(
  "click",
  openExplorer
);

document.getElementById("closeExplorer").addEventListener(
  "click",
  closeExplorer
);

explorerOverlay.addEventListener("click", closeExplorer);

document.querySelectorAll(".tree-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const tree = document.getElementById(button.dataset.tree);
    tree.classList.toggle("open");
  });
});

document.querySelectorAll(".tree-link").forEach(link => {
  link.addEventListener("click", () => {
    closeExplorer();
  });
});


/* MODAIS DOS CARTÕES */

const modalData = {
  prepare: {
    title: "Prepare seu equipamento",
    description:
      "Antes de encaminhar um eletrônico para reciclagem, alguns cuidados ajudam a proteger seus dados e facilitam o processo de descarte.",
    content: `
      <h3>1. Proteja seus dados</h3>
      <p>Faça backup dos arquivos importantes. Em celulares e computadores, restaure as configurações de fábrica ou apague os dados pessoais de forma segura.</p>

      <h3>2. Separe os componentes</h3>
      <p>Remova chips e cartões de memória. Pilhas e baterias removíveis devem ser encaminhadas conforme as orientações específicas de recebimento.</p>

      <h3>3. Organize os equipamentos</h3>
      <p>Junte cabos e acessórios relacionados. Isso facilita a identificação dos itens e o transporte até o ponto de coleta.</p>

      <h3>Antes de continuar</h3>
      <p>Não desmonte equipamentos perigosos ou componentes que você não saiba manusear com segurança.</p>
    `
  },

  entregue: {
    title: "Entregue no local correto",
    description:
      "O encaminhamento correto garante que os resíduos eletrônicos recebam tratamento adequado e não sejam descartados junto ao lixo comum.",
    content: `
      <h3>1. Encontre um ponto de coleta</h3>
      <p>Consulte os localizadores oficiais da ABREE e da Green Eletron para encontrar locais de recebimento.</p>

      <h3>2. Confirme o que é aceito</h3>
      <p>Nem todos os pontos recebem todos os tipos de equipamentos. Verifique previamente as categorias aceitas, os horários e possíveis restrições.</p>

      <h3>3. Transporte com cuidado</h3>
      <p>Proteja telas e componentes frágeis. Equipamentos grandes podem exigir uma modalidade específica de coleta.</p>

      <h3>Importante</h3>
      <p>Não abandone eletrônicos em calçadas, terrenos ou locais sem autorização para recebê-los.</p>
    `
  },

  reaproveite: {
    title: "Reaproveite sempre que possível",
    description:
      "Nem todo equipamento sem uso precisa ser descartado imediatamente. Prolongar sua vida útil também é uma forma importante de reduzir impactos ambientais.",
    content: `
      <h3>1. Avalie se ainda funciona</h3>
      <p>Um equipamento que ainda está em boas condições pode continuar sendo utilizado por outra pessoa.</p>

      <h3>2. Considere reparar</h3>
      <p>Quando for viável e seguro, avalie a possibilidade de conserto antes de substituir o aparelho.</p>

      <h3>3. Doe ou compartilhe</h3>
      <p>Equipamentos funcionais podem ser doados ou destinados a projetos que aproveitem seus componentes.</p>

      <h3>4. Recicle quando necessário</h3>
      <p>Quando não houver possibilidade de reutilização, encaminhe o equipamento para um sistema adequado de logística reversa.</p>
    `
  }
};

const stepModal = document.getElementById("stepModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");

let lastFocusedCard = null;

function openStepModal(type, card) {
  const data = modalData[type];
  if (!data) return;

  lastFocusedCard = card || document.activeElement;

  modalTitle.textContent = data.title;
  modalDescription.textContent = data.description;
  modalContent.innerHTML = data.content;

  stepModal.classList.add("open");
  stepModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  modalClose.focus();
}

function closeStepModal() {
  stepModal.classList.remove("open");
  stepModal.setAttribute("aria-hidden", "true");

  if (!activeSidebar &&
      !pageExplorer.classList.contains("open")) {
    document.body.style.overflow = "";
  }

  if (lastFocusedCard && typeof lastFocusedCard.focus === "function") {
    lastFocusedCard.focus();
  }
}

document.querySelectorAll(".step[data-modal]").forEach(card => {
  card.addEventListener("click", () => {
    openStepModal(card.dataset.modal, card);
  });

  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openStepModal(card.dataset.modal, card);
    }
  });
});

modalClose.addEventListener("click", closeStepModal);

stepModal.addEventListener("click", event => {
  if (event.target === stepModal) {
    closeStepModal();
  }
});


/* AÇÕES CONTEXTUAIS */

const actionButtons = document.querySelectorAll(
  ".quick-action[data-section]"
);

const sections = [
  "inicio",
  "guia",
  "checklist",
  "pontos",
  "folder",
  "consciente"
].map(id => document.getElementById(id));

function showSectionAction(sectionId) {
  actionButtons.forEach(button => {
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
  threshold: [0.15, 0.35, 0.55]
});

sections.forEach(section => {
  if (section) sectionObserver.observe(section);
});

// Ações contextuais que não precisam de uma sidebar.
document.querySelector('[data-section="checklist"]')
  .addEventListener("click", () => {
    document.getElementById("checklist").scrollIntoView({
      behavior: "smooth"
    });
  });


/* HEADER: ESCONDE AO DESCER E APARECE AO SUBIR */

const topbar = document.getElementById("topbar");
let previousScroll = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  const difference = currentScroll - previousScroll;

  if (currentScroll < 80) {
    topbar.classList.remove("header-hidden");
  } else if (difference > 4) {
    topbar.classList.add("header-hidden");
  } else if (difference < -4) {
    topbar.classList.remove("header-hidden");
  }

  previousScroll = currentScroll;
}, { passive: true });


/* ESC FECHA PAINÉIS E MODAL */

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;

  if (stepModal.classList.contains("open")) {
    closeStepModal();
    return;
  }

  if (activeSidebar) {
    closeRightSidebar();
    return;
  }

  if (pageExplorer.classList.contains("open")) {
    closeExplorer();
  }
});


/* AJUSTE DO MAPA APÓS VISUALIZAÇÃO */

const mapObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => map.invalidateSize(), 150);
    }
  });
});

mapObserver.observe(document.getElementById("map"));
