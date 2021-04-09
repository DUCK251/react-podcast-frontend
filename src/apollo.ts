import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { CURRENT_EPISODE, LOCALSTORAGE_TOKEN } from "./constants";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
const currentEpisode = localStorage.getItem(CURRENT_EPISODE);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);
export const currentEpisodeVar = makeVar(currentEpisode);

const httpLink = createHttpLink({
  uri: "https://nestjs-podcast-backend.herokuapp.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
          currentEpisode: {
            read() {
              return currentEpisodeVar();
            },
          },
        },
      },
    },
  }),
});
