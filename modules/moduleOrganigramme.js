let myDiagram;

export function initializeDiagram(divId) {
  const $ = go.GraphObject.make;

  myDiagram = $(go.Diagram, divId, {
    "undoManager.isEnabled": true,
    layout: $(go.TreeLayout, { angle: 90, layerSpacing: 40 }),
    "initialContentAlignment": go.Spot.Center,
    "hasHorizontalScrollbar": true,
    "hasVerticalScrollbar": true,
    "linkingTool.isEnabled": true,
    "relinkingTool.isEnabled": true,
    "commandHandler.deletable": true // Activer la suppression avec la touche Suppr
  });

  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      {
        minSize: new go.Size(80, 40), // Taille minimale pour les nœuds
        mouseEnter: (e, node) => node.findObject("SHAPE").fill = "lightyellow",
        mouseLeave: (e, node) => node.findObject("SHAPE").fill = "lightblue",
        "dragover": (e, node) => {
          e.preventDefault(); // Autoriser le drop sur les nœuds
        },
        "drop": (e, node) => {
          const memberData = JSON.parse(e.dataTransfer.getData("text/plain"));
          myDiagram.model.setDataProperty(node.data, "name", memberData.name); // Mettre à jour le nom du nœud
          // Ici, tu pourrais également mettre à jour d'autres propriétés du nœud avec les données du membre
        }
      },
      $(go.Shape, "RoundedRectangle",
        { fill: "lightblue", strokeWidth: 0, name: "SHAPE" }),
      $(go.TextBlock,
        { margin: 8, editable: true },
        new go.Binding("text", "name").makeTwoWay())
    );

  myDiagram.linkTemplate =
    $(go.Link, { routing: go.Link.Orthogonal, corner: 5, reshapable: true },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" })
    );

  // Chargement des données sauvegardées ou modèle vide
  const savedDiagram = localStorage.getItem("orgDiagramData");
  if (savedDiagram) {
    const savedModel = JSON.parse(savedDiagram);
    myDiagram.model = go.Model.fromJson(savedModel);
  } else {
    myDiagram.model = new go.GraphLinksModel([], []);
  }

  // Sauvegarde du modèle dans localStorage
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
    const memberData = JSON.parse(e.dataTransfer.getData("text/plain"));
    const point = myDiagram.lastInput.documentPoint;

    // Vérifier si un nœud avec cette clé existe déjà
    if (!myDiagram.model.findNodeDataForKey(memberData.key)) {
      myDiagram.model.addNodeData({ ...memberData, color: "lightgreen", loc: go.Point.stringify(point) });
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
    alert("Veuillez sélectionner exactement deux blocs pour créer un lien.");
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
