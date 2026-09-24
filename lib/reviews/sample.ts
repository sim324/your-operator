import type { PlaceReviews } from "@/lib/google-places/client";

// Shown for the "use sample data" company (Acme Robotics), which has no
// website and so no Google listing to look up. Shaped like a Places details
// response so it renders through the same component.
export const SAMPLE_PLACE_REVIEWS: PlaceReviews = {
  id: "sample",
  displayName: { text: "Acme Robotics" },
  rating: 4.6,
  userRatingCount: 128,
  reviews: [
    {
      name: "sample-1",
      rating: 5,
      relativePublishTimeDescription: "2 weeks ago",
      text: {
        text: "Our forklift fleet went live in three weeks. The onboarding team stayed on site until every operator was comfortable.",
      },
      authorAttribution: { displayName: "Dana R." },
    },
    {
      name: "sample-2",
      rating: 5,
      relativePublishTimeDescription: "a month ago",
      text: {
        text: "Fleet dashboard is genuinely useful. We cut pick times noticeably in the first quarter.",
      },
      authorAttribution: { displayName: "Marcus T." },
    },
    {
      name: "sample-3",
      rating: 4,
      relativePublishTimeDescription: "2 months ago",
      text: {
        text: "Great hardware. Support response times could be faster on weekends, but they always follow through.",
      },
      authorAttribution: { displayName: "Priya S." },
    },
    {
      name: "sample-4",
      rating: 3,
      relativePublishTimeDescription: "3 months ago",
      text: {
        text: "Solid product, but pricing for the software add-ons wasn't clear until after the pilot.",
      },
      authorAttribution: { displayName: "Jordan K." },
    },
  ],
};
