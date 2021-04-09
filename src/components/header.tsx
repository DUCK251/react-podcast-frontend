import {
  faHome,
  faPlus,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { CURRENT_EPISODE, LOCALSTORAGE_TOKEN } from "../constants";
import { authTokenVar, currentEpisodeVar, isLoggedInVar } from "../apollo";
import { useApolloClient } from "@apollo/client";
import { SearchBar } from "./searchBar";
import { useMe } from "../hooks/useMe";
import { UserRole } from "../__generated__/globalTypes";

export const Header: React.FC = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [isSearch, setIsSearch] = useState(false);
  const { data: useMeResult } = useMe();
  const onClick = () => {
    client.clearStore();
    localStorage.setItem(LOCALSTORAGE_TOKEN, "");
    localStorage.setItem(CURRENT_EPISODE, "");
    currentEpisodeVar("");
    authTokenVar("");
    isLoggedInVar(false);
    history.push("/");
  };
  return (
    <header className="max-w-screen-md mx-auto p-4 bg-blue-300">
      <div className="w-full mx-auto flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <div className="flex items-center">
            <span
              className="text-xs mr-2 text-white bg-blue-400 hover:bg-blue-600 py-1 px-2 rounded-3xl"
              onClick={() => setIsSearch(false)}
            >
              <Link to="/">
                <FontAwesomeIcon icon={faHome} className="text-xl" />
              </Link>
            </span>
            <button
              className="mr-2 py-1 px-2 text-white bg-blue-400 hover:bg-blue-600 rounded-3xl focus:outline-none"
              onClick={() => {
                setIsSearch((current) => !current);
              }}
            >
              <FontAwesomeIcon icon={faSearch} className="text-xl" />
            </button>
          </div>
          <div className="flex">
            {useMeResult?.me.role === UserRole.Host && (
              <Link to="/add-podcast">
                <button className="py-1 px-2 text-white bg-blue-400 hover:bg-blue-600 rounded-3xl focus:outline-none">
                  <FontAwesomeIcon icon={faPlus} /> Podcast
                </button>
              </Link>
            )}
            <span className="text-xs mx-2 text-white bg-blue-400 hover:bg-blue-600 py-1 px-2 rounded-3xl">
              <Link to="/profile">
                <FontAwesomeIcon icon={faUser} className="text-xl" />
              </Link>
            </span>
            <button
              onClick={onClick}
              className="py-1 px-2 text-white bg-blue-400 hover:bg-blue-600 rounded-3xl focus:outline-none"
            >
              Log Out
            </button>
          </div>
        </div>
        {isSearch && <SearchBar />}
      </div>
    </header>
  );
};
