import { env, pipeline } from "@huggingface/transformers";
import path from "path";

// Tell transformers.js to look for models in our local bundled directory
env.localModelPath = path.join(process.cwd(), "models");
env.allowRemoteModels = false; // Never download on the fly (prevents Vercel 10s timeout)
env.allowLocalModels = true;

const embeddingModel = "Xenova/all-MiniLM-L6-v2";

type FeatureExtractionPipeline = Awaited<ReturnType<typeof pipeline>>;

type GlobalWithEmbeddingPipeline = typeof globalThis & {
  embeddingPipeline?: Promise<FeatureExtractionPipeline>;
};

const globalForEmbedding = globalThis as GlobalWithEmbeddingPipeline;

export async function getEmbeddingPipeline() {
  if (!globalForEmbedding.embeddingPipeline) {
    globalForEmbedding.embeddingPipeline = pipeline(
      "feature-extraction",
      embeddingModel,
    ) as Promise<FeatureExtractionPipeline>;
  }

  return globalForEmbedding.embeddingPipeline;
}

export async function generateEmbedding(text: string): Promise<number[]> {
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
}
