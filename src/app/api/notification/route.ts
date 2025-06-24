import { NextRequest, NextResponse } from "next/server";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 0 }); // Cache TTL set to 1 hour
const MAX_LOG = 100;
interface noti {
  type: "info" | "success" | "warning" | "error";
  message: string;
  role: "user" | "bot";
  createdAt: string;
}
// GET - Lấy danh sách thông báo
export async function GET() {
  try {
    const dataCache: noti[] = cache.get("notifications") || [];
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
    const data: noti = {
      ...(await request.json()),
      createdAt: new Date().toISOString(),
    };

    const dataCache: noti[] = cache.get("notifications") || [];
    if (dataCache.length == MAX_LOG) {
      dataCache.shift();
    }
    dataCache.push(data);
    cache.set("notifications", dataCache);
    return NextResponse.json(data, {
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
