import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ next?: string; error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  return (
    <section className="container-editorial flex min-h-[70vh] items-center justify-center py-24">
      <div className="w-full max-w-sm">
        <h1 className="font-display tracking-[0.25em] text-2xl mb-2">
          SIGN IN
        </h1>
        <p className="text-sm opacity-70 mb-8">
          Admin access to Book &amp; Capture.
        </p>
        <LoginForm next={sp.next} initialError={sp.error} />
      </div>
    </section>
  );
}
