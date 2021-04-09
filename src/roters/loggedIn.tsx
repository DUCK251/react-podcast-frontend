import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Header } from "../components/header";
import { Podcasts } from "../pages/podcasts";
import { CreateEpisode } from "../pages/Host/createEpisode";
import { useMe } from "../hooks/useMe";
import { UserRole } from "../__generated__/globalTypes";
import { UpdateProfile } from "../pages/updateprofile";
import { Loading } from "../components/loading";
import { SearchPodcast } from "../pages/searchPodcast";
import { ListenerProfile } from "../pages/Listener/profile";
import { AudioBar } from "../components/audioBar";
import { HostProfile } from "../pages/Host/profile";
import { ListenerPodcast } from "../pages/Listener/podcast";
import { HostPodcast } from "../pages/Host/podcast";
import { SeeListeners } from "../pages/Host/seeListeners";
import { CreatePodcast } from "../pages/Host/createPodcast";
import { DeleteEpisode } from "../pages/Host/deleteEpisode";
import { DeletePodcast } from "../pages/Host/deletePodcast";
import { UpdateEpisode } from "../pages/Host/updateEpisode";
import { UpdatePodcast } from "../pages/Host/updatePodcast";

const HostRoutes = [
  {
    path: "/profile",
    component: <HostProfile />,
  },
  {
    path: "/podcast/:id",
    component: <HostPodcast />,
  },
  {
    path: "/podcast/:podcastId/add-episode",
    component: <CreateEpisode />,
  },
  {
    path: "/podcast/:podcastId/episode/:episodeId/listeners",
    component: <SeeListeners />,
  },
  {
    path: "/podcast/:podcastId/delete-episode/:episodeId",
    component: <DeleteEpisode />,
  },
  {
    path: "/podcast/:podcastId/update-episode/:episodeId",
    component: <UpdateEpisode />,
  },
  {
    path: "/add-podcast",
    component: <CreatePodcast />,
  },
  {
    path: "/delete-podcast/:id",
    component: <DeletePodcast />,
  },
  {
    path: "/update-podcast/:id",
    component: <UpdatePodcast />,
  },
];

const ListenerRoutes = [
  {
    path: "/profile",
    component: <ListenerProfile />,
  },
  {
    path: "/podcast/:id",
    component: <ListenerPodcast />,
  },
];

export const LoggedInRouter = () => {
  const { data: useMeResult, loading } = useMe();
  if (loading || !useMeResult) {
    return <Loading />;
  }
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact>
            <Podcasts />
          </Route>
          <Route path="/update-profile" exact>
            <UpdateProfile />
          </Route>
          <Route path="/search" exact>
            <SearchPodcast />
          </Route>
          {useMeResult?.me.role === UserRole.Host &&
            HostRoutes.map((route) => (
              <Route key={route.path} path={route.path} exact>
                {route.component}
              </Route>
            ))}
          {useMeResult?.me.role === UserRole.Listener &&
            ListenerRoutes.map((route) => (
              <Route key={route.path} path={route.path} exact>
                {route.component}
              </Route>
            ))}
          <Redirect to="/" />
        </Switch>
        <AudioBar />
      </Router>
    </>
  );
};
