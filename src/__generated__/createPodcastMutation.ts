/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreatePodcastInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createPodcastMutation
// ====================================================

export interface createPodcastMutation_createPodcast {
  __typename: "CreatePodcastOutput";
  ok: boolean;
  id: number | null;
  error: string | null;
}

export interface createPodcastMutation {
  createPodcast: createPodcastMutation_createPodcast;
}

export interface createPodcastMutationVariables {
  input: CreatePodcastInput;
}
