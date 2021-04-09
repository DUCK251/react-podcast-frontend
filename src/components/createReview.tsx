import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMe } from "../hooks/useMe";
import { PODCAST_QUERY } from "../queries";
import {
  createReviewMutation,
  createReviewMutationVariables,
} from "../__generated__/createReviewMutation";

const CREATE_REVIEW_MUTATION = gql`
  mutation createReviewMutation($input: CreateReviewInput!) {
    createReview(input: $input) {
      ok
      error
      id
    }
  }
`;

interface ICreateReviewProps {
  podcastId: number;
}

interface ICreateReviewForm {
  title: string;
  text: string;
}

export const CreateReviewComponent: React.FC<ICreateReviewProps> = ({
  podcastId,
}) => {
  const client = useApolloClient();
  const [canCreate, setCanCreate] = useState(false);
  const { data: useMeResult } = useMe();
  const {
    register,
    getValues,
    handleSubmit,
    setValue,
  } = useForm<ICreateReviewForm>({
    mode: "onChange",
  });
  const onCompleted = (data: createReviewMutation) => {
    const {
      createReview: { ok, id },
    } = data;
    if (ok) {
      alert("Review Created!");
      const { title, text } = getValues();
      const data = client.readQuery({
        query: PODCAST_QUERY,
        variables: { input: { id: podcastId } },
      });
      client.writeQuery({
        query: PODCAST_QUERY,
        variables: { input: { id: podcastId } },
        data: {
          getPodcast: {
            ...data.getPodcast,
            podcast: {
              ...data.getPodcast.podcast,
              reviews: [
                {
                  __typename: "Review",
                  id,
                  title,
                  text,
                  creator: {
                    email: useMeResult?.me.email,
                    id: useMeResult?.me.id,
                    __typename: "User",
                  },
                },
                ...data.getPodcast.podcast.reviews,
              ],
            },
          },
        },
      });
    }
    setValue("text", "");
    setValue("title", "");
  };
  const [createReviewMutation] = useMutation<
    createReviewMutation,
    createReviewMutationVariables
  >(CREATE_REVIEW_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    const { title, text } = getValues();
    createReviewMutation({
      variables: {
        input: {
          title,
          text,
          podcastId,
        },
      },
    });
  };
  return canCreate ? (
    <div className="flex flex-col p-2 justify-center border-b-2 border-blue-400">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grip gap-3 my-5 w-full"
      >
        <input
          ref={register({
            required: "Review Title is required",
          })}
          name="title"
          type="text"
          placeholder="Title"
          className="focus:outline-none focus:border-blue-500 p-2 border border-blue-200 transition-colors w-full mb-2 rounded-lg"
        />
        <textarea
          ref={register({
            required: "Review Text is required",
          })}
          name="text"
          placeholder="Review"
          className="focus:outline-none focus:border-blue-500 p-2 border border-blue-200 transition-colors w-full mb-2 rounded-lg"
        />
        <div className="flex justify-end">
          <button className="w-36 mr-2 py-1 px-2 text-white bg-blue-400 hover:bg-blue-600 rounded-3xl focus:outline-none">
            Submit
          </button>
          <button
            className="w-8 py-1 px-2 text-white bg-red-400 hover:bg-red-600 rounded-3xl focus:outline-none"
            onClick={() => {
              setCanCreate(false);
            }}
          >
            X
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div className="flex justify-end my-4">
      <button
        className="w-36 py-1 px-2 text-white bg-blue-400 hover:bg-blue-600 rounded-3xl focus:outline-none"
        onClick={() => {
          setCanCreate(true);
        }}
      >
        Create Review
      </button>
    </div>
  );
};
