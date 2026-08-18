import { useEffect, useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";

import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Scene from "./Scene";

type AuthPage = "login" | "signup";

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [page, setPage] = useState<AuthPage>("login");

  useEffect(() => {
    async function checkAuth() {
      try {
        await getCurrentUser();
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      }
    }

    checkAuth();
  }, []);

  if (authenticated === null) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    if (page === "signup") {
      return (
        <Signup
          onLogin={() => setPage("login")}
        />
      );
    }

    return (
      <Login
        onSignup={() => setPage("signup")}
        onLoginSuccess={() => setAuthenticated(true)}
      />
    );
  }
  console.log('bleh');
  
  return <Scene />;
}