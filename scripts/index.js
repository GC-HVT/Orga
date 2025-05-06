import { chargerGroupes, chargerMembres } from "../modules/moduleMembres.js";
import {
  initializeDiagram,
  addNode,
  addLink,
  resetDiagram,
  exportDiagram,
  addMembersToDiagram
} from "../modules/moduleOrganigramme.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeDiagram();

  chargerGroupes();

  const loadBtn = document.getElementById("loadMembersBtn");
  if (loadBtn) {
    loadBtn.addEventListener("click", () => {
      chargerMembres(ajouterMembresDansDiagramme);
    });
  }

  const groupSelect = document.getElementById("groupSelect");
  if (groupSelect) {
    groupSelect.addEventListener("change", () => {
      chargerMembres(ajouterMembresDansDiagramme);
    });
  }

  document.getElementById("addNodeBtn")?.addEventListener("click", addNode);
  document.getElementById("addLinkBtn")?.addEventListener("click", addLink);
  document.getElementById("resetBtn")?.addEventListener("click", resetDiagram);
  document.getElementById("exportBtn")?.addEventListener("click", exportDiagram);
});

function ajouterMembresDansDiagramme(membres) {
  const donnees = membres.map((membre, index) => ({
    key: membre.id || index.toString(),
    name: membre.displayName || "Sans nom"
  }));
  console.log("Ajout au diagramme :", donnees);
  addMembersToDiagram(donnees);
}
