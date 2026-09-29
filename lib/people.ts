import type { ComponentProps } from "react";
import type { Portrait } from "@/components/site/portrait";

type PortraitProps = Omit<ComponentProps<typeof Portrait>, "size">;

/** Photo and crop for people quoted around the site. Add a `size` where used. */
export const PEOPLE = {
  ceo: {
    src: "/assets/people/ceo.jpg",
    zoom: 1.7,
    focus: "49% 50%",
    origin: "49% 35%",
  },
  headOfCoaching: {
    src: "/assets/people/head-of-coaching.jpg",
    zoom: 1.5,
    focus: "30% 50%",
    origin: "38% 50%",
  },
} satisfies Record<string, PortraitProps>;
