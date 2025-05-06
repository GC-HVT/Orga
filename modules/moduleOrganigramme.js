import * as go from "https://unpkg.com/gojs@3.0.21/release/go.mjs";

let diagram; // défini au niveau global du module

export function initDiagram(containerId) {
  const $ = go.GraphObject.make;
  diagram = $(go.Diagram, containerId, {
    initialAutoScale: go.Diagram.Uniform,
    "undoManager.isEnabled": true
  });

  diagram.nodeTemplate = $(go.Node, "Auto",
    $(go.Shape, "RoundedRectangle", { fill: "lightgray", strokeWidth: 0 }),
    $(go.TextBlock, { margin: 10 }, new go.Binding("text", "name"))
  );

  diagram.model = new go.GraphLinksModel(); // vide au départ
}

export function addMembersToDiagram(membres) {
  if (!diagram) {
    console.error("Le diagramme n'est pas initialisé !");
    return;
  }

  diagram.model.addNodeDataCollection(membres);
}

export function clearDiagram() {
  if (diagram) {
    diagram.model = new go.GraphLinksModel(); // réinitialise le modèle
  }
}
