import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache", "gen2");

interface CacheEntry {
  hash: string;
  timestamp: number;
  response: {
    s3Url?: string;
    patent?: {
      patent_id?: string;
      title?: string;
      abstract?: string;
    };
  };
}

interface GalleryImage {
  s3Url: string;
  timestamp: number;
  patentId?: string;
  title?: string;
  abstract?: string;
}

export async function GET() {
  try {
    // Ensure cache directory exists
    try {
      await fs.access(CACHE_DIR);
    } catch {
      return NextResponse.json({ images: [] });
    }

    const files = await fs.readdir(CACHE_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const images: GalleryImage[] = [];

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(CACHE_DIR, file);
        const data = await fs.readFile(filePath, "utf-8");
        const entry: CacheEntry = JSON.parse(data);

        // Extract S3 URL if it exists
        if (entry.response?.s3Url) {
          images.push({
            s3Url: entry.response.s3Url,
            timestamp: entry.timestamp,
            patentId: entry.response.patent?.patent_id,
            title: entry.response.patent?.title,
            abstract: entry.response.patent?.abstract,
          });
        }
      } catch (err) {
        // Skip invalid cache files
        console.error(`Error reading cache file ${file}:`, err);
      }
    }

    // Sort by timestamp (newest first)
    images.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({ images });
  } catch (err) {
    console.error("Gallery API error:", err);
    return NextResponse.json(
      { error: "Failed to load gallery images" },
      { status: 500 }
    );
  }
}
