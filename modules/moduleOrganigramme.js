import * as go from "https://unpkg.com/gojs@3.0.21/release/go.mjs";

// Fonction pour créer un bouton de suppression sans jQuery
function createDeleteButton(node) {
  const btn = document.createElement('button');
  btn.textContent = 'Supprimer';
  btn.onclick = function() {
    // Supprimer le nœud de GoJS
    diagram.model.removeNodeData(node.data);
  };
  return btn;
}

// Fonction d'initialisation du diagramme
function initDiagram() {
  const $ = go.GraphObject.make;
  const diagram = $(go.Diagram, "myDiagramDiv", {
    initialAutoScale: go.Diagram.Uniform,
    "undoManager.isEnabled": true
  });

  diagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, "RoundedRectangle", { fill: "lightgray", strokeWidth: 0 }),
      $(go.TextBlock, { margin: 10 }, new go.Binding("text", "name")),
      {
        click: function (e, node) {
          // Créer un bouton de suppression
          const deleteButton = createDeleteButton(node);
          document.getElementById("myDiagramDiv").appendChild(deleteButton);
        }
      });

  diagram.model = new go.GraphLinksModel(
    [
      { key: 1, name: "Node 1" },
      { key: 2, name: "Node 2" }
    ]
  );
}

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", function () {
  initDiagram();
});
