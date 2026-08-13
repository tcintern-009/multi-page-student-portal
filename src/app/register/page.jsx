import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Register | Student Course Portal",
  description: "Create a student account on the Student Course Portal",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
