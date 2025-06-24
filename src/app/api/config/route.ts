import { NextRequest, NextResponse } from "next/server";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 0 }); // Cache TTL set to 1 hour
type config = {
  serverConnect: number;
  totalMessage: number;
  totalCommand: number;
};
const dataDefault: config = {
  serverConnect: 3,
  totalMessage: 40000,
  totalCommand: 50,
};
const keyCache = "configs";

export async function GET() {
  try {
    const dataCache: config = cache.get(keyCache) || dataDefault;

    return NextResponse.json(dataCache, {
      status: 200,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: config = await request.json();
    let dataCache = cache.get(keyCache);
    if (dataCache) {
      dataCache = { ...dataCache, ...data };
      cache.set(keyCache, dataCache);
    } else {
      cache.set(keyCache, dataDefault);
    }

    return NextResponse.json(dataCache, {
      status: 201,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
