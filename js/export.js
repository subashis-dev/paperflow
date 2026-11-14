/**
 * PaperFlow — Export & Serialization Suite
 * Handles 300 DPI PNG, Vector SVG, JSON, and Draw.io XML format generation.
 */

class ExportManager {
  static exportSVG(canvas) {
    const bounds = canvas.getDiagramBounds(40);
    const svgClone = canvas.svgElement.cloneNode(true);

    svgClone.setAttribute("width", bounds.width);
    svgClone.setAttribute("height", bounds.height);
    svgClone.setAttribute("viewBox", `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`);

    // Remove UI elements like anchor dots and selection boxes
    svgClone.querySelectorAll(".pf-anchor, .pf-selection-box, .pf-guide").forEach(el => el.remove());

    const serializer = new XMLSerializer();
    const svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(svgClone);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    this.downloadFile(blob, "paperflow_methodology.svg");
  }

  static async exportPNG(canvas, scale = 3) {
    // scale = 3 produces ~300 DPI crisp print quality
    const bounds = canvas.getDiagramBounds(40);
    const svgClone = canvas.svgElement.cloneNode(true);

    svgClone.setAttribute("width", bounds.width);
    svgClone.setAttribute("height", bounds.height);
    svgClone.setAttribute("viewBox", `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`);
    svgClone.querySelectorAll(".pf-anchor, .pf-selection-box, .pf-guide").forEach(el => el.remove());

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = bounds.width * scale;
      offscreenCanvas.height = bounds.height * scale;
      const ctx = offscreenCanvas.getContext("2d");

      // Background fill based on theme
      ctx.fillStyle = canvas.theme === "dark" ? "#0b0f19" : "#ffffff";
      ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(image, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

      offscreenCanvas.toBlob(pngBlob => {
        URL.revokeObjectURL(blobURL);
        this.downloadFile(pngBlob, `paperflow_methodology_${scale >= 3 ? "300dpi" : "preview"}.png`);
      }, "image/png");
    };
    image.src = blobURL;
  }

  static exportJSON(canvas) {
    const state = {
      version: "1.0",
      theme: canvas.theme,
      nodes: canvas.nodes,
      connectors: canvas.connectors
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    this.downloadFile(blob, "methodology_diagram.paperflow");
  }

  static loadJSON(canvas, file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const state = JSON.parse(e.target.result);
        if (state.nodes && Array.isArray(state.nodes)) {
          canvas.nodes = state.nodes;
          canvas.connectors = state.connectors || [];
          if (state.theme) canvas.setTheme(state.theme);
          canvas.render();
        }
      } catch (err) {
        alert("Failed to parse PaperFlow file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  static exportDrawIO(canvas) {
    let cellsXML = "";
    let cellId = 2;

    // Node id mapping
    const nodeCellMap = {};

    canvas.nodes.forEach(node => {
      const curId = cellId++;
      nodeCellMap[node.id] = curId;

      const titleEscaped = this.escapeXml(node.title);
      const subEscaped = this.escapeXml(node.subtitle);
      const label = `<b>${titleEscaped}</b><br/>${subEscaped}`;

      const style = `rounded=1;whiteSpace=wrap;html=1;strokeColor=${node.borderColor};fillColor=#ffffff;fontFamily=Helvetica;strokeWidth=2;`;
      cellsXML += `\n        <mxCell id="${curId}" value="${label}" style="${style}" vertex="1" parent="1">
          <mxGeometry x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" as="geometry"/>
        </mxCell>`;
    });

    canvas.connectors.forEach(conn => {
      const curId = cellId++;
      const sourceId = nodeCellMap[conn.from] || "";
      const targetId = nodeCellMap[conn.to] || "";
      const label = this.escapeXml(conn.label || "");

      const style = "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#334155;strokeWidth=2;endArrow=classic;";
      cellsXML += `\n        <mxCell id="${curId}" value="${label}" style="${style}" edge="1" source="${sourceId}" target="${targetId}" parent="1">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`;
    });

    const drawIoXML = `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="PaperFlow" modified="${new Date().toISOString()}" agent="PaperFlow Studio" version="21.0.0">
  <diagram id="paperflow-diagram" name="Methodology Architecture">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1200" pageHeight="800">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>${cellsXML}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

    const blob = new Blob([drawIoXML], { type: "application/xml" });
    this.downloadFile(blob, "methodology_diagram.drawio");
  }

  static escapeXml(unsafe) {
    if (!unsafe) return "";
    return unsafe.replace(/[<>&'"]/g, c => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
  }

  static downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
