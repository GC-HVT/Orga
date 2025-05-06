import * as go from "gojs";

let myDiagram;

export function initializeDiagram() {
  const $ = go.GraphObject.make;

  myDiagram = $(go.Diagram, "myDiagramDiv", {
    "undoManager.isEnabled": true,
    layout: $(go.TreeLayout, { angle: 90, layerSpacing: 40 })
  });

  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      $(go.Shape, "RoundedRectangle", { fill: "lightblue", strokeWidth: 0 },
        new go.Binding("fill", "color")),
      $(go.TextBlock, { margin: 8, editable: true }, new go.Binding("text").makeTwoWay())
    );

  myDiagram.linkTemplate =
    $(go.Link, { routing: go.Link.Orthogonal, corner: 5 },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" })
    );

  const savedDiagram = localStorage.getItem("orgDiagramData");
  if (savedDiagram) {
    const savedModel = JSON.parse(savedDiagram);
    myDiagram.model = go.Model.fromJson(savedModel);
  } else {
    myDiagram.model = new go.GraphLinksModel([], []);
  }

  myDiagram.addModelChangedListener((evt) => {
    if (evt.isTransactionFinished) {
      const json = myDiagram.model.toJson();
      localStorage.setItem("orgDiagramData", json);
    }
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
 
