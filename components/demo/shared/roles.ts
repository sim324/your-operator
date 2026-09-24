export type DemoRole = "leader" | "rep" | "prospect";

export interface DemoRoleConfig {
  slug: DemoRole;
  label: string;
  href: `/demo/${DemoRole}`;
}

export const DEMO_ROLES: DemoRoleConfig[] = [
  { slug: "leader", label: "Leader", href: "/demo/leader" },
  { slug: "rep", label: "Sales Rep", href: "/demo/rep" },
  { slug: "prospect", label: "Prospect", href: "/demo/prospect" },
];

export const DEFAULT_DEMO_ROLE: DemoRole = "prospect";
