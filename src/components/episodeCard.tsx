import React from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { currentEpisodeVar } from "../apollo";
import { CURRENT_EPISODE } from "../constants";
import {
  markEpisodeAsPlayedMutation,
  markEpisodeAsPlayedMutationVariables,
} from "../__generated__/markEpisodeAsPlayedMutation";
import { useMe } from "../hooks/useMe";
import { UserRole } from "../__generated__/globalTypes";

const MARK_EPISODE_AS_PLAYED_MUTATION = gql`
  mutation markEpisodeAsPlayedMutation($input: MarkEpisodeAsPlayedInput!) {
    markEpisodeAsPlayed(input: $input) {
      ok
      error
    }
  }
`;

interface IEpisodeProps {
  podcastId: number;
  episodeId: number;
  title: string;
  createdAt: any;
  host?: boolean;
}

const getDateString = (date: any): string => {
  date = new Date(date);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
};

export const EpisodeCard: React.FC<IEpisodeProps> = ({
  podcastId,
  episodeId,
  title,
  createdAt,
  host = false,
}) => {
  const client = useApolloClient();
  const { data: useMeResult, loading: useMeLoading } = useMe();
  const [markEpisodeAsPlayed] = useMutation<
    markEpisodeAsPlayedMutation,
    markEpisodeAsPlayedMutationVariables
  >(MARK_EPISODE_AS_PLAYED_MUTATION, {
    onCompleted(data: markEpisodeAsPlayedMutation) {
      if (data.markEpisodeAsPlayed.ok) {
        client.cache.modify({
          id: `User:${useMeResult?.me.id}`,
          fields: {
            playedEpisodes(existingEpisodeRefs = [], { readField }) {
              const newEpisodeRef = client.cache.writeFragment({
                data: { __typename: "Episode", id: episodeId },
                fragment: gql`
                  fragment NewEpisode on Episode {
                    id
                  }
                `,
              });

              if (
                existingEpisodeRefs.some(
                  (ref: any) => readField("id", ref) === episodeId
                )
              ) {
                return existingEpisodeRefs;
              }

              return [...existingEpisodeRefs, newEpisodeRef];
            },
          },
        });
      }
    },
  });
  const onClick = () => {
    currentEpisodeVar(`${podcastId}-${episodeId}`);
    localStorage.setItem(CURRENT_EPISODE, `${podcastId}-${episodeId}`);
    if (
      !useMeLoading &&
      useMeResult?.me.role === UserRole.Listener &&
      !useMeResult?.me.playedEpisodes.some(
        (episode) => episode.id === episodeId
      )
    ) {
      markEpisodeAsPlayed({ variables: { input: { id: episodeId } } });
    }
  };
  return useMeLoading ? (
    <div></div>
  ) : (
    <div
      key={episodeId}
      className="flex flex-col md:flex-row px-4 py-2 justify-between"
    >
      <div className="flex flex-col items-center mb-2 md:mb-0">
        <p>{title}</p>
        <p className="text-xs">{getDateString(createdAt)}</p>
      </div>
      <div className="flex justify-center items-center">
        {host && (
          <>
            <Link to={`/podcast/${podcastId}/episode/${episodeId}/listeners`}>
              <button className="py-1 px-2 mr-2 text-white bg-blue-400 hover:bg-blue-600 rounded-3xl focus:outline-none">
                See Listeners
              </button>
            </Link>
            <Link to={`/podcast/${podcastId}/update-episode/${episodeId}`}>
              <button className="py-1 px-2 mr-2 text-white bg-blue-400 hover:bg-blue-600 rounded-3xl focus:outline-none">
                Edit
              </button>
            </Link>
            <Link to={`/podcast/${podcastId}/delete-episode/${episodeId}`}>
              <button className="py-1 px-2 mr-2 text-white bg-red-400 hover:bg-red-600 rounded-3xl focus:outline-none">
                Delete
              </button>
            </Link>
          </>
        )}
        <div>
          <button
            onClick={onClick}
            className="py-1 px-2 text-white bg-blue-400 hover:bg-blue-600 rounded-3xl focus:outline-none"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
};
