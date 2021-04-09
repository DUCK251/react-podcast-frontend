import { gql } from "@apollo/client";

export const PODCAST_FRAGMENT = gql`
  fragment PodcastFields on Podcast {
    id
    title
    category
    description
    coverImage
    rating
    totalSubscribers
    episodes {
      id
      createdAt
      title
      category
      audioURL
    }
    reviews {
      id
      title
      text
      creator {
        id
        email
      }
    }
    creator {
      id
      email
    }
  }
`;
