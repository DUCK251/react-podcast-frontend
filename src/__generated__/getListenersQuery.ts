/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EpisodesSearchInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getListenersQuery
// ====================================================

export interface getListenersQuery_getEpisode_episode_listeners {
  __typename: "User";
  id: number;
  email: string;
}

export interface getListenersQuery_getEpisode_episode {
  __typename: "Episode";
  id: number;
  listeners: getListenersQuery_getEpisode_episode_listeners[];
}

export interface getListenersQuery_getEpisode {
  __typename: "GetEpisodeOutput";
  ok: boolean;
  error: string | null;
  episode: getListenersQuery_getEpisode_episode | null;
}

export interface getListenersQuery {
  getEpisode: getListenersQuery_getEpisode;
}

export interface getListenersQueryVariables {
  input: EpisodesSearchInput;
}
