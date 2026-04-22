import { loginAdmin } from "./actions";

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
          Enter the admin password to open the pricing manager or save updates to
          Google Sheets.
        </p>

        {error === "invalid" ? (
          <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            The password is incorrect.
          </p>
        ) : null}

        {error === "not-configured" ? (
          <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Admin login is not configured. Set `ADMIN_PASSWORD` and
            `ADMIN_SESSION_SECRET` in the environment.
          </p>
        ) : null}

        <form action={loginAdmin} className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-semibold">Admin password</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FAFDFF] px-4 py-3 outline-none transition focus:border-[#303940]"
            />
          </label>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#303940] px-6 py-3 text-sm font-semibold text-[#FAFDFF] transition hover:bg-[#9c9c9c] hover:text-[#303940]"
          >
            Continue
          </button>
        </form>
      </div>
    </main>
  );
}
