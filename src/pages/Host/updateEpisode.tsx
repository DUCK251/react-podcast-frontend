import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import {
  getPodcast,
  getPodcastVariables,
} from "../../__generated__/getPodcast";
import { PODCAST_QUERY } from "../../queries";
import {
  updateEpisodeMutation,
  updateEpisodeMutationVariables,
} from "../../__generated__/updateEpisodeMutation";
import { UserRole } from "../../__generated__/globalTypes";
import { Loading } from "../../components/loading";

const UPDATE_EPISODE_MUTATION = gql`
  mutation updateEpisodeMutation($input: UpdateEpisodeInput!) {
    updateEpisode(input: $input) {
      ok
      error
    }
  }
`;

interface IUpdateEpisodeForm {
  title: string;
}

interface IEpisodeParams {
  podcastId: string;
  episodeId: string;
}

export const UpdateEpisode = () => {
  const [uploading, setUploading] = useState(false);
  const history = useHistory();
  const params = useParams<IEpisodeParams>();
  const {
    register,
    getValues,
    handleSubmit,
    setValue,
  } = useForm<IUpdateEpisodeForm>({
    mode: "onChange",
  });
  const { loading: useMeLoading, data: useMeResult } = useMe();
  const { loading: podcastLoading, data: podcastData } = useQuery<
    getPodcast,
    getPodcastVariables
  >(PODCAST_QUERY, {
    variables: { input: { id: +params.podcastId } },
    onCompleted(data: getPodcast) {
      const episode = data?.getPodcast.podcast?.episodes.find(
        (episode) => episode.id === +params.episodeId
      );
      setValue("title", episode?.title);
    },
  });
  const onCompleted = (data: updateEpisodeMutation) => {
    const {
      updateEpisode: { ok },
    } = data;
    if (ok) {
      history.goBack();
    }
    setUploading(false);
  };
  const [updateEpisodeMutation, { loading }] = useMutation<
    updateEpisodeMutation,
    updateEpisodeMutationVariables
  >(UPDATE_EPISODE_MUTATION, {
    onCompleted,
    refetchQueries: [
      {
        query: PODCAST_QUERY,
        variables: {
          input: {
            id: +params.podcastId,
          },
        },
      },
    ],
  });
  const onSubmit = async () => {
    if (!uploading && podcastData?.getPodcast.podcast) {
      setUploading(true);
      try {
        const { title } = getValues();
        updateEpisodeMutation({
          variables: {
            input: {
              title,
              podcastId: +params.podcastId,
              episodeId: +params.episodeId,
            },
          },
        });
      } catch (e) {
        setUploading(false);
      }
    }
  };
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
      if (!episode) {
        history.push("/");
      }
    }
  });
  return useMeLoading || podcastLoading || loading ? (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-100 p-4">
      <Loading />
    </div>
  ) : (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-100 p-4">
      <Helmet>
        <title>Update Episode</title>
      </Helmet>
      <div className="flex flex-col w-full">
        <h4 className="w-full text-center mb-5 text-2xl">Update Episode</h4>
        <hr className="border border-blue-200"></hr>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 w-full my-5"
        >
          <p className="w-full text-center text-xl">Title</p>
          <input
            ref={register({
              required: "Title is required",
            })}
            name="title"
            required
            type="text"
            className="input rounded-xl"
          />
          <button
            className={`focus:outline-none w-1/2 md:w-1/3 mx-auto text-white py-3  transition-colors rounded-3xl bg-blue-600 hover:bg-blue-700`}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
