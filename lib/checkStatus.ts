export async function checkDomainStatus(domain: string) {
  try {
    const res = await fetch(`https://${domain}`, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 300 },
    })

    return {
      status: res.ok ? "online" : "offline",
      code: res.status,
    } as const
  } catch {
    return {
      status: "offline",
      code: 0,
    } as const
  }
}
