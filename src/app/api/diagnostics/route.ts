import { NextResponse } from "next/server";

export async function GET() {
  console.log("SERVER RUNTIME ACTIVE");
  return NextResponse.json({
    ok: true,
    message: "Node route handler executed",
    nextRuntime: process.env.NEXT_RUNTIME ?? null,
  });
}
