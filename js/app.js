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
  const inputWidth = document.getElementById("prop-width");
  const inputHeight = document.getElementById("prop-height");
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
    if (inputWidth) inputWidth.value = node.width || 180;
    if (inputHeight) inputHeight.value = node.height || 140;

    // Dynamic fields by node type
    renderCustomFields(node);
  }

  function renderCustomFields(node) {
    if (!customFieldsContainer) return;
    customFieldsContainer.innerHTML = "";

    const addTextarea = (labelText, value, onUpdate) => {
      const lbl = document.createElement("label");
      lbl.className = "pf-prop-label";
      lbl.textContent = labelText;
      customFieldsContainer.appendChild(lbl);

      const ta = document.createElement("textarea");
      ta.className = "pf-prop-textarea";
      ta.value = value;
      ta.addEventListener("input", e => {
        onUpdate(e.target.value);
        canvas.render();
      });
      customFieldsContainer.appendChild(ta);
    };

    const addTextInput = (labelText, value, onUpdate) => {
      const lbl = document.createElement("label");
      lbl.className = "pf-prop-label";
      lbl.textContent = labelText;
      customFieldsContainer.appendChild(lbl);

      const inp = document.createElement("input");
      inp.type = "text";
      inp.className = "pf-prop-input";
      inp.value = value || "";
      inp.addEventListener("input", e => {
        onUpdate(e.target.value);
        canvas.render();
      });
      customFieldsContainer.appendChild(inp);
    };

    if (node.type === CONFIG.nodeTypes.STAGE_CONTAINER && node.data) {
      addTextInput("Section Header Name:", node.data.sectionHeader || "", val => {
        node.data.sectionHeader = val;
      });
    } else if (node.type === CONFIG.nodeTypes.FUNNEL_STAGE && node.data) {
      addTextInput("Stage Screening Criteria:", node.data.criteria || "", val => {
        node.data.criteria = val;
      });
      addTextarea("Funnel Steps (one per line):", (node.data.funnelSteps || []).join("\n"), val => {
        node.data.funnelSteps = val.split("\n").filter(s => s.trim().length > 0);
      });
    } else if (node.type === CONFIG.nodeTypes.BRANCHING_AB && node.data) {
      if (node.data.branchA) {
        addTextInput("Branch A Name:", node.data.branchA.name || "", val => {
          node.data.branchA.name = val;
        });
        addTextInput("Branch A Count / Detail:", node.data.branchA.count || "", val => {
          node.data.branchA.count = val;
        });
      }
      if (node.data.branchB) {
        addTextInput("Branch B Name:", node.data.branchB.name || "", val => {
          node.data.branchB.name = val;
        });
        addTextInput("Branch B Count / Detail:", node.data.branchB.count || "", val => {
          node.data.branchB.count = val;
        });
      }
      addTextInput("Total Summary Banner:", node.data.totalBanner || "", val => {
        node.data.totalBanner = val;
      });
    } else if (node.type === CONFIG.nodeTypes.EXPERIMENT_CARD && node.data) {
      addTextInput("Input Reference Tag:", node.data.inputRef || "", val => {
        node.data.inputRef = val;
      });
      addTextInput("Sample Count / Setup:", node.data.sampleCount || "", val => {
        node.data.sampleCount = val;
      });
      addTextInput("Question / Prompt:", node.data.questionPrompt || "", val => {
        node.data.questionPrompt = val;
      });
    } else if (node.type === CONFIG.nodeTypes.WIDE_STAGE && node.data) {
      addTextarea("Stage Bullets (one per line):", (node.data.bullets || []).join("\n"), val => {
        node.data.bullets = val.split("\n").filter(s => s.trim().length > 0);
      });
    } else if (node.type === CONFIG.nodeTypes.PREPROCESSING && node.data && node.data.steps) {
      addTextarea("Pre-processing Steps (one per line):", node.data.steps.join("\n"), val => {
        node.data.steps = val.split("\n").filter(s => s.trim().length > 0);
      });
    } else if (node.type === CONFIG.nodeTypes.DATASET_INPUT && node.data && node.data.classes) {
      addTextarea("Dataset Classes (one per line):", node.data.classes.join("\n"), val => {
        node.data.classes = val.split("\n").filter(s => s.trim().length > 0);
      });
    } else if (node.type === CONFIG.nodeTypes.EVALUATION && node.data && node.data.metrics) {
      addTextarea("Metrics (Name: Value):", node.data.metrics.map(m => `${m.name}: ${m.value}`).join("\n"), val => {
        node.data.metrics = val.split("\n").filter(l => l.includes(":")).map(l => {
          const [n, v] = l.split(":");
          return { name: n.trim(), value: v ? v.trim() : "" };
        });
      });
    } else if (node.type === CONFIG.nodeTypes.CALLOUT_NOTE && node.data && node.data.lines) {
      addTextarea("Callout Lines (one per line):", node.data.lines.join("\n"), val => {
        node.data.lines = val.split("\n");
      });
    }
  }

  // Live Title, Subtitle, Width & Height updates
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

  inputWidth?.addEventListener("input", e => {
    const node = canvas.getSelectedNode();
    if (node) {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val >= 50) {
        node.width = val;
        canvas.render();
      }
    }
  });

  inputHeight?.addEventListener("input", e => {
    const node = canvas.getSelectedNode();
    if (node) {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val >= 30) {
        node.height = val;
        canvas.render();
      }
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
