import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ReviewThemeCategory } from "@/lib/supabase/models";

// PostgREST caps a response at 1,000 rows; tags can exceed that (a review
// can carry several themes), so page through them.
const PAGE_SIZE = 1000;
const EXAMPLES_PER_THEME = 3;

export interface ThemeExample {
  id: string;
  body: string;
  rating: number | null;
  publishedAt: string | null;
}

export interface ThemeSummary {
  id: string;
  name: string;
  description: string;
  category: ReviewThemeCategory;
  mentions: number;
  // Share of written reviews that mention this theme, 0–1
  share: number;
  averageRating: number | null;
  examples: ThemeExample[];
}

export interface ReviewThemes {
  writtenReviews: number;
  themes: ThemeSummary[];
}

export async function getReviewThemes(
  companyId: string,
): Promise<ReviewThemes> {
  const supabase = getSupabaseServerClient();

  const [{ data: themes, error: themesError }, { data: reviews, error: reviewsError }] =
    await Promise.all([
      supabase
        .from("review_themes")
        .select("id, name, description, category")
        .eq("company_id", companyId)
        .order("position"),
      supabase
        .from("lead_reviews")
        .select("id, body, rating, published_at")
        .eq("company_id", companyId)
        .not("body", "is", null),
    ]);

  if (themesError) throw new Error(`Failed to load themes: ${themesError.message}`);
  if (reviewsError) throw new Error(`Failed to load reviews: ${reviewsError.message}`);
  if (!themes?.length) return { writtenReviews: reviews?.length ?? 0, themes: [] };

  const tags: { review_id: string; theme_id: string }[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("review_theme_tags")
      .select("review_id, theme_id")
      .in(
        "theme_id",
        themes.map((theme) => theme.id),
      )
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`Failed to load theme tags: ${error.message}`);
    tags.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) break;
  }

  const reviewById = new Map((reviews ?? []).map((review) => [review.id, review]));
  const writtenReviews = reviewById.size;

  const summaries = themes.map((theme): ThemeSummary => {
    const tagged = tags
      .filter((tag) => tag.theme_id === theme.id)
      .map((tag) => reviewById.get(tag.review_id))
      .filter((review) => review !== undefined);
    const ratings = tagged
      .map((review) => review.rating)
      .filter((rating): rating is number => rating !== null);

    return {
      id: theme.id,
      name: theme.name,
      description: theme.description,
      category: theme.category as ReviewThemeCategory,
      mentions: tagged.length,
      share: writtenReviews ? tagged.length / writtenReviews : 0,
      averageRating: ratings.length
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : null,
      examples: tagged
        .sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""))
        .slice(0, EXAMPLES_PER_THEME)
        .map((review) => ({
          id: review.id,
          body: review.body ?? "",
          rating: review.rating,
          publishedAt: review.published_at,
        })),
    };
  });

  return {
    writtenReviews,
    themes: summaries.sort((a, b) => b.mentions - a.mentions),
  };
}
