import { env, pipeline } from "@huggingface/transformers";

env.allowRemoteModels = true;
env.allowLocalModels = true;

// Vercel serverless functions only allow writing to /tmp
// Without this, transformers.js will crash with a read-only file system error
if (process.env.VERCEL) {
  env.cacheDir = "/tmp";
}

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
