/**
 * PaperFlow — Node Models & Visual Components
 * Provides clean architectural components with icon support and customizable properties.
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
      width: customProps.width || defaults.width || 180,
      height: customProps.height || defaults.height || 140,
      title: customProps.title || defaults.title || "Step",
      subtitle: customProps.subtitle || defaults.subtitle || "",
      icon: customProps.icon || defaults.icon || "⚙️",
      borderColor: customProps.borderColor || defaults.borderColor || "#f59e0b",
      bgColor: defaults.bgColor || "transparent",
      data: { ...defaults.data, ...customProps.data, icon: customProps.icon || defaults.icon || "⚙️" },
      ...customProps
    };
  }

  static getDefaultsForType(type) {
    switch (type) {
      case CONFIG.nodeTypes.DATASET_INPUT:
        return {
          title: "Input / Data Source",
          subtitle: "Dataset or Inputs",
          icon: "🗄️",
          width: 180,
          height: 140,
          borderColor: "#f59e0b",
          data: {
            icon: "🗄️",
            classes: ["Item 1", "Item 2", "Item 3"]
          }
        };

      case CONFIG.nodeTypes.PREPROCESSING:
        return {
          title: "Process Step",
          subtitle: "Transform / Normalization",
          icon: "⚙️",
          width: 180,
          height: 140,
          borderColor: "#10b981",
          data: {
            icon: "⚙️",
            steps: ["Operation 1", "Operation 2", "Operation 3"]
          }
        };

      case CONFIG.nodeTypes.FEATURE_EXTRACTION:
        return {
          title: "Feature Extractor",
          subtitle: "Representation Learning",
          icon: "🧠",
          width: 180,
          height: 140,
          borderColor: "#8b5cf6",
          data: {
            icon: "🧠",
            details: ["Dimension: D", "Weights / Embeddings"]
          }
        };

      case CONFIG.nodeTypes.DATA_SPLIT:
        return {
          title: "Data Split",
          subtitle: "Partition Ratio",
          icon: "🥧",
          width: 160,
          height: 150,
          borderColor: "#d97706",
          data: {
            icon: "🥧",
            ratio: "80 / 20 Split"
          }
        };

      case CONFIG.nodeTypes.SPLIT_BADGE:
        return {
          title: "Subset Badge",
          subtitle: "",
          icon: "🏷️",
          width: 130,
          height: 44,
          borderColor: "#ef4444",
          data: {
            icon: "🏷️",
            variant: "red"
          }
        };

      case CONFIG.nodeTypes.MODEL_ENSEMBLE:
        return {
          title: "Model Ensemble",
          subtitle: "Candidate Models",
          icon: "💻",
          width: 280,
          height: 130,
          borderColor: "#dc2626",
          data: {
            icon: "💻",
            algorithms: [
              { name: "Model A", color: "#f59e0b" },
              { name: "Model B", color: "#3b82f6" },
              { name: "Model C", color: "#10b981" }
            ]
          }
        };

      case CONFIG.nodeTypes.TRAINED_MODEL:
        return {
          title: "Trained Model",
          subtitle: "Optimized Checkpoint",
          icon: "🎯",
          width: 180,
          height: 120,
          borderColor: "#e11d48",
          data: {
            icon: "🎯",
            modelName: "Model Checkpoint",
            accuracySummary: "Performance Score"
          }
        };

      case CONFIG.nodeTypes.EVALUATION:
        return {
          title: "Evaluation Metrics",
          subtitle: "Test Results",
          icon: "📊",
          width: 180,
          height: 150,
          borderColor: "#059669",
          data: {
            icon: "📊",
            metrics: [
              { name: "Metric 1", value: "98.2%" },
              { name: "Metric 2", value: "96.5%" }
            ]
          }
        };

      case CONFIG.nodeTypes.PREDICTION:
        return {
          title: "Inference Output",
          subtitle: "Target Output",
          icon: "📈",
          width: 180,
          height: 130,
          borderColor: "#10b981",
          data: {
            icon: "📈",
            outputs: [
              { label: "Class / State A", color: "#10b981", arrow: "up" },
              { label: "Class / State B", color: "#ef4444", arrow: "down" }
            ]
          }
        };

      case CONFIG.nodeTypes.CALLOUT_NOTE:
        return {
          title: "Note / Annotation",
          subtitle: "",
          icon: "💬",
          width: 180,
          height: 130,
          borderColor: "#10b981",
          data: {
            icon: "💬",
            lines: ["• Note item 1", "• Note item 2"]
          }
        };

      case CONFIG.nodeTypes.STAGE_CONTAINER:
        return {
          title: "Pipeline Container",
          subtitle: "Stage Group",
          icon: "🗂️",
          width: 500,
          height: 350,
          borderColor: "#8b5cf6",
          data: {
            icon: "🗂️",
            sectionHeader: "Pipeline Stage Group",
            isGroup: true
          }
        };

      case CONFIG.nodeTypes.FUNNEL_STAGE:
        return {
          title: "Funnel Filter Stage",
          subtitle: "Screening Criteria",
          icon: "🌪️",
          width: 460,
          height: 85,
          borderColor: "#8b5cf6",
          data: {
            icon: "🌪️",
            criteria: "Category • Conditions • Threshold",
            funnelSteps: ["Ingestion", "Filtered", "Selected"]
          }
        };

      case CONFIG.nodeTypes.BRANCHING_AB:
        return {
          title: "Dual-Branch Comparison",
          subtitle: "Comparative Evaluation",
          icon: "⚖️",
          width: 460,
          height: 105,
          borderColor: "#3b82f6",
          data: {
            icon: "⚖️",
            branchA: { name: "Branch A", count: "Count / Detail" },
            branchB: { name: "Branch B", count: "Count / Detail" },
            totalBanner: "Total Combined"
          }
        };

      case CONFIG.nodeTypes.EXPERIMENT_CARD:
        return {
          title: "Perception / Study Card",
          subtitle: "",
          icon: "👤",
          width: 220,
          height: 140,
          borderColor: "#0284c7",
          data: {
            icon: "👤",
            inputRef: "Input Source",
            sampleCount: "Sample configuration",
            questionPrompt: "Question: Meets quality criteria? — Yes / No"
          }
        };

      case CONFIG.nodeTypes.WIDE_STAGE:
        return {
          title: "Primary Dataset Stage",
          subtitle: "",
          icon: "🗄️",
          width: 460,
          height: 65,
          borderColor: "#334155",
          data: {
            icon: "🗄️",
            bullets: ["• Samples / Items", "• Classes / Categories", "• Format & Specifications"]
          }
        };

      case CONFIG.nodeTypes.GENERIC_CARD:
      default:
        return {
          title: "Process Step",
          subtitle: "Description",
          icon: "📦",
          width: 180,
          height: 120,
          borderColor: "#6366f1",
          data: {
            icon: "📦",
            description: "Custom step description or parameters."
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
