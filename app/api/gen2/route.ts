import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  createInputHash,
  getCacheEntry,
  setCacheEntry,
} from "@/lib/cache";
import { readFileSync } from "node:fs";
import path from "node:path";

// Configure fal.ai
fal.config({
  credentials: process.env.FAL_KEY,
});

// Configure S3
const awsRegion = process.env.AWS_REGION || "us-west-1";
const bucketName = process.env.AWS_S3_BUCKET_NAME;

const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const fluxPromptTemplate = (() => {
  const templatePath = path.resolve(
    process.cwd(),
    "prompts/generate-designs.md"
  );
  try {
    return readFileSync(templatePath, "utf8");
  } catch (error) {
    console.error(
      `Failed to load flux prompt template at ${templatePath}`,
      error
    );
    return "";
  }
})();

type FluxPromptMeta = {
  patent_url?: string;
  patent_id?: string;
  title?: string;
  abstract?: string;
  additionalUserRequest?: string;
};

function buildFluxPrompt(template: string, meta: FluxPromptMeta) {
  if (!template) {
    throw new Error("Flux prompt template is not available.");
  }

  const {
    patent_url,
    patent_id,
    title,
    abstract,
    additionalUserRequest,
  } = meta;

  const sanitizedAbstract = abstract?.trim() || "No abstract provided.";
  const sanitizedAdditional = additionalUserRequest?.trim();

  let prompt = template
    .replace(
      "{image}",
      "Use the uploaded patent drawing as the visual reference."
    )
    .replace("{patent_abstract}", sanitizedAbstract);

  const details = [
    title && `Title: ${title}`,
    patent_id && `Patent ID: ${patent_id}`,
    patent_url && `Patent URL: ${patent_url}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (details) {
    prompt += `\n\nPATENT DETAILS:\n${details}`;
  }

  if (sanitizedAdditional) {
    prompt += `\n\nADDITIONAL USER REQUEST:\n${sanitizedAdditional}`;
  }

  return prompt.trim();
}

export async function POST(req: NextRequest) {
  try {
    // We accept multipart/form-data:  meta (JSON) + image file
    const form = await req.formData();

    const metaRaw = form.get("meta");
    const image = form.get("image");

    if (!metaRaw || typeof metaRaw !== "string") {
      return NextResponse.json(
        { error: "Missing required 'meta' JSON field." },
        { status: 400 }
      );
    }

    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { error: "Missing required 'image' file." },
        { status: 400 }
      );
    }

    const meta = JSON.parse(metaRaw);
    const { patent_url, patent_id, title, abstract, additionalUserRequest } = meta;

    ////////////////////////////////////////////////////////////////////////////
    // CACHE: Check if we have a cached response for this input
    ////////////////////////////////////////////////////////////////////////////
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const inputHash = createInputHash(imageBuffer, meta);

    const cachedEntry = await getCacheEntry(inputHash);
    if (cachedEntry) {
      console.log(`[CACHE HIT] Returning cached response for hash: ${inputHash}`);
      return NextResponse.json(
        {
          ...cachedEntry.response,
          cached: true,
          cacheTimestamp: cachedEntry.timestamp,
        },
        {
          headers: {
            "X-Cache": "HIT",
            "X-Cache-Hash": inputHash,
          },
        }
      );
    }

    console.log(`[CACHE MISS] Processing new request for hash: ${inputHash}`);

    ////////////////////////////////////////////////////////////////////////////
    // 1) Build Flux prompt
    ////////////////////////////////////////////////////////////////////////////
    const fluxPrompt = buildFluxPrompt(fluxPromptTemplate, {
      patent_url,
      patent_id,
      title,
      abstract,
      additionalUserRequest,
    });

    ////////////////////////////////////////////////////////////////////////////
    // 2) Send to Fal "edit-image" model
    ////////////////////////////////////////////////////////////////////////////

    // Create a new File from the buffer for Fal
    const imageFile = new File([imageBuffer], image.name, { type: image.type });

    // Fal client will auto-upload local File objects
    const falResult = await fal.subscribe("fal-ai/alpha-image-232/edit-image", {
      input: {
        prompt: fluxPrompt,
        image_size: "auto",
        output_format: "png",
        image_urls: [imageFile], // <— just send the File object
      },
      logs: false,
    });

    const outputUrl = falResult.data?.images?.[0]?.url;
    if (!outputUrl) {
      throw new Error("Fal returned no usable image URL");
    }

    ////////////////////////////////////////////////////////////////////////////
    // 3) Download the image & upload to S3
    ////////////////////////////////////////////////////////////////////////////
    const imageResp = await fetch(outputUrl);
    if (!imageResp.ok) throw new Error("Failed to download Fal image");

    const arrayBuf = await imageResp.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    const s3Key = `patent-renders/${patent_id}-${Date.now()}.png`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: buffer,
        ContentType: "image/png",
      })
    );

    const s3Url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${s3Key}`;

    ////////////////////////////////////////////////////////////////////////////
    // 4) Build and cache response
    ////////////////////////////////////////////////////////////////////////////
    const responseData = {
      success: true,
      patent: meta,
      generatedPrompt: fluxPrompt,
      falOutput: falResult.data,
      falRequestId: falResult.requestId,
      s3Url,
    };

    // Cache the successful response for future requests
    await setCacheEntry(inputHash, imageBuffer, meta, responseData);
    console.log(`[CACHE WRITE] Cached response for hash: ${inputHash}`);

    ////////////////////////////////////////////////////////////////////////////
    // 5) Return final response
    ////////////////////////////////////////////////////////////////////////////
    return NextResponse.json(
      {
        ...responseData,
        cached: false,
      },
      {
        headers: {
          "X-Cache": "MISS",
          "X-Cache-Hash": inputHash,
        },
      }
    );
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
