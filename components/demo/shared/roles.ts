export type DemoRole = "manager" | "rep" | "prospect";

export interface DemoRoleConfig {
  slug: DemoRole;
  label: string;
  href: `/demo/${DemoRole}`;
}

export const DEMO_ROLES: DemoRoleConfig[] = [
  { slug: "manager", label: "Manager", href: "/demo/manager" },
  { slug: "rep", label: "Sales Rep", href: "/demo/rep" },
  { slug: "prospect", label: "Prospect", href: "/demo/prospect" },
];

export const DEFAULT_DEMO_ROLE: DemoRole = "rep";
