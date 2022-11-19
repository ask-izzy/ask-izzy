export {}

type CacheType = "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached"
type CredentialsType = "omit" | "same-origin" | "include"
type ModeType = "cors" | "no-cors" | "same-origin"
type RedirectType = "follow" | "error" | "manual"
type ReferrerPolicyType =
    "" | "no-referrer" | "no-referrer-when-downgrade" | "same-origin" |
    "origin" | "strict-origin" | "origin-when-cross-origin" |
    "strict-origin-when-cross-origin" | "unsafe-url"

declare global {
  interface RequestOptions {
    body?: BodyInit | null | undefined
    cache?: CacheType
    credentials?: CredentialsType
    headers?: HeadersInit
    integrity?: string
    keepalive?: boolean
    method?: string
    mode?: ModeType
    redirect?: RedirectType
    referrer?: string
    referrerPolicy?: ReferrerPolicyType
    signal?: AbortSignal | null | undefined
    window?: any
  }
}
