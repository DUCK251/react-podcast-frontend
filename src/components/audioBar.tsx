import { useReactiveVar } from "@apollo/client";
import { gql, useQuery } from "@apollo/client";
import {
  faExternalLinkAlt,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { currentEpisodeVar } from "../apollo";
import { getEpisode, getEpisodeVariables } from "../__generated__/getEpisode";

const GET_EPISODE_QUERY = gql`
  query getEpisode($input: EpisodesSearchInput!) {
    getEpisode(input: $input) {
      ok
      error
      episode {
        id
        title
        podcast {
          title
          category
        }
        audioURL
      }
    }
  }
`;

export const AudioBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentEpisode = useReactiveVar(currentEpisodeVar);
  const podcastId = currentEpisode && +currentEpisode.split("-")[0];
  const episodeId = currentEpisode && +currentEpisode.split("-")[1];
  const { data, loading } = useQuery<getEpisode, getEpisodeVariables>(
    GET_EPISODE_QUERY,
    {
      variables: {
        input: { episodeId: episodeId || 0, podcastId: podcastId || 0 },
      },
    }
  );
  if (!currentEpisode || loading) {
    return <div></div>;
  }
  return (
    <div className="flex w-full max-w-screen-md mx-auto bg-blue-100">
      <div
        className={`flex flex-col md:flex-row w-full max-w-screen-md mx-auto fixed inset-x-0 bottom-0 bg-blue-600 text-white p-4 ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div className="flex w-full md:w-1/2 mb-3 md:mb-0 justify-center items-center text-center">
          {data?.getEpisode.episode?.podcast.title}[
          {data?.getEpisode.episode?.podcast.category}] -{" "}
          {data?.getEpisode.episode?.title}
        </div>
        <div className="flex w-full md:w-1/2 justify-center items-center">
          <audio
            controls
            src={data?.getEpisode.episode?.audioURL || ""}
            className="focus:outline-none"
            autoPlay
          >
            Your browser does not support the
            <code>audio</code> element.
          </audio>
        </div>
        <button
          className="absolute top-0 right-0 focus:outline-none"
          onClick={() => setIsOpen(false)}
        >
          <FontAwesomeIcon icon={faTimesCircle} className="text-xl" />
        </button>
      </div>
      <div
        className={`flex md:flex-row w-full max-w-screen-md mx-auto justify-end fixed inset-x-0 bottom-0 bg-blue-600 text-white p-2 ${
          isOpen ? "hidden" : ""
        }`}
      >
        <button className="focus:outline-none" onClick={() => setIsOpen(true)}>
          <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xl" />
        </button>
      </div>
    </div>
  );
};
