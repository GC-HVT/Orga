const $ = go.GraphObject.make;

let diagram;

function initDiagram() {
  diagram = $(go.Diagram, "myDiagramDiv", {
    "undoManager.isEnabled": true,
    allowDrop: true,
    "draggingTool.isGridSnapEnabled": true,
    "resizingTool.isGridSnapEnabled": true,
    "rotatingTool.snapAngleMultiple": 90,
    "rotatingTool.snapAngleEpsilon": 45,
    layout: $(go.TreeLayout, {
      angle: 90,
      layerSpacing: 35
    })
  });

  diagram.nodeTemplate = $(go.Node, "Auto", {
      locationSpot: go.Spot.Center
    },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    $(go.Shape, "RoundedRectangle", {
      fill: "#ACE600",
      stroke: null
    }, new go.Binding("fill", "color")),
    $(go.Panel, "Table", {
        margin: 6,
        maxSize: new go.Size(200, NaN)
      },
      $(go.TextBlock, {
        row: 0,
        font: "bold 14px sans-serif",
        stroke: "#333",
        maxSize: new go.Size(200, NaN),
        wrap: go.TextBlock.WrapFit
      }, new go.Binding("text", "name")),
      $(go.TextBlock, {
        row: 1,
        margin: new go.Margin(4, 0, 0, 0),
        maxSize: new go.Size(200, NaN),
        wrap: go.TextBlock.WrapFit
      }, new go.Binding("text", "poste")),
      $(go.TextBlock, {
        row: 2,
        margin: new go.Margin(4, 0, 0, 0),
        maxSize: new go.Size(200, NaN),
        wrap: go.TextBlock.WrapFit
      }, new go.Binding("text", "tel")),
      $(go.TextBlock, {
        row: 3,
        margin: new go.Margin(4, 0, 0, 0),
        maxSize: new go.Size(200, NaN),
        wrap: go.TextBlock.WrapFit
      }, new go.Binding("text", "mail"))
    )
  );

  diagram.model = new go.GraphLinksModel([], []);
}

// Fonction pour ajouter un nœud
function ajouterBloc(data) {
  diagram.model.addNodeData(data);
}

// Fonction pour ajouter un lien entre deux nœuds
function addLink(fromNode, toNode) {
  diagram.model.addLinkData({
    from: fromNode.key,
    to: toNode.key
  });
}

// Exportation des fonctions
export { initDiagram, ajouterBloc, addLink };
