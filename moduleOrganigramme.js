// moduleOrganigramme.js
import * as go from "https://unpkg.com/gojs/release/go-module.js";

let myDiagram = null;
let currentKey = 1;

export function initDiagram(containerId) {
  const $ = go.GraphObject.make;

  myDiagram = $(go.Diagram, containerId, {
    "undoManager.isEnabled": true,
    layout: $(go.TreeLayout, { angle: 90, layerSpacing: 30 }),
    "draggingTool.isEnabled": true,
    model: new go.GraphLinksModel([], [])
  });

  myDiagram.nodeTemplate = $(go.Node, "Auto",
    $(go.Shape, "RoundedRectangle", { fill: "lightblue", strokeWidth: 0 }),
    $(go.Panel, "Vertical",
      $(go.TextBlock, { margin: 5, font: "bold 12px sans-serif" }, new go.Binding("text", "name")),
      $(go.TextBlock, { margin: 2, font: "10px sans-serif" }, new go.Binding("text", "jobTitle")),
      $(go.TextBlock, { margin: 2, font: "10px sans-serif" }, new go.Binding("text", "mobilePhone")),
      $(go.TextBlock, { margin: 2, font: "10px sans-serif", isMultiline: true }, new go.Binding("text", "email")),
      $(go.Shape, {
        geometryString: "M 0 0 L 10 0 L 10 10 L 0 10 Z",
        fill: "white",
        stroke: "black",
        width: 10,
        height: 10,
        alignment: go.Spot.TopRight,
        cursor: "pointer",
        click: (e, obj) => {
          const part = obj.part;
          if (part && part.data) {
            myDiagram.model.removeNodeData(part.data);
          }
        }
      })
    )
  );

  myDiagram.linkTemplate = $(go.Link, { curve: go.Link.Bezier, toShortLength: 4 },
    $(go.Shape, { stroke: "gray", strokeWidth: 2 }),
    $(go.Shape, { toArrow: "Standard", fill: "gray" })
  );

  myDiagram.addDiagramListener("ObjectSingleClicked", function (e) {
    const clickedNode = e.subject.part;
    if (clickedNode && clickedNode instanceof go.Node) {
      if (!myDiagram.selectedNode) {
        myDiagram.selectedNode = clickedNode;
      } else {
        if (myDiagram.selectedNode !== clickedNode) {
          myDiagram.model.addLinkData({
            from: myDiagram.selectedNode.data.key,
            to: clickedNode.data.key
          });
        }
        myDiagram.selectedNode = null;
      }
    }
  });
}

export function clearDiagram() {
  if (myDiagram) {
    myDiagram.model = new go.GraphLinksModel([], []);
    currentKey = 1;
  }
}

export function addMembersToDiagram(members) {
  if (!myDiagram || !Array.isArray(members)) return;

  const nodes = members.map(member => ({
    key: currentKey++,
    name: member.displayName,
    jobTitle: member.jobTitle || "",
    mobilePhone: member.mobilePhone || "",
    email: member.email || ""
  }));

  myDiagram.model.addNodeDataCollection(nodes);
}