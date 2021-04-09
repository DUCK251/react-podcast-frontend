import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet-async";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import {
  getPodcast,
  getPodcastVariables,
} from "../../__generated__/getPodcast";
import { Loading } from "../../components/loading";
import { StarRating } from "../../components/starRating";
import { EpisodeCard } from "../../components/episodeCard";
import { PODCAST_QUERY } from "../../queries";

interface IPodcastParams {
  id: string;
}

export const HostPodcast = () => {
  const params = useParams<IPodcastParams>();
  const history = useHistory();
  const { data: useMeResult } = useMe();
  const [isEpisode, setIsEpisode] = useState(true);
  const { data, loading } = useQuery<getPodcast, getPodcastVariables>(
    PODCAST_QUERY,
    {
      onCompleted(data) {
        if (!data.getPodcast.podcast) {
          history.push("/");
        }
      },
      variables: {
        input: {
          id: +params.id,
        },
      },
    }
  );
  return loading ? (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-300 p-4">
      <Loading />
    </div>
  ) : (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-300 p-4">
      <Helmet>
        <title>{data?.getPodcast.podcast?.title || ""}</title>
      </Helmet>
      <div className="flex w-full mb-4">
        <div
          className="flex w-24 h-24 md:w-36 md:h-36 bg-blue-900 mr-3 rounded-lg bg-cover bg-center"
          style={{
            backgroundImage: `url(${data?.getPodcast.podcast?.coverImage})`,
          }}
        ></div>
        <div className="flex flex-col">
          <p className="text-2xl md:text-3xl md:mb-2">
            {data?.getPodcast.podcast?.title}
          </p>
          <p className="md:text-2xl md:mb-2">
            {data?.getPodcast.podcast?.category}
          </p>
          <div className="flex items-center">
            <StarRating rating={data?.getPodcast.podcast?.rating || 0} />{" "}
            <span className="ml-1 font-medium">
              {data?.getPodcast.podcast?.rating || 0}
            </span>
          </div>
        </div>
      </div>
      {data?.getPodcast.podcast?.creator.id === useMeResult?.me.id && (
        <div className="flex mb-4">
          <Link to={`/update-podcast/${data?.getPodcast.podcast?.id}`}>
            <button className="py-1 px-2 mr-2 text-white bg-blue-400 hover:bg-blue-600 rounded-3xl focus:outline-none">
              Edit
            </button>
          </Link>
          <Link to={`/delete-podcast/${data?.getPodcast.podcast?.id}`}>
            <button className="py-1 px-2 mr-2 text-white bg-red-400 hover:bg-red-600 rounded-3xl focus:outline-none">
              Delete
            </button>
          </Link>
          <Link to={`/podcast/${params.id}/add-episode`}>
            <button className="py-1 px-2 text-white bg-blue-400 hover:bg-blue-600 rounded-3xl focus:outline-none">
              <FontAwesomeIcon icon={faPlus} /> Episode
            </button>
          </Link>
        </div>
      )}
      <div className="flex items-center mb-4">
        <p>{data?.getPodcast.podcast?.description}</p>
      </div>
      <div className="flex text-white mb-4">
        <div
          className={`flex w-1/2 h-12 items-center justify-center ${
            isEpisode ? "bg-blue-600" : "bg-blue-400"
          } cursor-pointer rounded-l-3xl`}
          onClick={() => setIsEpisode(true)}
        >
          Episodes
        </div>
        <div
          className={`flex w-1/2 h-12 items-center justify-center ${
            !isEpisode ? "bg-blue-600" : "bg-blue-400"
          } cursor-pointer rounded-r-3xl`}
          onClick={() => setIsEpisode(false)}
        >
          Reviews
        </div>
      </div>
      {isEpisode ? (
        data?.getPodcast.podcast?.episodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            podcastId={data.getPodcast.podcast?.id || 0}
            episodeId={episode.id}
            title={episode.title}
            createdAt={episode.createdAt}
            host={data?.getPodcast.podcast?.creator.id === useMeResult?.me.id}
          />
        ))
      ) : (
        <>
          {data?.getPodcast.podcast?.reviews?.map((review) => (
            <div
              key={review.id}
              className="flex flex-col p-2 justify-center border-b-2 border-blue-400"
            >
              <div className="flex justify-between mb-2">
                <p className="font-medium">{review.title}</p>
                <p>{review.creator.email}</p>
              </div>
              <p className="mb-2">{review.text}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
