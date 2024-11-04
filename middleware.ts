// middleware.ts
import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/login", "/signup"],
  async beforeAuth(req) {
    // You can add custom logic here
  },
  async afterAuth(auth, req) {
    // Verify token with your backend if needed
    if (auth.userId) {
      const token = localStorage.getItem('access_token')
      // Verify token with your backend
    }
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}