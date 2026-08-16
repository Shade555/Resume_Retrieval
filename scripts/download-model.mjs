import { env, pipeline } from "@huggingface/transformers";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelDir = path.join(__dirname, "..", "models");

if (!fs.existsSync(modelDir)) {
  fs.mkdirSync(modelDir, { recursive: true });
}

// Configure to download to our local models directory
env.cacheDir = modelDir;
env.allowLocalModels = false; // Disable local models during download so it forces fetch from HF
env.allowRemoteModels = true;

async function download() {
  console.log("Downloading Xenova/all-MiniLM-L6-v2 to local directory...");
  try {
    // This will fetch and cache the model in the cacheDir
    await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("✅ Model successfully downloaded and cached to", modelDir);
  } catch (error) {
    console.error("❌ Failed to download model:", error);
    process.exit(1);
  }
}

download();
