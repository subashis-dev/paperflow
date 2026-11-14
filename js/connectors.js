/**
 * PaperFlow — Smart Connectors & Routing Engine
 * Generates orthogonal step paths, bezier curves, and interactive arrowheads.
 */

class ConnectorManager {
  static createConnector(fromNodeId, fromAnchor = "right", toNodeId, toAnchor = "left", label = "") {
    return {
      id: "conn_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      from: fromNodeId,
      fromAnchor: fromAnchor,
      to: toNodeId,
      toAnchor: toAnchor,
      label: label,
      routing: "orthogonal", // "orthogonal" | "bezier" | "straight"
      color: "#334155",
      strokeWidth: 2,
      style: "solid", // "solid" | "dashed"
      arrowhead: "classic"
    };
  }

  static getAnchorPos(node, anchorId) {
    if (!node) return { x: 0, y: 0 };
    const cx = node.x + node.width / 2;
    const cy = node.y + node.height / 2;
    switch (anchorId) {
      case "top":
        return { x: cx, y: node.y, nx: 0, ny: -1 };
      case "right":
        return { x: node.x + node.width, y: cy, nx: 1, ny: 0 };
      case "bottom":
        return { x: cx, y: node.y + node.height, nx: 0, ny: 1 };
      case "left":
      default:
        return { x: node.x, y: cy, nx: -1, ny: 0 };
    }
  }

  static computePath(p1, p2, routing = "orthogonal") {
    if (routing === "straight") {
      return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
    }

    if (routing === "bezier") {
      const dx = Math.abs(p2.x - p1.x) * 0.5;
      const dy = Math.abs(p2.y - p1.y) * 0.5;
      const cp1x = p1.x + (p1.nx || 1) * Math.max(dx, 40);
      const cp1y = p1.y + (p1.ny || 0) * Math.max(dy, 40);
      const cp2x = p2.x + (p2.nx || -1) * Math.max(dx, 40);
      const cp2y = p2.y + (p2.ny || 0) * Math.max(dy, 40);
      return `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    // Orthogonal step routing (standard IEEE / Springer academic layout)
    const p1_dir = p1.nx !== undefined ? { x: p1.nx, y: p1.ny } : { x: 1, y: 0 };
    const p2_dir = p2.nx !== undefined ? { x: p2.nx, y: p2.ny } : { x: -1, y: 0 };

    if (p1_dir.x !== 0 && p2_dir.x !== 0) {
      // Both horizontal anchors
      const midX = p1.x + (p2.x - p1.x) / 2;
      return `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`;
    } else if (p1_dir.y !== 0 && p2_dir.y !== 0) {
      // Both vertical anchors
      const midY = p1.y + (p2.y - p1.y) / 2;
      return `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
    } else {
      // Mixed orthogonal corner
      if (p1_dir.x !== 0) {
        return `M ${p1.x} ${p1.y} L ${p2.x} ${p1.y} L ${p2.x} ${p2.y}`;
      } else {
        return `M ${p1.x} ${p1.y} L ${p1.x} ${p2.y} L ${p2.x} ${p2.y}`;
      }
    }
  }

  static getMidpoint(p1, p2) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    };
  }
}
