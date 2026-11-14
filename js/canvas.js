/**
 * PaperFlow — Vector Canvas Engine
 * High-performance interactive canvas for academic methodology diagrams.
 */

class PaperCanvas {
  constructor(containerElement) {
    this.container = containerElement;
    this.nodes = [];
    this.connectors = [];
    this.selectedNodeIds = new Set();
    this.selectedConnectorId = null;

    // Viewport transform
    this.panX = 40;
    this.panY = 40;
    this.zoom = 1.0;
    this.theme = "light"; // default academic paper style

    // Interaction states
    this.isPanning = false;
    this.isDraggingNodes = false;
    this.isConnecting = false;
    this.connectingSource = null; // { nodeId, anchorId, startPos }
    this.connectingMousePos = { x: 0, y: 0 };
    this.dragStart = { x: 0, y: 0 };

    // History for Undo / Redo
    this.undoStack = [];
    this.redoStack = [];

    this._initDOM();
    this._bindEvents();
    this.saveState();
  }

  _initDOM() {
    this.container.innerHTML = "";
    this.svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svgElement.setAttribute("class", "paperflow-canvas-svg");
    this.svgElement.setAttribute("width", "100%");
    this.svgElement.setAttribute("height", "100%");

    // Defs: Arrow markers & grid patterns
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#334155" />
      </marker>
      <marker id="arrow-selected" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#6366f1" />
      </marker>
      <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="1.2" fill="rgba(100, 116, 139, 0.25)" />
      </pattern>
    `;
    this.svgElement.appendChild(defs);

    // Grid layer
    this.gridRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    this.gridRect.setAttribute("width", "100%");
    this.gridRect.setAttribute("height", "100%");
    this.gridRect.setAttribute("fill", "url(#dot-grid)");
    this.svgElement.appendChild(this.gridRect);

    // Root viewport group for Pan & Zoom
    this.viewportGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.viewportGroup.setAttribute("class", "pf-viewport");
    this.svgElement.appendChild(this.viewportGroup);

    // Layers inside viewport
    this.connectorsLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.connectorsLayer.setAttribute("class", "pf-layer-connectors");
    this.viewportGroup.appendChild(this.connectorsLayer);

    this.tempConnectorLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.tempConnectorLine.setAttribute("class", "pf-temp-connector");
    this.tempConnectorLine.setAttribute("stroke", "#6366f1");
    this.tempConnectorLine.setAttribute("stroke-width", "2");
    this.tempConnectorLine.setAttribute("stroke-dasharray", "4,4");
    this.tempConnectorLine.setAttribute("fill", "none");
    this.tempConnectorLine.style.display = "none";
    this.viewportGroup.appendChild(this.tempConnectorLine);

    this.nodesLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.nodesLayer.setAttribute("class", "pf-layer-nodes");
    this.viewportGroup.appendChild(this.nodesLayer);

    this.container.appendChild(this.svgElement);
    this.updateTransform();
  }

  updateTransform() {
    this.viewportGroup.setAttribute(
      "transform",
      `translate(${this.panX}, ${this.panY}) scale(${this.zoom})`
    );
  }

  setTheme(themeKey) {
    this.theme = themeKey;
    const themeConfig = CONFIG.themes[themeKey] || CONFIG.themes.light;
    this.container.style.backgroundColor = themeConfig.canvasBg;
    this.render();
  }

  screenToCanvas(screenX, screenY) {
    const rect = this.container.getBoundingClientRect();
    const x = (screenX - rect.left - this.panX) / this.zoom;
    const y = (screenY - rect.top - this.panY) / this.zoom;
    return { x, y };
  }

  getDiagramBounds(padding = 40) {
    if (this.nodes.length === 0) {
      return { minX: 0, minY: 0, width: 800, height: 600 };
    }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    this.nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + n.width);
      maxY = Math.max(maxY, n.y + n.height);
    });
    return {
      minX: minX - padding,
      minY: minY - padding,
      width: Math.max(400, (maxX - minX) + padding * 2),
      height: Math.max(300, (maxY - minY) + padding * 2)
    };
  }

  saveState() {
    this.undoStack.push({
      nodes: JSON.parse(JSON.stringify(this.nodes)),
      connectors: JSON.parse(JSON.stringify(this.connectors))
    });
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length <= 1) return;
    const currentState = this.undoStack.pop();
    this.redoStack.push(currentState);
    const prevState = this.undoStack[this.undoStack.length - 1];
    this.nodes = JSON.parse(JSON.stringify(prevState.nodes));
    this.connectors = JSON.parse(JSON.stringify(prevState.connectors));
    this.render();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const nextState = this.redoStack.pop();
    this.undoStack.push(nextState);
    this.nodes = JSON.parse(JSON.stringify(nextState.nodes));
    this.connectors = JSON.parse(JSON.stringify(nextState.connectors));
    this.render();
  }

  render() {
    this._renderConnectors();
    this._renderNodes();
    if (window.onCanvasSelectionChange) {
      window.onCanvasSelectionChange(this.getSelectedNode());
    }
  }

  _renderNodes() {
    this.nodesLayer.innerHTML = "";
    const isDark = this.theme === "dark" || this.theme === "blueprint";

    this.nodes.forEach(node => {
      const isSelected = this.selectedNodeIds.has(node.id);
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", `pf-node ${isSelected ? "pf-selected" : ""}`);
      group.setAttribute("data-id", node.id);
      group.setAttribute("transform", `translate(${node.x}, ${node.y})`);

      // Outer Card Box
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("width", node.width);
      rect.setAttribute("height", node.height);
      rect.setAttribute("rx", "10");
      rect.setAttribute("fill", isDark ? "#111827" : "#ffffff");
      rect.setAttribute("stroke", isSelected ? "#6366f1" : node.borderColor);
      rect.setAttribute("stroke-width", isSelected ? "3" : "2");
      rect.setAttribute("class", "pf-node-rect");
      group.appendChild(rect);

      // Card Content rendering based on type
      this._renderNodeContent(group, node, isDark);

      // Anchors (hover interaction handles)
      const anchors = [
        { id: "top", cx: node.width / 2, cy: 0 },
        { id: "right", cx: node.width, cy: node.height / 2 },
        { id: "bottom", cx: node.width / 2, cy: node.height },
        { id: "left", cx: 0, cy: node.height / 2 }
      ];

      anchors.forEach(a => {
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", a.cx);
        dot.setAttribute("cy", a.cy);
        dot.setAttribute("r", "5");
        dot.setAttribute("class", "pf-anchor");
        dot.setAttribute("data-anchor", a.id);
        dot.setAttribute("data-node-id", node.id);
        group.appendChild(dot);
      });

      this.nodesLayer.appendChild(group);
    });
  }

  _renderNodeContent(group, node, isDark) {
    const textColor = isDark ? "#f8fafc" : "#0f172a";
    const subColor = isDark ? "#94a3b8" : "#475569";

    // Split Badge (Special Pill Style)
    if (node.type === CONFIG.nodeTypes.SPLIT_BADGE) {
      const badgeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      badgeText.setAttribute("x", node.width / 2);
      badgeText.setAttribute("y", node.height / 2 + 5);
      badgeText.setAttribute("text-anchor", "middle");
      badgeText.setAttribute("font-family", "'Space Grotesk', system-ui, sans-serif");
      badgeText.setAttribute("font-size", "12");
      badgeText.setAttribute("font-weight", "600");
      badgeText.setAttribute("fill", node.borderColor);
      badgeText.textContent = node.title;
      group.appendChild(badgeText);
      return;
    }

    // Header Title
    const titleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    titleText.setAttribute("x", node.width / 2);
    titleText.setAttribute("y", "26");
    titleText.setAttribute("text-anchor", "middle");
    titleText.setAttribute("font-family", "'Space Grotesk', system-ui, sans-serif");
    titleText.setAttribute("font-size", "13");
    titleText.setAttribute("font-weight", "700");
    titleText.setAttribute("fill", textColor);
    titleText.textContent = node.title;
    group.appendChild(titleText);

    // Subtitle
    if (node.subtitle) {
      const sub = document.createElementNS("http://www.w3.org/2000/svg", "text");
      sub.setAttribute("x", node.width / 2);
      sub.setAttribute("y", "42");
      sub.setAttribute("text-anchor", "middle");
      sub.setAttribute("font-family", "system-ui, sans-serif");
      sub.setAttribute("font-size", "10");
      sub.setAttribute("fill", subColor);
      sub.textContent = node.subtitle;
      group.appendChild(sub);
    }

    // Divider Line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "12");
    line.setAttribute("y1", "50");
    line.setAttribute("x2", node.width - 12);
    line.setAttribute("y2", "50");
    line.setAttribute("stroke", isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)");
    group.appendChild(line);

    // Inner Body rendering by type
    if (node.type === CONFIG.nodeTypes.DATA_SPLIT) {
      this._renderPieChart(group, node);
    } else if (node.type === CONFIG.nodeTypes.PREPROCESSING && node.data && node.data.steps) {
      this._renderBulletList(group, node, node.data.steps, subColor);
    } else if (node.type === CONFIG.nodeTypes.EVALUATION && node.data && node.data.metrics) {
      this._renderMetricsTree(group, node, node.data.metrics, textColor);
    } else if (node.type === CONFIG.nodeTypes.MODEL_ENSEMBLE && node.data && node.data.algorithms) {
      this._renderModelBadges(group, node, node.data.algorithms);
    } else if (node.type === CONFIG.nodeTypes.DATASET_INPUT && node.data && node.data.classes) {
      this._renderDatasetClasses(group, node, node.data.classes, subColor);
    } else if (node.type === CONFIG.nodeTypes.PREDICTION && node.data && node.data.outputs) {
      this._renderPredictionOutputs(group, node, node.data.outputs);
    } else if (node.type === CONFIG.nodeTypes.CALLOUT_NOTE && node.data && node.data.lines) {
      this._renderNoteLines(group, node, node.data.lines, textColor);
    } else {
      // Default Description Card
      const desc = document.createElementNS("http://www.w3.org/2000/svg", "text");
      desc.setAttribute("x", "16");
      desc.setAttribute("y", "70");
      desc.setAttribute("font-size", "11");
      desc.setAttribute("fill", subColor);
      desc.setAttribute("font-family", "system-ui, sans-serif");
      desc.textContent = (node.data && node.data.description) ? node.data.description : "";
      group.appendChild(desc);
    }
  }

  _renderPieChart(group, node) {
    const cx = node.width / 2;
    const cy = 95;
    const r = 32;

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // Draw 80% pie slice (Train)
    const trainSlice = document.createElementNS("http://www.w3.org/2000/svg", "path");
    trainSlice.setAttribute("d", `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - r * 0.95} ${cy + r * 0.3} Z`);
    trainSlice.setAttribute("fill", "#0f172a");
    g.appendChild(trainSlice);

    // Draw 20% pie slice (Test)
    const testSlice = document.createElementNS("http://www.w3.org/2000/svg", "path");
    testSlice.setAttribute("d", `M ${cx} ${cy} L ${cx - r * 0.95} ${cy + r * 0.3} A ${r} ${r} 0 0 1 ${cx} ${cy - r} Z`);
    testSlice.setAttribute("fill", "#64748b");
    g.appendChild(testSlice);

    group.appendChild(g);
  }

  _renderBulletList(group, node, items, subColor) {
    items.slice(0, 4).forEach((step, idx) => {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "16");
      text.setAttribute("y", 70 + idx * 20);
      text.setAttribute("font-size", "11");
      text.setAttribute("font-family", "system-ui, sans-serif");
      text.setAttribute("fill", subColor);
      text.textContent = `• ${step}`;
      group.appendChild(text);
    });
  }

  _renderMetricsTree(group, node, metrics, textColor) {
    metrics.forEach((m, idx) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const arrow = document.createElementNS("http://www.w3.org/2000/svg", "text");
      arrow.setAttribute("x", "16");
      arrow.setAttribute("y", 72 + idx * 22);
      arrow.setAttribute("font-size", "11");
      arrow.setAttribute("font-weight", "bold");
      arrow.setAttribute("fill", "#10b981");
      arrow.textContent = "➔";
      g.appendChild(arrow);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", "32");
      label.setAttribute("y", 72 + idx * 22);
      label.setAttribute("font-size", "11");
      label.setAttribute("font-family", "'Space Grotesk', system-ui, sans-serif");
      label.setAttribute("fill", textColor);
      label.textContent = `${m.name}: ${m.value}`;
      g.appendChild(label);

      group.appendChild(g);
    });
  }

  _renderModelBadges(group, node, algos) {
    const badgeW = 75;
    const badgeH = 28;
    const startX = 14;
    const startY = 62;

    algos.slice(0, 6).forEach((alg, idx) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      const bx = startX + col * (badgeW + 6);
      const by = startY + row * (badgeH + 8);

      const pill = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      pill.setAttribute("x", bx);
      pill.setAttribute("y", by);
      pill.setAttribute("width", badgeW);
      pill.setAttribute("height", badgeH);
      pill.setAttribute("rx", "14");
      pill.setAttribute("fill", "rgba(99, 102, 241, 0.08)");
      pill.setAttribute("stroke", alg.color || "#6366f1");
      pill.setAttribute("stroke-width", "1.5");
      group.appendChild(pill);

      const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      txt.setAttribute("x", bx + badgeW / 2);
      txt.setAttribute("y", by + badgeH / 2 + 4);
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("font-size", "10");
      txt.setAttribute("font-weight", "600");
      txt.setAttribute("fill", alg.color || "#6366f1");
      txt.setAttribute("font-family", "'Space Grotesk', system-ui, sans-serif");
      txt.textContent = alg.name;
      group.appendChild(txt);
    });
  }

  _renderDatasetClasses(group, node, classes, subColor) {
    classes.slice(0, 5).forEach((cls, idx) => {
      const itemG = document.createElementNS("http://www.w3.org/2000/svg", "g");

      const iconCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      iconCircle.setAttribute("cx", "28");
      iconCircle.setAttribute("cy", 76 + idx * 36);
      iconCircle.setAttribute("r", "12");
      iconCircle.setAttribute("fill", "rgba(16, 185, 129, 0.12)");
      iconCircle.setAttribute("stroke", "#10b981");
      itemG.appendChild(iconCircle);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", "48");
      label.setAttribute("y", 80 + idx * 36);
      label.setAttribute("font-size", "12");
      label.setAttribute("font-family", "'Space Grotesk', system-ui, sans-serif");
      label.setAttribute("font-weight", "500");
      label.setAttribute("fill", subColor);
      label.textContent = cls;
      itemG.appendChild(label);

      group.appendChild(itemG);
    });
  }

  _renderPredictionOutputs(group, node, outputs) {
    outputs.forEach((out, idx) => {
      const y = 72 + idx * 28;
      const pill = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      pill.setAttribute("x", "16");
      pill.setAttribute("y", y);
      pill.setAttribute("width", node.width - 32);
      pill.setAttribute("height", "24");
      pill.setAttribute("rx", "6");
      pill.setAttribute("fill", out.color === "#10b981" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)");
      pill.setAttribute("stroke", out.color);
      pill.setAttribute("stroke-width", "1");
      group.appendChild(pill);

      const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      txt.setAttribute("x", node.width / 2);
      txt.setAttribute("y", y + 16);
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("font-size", "11");
      txt.setAttribute("font-weight", "600");
      txt.setAttribute("fill", out.color);
      txt.textContent = out.label;
      group.appendChild(txt);
    });
  }

  _renderNoteLines(group, node, lines, textColor) {
    lines.forEach((l, idx) => {
      const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
      txt.setAttribute("x", "16");
      txt.setAttribute("y", 68 + idx * 17);
      txt.setAttribute("font-size", "10");
      txt.setAttribute("font-family", "system-ui, sans-serif");
      txt.setAttribute("fill", l.startsWith("Removing:") ? "#ef4444" : (l.startsWith("Applying:") ? "#10b981" : textColor));
      txt.textContent = l;
      group.appendChild(txt);
    });
  }

  _renderConnectors() {
    this.connectorsLayer.innerHTML = "";
    this.connectors.forEach(conn => {
      const fromNode = this.nodes.find(n => n.id === conn.from);
      const toNode = this.nodes.find(n => n.id === conn.to);
      if (!fromNode || !toNode) return;

      const p1 = ConnectorManager.getAnchorPos(fromNode, conn.fromAnchor);
      const p2 = ConnectorManager.getAnchorPos(toNode, conn.toAnchor);
      const d = ConnectorManager.computePath(p1, p2, conn.routing);

      const isSelected = this.selectedConnectorId === conn.id;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.setAttribute("class", `pf-connector ${isSelected ? "pf-connector-selected" : ""}`);
      path.setAttribute("stroke", isSelected ? "#6366f1" : conn.color || "#334155");
      path.setAttribute("stroke-width", isSelected ? "3" : conn.strokeWidth || 2);
      if (conn.style === "dashed") path.setAttribute("stroke-dasharray", "5,5");
      path.setAttribute("fill", "none");
      path.setAttribute("marker-end", isSelected ? "url(#arrow-selected)" : "url(#arrow)");
      path.setAttribute("data-conn-id", conn.id);
      this.connectorsLayer.appendChild(path);

      // Label on connector
      if (conn.label) {
        const mid = ConnectorManager.getMidpoint(p1, p2);
        const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        labelText.setAttribute("x", mid.x);
        labelText.setAttribute("y", mid.y - 8);
        labelText.setAttribute("text-anchor", "middle");
        labelText.setAttribute("class", "pf-connector-label");
        labelText.setAttribute("fill", isSelected ? "#6366f1" : "#475569");
        labelText.setAttribute("font-size", "10");
        labelText.setAttribute("font-weight", "600");
        labelText.textContent = conn.label;
        this.connectorsLayer.appendChild(labelText);
      }
    });
  }

  _bindEvents() {
    // Canvas Pan & Zoom
    this.container.addEventListener("wheel", e => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newZoom = Math.min(CONFIG.canvas.maxZoom, Math.max(CONFIG.canvas.minZoom, this.zoom * zoomFactor));

      const rect = this.container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      this.panX = mouseX - (mouseX - this.panX) * (newZoom / this.zoom);
      this.panY = mouseY - (mouseY - this.panY) * (newZoom / this.zoom);
      this.zoom = newZoom;
      this.updateTransform();
    });

    // Mousedown: Node selection / drag / pan / connection
    this.container.addEventListener("mousedown", e => {
      const anchorEl = e.target.closest(".pf-anchor");
      if (anchorEl) {
        // Start connection drag
        e.stopPropagation();
        this.isConnecting = true;
        const nodeId = anchorEl.getAttribute("data-node-id");
        const anchorId = anchorEl.getAttribute("data-anchor");
        const node = this.nodes.find(n => n.id === nodeId);
        const startPos = ConnectorManager.getAnchorPos(node, anchorId);
        this.connectingSource = { nodeId, anchorId, startPos };
        this.tempConnectorLine.style.display = "block";
        return;
      }

      const nodeEl = e.target.closest(".pf-node");
      if (nodeEl) {
        const nodeId = nodeEl.getAttribute("data-id");
        if (!e.shiftKey && !this.selectedNodeIds.has(nodeId)) {
          this.selectedNodeIds.clear();
        }
        this.selectedNodeIds.add(nodeId);
        this.selectedConnectorId = null;
        this.isDraggingNodes = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
        this.render();
        return;
      }

      const connEl = e.target.closest(".pf-connector");
      if (connEl) {
        this.selectedConnectorId = connEl.getAttribute("data-conn-id");
        this.selectedNodeIds.clear();
        this.render();
        return;
      }

      // Clicked on blank canvas ➔ Pan or Clear Selection
      this.selectedNodeIds.clear();
      this.selectedConnectorId = null;
      this.isPanning = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.render();
    });

    window.addEventListener("mousemove", e => {
      if (this.isPanning) {
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;
        this.panX += dx;
        this.panY += dy;
        this.dragStart = { x: e.clientX, y: e.clientY };
        this.updateTransform();
        return;
      }

      if (this.isDraggingNodes) {
        const dx = (e.clientX - this.dragStart.x) / this.zoom;
        const dy = (e.clientY - this.dragStart.y) / this.zoom;
        this.dragStart = { x: e.clientX, y: e.clientY };

        this.selectedNodeIds.forEach(id => {
          const node = this.nodes.find(n => n.id === id);
          if (node) {
            node.x += dx;
            node.y += dy;
            if (CONFIG.canvas.snapToGrid) {
              node.x = Math.round(node.x / CONFIG.canvas.gridSize) * CONFIG.canvas.gridSize;
              node.y = Math.round(node.y / CONFIG.canvas.gridSize) * CONFIG.canvas.gridSize;
            }
          }
        });
        this.render();
        return;
      }

      if (this.isConnecting && this.connectingSource) {
        const mouse = this.screenToCanvas(e.clientX, e.clientY);
        const p1 = this.connectingSource.startPos;
        const d = ConnectorManager.computePath(p1, mouse, "bezier");
        this.tempConnectorLine.setAttribute("d", d);
      }
    });

    window.addEventListener("mouseup", e => {
      if (this.isPanning) {
        this.isPanning = false;
      }

      if (this.isDraggingNodes) {
        this.isDraggingNodes = false;
        this.saveState();
      }

      if (this.isConnecting) {
        this.isConnecting = false;
        this.tempConnectorLine.style.display = "none";

        const targetAnchor = e.target.closest(".pf-anchor");
        if (targetAnchor && this.connectingSource) {
          const targetNodeId = targetAnchor.getAttribute("data-node-id");
          const targetAnchorId = targetAnchor.getAttribute("data-anchor");

          if (targetNodeId !== this.connectingSource.nodeId) {
            const newConn = ConnectorManager.createConnector(
              this.connectingSource.nodeId,
              this.connectingSource.anchorId,
              targetNodeId,
              targetAnchorId
            );
            this.connectors.push(newConn);
            this.saveState();
            this.render();
          }
        }
        this.connectingSource = null;
      }
    });

    // Keyboard Shortcuts
    window.addEventListener("keydown", e => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "Delete" || e.key === "Backspace") {
        if (this.selectedNodeIds.size > 0) {
          this.nodes = this.nodes.filter(n => !this.selectedNodeIds.has(n.id));
          this.connectors = this.connectors.filter(c => !this.selectedNodeIds.has(c.from) && !this.selectedNodeIds.has(c.to));
          this.selectedNodeIds.clear();
          this.saveState();
          this.render();
        } else if (this.selectedConnectorId) {
          this.connectors = this.connectors.filter(c => c.id !== this.selectedConnectorId);
          this.selectedConnectorId = null;
          this.saveState();
          this.render();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) this.redo();
        else this.undo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        this.duplicateSelected();
      }
    });
  }

  duplicateSelected() {
    if (this.selectedNodeIds.size === 0) return;
    const newSelectedIds = new Set();
    this.selectedNodeIds.forEach(id => {
      const orig = this.nodes.find(n => n.id === id);
      if (orig) {
        const copy = JSON.parse(JSON.stringify(orig));
        copy.id = "node_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
        copy.x += 30;
        copy.y += 30;
        this.nodes.push(copy);
        newSelectedIds.add(copy.id);
      }
    });
    this.selectedNodeIds = newSelectedIds;
    this.saveState();
    this.render();
  }

  getSelectedNode() {
    if (this.selectedNodeIds.size === 1) {
      const id = Array.from(this.selectedNodeIds)[0];
      return this.nodes.find(n => n.id === id) || null;
    }
    return null;
  }

  addNode(type, x = 200, y = 200) {
    const node = NodeManager.createNode(type, x, y);
    this.nodes.push(node);
    this.selectedNodeIds.clear();
    this.selectedNodeIds.add(node.id);
    this.saveState();
    this.render();
  }

  loadTemplate(templateKey) {
    const tmpl = TEMPLATES[templateKey];
    if (!tmpl) return;
    this.nodes = tmpl.getNodes();
    this.connectors = tmpl.getConnectors();
    this.selectedNodeIds.clear();
    this.selectedConnectorId = null;
    this.panX = 40;
    this.panY = 40;
    this.zoom = 1.0;
    this.updateTransform();
    this.saveState();
    this.render();
  }
}
