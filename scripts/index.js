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
import * as go from "gojs"; // Importez la librairie GoJS complète

document.addEventListener("DOMContentLoaded", () => {
    // Initialiser le diagramme avec l'ID de la div
    const diagram = initializeDiagram("myDiagramDiv"); // Récupérer l'instance du diagramme

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

    let selectedNodes = [];

    // Fonction pour gérer la sélection des nœuds
    diagram.addDiagramListener("ObjectSingleClicked", (e) => {
        const part = e.subject.part;
        if (part instanceof go.Node) {
            if (selectedNodes.length < 2 && !selectedNodes.includes(part)) {
                selectedNodes.push(part);
                part.isSelected = true; // Indiquer visuellement la sélection
            } else if (selectedNodes.includes(part)) {
                selectedNodes = selectedNodes.filter(node => node !== part);
                part.isSelected = false; // Désélectionner
            } else {
                // Limiter à deux sélections, désélectionner la première et sélectionner la nouvelle
                if (selectedNodes[0]) selectedNodes[0].isSelected = false;
                selectedNodes = [part];
                part.isSelected = true;
            }
            console.log("Nœuds sélectionnés :", selectedNodes.map(node => node.key));
        }
    });

    // Ajouter un lien entre les nœuds lors du clic sur le bouton "Add Link"
    document.getElementById("addLinkBtn").addEventListener("click", () => {
        if (selectedNodes.length === 2) {
            const fromNodeData = selectedNodes[0].data;
            const toNodeData = selectedNodes[1].data;
            addLink(fromNodeData, toNodeData);
            // Réinitialiser la sélection
            selectedNodes.forEach(node => node.isSelected = false);
            selectedNodes = [];
        } else {
            alert("Veuillez sélectionner deux nœuds pour créer un lien.");
        }
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
