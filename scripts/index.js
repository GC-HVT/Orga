// index.js
import { chargerGroupes, chargerMembres } from "../modules/moduleMembres.js";
import { initDiagram, addMembersToDiagram, clearDiagram } from "../modules/moduleOrganigramme.js";

// Initialiser le diagramme dans l'élément HTML
document.addEventListener("DOMContentLoaded", () => {
  // Initialisation du diagramme
  initDiagram("myDiagramDiv");

  // Charger les groupes au démarrage
  chargerGroupes();

  // Ajouter l'événement de chargement des membres lorsque le bouton est cliqué
  const loadMembersBtn = document.getElementById("loadMembersBtn");
  loadMembersBtn.addEventListener("click", chargerMembres);

  // Initialiser les actions de création des nœuds dans le diagramme
  document.getElementById("groupSelect").addEventListener("change", () => {
    // Effacer le diagramme avant d'ajouter de nouveaux membres
    clearDiagram();
  });
});

// Fonction pour ajouter des membres à l'organigramme
function ajouterMembresDansDiagramme(membres) {
  console.log("Membres à ajouter au diagramme :", membres);
  addMembersToDiagram(membres);
}
