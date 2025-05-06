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

    const memberData = {
      key: membre.userId || `user-${index}`,
      name: membre.displayName || "",
      poste: membre.jobTitle || "",
      tel: membre.telephoneNumber || "",
      mail: membre.mail || ""
    };

    // Stocker les infos dans les data-* pour du debug ou autre usage
    div.dataset.id = memberData.key;
    div.dataset.nom = memberData.name;
    div.dataset.poste = memberData.poste;
    div.dataset.tel = memberData.tel;
    div.dataset.mail = memberData.mail;

    div.addEventListener("dragstart", (event) => {
      const json = JSON.stringify(memberData);
      event.dataTransfer.setData("application/json-member", json);
      console.log("Drag member JSON:", json);
    });
    membersListDiv.appendChild(div);
  });
}
