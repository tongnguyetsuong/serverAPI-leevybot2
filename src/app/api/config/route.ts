import { NextRequest, NextResponse } from "next/server";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 }); // TTL 1 hour (3600 seconds)
type Config = {
  serverConnect: number;
  totalMessage: number;
  totalCommand: number;
};

const defaultConfig: Config = {
  serverConnect: 3,
  totalMessage: 40000,
  totalCommand: 50,
};

const CACHE_KEY = "configs";

// Middleware để validate dữ liệu một phần
const validatePartialConfig = (data: any): Partial<Config> | null => {
  const result: Partial<Config> = {};
  if (typeof data === "object" && data !== null) {
    if ("serverConnect" in data && typeof data.serverConnect === "number") {
      result.serverConnect = data.serverConnect;
    }
    if ("totalMessage" in data && typeof data.totalMessage === "number") {
      result.totalMessage = data.totalMessage;
    }
    if ("totalCommand" in data && typeof data.totalCommand === "number") {
      result.totalCommand = data.totalCommand;
    }
    return Object.keys(result).length > 0 ? result : null;
  }
  return null;
};

export async function GET(): Promise<NextResponse> {
  try {
    const cachedData = cache.get<Config>(CACHE_KEY) ?? defaultConfig;
    return NextResponse.json(cachedData, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = validatePartialConfig(body);

    if (!validatedData) {
      return NextResponse.json(
        { error: "Invalid or empty config data" },
        { status: 400 }
      );
    }

    let cachedData = cache.get<Config>(CACHE_KEY) ?? { ...defaultConfig };
    cachedData = { ...cachedData, ...validatedData }; // Gộp dữ liệu mới với dữ liệu cũ
    cache.set(CACHE_KEY, cachedData);

    return NextResponse.json(cachedData, { status: 201 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
