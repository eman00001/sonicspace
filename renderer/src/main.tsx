import Scene from './Scene.tsx'
import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client"
import {ApolloProvider} from "@apollo/client/react"
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: import.meta.env.VITE_COGNITO_RESPONSE_TYPE,
  scope: import.meta.env.VITE_COGNITO_SCOPE,
};

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:8080/graphql",
  }),
});

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <ApolloProvider client={client}>
        <Scene />
      </ApolloProvider>
    </AuthProvider>
  </React.StrictMode>
);
