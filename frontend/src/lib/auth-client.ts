import { polarClient } from "@polar-sh/better-auth"
import { createAuthClient } from "better-auth/react"
import { env } from "process"
export const authClient = createAuthClient({
    /** 服务器的基本 URL（如果使用相同域名则为可选） */
    baseURL: env.BETTER_AUTH_URL,
    plugins: [polarClient()]
})