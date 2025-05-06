let diagram;

export function initializeDiagram(containerId) {
  const $ = go.GraphObject.make;

  diagram = $(go.Diagram, containerId, {
    initialContentAlignment: go.Spot.Center,
    "undoManager.isEnabled": true,
    allowDrop: true,
    "draggingTool.dragsLink": true,
    "linkingTool.direction": go.LinkingTool.ForwardsOnly
  });

  diagram.nodeTemplate =
    $(go.Node, "Auto",
      {
        selectionAdorned: true,
        deletable: true
      },
      $(go.Shape, "RoundedRectangle", {
        fill: "lightblue",
        stroke: "gray",
        strokeWidth: 1
      }),
      $(go.Panel, "Table",
        { padding: 6 },
        $(go.RowColumnDefinition, { column: 1, width: 4 }),
        $(go.TextBlock,
          {
            row: 0, columnSpan: 2,
            font: "bold 14px sans-serif",
            stroke: "#333"
          },
          new go.Binding("text", "name")
        ),
        $(go.TextBlock,
          {
            row: 1, column: 0,
            stroke: "#555",
            font: "12px sans-serif"
          },
          new go.Binding("text", "poste")
        ),
        $(go.TextBlock,
          {
            row: 2, column: 0,
            stroke: "#555",
            font: "12px sans-serif"
          },
          new go.Binding("text", "tel")
        ),
        $(go.TextBlock,
          {
            row: 3, column: 0,
            stroke: "#555",
            font: "12px sans-serif"
          },
          new go.Binding("text", "mail")
        )
      )
    );

  diagram.linkTemplate =
    $(go.Link,
      { relinkableFrom: true, relinkableTo: true },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" })
    );

  const container = document.getElementById(containerId);
  container.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  container.addEventListener("drop", (event) => {
    event.preventDefault();
    const json = event.dataTransfer.getData("text/plain");

    if (!json) {
      console.error("Aucune donnée reçue pour le drop.");
      return;
    }

    let membreData;
    try {
      membreData = JSON.parse(json);
    } catch (error) {
      console.error("Erreur lors du parsing JSON:", error);
      return;
    }

    const point = diagram.lastInput.documentPoint;
    diagram.model.addNodeData({
      key: membreData.key,
      name: membreData.name,
      poste: membreData.poste,
      tel: membreData.tel,
      mail: membreData.mail,
      loc: go.Point.stringify(point)
    });
  });
}

export function addNode() {
  diagram.model.addNodeData({
    key: "nouveau",
    name: "Nouveau",
    poste: "Poste",
    tel: "",
    mail: ""
  });
}

export function addLink() {
  const sel = diagram.selection.toArray();
  if (sel.length === 2) {
    diagram.model.addLinkData({
      from: sel[0].data.key,
      to: sel[1].data.key
    });
  } else {
    alert("Sélectionnez exactement deux blocs pour créer un lien.");
  }
}

export function resetDiagram() {
  diagram.clear();
}

export function exportDiagram() {
  const svg = diagram.makeSvg({ scale: 1, background: "white" });
  const blob = new Blob([svg.outerHTML], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "organigramme.svg";
  a.click();
  URL.revokeObjectURL(url);
}
