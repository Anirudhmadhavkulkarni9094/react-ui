import { useState } from "react";

import { Mail, Lock } from "lucide-react";
import Input from "./Input/Input";
import Button from "./Button/Button";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    } else {
      setPasswordError("");
    }

    alert("Form submitted ✅");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-xl"
    >
      <h2 className="text-xl font-semibold mb-2">Sign Up</h2>

      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        icon={<Mail size={18} />}
        iconPosition="left"
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={passwordError}
        errorStatus={!!passwordError}
        required
        icon={<Lock size={18} />}
        iconPosition="left"
      />

      <Button type="submit" variant="primary" size="md" className="w-full">
        Create Account
      </Button>
    </form>
  );
}
