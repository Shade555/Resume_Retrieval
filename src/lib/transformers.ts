import { env, pipeline } from "@huggingface/transformers";
import path from "path";

env.allowRemoteModels = true;
env.allowLocalModels = true;

const embeddingModel = "Xenova/all-MiniLM-L6-v2";

type FeatureExtractionPipeline = Awaited<ReturnType<typeof pipeline>>;

type GlobalWithEmbeddingPipeline = typeof globalThis & {
  embeddingPipeline?: Promise<FeatureExtractionPipeline>;
};

const globalForEmbedding = globalThis as GlobalWithEmbeddingPipeline;
// FORCE RESET: The user's current dev server has a corrupted ONNX session in memory.
// This will force it to reload the model from disk on the very next request.
globalForEmbedding.embeddingPipeline = undefined;

export async function getEmbeddingPipeline() {
  if (!globalForEmbedding.embeddingPipeline) {
    globalForEmbedding.embeddingPipeline = pipeline(
      "feature-extraction",
      embeddingModel,
    ) as Promise<FeatureExtractionPipeline>;
  }

  return globalForEmbedding.embeddingPipeline;
}

// Mutex queue to prevent concurrent WebAssembly execution corruption
let isExtracting = false;
const extractionQueue: (() => void)[] = [];

async function acquireLock(): Promise<void> {
  if (!isExtracting) {
    isExtracting = true;
    return;
  }
  return new Promise((resolve) => {
    extractionQueue.push(resolve);
  });
}

function releaseLock() {
  if (extractionQueue.length > 0) {
    const next = extractionQueue.shift();
    if (next) next();
  } else {
    isExtracting = false;
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  await acquireLock();
  try {
    const extractor = await getEmbeddingPipeline();
    const output = await (extractor as any)(text, {
      pooling: "mean",
      normalize: true,
    });
    const embedding = Array.from(output.data as Float32Array);

    if (embedding.length !== 384) {
      throw new Error(`Expected a 384-dimensional embedding, received ${embedding.length}.`);
    }

    return embedding;
  } finally {
    releaseLock();
  }
}
