import { gql, useQuery } from "@apollo/client";
import { meQuery } from "../__generated__/meQuery";

export const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      subscriptions {
        id
        title
        category
        coverImage
      }
      podcasts {
        id
        title
        category
        coverImage
      }
      playedEpisodes {
        id
      }
    }
  }
`;

export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY);
};
