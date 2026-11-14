/**
 * PaperFlow — Main Application Controller & UI Binder
 * Handles sidebar palette, properties inspector, templates, and toolbar controls.
 */

document.addEventListener("DOMContentLoaded", () => {
  const canvasContainer = document.getElementById("canvas-container");
  const canvas = new PaperCanvas(canvasContainer);

  // Load default template on first visit (Deep Learning Vision Framework)
  canvas.loadTemplate("visionFramework");

  // Hook global canvas selection change to update the Properties Inspector
  window.onCanvasSelectionChange = selectedNode => {
    updatePropertiesPanel(selectedNode);
  };

  // ---------------- SIDEBAR BLOCKS PALETTE ----------------
  document.querySelectorAll(".pf-palette-item").forEach(item => {
    item.addEventListener("click", () => {
      const type = item.getAttribute("data-type");
      const center = canvas.screenToCanvas(
        canvasContainer.clientWidth / 2,
        canvasContainer.clientHeight / 2
      );
      canvas.addNode(type, center.x - 90, center.y - 70);
    });

    // Drag and drop into canvas
    item.setAttribute("draggable", "true");
    item.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", item.getAttribute("data-type"));
    });
  });

  canvasContainer.addEventListener("dragover", e => {
    e.preventDefault();
  });

  canvasContainer.addEventListener("drop", e => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    if (type) {
      const pos = canvas.screenToCanvas(e.clientX, e.clientY);
      canvas.addNode(type, pos.x - 90, pos.y - 60);
    }
  });

  // ---------------- TOP TOOLBAR CONTROLS ----------------
  // Template Selector
  const templateSelect = document.getElementById("template-select");
  if (templateSelect) {
    templateSelect.addEventListener("change", e => {
      const key = e.target.value;
      if (key && TEMPLATES[key]) {
        canvas.loadTemplate(key);
      }
    });
  }

  // Theme Switcher
  const themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    themeSelect.addEventListener("change", e => {
      canvas.setTheme(e.target.value);
    });
  }

  // Undo / Redo
  document.getElementById("btn-undo")?.addEventListener("click", () => canvas.undo());
  document.getElementById("btn-redo")?.addEventListener("click", () => canvas.redo());

  // Zoom Controls
  document.getElementById("btn-zoom-in")?.addEventListener("click", () => {
    canvas.zoom = Math.min(CONFIG.canvas.maxZoom, canvas.zoom + 0.15);
    canvas.updateTransform();
  });

  document.getElementById("btn-zoom-out")?.addEventListener("click", () => {
    canvas.zoom = Math.max(CONFIG.canvas.minZoom, canvas.zoom - 0.15);
    canvas.updateTransform();
  });

  document.getElementById("btn-zoom-reset")?.addEventListener("click", () => {
    canvas.zoom = 1.0;
    canvas.panX = 40;
    canvas.panY = 40;
    canvas.updateTransform();
  });

  // Export Buttons
  document.getElementById("btn-export-svg")?.addEventListener("click", () => {
    ExportManager.exportSVG(canvas);
  });

  document.getElementById("btn-export-png")?.addEventListener("click", () => {
    ExportManager.exportPNG(canvas, 3); // 300 DPI print quality
  });

  document.getElementById("btn-export-drawio")?.addEventListener("click", () => {
    ExportManager.exportDrawIO(canvas);
  });

  document.getElementById("btn-export-json")?.addEventListener("click", () => {
    ExportManager.exportJSON(canvas);
  });

  // Import JSON
  const importInput = document.getElementById("input-import-json");
  if (importInput) {
    importInput.addEventListener("change", e => {
      if (e.target.files && e.target.files[0]) {
        ExportManager.loadJSON(canvas, e.target.files[0]);
      }
    });
  }

  // ---------------- PROPERTIES INSPECTOR ----------------
  const inspectorPanel = document.getElementById("properties-inspector");
  const emptyState = document.getElementById("inspector-empty");
  const formState = document.getElementById("inspector-form");

  const inputTitle = document.getElementById("prop-title");
  const inputSub = document.getElementById("prop-subtitle");
  const colorPickerContainer = document.getElementById("prop-colors");
  const btnDeleteNode = document.getElementById("btn-delete-node");
  const btnDuplicateNode = document.getElementById("btn-duplicate-node");
  const customFieldsContainer = document.getElementById("prop-custom-fields");

  // Render Color Swatches
  if (colorPickerContainer) {
    colorPickerContainer.innerHTML = "";
    CONFIG.colors.forEach(c => {
      const swatch = document.createElement("button");
      swatch.className = "pf-color-swatch";
      swatch.style.backgroundColor = c.border;
      swatch.title = c.name;
      swatch.addEventListener("click", () => {
        const node = canvas.getSelectedNode();
        if (node) {
          node.borderColor = c.border;
          canvas.saveState();
          canvas.render();
        }
      });
      colorPickerContainer.appendChild(swatch);
    });
  }

  function updatePropertiesPanel(node) {
    if (!node) {
      emptyState.style.display = "block";
      formState.style.display = "none";
      return;
    }

    emptyState.style.display = "none";
    formState.style.display = "block";

    inputTitle.value = node.title || "";
    inputSub.value = node.subtitle || "";

    // Dynamic fields by node type
    renderCustomFields(node);
  }

  function renderCustomFields(node) {
    if (!customFieldsContainer) return;
    customFieldsContainer.innerHTML = "";

    if (node.type === CONFIG.nodeTypes.PREPROCESSING && node.data && node.data.steps) {
      const lbl = document.createElement("label");
      lbl.className = "pf-prop-label";
      lbl.textContent = "Pre-processing Steps (one per line):";
      customFieldsContainer.appendChild(lbl);

      const ta = document.createElement("textarea");
      ta.className = "pf-prop-textarea";
      ta.value = node.data.steps.join("\n");
      ta.addEventListener("input", e => {
        node.data.steps = e.target.value.split("\n").filter(s => s.trim().length > 0);
        canvas.render();
      });
      customFieldsContainer.appendChild(ta);
    } else if (node.type === CONFIG.nodeTypes.DATASET_INPUT && node.data && node.data.classes) {
      const lbl = document.createElement("label");
      lbl.className = "pf-prop-label";
      lbl.textContent = "Dataset Classes (one per line):";
      customFieldsContainer.appendChild(lbl);

      const ta = document.createElement("textarea");
      ta.className = "pf-prop-textarea";
      ta.value = node.data.classes.join("\n");
      ta.addEventListener("input", e => {
        node.data.classes = e.target.value.split("\n").filter(s => s.trim().length > 0);
        canvas.render();
      });
      customFieldsContainer.appendChild(ta);
    } else if (node.type === CONFIG.nodeTypes.EVALUATION && node.data && node.data.metrics) {
      const lbl = document.createElement("label");
      lbl.className = "pf-prop-label";
      lbl.textContent = "Metrics (Name: Value):";
      customFieldsContainer.appendChild(lbl);

      const ta = document.createElement("textarea");
      ta.className = "pf-prop-textarea";
      ta.value = node.data.metrics.map(m => `${m.name}: ${m.value}`).join("\n");
      ta.addEventListener("input", e => {
        node.data.metrics = e.target.value.split("\n").filter(l => l.includes(":")).map(l => {
          const [n, v] = l.split(":");
          return { name: n.trim(), value: v ? v.trim() : "" };
        });
        canvas.render();
      });
      customFieldsContainer.appendChild(ta);
    }
  }

  // Live Title & Subtitle updates
  inputTitle?.addEventListener("input", e => {
    const node = canvas.getSelectedNode();
    if (node) {
      node.title = e.target.value;
      canvas.render();
    }
  });

  inputSub?.addEventListener("input", e => {
    const node = canvas.getSelectedNode();
    if (node) {
      node.subtitle = e.target.value;
      canvas.render();
    }
  });

  btnDeleteNode?.addEventListener("click", () => {
    const node = canvas.getSelectedNode();
    if (node) {
      canvas.nodes = canvas.nodes.filter(n => n.id !== node.id);
      canvas.connectors = canvas.connectors.filter(c => c.from !== node.id && c.to !== node.id);
      canvas.selectedNodeIds.clear();
      canvas.saveState();
      canvas.render();
    }
  });

  btnDuplicateNode?.addEventListener("click", () => {
    canvas.duplicateSelected();
  });
});
