import { NextRequest, NextResponse } from "next/server"

import { checkDomainStatus } from "@/lib/checkStatus"

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain")?.trim()

  if (!domain) {
    return NextResponse.json(
      { error: "Missing 'domain' query parameter" },
      { status: 400 },
    )
  }

  const sanitized = domain.replace(/^https?:\/\//i, "").split("/")[0]

  if (!sanitized) {
    return NextResponse.json(
      { error: "Invalid domain supplied" },
      { status: 400 },
    )
  }

  const result = await checkDomainStatus(sanitized)

  return NextResponse.json({ domain: sanitized, ...result })
}
