import { SignIn } from "@clerk/nextjs";
import CovertLogo from "@/components/shared/CovertLogo";

export default function SignInPage() {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center gap-8 px-6"
      style={{ backgroundColor: "var(--covert-bg)" }}
    >
      <CovertLogo size={32} />
      <SignIn />
    </div>
  );
}
