/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MarkEpisodeAsPlayedInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: markEpisodeAsPlayedMutation
// ====================================================

export interface markEpisodeAsPlayedMutation_markEpisodeAsPlayed {
  __typename: "MarkEpisodeAsPlayedOutput";
  ok: boolean;
  error: string | null;
}

export interface markEpisodeAsPlayedMutation {
  markEpisodeAsPlayed: markEpisodeAsPlayedMutation_markEpisodeAsPlayed;
}

export interface markEpisodeAsPlayedMutationVariables {
  input: MarkEpisodeAsPlayedInput;
}
