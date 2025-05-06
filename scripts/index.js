import {
    chargerGroupes,
    chargerMembres
} from "../modules/moduleMembres.js";
import {
    initializeDiagram,
    ajouterBloc, // Correction ici : addNode remplacé par ajouterBloc
    addLink,
    resetDiagram,
    exportDiagram
} from "../modules/moduleOrganigramme.js";

document.addEventListener("DOMContentLoaded", () => {
    // Initialiser le diagramme avec l'ID de la div
    initializeDiagram("myDiagramDiv");

    // Charger les groupes
    chargerGroupes();

    // Charger les membres lors du clic sur le bouton "Load Members"
    document.getElementById("loadMembersBtn").addEventListener("click", () => {
        chargerMembres(injecterMembresSidebar);
    });

    // Charger les membres quand un groupe est sélectionné dans le menu déroulant
    document.getElementById("groupSelect").addEventListener("change", () => {
        chargerMembres(injecterMembresSidebar);
    });

    // Ajouter un nœud lors du clic sur le bouton "Add Node"
    document.getElementById("addNodeBtn").addEventListener("click", () => {
        ajouterBloc(); // Correction ici : addNode() remplacé par ajouterBloc()
    });

    // Ajouter un lien entre les nœuds lors du clic sur le bouton "Add Link"
    document.getElementById("addLinkBtn").addEventListener("click", () => {
        // Pour ajouter un lien, tu pourrais avoir besoin d'une logique pour sélectionner les nœuds à relier
        // Ceci est une implémentation basique
        const fromNode = { key: 1 };  // Exemple de nœud source
        const toNode = { key: 2 };    // Exemple de nœud cible
        addLink(fromNode, toNode);    // Ajouter un lien entre les deux nœuds
    });

    // Réinitialiser le diagramme
    document.getElementById("resetBtn").addEventListener("click", () => {
        resetDiagram();
    });

    // Exporter le diagramme
    document.getElementById("exportBtn").addEventListener("click", () => {
        exportDiagram();
    });
});

// Fonction pour injecter les membres dans la sidebar
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
            event.dataTransfer.setData("text/plain", json);
            console.log("Drag member JSON:", json);  // Vérification du JSON
        });

        membersListDiv.appendChild(div);
    });
}
