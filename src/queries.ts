import { gql } from "@apollo/client";
import { PODCAST_FRAGMENT } from "./fragments";

export const PODCAST_QUERY = gql`
  ${PODCAST_FRAGMENT}
  query getPodcast($input: PodcastSearchInput!) {
    getPodcast(input: $input) {
      ok
      error
      podcast {
        ...PodcastFields
      }
    }
  }
`;
