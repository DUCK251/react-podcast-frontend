import React from "react";
import { Link } from "react-router-dom";
import { Loading } from "../../components/loading";
import { useMe } from "../../hooks/useMe";

export const HostProfile = () => {
  const { data: useMeResult, loading: useMeLoading } = useMe();
  return useMeLoading ? (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-300">
      <Loading />
    </div>
  ) : (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-300">
      <div className="flex justify-center items-center mt-4">
        <p className="font-medium">Profile</p>
        <Link to="/update-profile">
          <button className="py-1 px-2 ml-2 text-white bg-blue-400 hover:bg-blue-600 rounded-3xl focus:outline-none">
            Edit
          </button>
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center my-4">
        <p className="mb-3">Email : {useMeResult?.me.email}</p>
        <p>Role : {useMeResult?.me.role}</p>
      </div>
      <div className="flex justify-center items-center my-4">
        <p className="font-medium">Podcasts</p>
      </div>
      <div className="flex overflow-auto">
        {useMeResult?.me.podcasts.map((podcast) => (
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
