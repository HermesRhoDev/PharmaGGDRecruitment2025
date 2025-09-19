import { adminAuth } from "App/lib/auth-admin"

const handler = adminAuth.handlers
export { handler as GET, handler as POST }