/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PodcastFields
// ====================================================

export interface PodcastFields_episodes {
  __typename: "Episode";
  id: number;
  createdAt: any;
  title: string;
  category: string;
  audioURL: string | null;
}

export interface PodcastFields_reviews_creator {
  __typename: "User";
  id: number;
  email: string;
}

export interface PodcastFields_reviews {
  __typename: "Review";
  id: number;
  title: string;
  text: string;
  creator: PodcastFields_reviews_creator;
}

export interface PodcastFields_creator {
  __typename: "User";
  id: number;
  email: string;
}

export interface PodcastFields {
  __typename: "Podcast";
  id: number;
  title: string;
  category: string;
  description: string | null;
  coverImage: string | null;
  rating: number;
  totalSubscribers: number | null;
  episodes: PodcastFields_episodes[];
  reviews: PodcastFields_reviews[];
  creator: PodcastFields_creator;
}
