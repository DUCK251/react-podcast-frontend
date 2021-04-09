/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: feedsQuery
// ====================================================

export interface feedsQuery_feeds_episodes_podcast {
  __typename: "Podcast";
  id: number;
  title: string;
  category: string;
}

export interface feedsQuery_feeds_episodes {
  __typename: "Episode";
  id: number;
  title: string;
  audioURL: string | null;
  createdAt: any;
  podcast: feedsQuery_feeds_episodes_podcast;
}

export interface feedsQuery_feeds {
  __typename: "FeedsOutput";
  ok: boolean;
  error: string | null;
  episodes: feedsQuery_feeds_episodes[] | null;
}

export interface feedsQuery {
  feeds: feedsQuery_feeds;
}
