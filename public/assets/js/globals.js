
// Estado global da interface

const OVERLAY = document.getElementById("overlay");

let DRAWER = null;
let MODAL = null;

// Dados carregados dos arquivos JSON

let DATA_CATALOG = null;
let DATA_CATEGORIES = null;
let DATA_SUBCATEGORIES = null;
let DATA_EQUIPAMENT = null;
let DATA_COLLECTION_POINTS = null;
let DATA_CHECKLISTS = null;
let DATA_NEWS = null;
let DATA_CAMPAIGNS = null;
let DATA_REFERENCES = null;

// Configuração e carregamento dos arquivos de dados

const DATA_SOURCE = "./data";

const DATA_FILES = [
    "catalog.json",
    "categories.json",
    "subcategories.json",
    "equipment.json",
    "collection-points.json",
    "checklists.json",
    "news.json",
    "campaigns.json",
    "references.json"
];