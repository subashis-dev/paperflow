/**
 * PaperFlow — Configuration & Academic Node Catalog
 * Provides color palettes, node archetypes, and canvas configuration.
 */

const CONFIG = {
  canvas: {
    gridSize: 20,
    snapToGrid: true,
    minZoom: 0.25,
    maxZoom: 3.0,
    zoomStep: 0.1,
    defaultBg: "#0b0f19",
    gridColor: "rgba(255, 255, 255, 0.06)",
    selectionBoxColor: "rgba(99, 102, 241, 0.15)",
    selectionBorderColor: "#6366f1"
  },
  themes: {
    dark: {
      name: "Modern Dark",
      canvasBg: "#0b0f19",
      nodeBg: "#111827",
      textColor: "#f8fafc",
      subTextColor: "#94a3b8",
      borderColor: "#374151",
      connectorColor: "#64748b"
    },
    light: {
      name: "Academic Print (Paper)",
      canvasBg: "#ffffff",
      nodeBg: "#ffffff",
      textColor: "#0f172a",
      subTextColor: "#475569",
      borderColor: "#cbd5e1",
      connectorColor: "#334155"
    },
    blueprint: {
      name: "Engineering Blueprint",
      canvasBg: "#0f172a",
      nodeBg: "#1e293b",
      textColor: "#e2e8f0",
      subTextColor: "#94a3b8",
      borderColor: "#38bdf8",
      connectorColor: "#38bdf8"
    }
  },
  colors: [
    { name: "Gold / Amber", border: "#f59e0b", badge: "#fef3c7", badgeText: "#b45309" },
    { name: "Emerald Green", border: "#10b981", badge: "#d1fae5", badgeText: "#047857" },
    { name: "Crimson Red", border: "#ef4444", badge: "#fee2e2", badgeText: "#b91c1c" },
    { name: "Royal Purple", border: "#8b5cf6", badge: "#ede9fe", badgeText: "#6d28d9" },
    { name: "Electric Blue", border: "#3b82f6", badge: "#dbeafe", badgeText: "#1d4ed8" },
    { name: "Teal Cyan", border: "#14b8a6", badge: "#ccfbf1", badgeText: "#0f766e" },
    { name: "Academic Monochrome", border: "#334155", badge: "#f1f5f9", badgeText: "#1e293b" }
  ],
  icons: [
    { icon: "⚙️", label: "Settings / Process" },
    { icon: "🧠", label: "AI / Brain" },
    { icon: "🗄️", label: "Data / Database" },
    { icon: "📷", label: "Image / Vision" },
    { icon: "📊", label: "Bar Chart / Evaluation" },
    { icon: "📈", label: "Line Chart / Trend" },
    { icon: "🥧", label: "Pie Chart / Split" },
    { icon: "⚡", label: "Decision / Lightning" },
    { icon: "🔍", label: "Search / Inspection" },
    { icon: "🎯", label: "Target / Metric" },
    { icon: "👤", label: "User / Subject" },
    { icon: "💬", label: "Note / Annotation" },
    { icon: "💻", label: "Code / Terminal" },
    { icon: "📄", label: "Document / Text" },
    { icon: "🏷️", label: "Tag / Badge" },
    { icon: "✨", label: "Magic / Generation" },
    { icon: "🔒", label: "Security / Privacy" },
    { icon: "🌐", label: "Network / Web" },
    { icon: "☁️", label: "Cloud / Server" },
    { icon: "🔄", label: "Loop / Iteration" },
    { icon: "📦", label: "Box / Module" },
    { icon: "🗂️", label: "Folder / Container" },
    { icon: "🎛️", label: "Sliders / Tuning" },
    { icon: "🔊", label: "Audio / Voice" },
    { icon: "🎬", label: "Video / Stream" },
    { icon: "🧩", label: "Component / Plugin" },
    { icon: "📥", label: "Input / Ingest" },
    { icon: "📤", label: "Output / Export" },
    { icon: "⚖️", label: "Comparison / Balance" },
    { icon: "🌪️", label: "Funnel / Filter" }
  ],
  nodeTypes: {
    DATASET_INPUT: "dataset_input",
    PREPROCESSING: "preprocessing",
    FEATURE_EXTRACTION: "feature_extraction",
    DATA_SPLIT: "data_split",
    SPLIT_BADGE: "split_badge",
    MODEL_ENSEMBLE: "model_ensemble",
    TRAINED_MODEL: "trained_model",
    EVALUATION: "evaluation",
    PREDICTION: "prediction",
    CALLOUT_NOTE: "callout_note",
    GENERIC_CARD: "generic_card",
    STAGE_CONTAINER: "stage_container",
    FUNNEL_STAGE: "funnel_stage",
    BRANCHING_AB: "branching_ab",
    EXPERIMENT_CARD: "experiment_card",
    WIDE_STAGE: "wide_stage"
  }
};
