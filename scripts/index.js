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

export function injecterMembresSidebar(membres) {
  const membersListDiv = document.getElementById("membersList");
  membersListDiv.innerHTML = ""; // Effacer la liste précédente

  membres.forEach((membre, index) => {
    const div = document.createElement("div");
    div.classList.add("member-card");
    div.textContent = membre.displayName;
    div.draggable = true;
    div.dataset.id = membre.userId || index.toString(); // Utiliser userId si disponible
    div.dataset.nom = membre.displayName;
    div.dataset.poste = membre.jobTitle;
    div.dataset.tel = membre.telephoneNumber;
    div.dataset.mail = membre.mail;

    div.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", JSON.stringify({
        key: membre.userId,
        name: membre.displayName,
        poste: membre.jobTitle,
        tel: membre.telephoneNumber,
        mail: membre.mail
      }));
      event.dataTransfer.setData("memberId", membre.userId);
    });

    membersListDiv.appendChild(div);
  });
}
