import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn Page | UXCSystem",
  description: "SignIn to your UXCSystem account",
};

export default function SignIn() {
  return <SignInForm />;
}
