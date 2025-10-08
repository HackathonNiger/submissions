import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { isProfileComplete } from "@/actions/profile-actions";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Check KYC verification and profile completion for cause creation
  if (request.nextUrl.pathname.startsWith("/dashboard/causes/create")) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Check KYC verification status
      const { data: kycVerification } = await supabase
        .from("kyc_verifications")
        .select("status")
        .eq("user_id", user.id)
        .single();

      // Check if KYC exists
      if (!kycVerification) {
        return NextResponse.redirect(
          new URL("/dashboard/settings?error=kyc_required", request.url)
        );
      }

      // If KYC exists but is not approved
      if (kycVerification.status !== "approved") {
        return NextResponse.redirect(
          new URL(
            `/dashboard/settings?error=kyc_${kycVerification.status}`,
            request.url
          )
        );
      }
      // Check if profile is complete (has full name, bio, and avatar)
      const { isComplete } = await isProfileComplete(user.id);
      if (!isComplete) {
        return NextResponse.redirect(
          new URL("/dashboard/settings?error=profile_incomplete", request.url)
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
