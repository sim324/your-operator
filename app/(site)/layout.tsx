import WebFooter from "@/components/blocks/web-footer";
import WebHeader from "@/components/blocks/web-header";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebHeader />
      <main>{children}</main>
      <WebFooter />
    </>
  );
}
