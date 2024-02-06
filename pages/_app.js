import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App;
