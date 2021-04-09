/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum UserRole {
  Host = "Host",
  Listener = "Listener",
}

export interface CreateAccountInput {
  email?: string | null;
  password?: string | null;
  role?: UserRole | null;
}

export interface CreateEpisodeInput {
  title: string;
  category: string;
  audioURL?: string | null;
  podcastId: number;
}

export interface CreatePodcastInput {
  title: string;
  category: string;
  description?: string | null;
  coverImage?: string | null;
}

export interface CreateReviewInput {
  title: string;
  text: string;
  podcastId: number;
}

export interface EditProfileInput {
  email?: string | null;
  password?: string | null;
}

export interface EpisodesSearchInput {
  podcastId: number;
  episodeId: number;
}

export interface GetAllPodcastsInput {
  page?: number | null;
  category?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface MarkEpisodeAsPlayedInput {
  id: number;
}

export interface PodcastSearchInput {
  id: number;
}

export interface SearchPodcastsInput {
  page?: number | null;
  titleQuery: string;
}

export interface ToggleSubscribeInput {
  podcastId: number;
}

export interface UpdateEpisodeInput {
  podcastId: number;
  episodeId: number;
  title?: string | null;
  category?: string | null;
}

export interface UpdatePodcastInput {
  id: number;
  payload: UpdatePodcastPayload;
}

export interface UpdatePodcastPayload {
  title?: string | null;
  category?: string | null;
  description?: string | null;
  coverImage?: string | null;
  rating?: number | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
