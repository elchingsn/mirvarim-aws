import React, {useState, Suspense} from 'react';
import ReactDOM from 'react-dom';

import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';

import App from './App';
import Auth from "./components/Auth";
import AppNoLogin from "./AppNoLogin";

import { ApolloProvider, useQuery, useMutation } from "@apollo/react-hooks";
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable, concat, fromPromise } from 'apollo-link';
// import { Query } from "@apollo/react-components";
import gql from "graphql-tag";
import { setContext } from "apollo-link-context";
import axios from "axios";
import 'i18n';

import "./assets/scss/mirvarix-react.scss"

const cache = new InMemoryCache();


// const requestLink = new ApolloLink((operation, forward) => {
//   const token = localStorage.getItem("authToken") || "";
//   operation.setContext({
//     headers: {
//       Authorization: `JWT ${token}`
//     }
//   });

//   return forward(operation);
// });

const getNewToken = async () => {
  const freshToken = localStorage.getItem("refreshToken");
  // const {data} = useMutation(REFRESH_TOKEN_MUTATION, { variables: {refreshToken}});
  const res = await axios.post(
    `${process.env.REACT_APP_AWS_ALB_DNS}/graphql/`,
    {
      query: `mutation ($token: String!) {
        refreshToken(refreshToken: $token) {
          success
          errors
          token
          payload 
          refreshToken
        }
      }
      `,
      variables: {token: freshToken}
    }
  );
  console.log(res.data.data.refreshToken.token);
  localStorage.setItem("accessToken", res.data.data.refreshToken.token);
  return res.data.data.refreshToken.token;
}


const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('accessToken');
  console.log("authLink");
  // getNewToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    }
  }
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      // switch (err.extensions.code) {
      //   case 'UNAUTHENTICATED':
      switch (err.message) {
        case "Signature has expired":
          // error code is set to UNAUTHENTICATED
          // when AuthenticationError thrown in resolver

          // modify the operation context with a new token
          const oldHeaders = operation.getContext().headers;
          console.log("insie error");
          
          operation.setContext({
            headers: {
              ...oldHeaders,
              // authorization: `JWT ${localStorage.getItem('accessToken')}`,
              authorization: `JWT ${getNewToken()}`,
              // authorization: GetToken(),
            },
          });
          // retry the request, returning the new observable
          return forward(operation);
      }
    }
  }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      // if you would also like to retry automatically on
      // network errors, we recommend that you use
      // apollo-link-retry
    }
});

// httplink is not needed if upload client with version higher that 6 is used
const httpLink = new HttpLink({
  uri: `${process.env.REACT_APP_AWS_ALB_DNS}/graphql/`,
  credentials: 'include'
});

const uploadLink = new createUploadLink({uri: `${process.env.REACT_APP_AWS_ALB_DNS}/graphql/`});

const client = new ApolloClient({
  cache,
  //link: authLink.concat(httpLink),
  link: ApolloLink.from([
    authLink,
    errorLink,
    uploadLink
    // httpLink
  ])

  // resolvers: {
  //     Mutation: {
  //       updateNetworkStatus: (_, { isConnected }, { cache }) => {
  //         cache.writeData({ data: { isConnected }});
  //         return null;
  //       }
  //     }
  //   },
});

cache.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem("accessToken"),
    searchText: ""
  },
});

// client.onResetStore(() => cache.writeData({ data:{
//   isLoggedIn: !!localStorage.getItem("authToken")
// }
// }));

const IS_LOGGED_IN_QUERY = gql`
  query {
    isLoggedIn @client
  }
`;

cache.writeQuery({
  query: IS_LOGGED_IN_QUERY,
  data: {
    isLoggedIn: !!localStorage.getItem("accessToken"),
  },
});

const REFRESH_TOKEN_MUTATION = gql`
mutation RefreshToken($freshToken: String!) {
  refreshToken(refreshToken: $freshToken) {
    success
    error
    token
    payload
    refreshToken
  }
}
`;

function Selector() {
  const {data} = useQuery(IS_LOGGED_IN_QUERY);
  // const [tokenFunction, setTokenFunction] = useState(() => (console.log("Intial state")));
  // const freshToken = localStorage.getItem("refreshToken");
  // const [refreshToken, {loading, error}] = useMutation(REFRESH_TOKEN_MUTATION, {variables:{freshToken: {freshToken}}});
  return data.isLoggedIn ? <App/> : <AppNoLogin/>;
}

// const GetToken = async () => {
//   const res = await tokenFunction();
//   localStorage.setItem("accessToken", res.data.refreshToken.token);
//   return `JWT ${res.data.refreshToken.token}`
// }

ReactDOM.render(
  <ApolloProvider client={client}>
   <Suspense fallback={null}>
     <Selector />
   </Suspense>,
  </ApolloProvider>,
document.getElementById("root")
);



