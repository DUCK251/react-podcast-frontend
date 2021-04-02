import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Header } from "../components/header";
import { CreatePodcast } from "../pages/createPodcast";
import { Podcast } from "../pages/podcast";
import { Podcasts } from "../pages/podcasts";
import { DeletePodcast } from "../pages/deletePodcast";
import { CreateEpisode } from "../pages/createEpisode";
import { DeleteEpisode } from "../pages/deleteEpisode";

export const LoggedInRouter = () => {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact>
            <Podcasts />
          </Route>
          <Route path="/podcast/:id" exact>
            <Podcast />
          </Route>
          <Route path="/podcast/:podcastId/add-episode" exact>
            <CreateEpisode />
          </Route>
          <Route path="/podcast/:podcastId/delete-episode/:episodeId" exact>
            <DeleteEpisode />
          </Route>
          <Route path="/add-podcast" exact>
            <CreatePodcast />
          </Route>
          <Route path="/delete-podcast/:id" exact>
            <DeletePodcast />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    </>
  );
};
