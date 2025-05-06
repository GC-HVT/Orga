import {
  chargerGroupes,
  chargerMembres
} from "../modules/moduleMembres.js";
import {
  initializeDiagram,
  addNode,
  addLink,
  resetDiagram,
  exportDiagram
} from "../modules/moduleOrganigramme.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeDiagram("myDiagramDiv");
  chargerGroupes();

  document.getElementById("loadMembersBtn").addEventListener("click", () => {
    chargerMembres(injecterMembresSidebar);
  });

  document.getElementById("groupSelect").addEventListener("change", () => {
    chargerMembres(injecterMembresSidebar);
  });

  document.getElementById("addNodeBtn").addEventListener("click", () => addNode());
  document.getElementById("addLinkBtn").addEventListener("click", () => addLink());
  document.getElementById("resetBtn").addEventListener("click", () => resetDiagram());
  document.getElementById("exportBtn").addEventListener("click", () => exportDiagram());
});

function injecterMembresSidebar(membres) {
  const container = document.getElementById("membersList");
  container.innerHTML = ""; // vider avant ajout

  membres.forEach((membre, index) => {
    const div = document.createElement("div");
    div.className = "membre";
    div.draggable = true;
    div.dataset.id = membre.id || index.toString();
    div.dataset.nom = membre.displayName || "Sans nom";
    div.textContent = membre.displayName || "Sans nom";

    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", JSON.stringify({
        key: div.dataset.id,
        name: div.dataset.nom
      }));
    });

    container.appendChild(div);
  });
}
