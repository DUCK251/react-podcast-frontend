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
import { UserRole } from "../../__generated__/globalTypes";
import {
  createEpisodeMutation,
  createEpisodeMutationVariables,
} from "../../__generated__/createEpisodeMutation";
import { PODCAST_QUERY } from "../../queries";

const CREATE_EPISODE_MUTATION = gql`
  mutation createEpisodeMutation($input: CreateEpisodeInput!) {
    createEpisode(input: $input) {
      ok
      id
      error
    }
  }
`;

interface ICreateEpisodeForm {
  title: string;
  file: FileList;
}

interface IEpisodeParams {
  podcastId: string;
}

export const CreateEpisode = () => {
  const [uploading, setUploading] = useState(false);
  const history = useHistory();
  const params = useParams<IEpisodeParams>();
  const { loading: useMeLoading, data: useMeResult } = useMe();
  const { loading: podcastLoading, data: podcastData } = useQuery<
    getPodcast,
    getPodcastVariables
  >(PODCAST_QUERY, {
    variables: { input: { id: +params.podcastId } },
  });
  const { register, getValues, handleSubmit } = useForm<ICreateEpisodeForm>({
    mode: "onChange",
  });
  const onCompleted = (data: createEpisodeMutation) => {
    const {
      createEpisode: { ok },
    } = data;
    setUploading(false);
    if (ok) {
      history.goBack();
    }
  };
  const [createEpisodeMutation] = useMutation<
    createEpisodeMutation,
    createEpisodeMutationVariables
  >(CREATE_EPISODE_MUTATION, {
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
        const { title, file } = getValues();
        const actualFile = file[0];
        const formBody = new FormData();
        formBody.append("file", actualFile);
        const { url: audioURL } = await (
          await fetch("https://nestjs-podcast-backend.herokuapp.com/uploads/", {
            method: "POST",
            body: formBody,
          })
        ).json();
        const { id: podcastId, category } = {
          ...podcastData?.getPodcast.podcast,
        };
        createEpisodeMutation({
          variables: {
            input: { title, category, audioURL, podcastId },
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
    }
  }, []);
  return (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-100 p-4">
      <Helmet>
        <title>Create Episode</title>
      </Helmet>
      <div className="flex flex-col w-full">
        <h4 className="w-full text-center mb-5 text-2xl">Create Episode</h4>
        <hr className="border border-blue-200"></hr>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 w-full my-5"
        >
          <input
            ref={register({
              required: "Title is required",
            })}
            name="title"
            required
            type="text"
            placeholder="Title"
            className="input rounded-xl"
          />
          <input
            type="file"
            name="file"
            accept="audio/*"
            ref={register({ required: true })}
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
