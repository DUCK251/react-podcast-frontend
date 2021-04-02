import React, { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import {
  deletePodcastMutation,
  deletePodcastMutationVariables,
} from "../__generated__/deletePodcastMutation";
import { getPodcast, getPodcastVariables } from "../__generated__/getPodcast";
import { PODCAST_QUERY } from "./podcast";
import { useMe } from "../hooks/useMe";
import { UserRole } from "../__generated__/globalTypes";

const DELETE_PODCAST_MUTATION = gql`
  mutation deletePodcastMutation($input: PodcastSearchInput!) {
    deletePodcast(input: $input) {
      ok
      error
    }
  }
`;

interface IPodcastParams {
  id: string;
}

export const DeletePodcast = () => {
  const history = useHistory();
  const params = useParams<IPodcastParams>();
  const { data: useMeResult } = useMe();
  const { data } = useQuery<getPodcast, getPodcastVariables>(PODCAST_QUERY, {
    variables: { input: { id: +params.id } },
  });
  const [deletePodcastMutation] = useMutation<
    deletePodcastMutation,
    deletePodcastMutationVariables
  >(DELETE_PODCAST_MUTATION, {
    onCompleted(data) {
      if (data.deletePodcast.ok) {
        alert("Delete!");
        history.goBack();
      }
    },
  });
  useEffect(() => {
    const curUser = { ...useMeResult?.me };
    if (curUser.role !== UserRole.Host) {
      history.push("/");
    }
    if (curUser.id !== data?.getPodcast.podcast?.creator.id) {
      history.push("/");
    }
  });
  return (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-100 p-4">
      <Helmet>
        <title>Delete Podcast</title>
      </Helmet>
      <div className="flex flex-col w-full">
        <h4 className="w-full text-center mb-5 text-2xl text-red-600">
          Delete Podcast
        </h4>
        <hr className="border border-blue-200"></hr>
        <p className="w-full text-center my-5">
          Do you want to <span className="text-red-600">delete</span> "
          {data?.getPodcast.podcast?.title}" ?
        </p>
        <div className="flex w-full items-center justify-center">
          <button
            className="p-2 mr-5 bg-red-400 hover:bg-red-600 rounded-lg text-white focus:outline-none"
            onClick={() => {
              deletePodcastMutation({
                variables: { input: { id: +params.id } },
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
