import AppShell from "@/components/demo/shared/app-shell";
import EmailGateDialog from "@/components/demo/shared/email-gate-dialog";
import RoleSwitcherBanner from "@/components/demo/shared/role-switcher-banner";

export default function DemoLayout({ children }: LayoutProps<"/demo">) {
  return (
    <div className="flex h-svh flex-col">
      <EmailGateDialog />
      <RoleSwitcherBanner />
      <AppShell>{children}</AppShell>
    </div>
  );
}
