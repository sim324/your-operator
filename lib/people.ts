import type { ComponentProps } from "react";
import type { Portrait } from "@/components/site/portrait";

type PortraitProps = Omit<ComponentProps<typeof Portrait>, "size">;

/** Photo and crop for people quoted around the site. Add a `size` where used. */
export const PEOPLE = {
  ceo: {
    src: "/assets/people/ceo.jpg",
  },
  headOfCoaching: {
    src: "/assets/people/head-of-coaching.jpg",
  },
} satisfies Record<string, PortraitProps>;
