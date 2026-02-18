# Gatherly — Auth (Supabase)

Email/password and social login (Google, Facebook, Apple) are implemented with **Supabase Auth**.

## App routes

| Route | Purpose |
|-------|---------|
| `/login` | Sign in (email/password + Google, Facebook, Apple) |
| `/signup` | Create account (email/password + social) |
| `/forgot-password` | Request password reset email |
| `/auth/callback` | OAuth callback (do not link users here manually) |

## Enable providers in Supabase

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Authentication** → **Providers**.

2. **Redirect URL** (required for OAuth):  
   In **Authentication** → **URL Configuration**, set:
   - **Site URL:** your app URL (e.g. `https://yourapp.vercel.app` or `http://localhost:3000`)
   - **Redirect URLs:** add `https://yourapp.vercel.app/auth/callback` and `http://localhost:3000/auth/callback`

3. **Google**
   - Enable **Google**.
   - In [Google Cloud Console](https://console.cloud.google.com/): create OAuth 2.0 credentials (Web application).
   - Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret into Supabase Google provider.

4. **Facebook**
   - Enable **Facebook**.
   - In [Facebook Developers](https://developers.facebook.com/): create an app, add Facebook Login, set Valid OAuth Redirect URIs to `https://<project-ref>.supabase.co/auth/v1/callback`.
   - Copy App ID and App Secret into Supabase Facebook provider.

5. **Apple**
   - Enable **Apple**.
   - In [Apple Developer](https://developer.apple.com/): create a Services ID, configure Sign in with Apple, set redirect URL to `https://<project-ref>.supabase.co/auth/v1/callback`.
   - Create a private key and add Service ID, Key ID, Team ID, and Private Key in Supabase Apple provider.

Replace `<project-ref>` with your Supabase project reference (e.g. from the dashboard URL).

## Email/password

- **Confirm email:** In **Authentication** → **Providers** → **Email**, you can turn "Confirm email" on or off. If on, users must click the link in the email before signing in.
- **Password reset:** Uses Supabase’s built-in reset; the reset link redirects to your Site URL. You can add a dedicated “set new password” page later if needed.

## Server: get current user

```ts
import { getCurrentUser } from "@/lib/auth"

const user = await getCurrentUser()
if (!user) {
  redirect("/login")
}
// user.id, user.email, user.user_metadata
```

## Client: sign out

```ts
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()
await supabase.auth.signOut()
router.push("/")
router.refresh()
```

## Protecting routes

Redirect unauthenticated users in a server layout or page:

```ts
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({ children }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  return <>{children}</>
}
```

Apply this to member/studio routes when you want to require sign-in.
