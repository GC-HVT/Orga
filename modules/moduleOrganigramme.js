import * as go from "https://unpkg.com/gojs@3.0.21/release/go.mjs";

let diagram; // portée globale au module

// Fonction pour créer un bouton de suppression
function createDeleteButton(node) {
  const btn = document.createElement("button");
  btn.textContent = "Supprimer";
  btn.onclick = function () {
    diagram.model.removeNodeData(node.data);
  };
  return btn;
}

// Fonction d'initialisation du diagramme
function initDiagram(divId) {
  const $ = go.GraphObject.make;

  diagram = $(go.Diagram, divId, {
    initialAutoScale: go.Diagram.Uniform,
    "undoManager.isEnabled": true
  });

  diagram.nodeTemplate = $(
    go.Node,
    "Auto",
    $(go.Shape, "RoundedRectangle", { fill: "lightgray", strokeWidth: 0 }),
    $(go.TextBlock, { margin: 10 }, new go.Binding("text", "name")),
    {
      click: function (e, node) {
        const deleteButton = createDeleteButton(node);
        document.getElementById(divId).appendChild(deleteButton);
      }
    }
  );

  diagram.model = new go.GraphLinksModel(); // initialement vide
}

// Ajouter des membres (nœuds) au diagramme
function addMembersToDiagram(membres) {
  const nodes = membres.map((m, i) => ({
    key: i + 1,
    name: m.displayName || "Sans nom"
  }));
  diagram.model.addNodeDataCollection(nodes);
}

// Réinitialiser le diagramme
function clearDiagram() {
  diagram.model = new go.GraphLinksModel();
}

// Exporter les fonctions
export { initDiagram, addMembersToDiagram, clearDiagram };
