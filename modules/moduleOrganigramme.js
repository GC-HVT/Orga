const $ = go.GraphObject.make;
let diagram;

function initializeDiagram(divId) {
    diagram = $(go.Diagram, divId, {
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

    const diagramDiv = document.getElementById(divId);
    if (diagramDiv) {
        diagramDiv.addEventListener("dragover", dragOver);
        diagramDiv.addEventListener("drop", drop);
    }

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

    diagram.linkTemplate = $(go.Link, {
            routing: go.Link.Orthogonal,
            corner: 5
        },
        $(go.Shape, {
            strokeWidth: 2,
            stroke: "#555"
        })
    );

    diagram.model = new go.GraphLinksModel([], []);
}

function ajouterBloc(data) {
    const position = new go.Point(0, 0);
    const nodeData = {
        key: data ? data.key : Date.now(),
        name: data ? data.name : "Nouveau Bloc",
        poste: data ? data.poste : "",
        tel: data ? data.tel : "",
        mail: data ? data.mail : "",
        loc: data ? go.Point.stringify(diagram.transformViewToModel(diagram.lastInput.documentPoint)) : go.Point.stringify(position)
    };
    diagram.model.addNodeData(nodeData);
}

function addLink(fromNode, toNode) {
    diagram.model.addLinkData({
        from: fromNode.key,
        to: toNode.key
    });
}

function resetDiagram() {
    diagram.model = new go.GraphLinksModel([], []);
}

function exportDiagram() {
    diagram.makeImageData({
        scale: 0.5,
        background: "white",
        callback: (blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "organigramme.png";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            const diagramDiv = document.getElementById("myDiagramDiv");
            html2pdf(diagramDiv, {
                margin: 10,
                filename: 'organigramme.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            });
        }
    });
}

function dragOver(e) {
    e.preventDefault();
    const canAccept = e.dataTransfer.types.includes("application/json") || e.dataTransfer.types.includes("text/plain");
    const diagramDiv = document.getElementById("myDiagramDiv");
    if (diagramDiv) {
        diagramDiv.classList.toggle("go-drag-over", canAccept);
    }
}

function drop(e) {
    e.preventDefault();
    const diagramDiv = document.getElementById("myDiagramDiv");
    if (diagramDiv) {
        diagramDiv.classList.remove("go-drag-over");
    }
    let data;
    try {
        data = JSON.parse(e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text/plain"));
    } catch (error) {
        console.error("Erreur lors de la récupération des données du drop :", error);
        return;
    }
    if (data && diagram) {
        try {
            const point = diagram.transformViewToModel(diagram.lastInput.documentPoint);
            ajouterBloc({ ...data, loc: go.Point.stringify(point) });
        } catch (error) {
            console.error("Erreur lors de la transformation des coordonnées du drop :", error);
        }
    }
}


// Exportation des fonctions
export { initializeDiagram, ajouterBloc, addLink, resetDiagram, exportDiagram };
