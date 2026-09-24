// Lives outside the "use server" actions files, which can only export async
// functions, so both intake and the leader page's website form can share it.

// "https://www.acme.com/pricing" -> "acme.com"
export function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

// Loose sanity check on a normalized domain: labels of letters, digits and
// hyphens, at least one dot, a 2+ letter TLD. Catches "acme" and typos with
// spaces, not a full RFC validator.
export function isPlausibleDomain(domain: string): boolean {
  return /^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(domain);
}
