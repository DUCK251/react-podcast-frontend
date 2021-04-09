import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { useMe } from "../../hooks/useMe";
import {
  getPodcast,
  getPodcastVariables,
} from "../../__generated__/getPodcast";
import { PODCAST_QUERY } from "../../queries";
import {
  deleteEpisodeMutation,
  deleteEpisodeMutationVariables,
} from "../../__generated__/deleteEpisodeMutation";
import { UserRole } from "../../__generated__/globalTypes";

const DELETE_EPISODE_MUTATION = gql`
  mutation deleteEpisodeMutation($input: EpisodesSearchInput!) {
    deleteEpisode(input: $input) {
      ok
      error
    }
  }
`;

interface IEpisodeParams {
  podcastId: string;
  episodeId: string;
}

export const DeleteEpisode = () => {
  const history = useHistory();
  const params = useParams<IEpisodeParams>();
  const { loading: useMeLoading, data: useMeResult } = useMe();
  const { loading: podcastLoading, data: podcastData } = useQuery<
    getPodcast,
    getPodcastVariables
  >(PODCAST_QUERY, {
    variables: { input: { id: +params.podcastId } },
  });
  const [title, setTitle] = useState("");
  const [deleteEpisodeMutation] = useMutation<
    deleteEpisodeMutation,
    deleteEpisodeMutationVariables
  >(DELETE_EPISODE_MUTATION, {
    onCompleted(data) {
      if (data.deleteEpisode.ok) {
        alert("Delete!");
        history.goBack();
      }
    },
  });
  useEffect(() => {
    if (!useMeLoading && !podcastLoading) {
      const curUser = { ...useMeResult?.me };
      if (curUser.role !== UserRole.Host) {
        history.push("/");
      }
      if (curUser.id !== podcastData?.getPodcast.podcast?.creator.id) {
        history.push("/");
      }
      const episode = podcastData?.getPodcast.podcast?.episodes.find(
        (episode) => episode.id === +params.episodeId
      );
      if (episode) {
        setTitle(episode.title);
      } else {
        history.push("/");
      }
    }
  }, []);
  return (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-100 p-4">
      <Helmet>
        <title>Delete Episode</title>
      </Helmet>
      <div className="flex flex-col w-full">
        <h4 className="w-full text-center mb-5 text-2xl text-red-600">
          Delete Episode
        </h4>
        <hr className="border border-blue-200"></hr>
        <p className="w-full text-center my-5">
          Do you want to <span className="text-red-600">delete</span> "{title}"
          ?
        </p>
        <div className="flex w-full items-center justify-center">
          <button
            className="p-2 mr-5 bg-red-400 hover:bg-red-600 rounded-lg text-white focus:outline-none"
            onClick={() => {
              deleteEpisodeMutation({
                variables: {
                  input: {
                    podcastId: +params.podcastId,
                    episodeId: +params.episodeId,
                  },
                },
              });
            }}
          >
            Yes
          </button>
          <button
            className="p-2 bg-blue-400 hover:bg-blue-600 rounded-lg text-white focus:outline-none"
            onClick={() => {
              history.goBack();
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
