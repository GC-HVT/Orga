import * as go from 'https://unpkg.com/gojs/release/go.js';

let myDiagram;

export function initializeDiagram(divId) {
  const $ = go.GraphObject.make;

  // Initialisation du diagramme
  myDiagram = $(go.Diagram, divId, {
    "undoManager.isEnabled": true,  // Permet l'annulation et la réouverture des actions
    layout: $(go.TreeLayout, { angle: 90, layerSpacing: 40 }),  // Configuration de l'agencement
    "initialContentAlignment": go.Spot.Center,  // Centrage du diagramme
    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,  // Permet le zoom avec la molette de la souris
    "initialAutoScale": go.Diagram.Uniform,  // Mise à l'échelle automatique
    "hasHorizontalScrollbar": false,  // Désactive la barre de défilement horizontale
    "hasVerticalScrollbar": false,  // Désactive la barre de défilement verticale
  });

  // Définition du modèle de noeud
  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, "RoundedRectangle", { fill: "lightblue", strokeWidth: 0 }),
      $(go.TextBlock, { margin: 8, editable: true }, new go.Binding("text", "name").makeTwoWay())
    );

  // Définition du modèle de lien
  myDiagram.linkTemplate =
    $(go.Link, { routing: go.Link.Orthogonal, corner: 5 },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" })
    );

  // Vérification et chargement des données sauvegardées
  const savedDiagram = localStorage.getItem("orgDiagramData");
  if (savedDiagram) {
    const savedModel = JSON.parse(savedDiagram);
    myDiagram.model = go.Model.fromJson(savedModel);
  } else {
    myDiagram.model = new go.GraphLinksModel([], []);  // Création d'un modèle vide si aucune donnée
  }

  // Sauvegarde des modifications dans localStorage
  myDiagram.addModelChangedListener((evt) => {
    if (evt.isTransactionFinished) {
      const json = myDiagram.model.toJson();
      localStorage.setItem("orgDiagramData", json);
    }
  });
}

  myDiagram.addModelChangedListener((evt) => {
    if (evt.isTransactionFinished) {
      const json = myDiagram.model.toJson();
      localStorage.setItem("orgDiagramData", json);
    }
  });

  const div = document.getElementById(divId);
  div.addEventListener("dragover", (e) => e.preventDefault());
  div.addEventListener("drop", (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const point = myDiagram.lastInput.documentPoint;
    myDiagram.model.addNodeData({ ...data, color: "lightblue", loc: go.Point.stringify(point) });
  });
}

// Nouvelle fonction pour ajouter les membres au diagramme
export function addMembersToDiagram(membres) {
  membres.forEach((membre) => {
    myDiagram.model.addNodeData({
      key: membre.id,
      name: membre.displayName || "Nom inconnu",
      color: "lightgreen",  // Définir une couleur différente pour les membres
    });
  });
}

export function addNode() {
  myDiagram.model.addNodeData({ key: Date.now(), text: "Nouveau bloc", color: "lightblue" });
}

export function addLink() {
  const sel = myDiagram.selection.toArray();
  if (sel.length === 2 && sel[0] instanceof go.Node && sel[1] instanceof go.Node) {
    myDiagram.model.addLinkData({ from: sel[0].data.key, to: sel[1].data.key });
  } else {
    alert("Veuillez sélectionner exactement deux blocs.");
  }
}

export function resetDiagram() {
  localStorage.removeItem("orgDiagramData");
  myDiagram.model = new go.GraphLinksModel([], []);
}

export function exportDiagram() {
  const diagramDiv = document.getElementById("myDiagramDiv");
  const opt = {
    margin: 0,
    filename: 'organigramme.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'landscape' }
  };
  html2pdf().from(diagramDiv).set(opt).save();
}
