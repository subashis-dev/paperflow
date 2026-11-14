/**
 * PaperFlow — Pre-Built Academic Methodology Templates
 * Accurately replicates the user's research paper methodology flowcharts with 1-click loading.
 */

const TEMPLATES = {
  // Template 1: Crop/Object Deep Learning Framework (from user's Image 3)
  visionFramework: {
    name: "Deep Learning Vision Framework (Fig. 1)",
    description: "Multi-class Image Dataset ➔ Pre-processing ➔ Data Split ➔ DL Algorithms Ensemble ➔ Trained EfficientNetB3 ➔ Evaluation",
    getNodes: () => [
      {
        id: "node_input_crop",
        type: CONFIG.nodeTypes.DATASET_INPUT,
        x: 60,
        y: 160,
        width: 170,
        height: 260,
        title: "Data Collection",
        subtitle: "Multi-Class Images",
        borderColor: "#10b981",
        data: {
          inputType: "dataset_classes",
          classes: ["Bell pepper", "Potato", "Tomato", "Rice", "Corn"],
          icon: "camera"
        }
      },
      {
        id: "node_preproc",
        type: CONFIG.nodeTypes.PREPROCESSING,
        x: 280,
        y: 190,
        width: 160,
        height: 140,
        title: "Data Pre-Processing",
        subtitle: "Image Normalization",
        borderColor: "#10b981",
        data: {
          steps: ["Resizing (224x224)", "Gray scaling", "Data Augmentation"],
          icon: "sliders"
        }
      },
      {
        id: "node_preproc_data",
        type: CONFIG.nodeTypes.GENERIC_CARD,
        x: 480,
        y: 190,
        width: 150,
        height: 140,
        title: "Pre-Processed Data",
        subtitle: "Augmented Tensors",
        borderColor: "#10b981",
        data: {
          description: "Normalized 16-bit float tensor batch ready for training.",
          icon: "image"
        }
      },
      {
        id: "node_split",
        type: CONFIG.nodeTypes.DATA_SPLIT,
        x: 670,
        y: 190,
        width: 150,
        height: 140,
        title: "Data Split",
        subtitle: "Train/Test Partition",
        borderColor: "#10b981",
        data: {
          ratio: "80 / 20",
          pie: [{ label: "Train", pct: 80, color: "#ef4444" }, { label: "Test", pct: 20, color: "#3b82f6" }]
        }
      },
      {
        id: "badge_train",
        type: CONFIG.nodeTypes.SPLIT_BADGE,
        x: 770,
        y: 370,
        width: 150,
        height: 44,
        title: "Training & Testing (Images)",
        subtitle: "",
        borderColor: "#ef4444",
        data: { variant: "red" }
      },
      {
        id: "badge_video",
        type: CONFIG.nodeTypes.SPLIT_BADGE,
        x: 950,
        y: 370,
        width: 140,
        height: 44,
        title: "Testing (Video Dataset)",
        subtitle: "",
        borderColor: "#ef4444",
        data: { variant: "red" }
      },
      {
        id: "node_ensemble",
        type: CONFIG.nodeTypes.MODEL_ENSEMBLE,
        x: 450,
        y: 470,
        width: 360,
        height: 150,
        title: "Deep Learning Algorithms",
        subtitle: "Backbone Neural Ensembles",
        borderColor: "#ef4444",
        data: {
          icon: "hard-drive",
          algorithms: [
            { name: "CNN", color: "#f59e0b" },
            { name: "CNN+LSTM", color: "#3b82f6" },
            { name: "MobileNet V2", color: "#10b981" },
            { name: "VGG-16", color: "#8b5cf6" },
            { name: "EfficientNet B3", color: "#ec4899" },
            { name: "Inception V3", color: "#6366f1" }
          ]
        }
      },
      {
        id: "node_trained",
        type: CONFIG.nodeTypes.TRAINED_MODEL,
        x: 980,
        y: 200,
        width: 190,
        height: 120,
        title: "Trained EfficientNetB3",
        subtitle: "Optimal Checkpoint",
        borderColor: "#ef4444",
        data: {
          modelName: "EfficientNetB3 (Optimal)",
          accuracySummary: "Training Loss: 0.038",
          icon: "cpu"
        }
      },
      {
        id: "node_eval",
        type: CONFIG.nodeTypes.EVALUATION,
        x: 990,
        y: 360,
        width: 170,
        height: 160,
        title: "Evaluation",
        subtitle: "Standard Metrics",
        borderColor: "#10b981",
        data: {
          metrics: [
            { name: "Accuracy", value: "98.7%" },
            { name: "Precision", value: "98.2%" },
            { name: "Recall", value: "98.5%" },
            { name: "F1 Score", value: "98.3%" }
          ]
        }
      }
    ],
    getConnectors: () => [
      ConnectorManager.createConnector("node_input_crop", "right", "node_preproc", "left"),
      ConnectorManager.createConnector("node_preproc", "right", "node_preproc_data", "left"),
      ConnectorManager.createConnector("node_preproc_data", "right", "node_split", "left"),
      ConnectorManager.createConnector("node_split", "bottom", "badge_train", "top"),
      ConnectorManager.createConnector("node_split", "bottom", "badge_video", "top"),
      ConnectorManager.createConnector("badge_train", "left", "node_ensemble", "top"),
      ConnectorManager.createConnector("node_ensemble", "right", "node_trained", "bottom"),
      ConnectorManager.createConnector("node_trained", "bottom", "node_eval", "top")
    ]
  },

  // Template 2: NLP & Sentiment Classification Pipeline (from user's Image 2)
  nlpSentiment: {
    name: "NLP Sentiment Classification Pipeline (Fig. 1)",
    description: "Collecting Reviews ➔ Tokenization & Cleaning ➔ CBOW/Skip-Gram Embedding ➔ Splitting ➔ Classifiers ➔ Prediction",
    getNodes: () => [
      {
        id: "node_corpus",
        type: CONFIG.nodeTypes.DATASET_INPUT,
        x: 60,
        y: 100,
        width: 180,
        height: 140,
        title: "Collecting Reviews",
        subtitle: "Raw Text Corpus",
        borderColor: "#10b981",
        data: {
          inputType: "text",
          datasetCount: "15,000 book reviews",
          icon: "database"
        }
      },
      {
        id: "node_clean_preproc",
        type: CONFIG.nodeTypes.PREPROCESSING,
        x: 320,
        y: 100,
        width: 180,
        height: 140,
        title: "Text Pre-Processing",
        subtitle: "Tokenization & Normalization",
        borderColor: "#10b981",
        data: {
          steps: ["Lowercase mapping", "Emoji stripping", "Porter stemmer", "Subword tokenization"],
          icon: "code"
        }
      },
      {
        id: "callout_cleaning",
        type: CONFIG.nodeTypes.CALLOUT_NOTE,
        x: 540,
        y: 80,
        width: 190,
        height: 160,
        title: "Filter Rules Callout",
        borderColor: "#10b981",
        data: {
          lines: [
            "Removing:",
            "• punctuations, symbols",
            "• numbers, stop words",
            "• emojis & URLs",
            "Applying:",
            "• stemming & lemmatization"
          ]
        }
      },
      {
        id: "node_clean_data",
        type: CONFIG.nodeTypes.GENERIC_CARD,
        x: 320,
        y: 290,
        width: 180,
        height: 110,
        title: "Clean Data",
        subtitle: "Tokenized Stream",
        borderColor: "#10b981",
        data: {
          description: "Filtered vocabulary index of 8,500 distinct tokens.",
          icon: "file-text"
        }
      },
      {
        id: "node_nlp_features",
        type: CONFIG.nodeTypes.FEATURE_EXTRACTION,
        x: 60,
        y: 390,
        width: 220,
        height: 180,
        title: "Feature Extraction",
        subtitle: "Neural Embeddings",
        borderColor: "#10b981",
        data: {
          method: "Word2Vec (CBOW & Skip-gram)",
          details: ["CBOW: Context ➔ Target", "Skip-gram: Target ➔ Context", "Dim: 300 vector embeddings"]
        }
      },
      {
        id: "node_nlp_split",
        type: CONFIG.nodeTypes.DATA_SPLIT,
        x: 340,
        y: 450,
        width: 160,
        height: 140,
        title: "Splitting Data",
        subtitle: "Train/Test Sets",
        borderColor: "#10b981",
        data: {
          ratio: "75 / 25 Split",
          pie: [{ label: "Train", pct: 75, color: "#ef4444" }, { label: "Test", pct: 25, color: "#3b82f6" }]
        }
      },
      {
        id: "badge_nlp_train",
        type: CONFIG.nodeTypes.SPLIT_BADGE,
        x: 540,
        y: 430,
        width: 130,
        height: 40,
        title: "Training Data",
        borderColor: "#ef4444",
        data: { variant: "red" }
      },
      {
        id: "badge_nlp_test",
        type: CONFIG.nodeTypes.SPLIT_BADGE,
        x: 540,
        y: 490,
        width: 130,
        height: 40,
        title: "Test Data",
        borderColor: "#ef4444",
        data: { variant: "red" }
      },
      {
        id: "node_classifiers",
        type: CONFIG.nodeTypes.MODEL_ENSEMBLE,
        x: 720,
        y: 440,
        width: 280,
        height: 130,
        title: "Classifiers Suite",
        subtitle: "Benchmarking",
        borderColor: "#10b981",
        data: {
          algorithms: [
            { name: "SVM", color: "#f59e0b" },
            { name: "Random Forest", color: "#10b981" },
            { name: "XGBoost", color: "#3b82f6" },
            { name: "KNN", color: "#8b5cf6" },
            { name: "Hybrid", color: "#ec4899" }
          ]
        }
      },
      {
        id: "node_pred",
        type: CONFIG.nodeTypes.PREDICTION,
        x: 820,
        y: 260,
        width: 180,
        height: 130,
        title: "Prediction",
        subtitle: "Sentiment Class",
        borderColor: "#10b981",
        data: {
          outputs: [
            { label: "Positive Sentiment", color: "#10b981" },
            { label: "Negative Sentiment", color: "#ef4444" }
          ]
        }
      }
    ],
    getConnectors: () => [
      ConnectorManager.createConnector("node_corpus", "right", "node_clean_preproc", "left", "Raw Reviews"),
      ConnectorManager.createConnector("node_clean_preproc", "right", "callout_cleaning", "left"),
      ConnectorManager.createConnector("node_clean_preproc", "bottom", "node_clean_data", "top", "Clean Data"),
      ConnectorManager.createConnector("node_clean_data", "left", "node_nlp_features", "top"),
      ConnectorManager.createConnector("node_nlp_features", "right", "node_nlp_split", "left"),
      ConnectorManager.createConnector("node_nlp_split", "right", "badge_nlp_train", "left"),
      ConnectorManager.createConnector("node_nlp_split", "right", "badge_nlp_test", "left"),
      ConnectorManager.createConnector("badge_nlp_train", "right", "node_classifiers", "left"),
      ConnectorManager.createConnector("node_classifiers", "top", "node_pred", "bottom", "Inference")
    ]
  },

  // Template 3: Multimodal Image Captioning System (from user's Image 1)
  imageCaptioning: {
    name: "System Architecture for Generating Caption (Fig. 2)",
    description: "Input Image ➔ Tokenization & Augmentation ➔ Setting Extractor ➔ Data Split ➔ LSTM ➔ Generating Word ➔ Caption Output",
    getNodes: () => [
      {
        id: "node_img_in",
        type: CONFIG.nodeTypes.DATASET_INPUT,
        x: 60,
        y: 120,
        width: 160,
        height: 150,
        title: "Input Image",
        subtitle: "Visual Modality",
        borderColor: "#f59e0b",
        data: { inputType: "image", icon: "image" }
      },
      {
        id: "node_caption_prep",
        type: CONFIG.nodeTypes.PREPROCESSING,
        x: 270,
        y: 120,
        width: 170,
        height: 150,
        title: "Pre-Processing",
        subtitle: "Mapping & Augmentation",
        borderColor: "#f59e0b",
        data: { steps: ["Set Mapping", "Tokenization", "Data Augmentation"] }
      },
      {
        id: "node_extractor",
        type: CONFIG.nodeTypes.FEATURE_EXTRACTION,
        x: 480,
        y: 120,
        width: 160,
        height: 150,
        title: "Feature Extraction",
        subtitle: "Setting Extractor",
        borderColor: "#f59e0b",
        data: { method: "Setting Extractor", details: ["Visual Dense Features", "Spatial Grid Res"] }
      },
      {
        id: "node_split_cap",
        type: CONFIG.nodeTypes.DATA_SPLIT,
        x: 680,
        y: 120,
        width: 150,
        height: 150,
        title: "Data Split",
        subtitle: "Partitioning",
        borderColor: "#f59e0b",
        data: { ratio: "80 / 20", pie: [{ label: "Train", pct: 80, color: "#f59e0b" }, { label: "Test", pct: 20, color: "#3b82f6" }] }
      },
      {
        id: "badge_cap_train",
        type: CONFIG.nodeTypes.SPLIT_BADGE,
        x: 750,
        y: 330,
        width: 130,
        height: 40,
        title: "Training Data",
        borderColor: "#ef4444",
        data: { variant: "red" }
      },
      {
        id: "badge_cap_test",
        type: CONFIG.nodeTypes.SPLIT_BADGE,
        x: 750,
        y: 380,
        width: 130,
        height: 40,
        title: "Test Data",
        borderColor: "#ef4444",
        data: { variant: "red" }
      },
      {
        id: "node_lstm",
        type: CONFIG.nodeTypes.GENERIC_CARD,
        x: 520,
        y: 320,
        width: 180,
        height: 140,
        title: "LSTM Decoder",
        subtitle: "Sequence Modeling",
        borderColor: "#dc2626",
        data: { description: "Long / Short Term Memory recurrent language decoder with attention alignment.", icon: "layers" }
      },
      {
        id: "node_gen_word",
        type: CONFIG.nodeTypes.GENERIC_CARD,
        x: 310,
        y: 320,
        width: 160,
        height: 140,
        title: "Generating Word",
        subtitle: "Token Probability",
        borderColor: "#10b981",
        data: { description: "Beam search vocabulary prediction step-by-step.", icon: "file-text" }
      },
      {
        id: "node_caption_out",
        type: CONFIG.nodeTypes.GENERIC_CARD,
        x: 90,
        y: 320,
        width: 170,
        height: 140,
        title: "Generating Caption",
        subtitle: "Final Description (CC)",
        borderColor: "#10b981",
        data: { description: "\"A golden dog catching a frisbee in mid-air on grass.\"", icon: "message-square" }
      }
    ],
    getConnectors: () => [
      ConnectorManager.createConnector("node_img_in", "right", "node_caption_prep", "left"),
      ConnectorManager.createConnector("node_caption_prep", "right", "node_extractor", "left"),
      ConnectorManager.createConnector("node_extractor", "right", "node_split_cap", "left"),
      ConnectorManager.createConnector("node_split_cap", "bottom", "badge_cap_train", "top"),
      ConnectorManager.createConnector("node_split_cap", "bottom", "badge_cap_test", "top"),
      ConnectorManager.createConnector("badge_cap_train", "left", "node_lstm", "right"),
      ConnectorManager.createConnector("node_lstm", "left", "node_gen_word", "right"),
      ConnectorManager.createConnector("node_gen_word", "left", "node_caption_out", "right")
    ]
  },

  // Template 4: Sovereign Edge Voice AI & Live Dictation (OpenWrite Architecture)
  sovereignVoiceAI: {
    name: "Sovereign Edge Voice AI & Live Dictation Engine",
    description: "16kHz Ingestion ➔ Adaptive VAD Phrase Segmenter ➔ Quantized Faster-Whisper INT8 ➔ Zero-Focus SendInput ➔ Active Window",
    getNodes: () => [
      {
        id: "node_audio_in",
        type: CONFIG.nodeTypes.DATASET_INPUT,
        x: 60,
        y: 180,
        width: 170,
        height: 160,
        title: "Microphone Stream",
        subtitle: "Native 16kHz PCM Audio",
        borderColor: "#3b82f6",
        data: { inputType: "audio", datasetCount: "Auto-detected Mic Array", icon: "mic" }
      },
      {
        id: "node_vad",
        type: CONFIG.nodeTypes.PREPROCESSING,
        x: 280,
        y: 180,
        width: 180,
        height: 160,
        title: "Adaptive Phrase VAD",
        subtitle: "Dynamic Noise Floor",
        borderColor: "#10b981",
        data: { steps: ["Dynamic RMS Tracking", "Conversational Pause Detection", "Zero Word-Slicing Buffer"] }
      },
      {
        id: "node_whisper",
        type: CONFIG.nodeTypes.FEATURE_EXTRACTION,
        x: 510,
        y: 180,
        width: 200,
        height: 160,
        title: "Faster-Whisper INT8",
        subtitle: "Quantized Local Inference",
        borderColor: "#8b5cf6",
        data: { method: "CTranslate2 INT8 Execution", details: ["Tiny (~30ms) to Distil-Large", "Vocabulary Prompt Priming", "Zero Cloud Latency"] }
      },
      {
        id: "node_inject",
        type: CONFIG.nodeTypes.TRAINED_MODEL,
        x: 760,
        y: 180,
        width: 190,
        height: 160,
        title: "Win32 SendInput",
        subtitle: "Direct Cursor Injection",
        borderColor: "#ef4444",
        data: { modelName: "Unicode Keystrokes (40-byte)", accuracySummary: "WS_EX_NOACTIVATE • 0ms Focus Steal", icon: "terminal" }
      },
      {
        id: "node_target_app",
        type: CONFIG.nodeTypes.EVALUATION,
        x: 1000,
        y: 180,
        width: 180,
        height: 160,
        title: "Target Application",
        subtitle: "Notepad / Word / IDE",
        borderColor: "#10b981",
        data: { metrics: [{ name: "Target Window", value: "Notepad.exe" }, { name: "Latency", value: "65ms Total" }, { name: "Accuracy", value: "99.1%" }] }
      }
    ],
    getConnectors: () => [
      ConnectorManager.createConnector("node_audio_in", "right", "node_vad", "left", "16kHz Mono"),
      ConnectorManager.createConnector("node_vad", "right", "node_whisper", "left", "Speech Phrase"),
      ConnectorManager.createConnector("node_whisper", "right", "node_inject", "left", "Clean Text"),
      ConnectorManager.createConnector("node_inject", "right", "node_target_app", "left", "Live Type")
    ]
  }
};
