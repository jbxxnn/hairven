import GoogleSignInButton from "@/components/google-sign-in-button";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFE5FF_0%,#FAFDFF_42%,#FFFFFF_100%)] px-6 py-16 text-[#303940] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-[#9c9c9c]/20 bg-[#FFFFFF] p-8 shadow-[0_24px_80px_-48px_rgba(48,57,64,0.22)]">
        <p className="text-sm uppercase tracking-[0.35em] text-[#9c9c9c]">Admin Access</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Sign in to manage the pricing sheet.
        </h1>
        <p className="mt-4 text-base leading-7 text-[#303940]/75">
          Only approved Google accounts listed in `ADMIN_EMAILS` can open the pricing
          manager or save updates to Google Sheets.
        </p>

        {error === "AccessDenied" ? (
          <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            This Google account is not on the admin allowlist.
          </p>
        ) : null}

        <div className="mt-8">
          <GoogleSignInButton />
        </div>
      </div>
    </main>
  );
}
