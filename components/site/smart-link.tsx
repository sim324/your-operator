import Link from "next/link";

/** Next `Link` for on-site paths, a plain anchor for everything else. */
export function SmartLink({
  href,
  ...props
}: Omit<React.ComponentProps<"a">, "href"> & { href: string }) {
  return href.startsWith("/") ? (
    <Link href={href} {...props} />
  ) : (
    <a href={href} {...props} />
  );
}
