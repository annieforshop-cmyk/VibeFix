import { NextRequest, NextResponse } from "next/server";
import { listProblems, SortMode } from "@/lib/problems";
import { ALL_CATEGORIES, Category, Difficulty } from "@/lib/data";

const DIFFICULTIES: Difficulty[] = ["周末项目", "1-3个月", "需要团队"];
const SORTS: SortMode[] = ["hot", "new", "pain"];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const categoryParam = params.get("category");
  const category = ALL_CATEGORIES.includes(categoryParam as Category) ? (categoryParam as Category) : null;

  const difficultyParam = params.get("difficulty");
  const difficulty = DIFFICULTIES.includes(difficultyParam as Difficulty) ? (difficultyParam as Difficulty) : null;

  const sortParam = params.get("sort");
  const sort = SORTS.includes(sortParam as SortMode) ? (sortParam as SortMode) : "hot";

  const painScoreMin = params.get("pain_score_min") ? Number(params.get("pain_score_min")) : undefined;
  const page = params.get("page") ? Math.max(1, Number(params.get("page"))) : 1;
  const limit = params.get("limit") ? Math.min(50, Math.max(1, Number(params.get("limit")))) : 20;

  try {
    const { items, total } = await listProblems({ category, difficulty, painScoreMin, sort, page, limit });
    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    console.error("GET /api/problems failed", error);
    return NextResponse.json({ error: "Failed to load problems" }, { status: 500 });
  }
}
