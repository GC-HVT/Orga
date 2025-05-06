// moduleOrganigramme.js
import * as go from "https://unpkg.com/gojs/release/go-module.js";

let myDiagram = null;
let currentKey = 1;

// Fonction d'initialisation du diagramme
export function initDiagram(containerId) {
  const $ = go.GraphObject.make;
  myDiagram = $(go.Diagram, containerId, {
    "undoManager.isEnabled": true,
    layout: $(go.TreeLayout, { angle: 90, layerSpacing: 30 }),
    "draggingTool.isEnabled": true,
    model: new go.GraphLinksModel([], []),
  });

  myDiagram.nodeTemplate = $(go.Node, "Auto", 
    $(go.Shape, "RoundedRectangle", { fill: "lightblue", strokeWidth: 0 }),
    $(go.Panel, "Vertical", 
      $(go.TextBlock, { margin: 5, font: "bold 12px sans-serif" }, new go.Binding("text", "name")),
      $(go.TextBlock, { margin: 2, font: "10px sans-serif" }, new go.Binding("text", "jobTitle")),
      $(go.TextBlock, { margin: 2, font: "10px sans-serif" }, new go.Binding("text", "mobilePhone")),
      $(go.TextBlock, { margin: 2, font: "10px sans-serif", isMultiline: true }, new go.Binding("text", "email")),
      createDeleteButton()
    )
  );

  myDiagram.linkTemplate = $(go.Link, { curve: go.Link.Bezier, toShortLength: 4 },
    $(go.Shape, { stroke: "gray", strokeWidth: 2 }),
    $(go.Shape, { toArrow: "Standard", fill: "gray" })
  );
}

// Fonction pour créer un bouton de suppression pour chaque nœud
function createDeleteButton() {
  return $(go.Shape, {
    geometryString: "M 0 0 L 10 0 L 10 10 L 0 10 Z",
    fill: "white", stroke: "black", width: 10, height: 10,
    alignment: go.Spot.TopRight, cursor: "pointer",
    click: (e, obj) => removeNode(obj)
  });
}

// Fonction pour supprimer un nœud
function removeNode(obj) {
  const part = obj.part;
  if (part && part.data) {
    myDiagram.model.removeNodeData(part.data);
  }
}

// Fonction pour ajouter des membres dans le diagramme
export function addMembersToDiagram(members) {
  const nodes = members.map(member => ({
    key: currentKey++, name: member.displayName, jobTitle: member.jobTitle,
    mobilePhone: member.mobilePhone, email: member.email
  }));

  myDiagram.model.addNodeDataCollection(nodes);
}

// Fonction pour réinitialiser le diagramme
export function clearDiagram() {
  if (myDiagram) {
    myDiagram.model = new go.GraphLinksModel([], []);
    currentKey = 1;
  }
}
