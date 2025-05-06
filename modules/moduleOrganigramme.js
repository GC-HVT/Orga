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
    // "deletable": true // Supprimé car potentiellement source d'erreur et comportement par défaut
  });

  myDiagram.nodeTemplate =
    $(go.Node, "Auto",
      {
        minSize: new go.Size(120, 80), // Augmenter la taille pour afficher l'ID
        mouseEnter: (e, node) => node.findObject("SHAPE").fill = "lightyellow",
        mouseLeave: (e, node) => node.findObject("SHAPE").fill = "lightblue",
        "_dragover": (e, node) => {
          e.preventDefault();
        },
        "_drop": (e, node) => {
          const memberData = JSON.parse(e.dataTransfer.getData("text/plain"));
          myDiagram.model.setDataProperty(node.data, "name", memberData.name);
          myDiagram.model.setDataProperty(node.data, "poste", memberData.poste);
          myDiagram.model.setDataProperty(node.data, "tel", memberData.tel);
          myDiagram.model.setDataProperty(node.data, "mail", memberData.mail);
        }
      },
      $(go.Shape, "RoundedRectangle",
        { fill: "lightblue", strokeWidth: 0, name: "SHAPE" }),
      $(go.Panel, "Vertical", // Organiser les TextBlock verticalement
        $(go.TextBlock,
          { margin: new go.Margin(6, 6, 0, 6), font: "bold 10pt sans-serif", editable: true },
          new go.Binding("text", "name").makeTwoWay()),
        $(go.TextBlock,
          { margin: new go.Margin(0, 6, 0, 6), font: "9pt sans-serif", editable: true },
          new go.Binding("text", "poste").makeTwoWay()),
        $(go.TextBlock,
          { margin: new go.Margin(0, 6, 0, 6), font: "9pt sans-serif", editable: true },
          new go.Binding("text", "tel").makeTwoWay()),
        $(go.TextBlock,
          { margin: new go.Margin(0, 6, 0, 6), font: "9pt sans-serif", editable: true },
          new go.Binding("text", "mail").makeTwoWay()),
        $(go.TextBlock, // Ajout pour afficher l'ID
          { margin: new go.Margin(0, 6, 6, 6), font: "italic 8pt sans-serif" },
          new go.Binding("text", "key"))
      )
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
      myDiagram.model.addNodeData({
        key: memberData.key, // Utilise memberData.key (qui est userId)
        name: memberData.name,
        poste: memberData.poste,
        tel: memberData.tel,
        mail: memberData.mail,
        color: "lightgreen",
        loc: go.Point.stringify(point)
      });
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
