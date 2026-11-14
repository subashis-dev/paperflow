/**
 * PaperFlow — Generic Diagram Templates
 * Clean, customizable architectural skeletons without any domain-specific data.
 */

const TEMPLATES = {
  blank: {
    name: "Blank Canvas (Empty)",
    description: "Start fresh with a clean drawing surface",
    getNodes: () => [],
    getConnectors: () => []
  },

  linear: {
    name: "3-Step Pipeline (Input ➔ Process ➔ Output)",
    description: "Standard sequential flow diagram",
    getNodes: () => [
      {
        id: "node_step_1",
        type: CONFIG.nodeTypes.DATASET_INPUT,
        x: 100,
        y: 180,
        width: 180,
        height: 140,
        title: "Input Source",
        subtitle: "Raw Data / Inputs",
        icon: "🗄️",
        borderColor: "#f59e0b",
        data: { icon: "🗄️", classes: ["Item 1", "Item 2", "Item 3"] }
      },
      {
        id: "node_step_2",
        type: CONFIG.nodeTypes.PREPROCESSING,
        x: 380,
        y: 180,
        width: 180,
        height: 140,
        title: "Process Step",
        subtitle: "Transform / Compute",
        icon: "⚙️",
        borderColor: "#10b981",
        data: { icon: "⚙️", steps: ["Operation A", "Operation B", "Operation C"] }
      },
      {
        id: "node_step_3",
        type: CONFIG.nodeTypes.EVALUATION,
        x: 660,
        y: 180,
        width: 180,
        height: 140,
        title: "Output / Results",
        subtitle: "Evaluation & Metrics",
        icon: "📊",
        borderColor: "#3b82f6",
        data: { icon: "📊", metrics: [{ name: "Score A", value: "98%" }, { name: "Score B", value: "95%" }] }
      }
    ],
    getConnectors: () => [
      ConnectorManager.createConnector("node_step_1", "right", "node_step_2", "left", "Data Stream"),
      ConnectorManager.createConnector("node_step_2", "right", "node_step_3", "left", "Output Stream")
    ]
  },

  branching: {
    name: "Parallel Branching Flow",
    description: "Data partitioning into dual processing paths",
    getNodes: () => [
      {
        id: "node_src",
        type: CONFIG.nodeTypes.DATASET_INPUT,
        x: 80,
        y: 200,
        width: 180,
        height: 130,
        title: "Data Ingestion",
        subtitle: "Source Tensors",
        icon: "🗄️",
        borderColor: "#f59e0b",
        data: { icon: "🗄️" }
      },
      {
        id: "node_split",
        type: CONFIG.nodeTypes.DATA_SPLIT,
        x: 340,
        y: 190,
        width: 160,
        height: 150,
        title: "Data Partition",
        subtitle: "Ratio Split",
        icon: "🥧",
        borderColor: "#d97706",
        data: { icon: "🥧" }
      },
      {
        id: "node_branch_a",
        type: CONFIG.nodeTypes.GENERIC_CARD,
        x: 580,
        y: 110,
        width: 180,
        height: 120,
        title: "Branch A",
        subtitle: "Path 1",
        icon: "🧠",
        borderColor: "#8b5cf6",
        data: { icon: "🧠" }
      },
      {
        id: "node_branch_b",
        type: CONFIG.nodeTypes.GENERIC_CARD,
        x: 580,
        y: 280,
        width: 180,
        height: 120,
        title: "Branch B",
        subtitle: "Path 2",
        icon: "💻",
        borderColor: "#0284c7",
        data: { icon: "💻" }
      },
      {
        id: "node_eval",
        type: CONFIG.nodeTypes.EVALUATION,
        x: 840,
        y: 190,
        width: 180,
        height: 150,
        title: "Evaluation",
        subtitle: "Benchmarking",
        icon: "📊",
        borderColor: "#10b981",
        data: { icon: "📊", metrics: [{ name: "Metric 1", value: "96.4%" }, { name: "Metric 2", value: "94.2%" }] }
      }
    ],
    getConnectors: () => [
      ConnectorManager.createConnector("node_src", "right", "node_split", "left"),
      ConnectorManager.createConnector("node_split", "right", "node_branch_a", "left", "Subset A"),
      ConnectorManager.createConnector("node_split", "right", "node_branch_b", "left", "Subset B"),
      ConnectorManager.createConnector("node_branch_a", "right", "node_eval", "left"),
      ConnectorManager.createConnector("node_branch_b", "right", "node_eval", "left")
    ]
  }
};
