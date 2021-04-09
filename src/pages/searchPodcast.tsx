import React, { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import {
  searchPodcastsQuery,
  searchPodcastsQueryVariables,
} from "../__generated__/searchPodcastsQuery";
import { useLocation } from "react-router";
import { Loading } from "../components/loading";
import { Link } from "react-router-dom";

const SEARCH_PODCASTS_QUERY = gql`
  query searchPodcastsQuery($input: SearchPodcastsInput!) {
    searchPodcasts(input: $input) {
      ok
      error
      totalPages
      totalCount
      podcasts {
        id
        title
        category
        coverImage
      }
    }
  }
`;

export const SearchPodcast = () => {
  const [titleQuery, setTitleQuery] = useState("");
  const location = useLocation();
  const [callQuery, { data, loading }] = useLazyQuery<
    searchPodcastsQuery,
    searchPodcastsQueryVariables
  >(SEARCH_PODCASTS_QUERY, {
    fetchPolicy: "network-only",
  });
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setTitleQuery(params.get("title") || "");
  }, [location]);
  useEffect(() => {
    if (titleQuery && !loading) {
      callQuery({
        variables: { input: { titleQuery } },
      });
    }
  }, [titleQuery]);
  return loading ? (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-300">
      <Loading />
    </div>
  ) : (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-300">
      <div className="flex justify-center items-center my-4">
        <p>Searched By "{titleQuery}"</p>
      </div>
      <div className="flex flex-wrap">
        {data?.searchPodcasts.podcasts?.map((podcast) => (
          <Link to={`podcast/${podcast.id}`} key={podcast.id}>
            <div className="flex flex-col justify-center items-center p-4">
              <div
                className="flex h-24 w-24 md:h-36 md:w-36 bg-blue-600 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${podcast.coverImage})` }}
              ></div>
              <div className="flex w-full text-sm justify-center items-center">
                <p>{podcast.title}</p>
              </div>
              <div className="flex w-full text-sm justify-center items-center">
                <p>[{podcast.category}]</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
