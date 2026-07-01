import { NextResponse } from "next/server";
import { getProblemBySlug } from "@/lib/problems";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const problem = await getProblemBySlug(id);
    if (!problem) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item: problem });
  } catch (error) {
    console.error(`GET /api/problems/${id} failed`, error);
    return NextResponse.json({ error: "Failed to load problem" }, { status: 500 });
  }
}
