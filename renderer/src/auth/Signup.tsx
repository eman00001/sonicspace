import { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";

interface SignupProps {
  onLogin: () => void;
}

export default function Signup({ onLogin }: SignupProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  const [confirmationRequired, setConfirmationRequired] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      if (result.nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setConfirmationRequired(true);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmation(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await confirmSignUp({
        username,
        confirmationCode,
      });

      onLogin();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid confirmation code."
      );
    } finally {
      setLoading(false);
    }
  }

  if (confirmationRequired) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Verify your email</h1>

          <p className="auth-subtitle">
            Enter the confirmation code sent to {email}.
          </p>

          <form onSubmit={handleConfirmation}>
            <div className="form-group">
              <label htmlFor="confirmationCode">
                Confirmation code
              </label>

              <input
                id="confirmationCode"
                type="text"
                value={confirmationCode}
                onChange={(e) =>
                  setConfirmationCode(e.target.value)
                }
                required
              />
            </div>

            {error && (
              <p className="auth-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify email"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create your account</h1>

        <p className="auth-subtitle">
          Start building your SonicSpace
        </p>

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={onLogin}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}