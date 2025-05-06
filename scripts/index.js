import { chargerGroupes, chargerMembres } from "../modules/moduleMembres.js";
import { initializeDiagram, addMembersToDiagram } from "../modules/moduleOrganigramme.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeDiagram();  // appel corrigé
  chargerGroupes();

  const loadBtn = document.getElementById("loadMembersBtn");
  loadBtn.addEventListener("click", () => {
    chargerMembres(ajouterMembresDansDiagramme);
  });

  const groupSelect = document.getElementById("groupSelect");
  groupSelect.addEventListener("change", () => {
    chargerMembres(ajouterMembresDansDiagramme);
  });
});

function ajouterMembresDansDiagramme(membres) {
  const donnees = membres.map((membre, index) => ({
    key: membre.id || index.toString(),
    name: membre.displayName || "Sans nom"
  }));
  console.log("Ajout au diagramme :", donnees);
  addMembersToDiagram(donnees);
}
