import { SignUp } from "@clerk/nextjs";
import CovertLogo from "@/components/shared/CovertLogo";

// Note: lock down public sign-up in the Clerk dashboard (Restrictions →
// allowlist / invitation-only) so only Covert team members can register.
export default function SignUpPage() {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center gap-8 px-6"
      style={{ backgroundColor: "var(--covert-bg)" }}
    >
      <CovertLogo size={32} />
      <SignUp />
    </div>
  );
}
