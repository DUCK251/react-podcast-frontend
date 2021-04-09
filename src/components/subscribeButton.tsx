import { gql, Reference, useMutation } from "@apollo/client";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useMe } from "../hooks/useMe";
import { FEEDS_QUERY } from "../pages/Listener/profile";
import { PODCAST_QUERY } from "../queries";
import {
  toggleSubscribe,
  toggleSubscribeVariables,
} from "../__generated__/toggleSubscribe";

const TOGGLE_SUBSCRIBE_MUTATION = gql`
  mutation toggleSubscribe($input: ToggleSubscribeInput!) {
    toggleSubscribe(input: $input) {
      ok
      error
    }
  }
`;

interface ISubButtonProps {
  podcastId: number;
  isPodcastInSubs: boolean | undefined | null;
}

export const SubscribeButton: React.FC<ISubButtonProps> = ({
  podcastId,
  isPodcastInSubs,
}) => {
  const { data: useMeResult } = useMe();
  const [toggleSubscribeMutation, { loading }] = useMutation<
    toggleSubscribe,
    toggleSubscribeVariables
  >(TOGGLE_SUBSCRIBE_MUTATION, {
    update(cache, data) {
      cache.modify({
        id: cache.identify({ ...useMeResult?.me }),
        fields: {
          subscriptions(existingPodcastRefs = [], { readField }) {
            const newPodcastRef = cache.writeFragment({
              data: { __typename: "Podcast", id: podcastId },
              fragment: gql`
                fragment NewPodcast on Podcast {
                  id
                }
              `,
            });
            if (
              existingPodcastRefs.some(
                (ref: Reference) => readField("id", ref) === podcastId
              )
            ) {
              return existingPodcastRefs.filter(
                (ref: Reference) => readField("id", ref) !== podcastId
              );
            }
            return [...existingPodcastRefs, newPodcastRef];
          },
        },
      });
    },
    refetchQueries: [
      { query: FEEDS_QUERY },
      { query: PODCAST_QUERY, variables: { input: { id: podcastId } } },
    ],
  });
  const onClick = () => {
    if (!loading) {
      toggleSubscribeMutation({
        variables: { input: { podcastId } },
      });
    }
  };
  return loading ? (
    <button
      className={`py-1 px-2 mr-2 text-white ${
        isPodcastInSubs
          ? "bg-red-400 hover:bg-red-600"
          : "bg-blue-400 hover:bg-blue-600"
      } rounded-3xl focus:outline-none`}
      onClick={onClick}
    >
      Loading...
    </button>
  ) : (
    <button
      className={`py-1 px-2 mr-2 text-white ${
        isPodcastInSubs
          ? "bg-red-400 hover:bg-red-600"
          : "bg-blue-400 hover:bg-blue-600"
      } rounded-3xl focus:outline-none`}
      onClick={onClick}
    >
      {isPodcastInSubs ? (
        <FontAwesomeIcon icon={faMinus} />
      ) : (
        <FontAwesomeIcon icon={faPlus} />
      )}{" "}
      {isPodcastInSubs ? "Unsubscribe" : "Subscribe"}
    </button>
  );
};
