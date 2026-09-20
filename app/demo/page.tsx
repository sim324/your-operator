import { redirect } from "next/navigation";

import { DEFAULT_DEMO_ROLE } from "@/components/demo/shared/roles";

export default function DemoPage() {
  redirect(`/demo/${DEFAULT_DEMO_ROLE}`);
}
