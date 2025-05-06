import * as go from "https://unpkg.com/gojs/release/go-module.js";

let myDiagram;

export function initializeDiagram(divId) {
  const $ = go.GraphObject.make;

  myDiagram = $(go.Diagram, divId, {
    "undoManager.isEnabled": true,
    layout: $(go.TreeLayout, { angle: 90, layerSpacing: 40 })
  });

  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, "RoundedRectangle", { fill: "lightblue", strokeWidth: 0 }),
      $(go.TextBlock, { margin: 8, editable: true }, new go.Binding("text", "name").makeTwoWay())
    );

  myDiagram.linkTemplate =
    $(go.Link, { routing: go.Link.Orthogonal, corner: 5 },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" })
    );

  myDiagram.model = new go.GraphLinksModel([], []);

  // Chargement depuis localStorage si dispo
  const savedDiagram = localStorage.getItem("orgDiagramData");
  if (savedDiagram) {
    myDiagram.model = go.Model.fromJson(JSON.parse(savedDiagram));
  }

  // Sauvegarde automatique
  myDiagram.addModelChangedListener((evt) => {
    if (evt.isTransactionFinished) {
      const json = myDiagram.model.toJson();
      localStorage.setItem("orgDiagramData", json);
    }
  });

  // Drop d’un membre dans le diagramme
  const div = document.getElementById(divId);
  div.addEventListener("dragover", (e) => e.preventDefault());
  div.addEventListener("drop", (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const point = myDiagram.lastInput.documentPoint;
    myDiagram.model.addNodeData({ ...data, color: "lightblue", loc: go.Point.stringify(point) });
  });
}

export function addNode() {
  myDiagram.model.addNodeData({
    key: Date.now(),
    name: "Nouveau bloc",
    color: "lightblue"
  });
}

export function addLink() {
  const sel = myDiagram.selection.toArray();
  if (sel.length === 2 && sel[0] instanceof go.Node && sel[1] instanceof go.Node) {
    myDiagram.model.addLinkData({
      from: sel[0].data.key,
      to: sel[1].data.key
    });
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
  html2pdf().from(diagramDiv).set({
    margin: 0,
    filename: "organigramme.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "pt", format: "a4", orientation: "landscape" }
  }).save();
}

export function addMembersToDiagram(membres) {
  membres.forEach(membre => {
    myDiagram.model.addNodeData({
      key: membre.key,
      name: membre.name,
      color: "lightblue"
    });
  });
}
