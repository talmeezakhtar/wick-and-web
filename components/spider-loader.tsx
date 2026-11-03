"use client"

import dynamic from "next/dynamic"
import type { SilkSpiderCursorProps } from "@/components/ui/silk-spider-cursor"

// Loads three.js + the spider model only on the client, after the main page
// has rendered — it's a decorative cursor effect, not something first paint
// or SEO needs to wait on. next/dynamic's ssr:false requires a Client
// Component wrapper, which is all this file is.
const SilkSpiderCursor = dynamic(() => import("@/components/ui/silk-spider-cursor"), { ssr: false })

export default function SpiderLoader(props: SilkSpiderCursorProps) {
  return <SilkSpiderCursor {...props} />
}
