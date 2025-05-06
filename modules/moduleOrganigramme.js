// moduleOrganigramme.js
import * as go from "https://unpkg.com/gojs/release/go.mjs";

const make = go.GraphObject.make;

export function initDiagram() {
  const diagram = make(go.Diagram, "myDiagramDiv", {
    initialContentAlignment: go.Spot.Center,
    "undoManager.isEnabled": true,
    layout: make(go.TreeLayout, { angle: 90, layerSpacing: 35 })
  });

  diagram.nodeTemplate =
    make(go.Node, "Auto",
      make(go.Shape, "RoundedRectangle",
        { fill: "lightblue", strokeWidth: 0 },
        new go.Binding("fill", "color")
      ),
      make(go.Panel, "Vertical",
        make(go.TextBlock,
          { margin: 8, font: "bold 12pt sans-serif" },
          new go.Binding("text", "name")
        ),
        make("Button",
          {
            click: (e, obj) => {
              const node = obj.part;
              if (node instanceof go.Node) {
                diagram.remove(node);
              }
            }
          },
          make(go.TextBlock, "X", { margin: 4, font: "bold 10pt sans-serif" })
        )
      )
    );

  diagram.model = new go.GraphLinksModel(
    [
      { key: 1, name: "Chef de projet", color: "#ACE3F2" },
      { key: 2, name: "Responsable Technique", color: "#C4F2AC" },
      { key: 3, name: "Équipe Dev", color: "#F2D3AC" }
    ],
    [
      { from: 1, to: 2 },
      { from: 2, to: 3 }
    ]
  );

  return diagram;
}
