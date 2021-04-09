/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: meQuery
// ====================================================

export interface meQuery_me_subscriptions {
  __typename: "Podcast";
  id: number;
  title: string;
  category: string;
  coverImage: string | null;
}

export interface meQuery_me_podcasts {
  __typename: "Podcast";
  id: number;
  title: string;
  category: string;
  coverImage: string | null;
}

export interface meQuery_me_playedEpisodes {
  __typename: "Episode";
  id: number;
}

export interface meQuery_me {
  __typename: "User";
  id: number;
  email: string;
  role: UserRole;
  subscriptions: meQuery_me_subscriptions[];
  podcasts: meQuery_me_podcasts[];
  playedEpisodes: meQuery_me_playedEpisodes[];
}

export interface meQuery {
  me: meQuery_me;
}
