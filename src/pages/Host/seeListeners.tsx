import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";
import {
  getListenersQuery,
  getListenersQueryVariables,
} from "../../__generated__/getListenersQuery";
import { Loading } from "../../components/loading";

const GET_LISTENERS_QUERY = gql`
  query getListenersQuery($input: EpisodesSearchInput!) {
    getEpisode(input: $input) {
      ok
      error
      episode {
        id
        listeners {
          id
          email
        }
      }
    }
  }
`;

interface IEpisodeParams {
  podcastId: string;
  episodeId: string;
}

export const SeeListeners = () => {
  const params = useParams<IEpisodeParams>();
  const podcastId: number = +params.podcastId;
  const episodeId: number = +params.episodeId;
  const { data, loading } = useQuery<
    getListenersQuery,
    getListenersQueryVariables
  >(GET_LISTENERS_QUERY, {
    variables: { input: { podcastId, episodeId } },
  });
  return (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-300 p-4">
      <div className="flex flex-col items-center mb-4">
        <p>Listeners</p>
        {loading ? (
          <Loading />
        ) : (
          <p>Total : {data?.getEpisode.episode?.listeners.length}</p>
        )}
      </div>
      <div className="flex flex-col items-center">
        {!loading &&
          data?.getEpisode.episode?.listeners.map((user) => (
            <p>{user.email}</p>
          ))}
      </div>
    </div>
  );
};
