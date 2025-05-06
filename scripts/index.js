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

    div.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", JSON.stringify({
        key: member.userId, // Utiliser member.userId comme clé
        name: member.displayName,
        poste: member.jobTitle,
        tel: member.telephoneNumber,
        mail: member.mail
      }));
      event.dataTransfer.setData("memberId", member.userId); // Mise à jour ici aussi si tu utilises memberId ailleurs
    });

    container.appendChild(div);
  });
}
