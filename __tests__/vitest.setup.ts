import "@testing-library/jest-dom/vitest"
import { TextEncoder, TextDecoder } from "node:util"

if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder
}
