/**
 * PaperFlow — Node Models & Academic Visual Components
 * Handles node creation, dimension calculation, and SVG/DOM visual rendering.
 */

class NodeManager {
  static createNode(type, x, y, customProps = {}) {
    const id = "node_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    const defaults = this.getDefaultsForType(type);

    return {
      id,
      type,
      x: Math.round(x / CONFIG.canvas.gridSize) * CONFIG.canvas.gridSize,
      y: Math.round(y / CONFIG.canvas.gridSize) * CONFIG.canvas.gridSize,
      width: defaults.width || 180,
      height: defaults.height || 140,
      title: defaults.title || "Step",
      subtitle: defaults.subtitle || "",
      borderColor: defaults.borderColor || "#f59e0b",
      bgColor: defaults.bgColor || "transparent",
      data: { ...defaults.data, ...customProps.data },
      ...customProps
    };
  }

  static getDefaultsForType(type) {
    switch (type) {
      case CONFIG.nodeTypes.DATASET_INPUT:
        return {
          title: "Dataset Collection",
          subtitle: "Input Data",
          width: 200,
          height: 180,
          borderColor: "#f59e0b",
          data: {
            inputType: "image", // "image" | "audio" | "text" | "dataset_classes"
            classes: ["Bell pepper", "Potato", "Tomato", "Rice", "Corn"],
            datasetCount: "12,450 samples",
            icon: "image"
          }
        };

      case CONFIG.nodeTypes.PREPROCESSING:
        return {
          title: "Data Pre-Processing",
          subtitle: "Cleaning & Normalization",
          width: 190,
          height: 160,
          borderColor: "#10b981",
          data: {
            steps: ["Rescaling / Resize", "Parameter Set", "Data Augmentation", "Gray Scaling"],
            icon: "sliders"
          }
        };

      case CONFIG.nodeTypes.FEATURE_EXTRACTION:
        return {
          title: "Feature Extraction",
          subtitle: "Representation Learning",
          width: 190,
          height: 160,
          borderColor: "#8b5cf6",
          data: {
            method: "Deep Feature Extractor",
            details: ["Setting Weights", "Input Shape (224, 224, 3)", "Feature Dimension: 768"],
            nlpType: "CBOW / Skip-Gram",
            icon: "cpu"
          }
        };

      case CONFIG.nodeTypes.DATA_SPLIT:
        return {
          title: "Data Split",
          subtitle: "Cross-Validation Partition",
          width: 160,
          height: 150,
          borderColor: "#d97706",
          data: {
            ratio: "80 / 20 Split",
            pie: [
              { label: "Train", pct: 80, color: "#ef4444" },
              { label: "Test", pct: 20, color: "#3b82f6" }
            ],
            icon: "pie-chart"
          }
        };

      case CONFIG.nodeTypes.SPLIT_BADGE:
        return {
          title: "Training Data",
          subtitle: "",
          width: 130,
          height: 44,
          borderColor: "#ef4444",
          data: {
            variant: "red", // "red" | "blue" | "green"
            icon: "database"
          }
        };

      case CONFIG.nodeTypes.MODEL_ENSEMBLE:
        return {
          title: "DL & ML Algorithms",
          subtitle: "Model Suite & Ensembles",
          width: 320,
          height: 140,
          borderColor: "#dc2626",
          data: {
            icon: "hard-drive",
            algorithms: [
              { name: "CNN", color: "#f59e0b" },
              { name: "LSTM", color: "#3b82f6" },
              { name: "VGG-19", color: "#8b5cf6" },
              { name: "MobileNet", color: "#10b981" },
              { name: "EfficientNet", color: "#ec4899" },
              { name: "SVM", color: "#6366f1" }
            ]
          }
        };

      case CONFIG.nodeTypes.TRAINED_MODEL:
        return {
          title: "Trained Model",
          subtitle: "Optimized Weights",
          width: 190,
          height: 130,
          borderColor: "#e11d48",
          data: {
            modelName: "EfficientNetB3 (Trained)",
            accuracySummary: "Val Acc: 98.6%",
            icon: "check-circle"
          }
        };

      case CONFIG.nodeTypes.EVALUATION:
        return {
          title: "Model Evaluation",
          subtitle: "Performance Metrics",
          width: 180,
          height: 170,
          borderColor: "#059669",
          data: {
            icon: "search",
            metrics: [
              { name: "Accuracy", value: "98.4%" },
              { name: "Precision", value: "97.8%" },
              { name: "Recall", value: "98.1%" },
              { name: "F1 Score", value: "97.9%" }
            ]
          }
        };

      case CONFIG.nodeTypes.PREDICTION:
        return {
          title: "Prediction Output",
          subtitle: "Inference Result",
          width: 180,
          height: 130,
          borderColor: "#10b981",
          data: {
            icon: "trending-up",
            outputs: [
              { label: "Positive Class", color: "#10b981", arrow: "up" },
              { label: "Negative Class", color: "#ef4444", arrow: "down" }
            ]
          }
        };

      case CONFIG.nodeTypes.CALLOUT_NOTE:
        return {
          title: "Filter Callout",
          subtitle: "",
          width: 190,
          height: 150,
          borderColor: "#10b981",
          data: {
            title: "Pre-processing Notes",
            lines: [
              "Removing:",
              "• punctuations & symbols",
              "• stop words & emojis",
              "Applying:",
              "• Porter stemmer",
              "• Subword tokenizer"
            ]
          }
        };

      case CONFIG.nodeTypes.STAGE_CONTAINER:
        return {
          title: "Section Group Container",
          subtitle: "Grouping Module",
          width: 520,
          height: 380,
          borderColor: "#8b5cf6",
          data: {
            sectionHeader: "Preprocessing Pipeline",
            isGroup: true
          }
        };

      case CONFIG.nodeTypes.FUNNEL_STAGE:
        return {
          title: "Stage 2 — Screening & Filtering",
          subtitle: "Screen unsuitable conditions and visual criteria",
          width: 480,
          height: 85,
          borderColor: "#8b5cf6",
          data: {
            stageNum: "Stage 2",
            stageTitle: "Classification & Screening",
            criteria: "Category • Properties • Screening Criteria",
            funnelSteps: ["50,000 Ingestion", "24,000 Filtered", "500 Selected"],
            icon: "brain"
          }
        };

      case CONFIG.nodeTypes.BRANCHING_AB:
        return {
          title: "Stage 6 — Identity-Oriented Generation",
          subtitle: "Comparison of dual model pathways",
          width: 480,
          height: 105,
          borderColor: "#3b82f6",
          data: {
            stageNum: "Stage 6",
            stageTitle: "Dual-Branch Comparison",
            branchA: { name: "Branch A: Model Architecture A", count: "100 Generated Samples" },
            branchB: { name: "Branch B: Model Architecture B", count: "100 Generated Samples" },
            totalBanner: "Total: 200 Generated Samples",
            icon: "wand"
          }
        };

      case CONFIG.nodeTypes.EXPERIMENT_CARD:
        return {
          title: "Experiment 1 — Human Perception Study",
          subtitle: "",
          width: 235,
          height: 145,
          borderColor: "#0284c7",
          data: {
            expNum: "Experiment 1",
            expTitle: "Perceptual Quality",
            inputRef: "Input: Stage 6 Outputs",
            sampleCount: "200 samples • Side-by-side shown",
            questionPrompt: "Question: Does sample look authentic? — Yes / No",
            icon: "user"
          }
        };

      case CONFIG.nodeTypes.WIDE_STAGE:
        return {
          title: "Stage 1 — Primary Source Dataset",
          subtitle: "",
          width: 480,
          height: 65,
          borderColor: "#334155",
          data: {
            bullets: ["~1.2M Samples", "~100,000 Classes / Identities", "High-Resolution Tensors"],
            icon: "database"
          }
        };

      case CONFIG.nodeTypes.GENERIC_CARD:
      default:
        return {
          title: "Process Step",
          subtitle: "Custom Block",
          width: 180,
          height: 120,
          borderColor: "#6366f1",
          data: {
            description: "Custom methodology component description or formulas.",
            icon: "box"
          }
        };
    }
  }

  static getAnchors(node) {
    const cx = node.x + node.width / 2;
    const cy = node.y + node.height / 2;
    return [
      { id: "top", x: cx, y: node.y },
      { id: "right", x: node.x + node.width, y: cy },
      { id: "bottom", x: cx, y: node.y + node.height },
      { id: "left", x: node.x, y: cy }
    ];
  }
}
