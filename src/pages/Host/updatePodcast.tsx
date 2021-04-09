import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { useMe } from "../../hooks/useMe";
import {
  getPodcast,
  getPodcastVariables,
} from "../../__generated__/getPodcast";
import { PODCAST_QUERY } from "../../queries";
import { CATEGORIES } from "../../constants";
import {
  updatePodcastMutation,
  updatePodcastMutationVariables,
} from "../../__generated__/updatePodcastMutation";
import { UserRole } from "../../__generated__/globalTypes";
import { Loading } from "../../components/loading";

const UPDATE_PODCAST_MUTATION = gql`
  mutation updatePodcastMutation($input: UpdatePodcastInput!) {
    updatePodcast(input: $input) {
      ok
      error
    }
  }
`;

interface IEditPodcastForm {
  title: string;
  category: string;
  rating: number;
  description: string;
  file: FileList;
}

interface IPodcastParams {
  id: string;
}

export const UpdatePodcast = () => {
  const history = useHistory();
  const podcastId = +useParams<IPodcastParams>().id;
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    setValue,
  } = useForm<IEditPodcastForm>({
    mode: "onChange",
  });
  const [uploading, setUploading] = useState(false);
  const [isOtherCategory, setIsOtherCategory] = useState(false);

  const { data: useMeResult, loading: useMeLoading } = useMe();
  const { data: podcastResult, loading: podcastLoading } = useQuery<
    getPodcast,
    getPodcastVariables
  >(PODCAST_QUERY, {
    variables: { input: { id: podcastId } },
    onCompleted(data: getPodcast) {
      const categoryName = data.getPodcast.podcast?.category;
      if (categoryName && !CATEGORIES.includes(categoryName)) {
        setIsOtherCategory(true);
      }
      setValue("title", data.getPodcast.podcast?.title);
      setValue("category", data.getPodcast.podcast?.category);
      setValue("rating", data.getPodcast.podcast?.rating);
      setValue("description", data.getPodcast.podcast?.description);
    },
  });

  const onCompleted = (data: updatePodcastMutation) => {
    const {
      updatePodcast: { ok, error },
    } = data;
    console.log(error);
    setUploading(false);
    if (ok) {
      alert("Podcast Edited!");
      history.push("/");
    }
  };
  const [updatePodcastMutation, { loading }] = useMutation<
    updatePodcastMutation,
    updatePodcastMutationVariables
  >(UPDATE_PODCAST_MUTATION, {
    onCompleted,
  });
  const onSubmit = async () => {
    if (!uploading) {
      setUploading(true);
      try {
        const { title, category, description, rating, file } = getValues();
        let coverImage;
        const actualFile = file[0];
        if (actualFile) {
          const formBody = new FormData();
          formBody.append("file", actualFile);
          const { url } = await (
            await fetch(
              "https://nestjs-podcast-backend.herokuapp.com/uploads/",
              {
                method: "POST",
                body: formBody,
              }
            )
          ).json();
          coverImage = url;
        }
        updatePodcastMutation({
          variables: {
            input: {
              id: podcastId,
              payload: {
                title,
                category,
                description,
                rating: +rating,
                coverImage,
              },
            },
          },
        });
      } catch (e) {
        setUploading(false);
      }
    }
  };
  useEffect(() => {
    if (!useMeLoading && !podcastLoading) {
      const curUser = { ...useMeResult?.me };
      if (curUser.role !== UserRole.Host) {
        history.push("/");
      }
      if (curUser.id !== podcastResult?.getPodcast.podcast?.creator.id) {
        history.push("/");
      }
    }
  }, []);
  return useMeLoading || podcastLoading || loading ? (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-100 p-4">
      <Loading />
    </div>
  ) : (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-100 p-4 pb-20">
      <Helmet>
        <title>Update Podcast</title>
      </Helmet>
      <div className="flex flex-col w-full">
        <div className="flex justify-center items-center mb-5">
          <div
            className="flex w-24 h-24 md:w-36 md:h-36 bg-blue-900 mr-3 rounded-lg bg-cover bg-center"
            style={{
              backgroundImage: `url(${podcastResult?.getPodcast.podcast?.coverImage})`,
            }}
          ></div>
        </div>
        <h4 className="w-full text-center mb-5 text-2xl">Update Podcast</h4>
        <hr className="border border-blue-200"></hr>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 w-full my-5"
        >
          <p className="w-full text-center text-xl">Title</p>
          <input
            ref={register({
              required: "Title is required",
            })}
            name="title"
            required
            type="text"
            className="input rounded-xl"
          />
          <p className="w-full text-center text-xl">Category</p>
          <div className="flex flex-wrap text-center">
            {CATEGORIES.map((category) => {
              if (category !== "All") {
                return (
                  <div key={category} className="flex">
                    <input
                      ref={register({ required: true })}
                      type="radio"
                      className="hidden"
                      id={category}
                      name="category"
                      value={category}
                    />
                    <label
                      className={`cursor-pointer bg-blue-400 p-3 rounded-lg m-2 ${
                        watch("category") === category
                          ? "text-white bg-blue-600"
                          : ""
                      }`}
                      htmlFor={category}
                      onClick={() => {
                        setIsOtherCategory(false);
                      }}
                    >
                      {category}
                    </label>
                  </div>
                );
              }
              return null;
            })}
            <span
              className={`cursor-pointer focus:outline-none bg-blue-400 p-3 rounded-lg m-2 ${
                isOtherCategory ? "text-white bg-blue-600" : ""
              }`}
              onClick={() => {
                setValue("category", "");
                setIsOtherCategory(true);
              }}
            >
              Others
            </span>
          </div>
          {isOtherCategory && (
            <input
              ref={register({
                required: "Category is required",
              })}
              name="category"
              type="text"
              className="input rounded-xl"
            />
          )}
          <p className="w-full text-center text-xl">Description</p>
          <textarea
            ref={register({
              required: "Description is required",
            })}
            name="description"
            rows={5}
            className="focus:outline-none focus:border-blue-500 p-2 border w-full border-blue-200 transition-colors mb-2 rounded-xl"
          />
          <p className="w-full text-center text-xl">Rating</p>
          <input
            ref={register({ min: 1, max: 5 })}
            name="rating"
            type="number"
            step="0.1"
            className="input rounded-xl"
          />
          <p className="w-full text-center text-xl">Cover Image</p>
          <input type="file" name="file" accept="image/*" ref={register()} />
          <button
            className={`focus:outline-none w-1/2 md:w-1/3 mx-auto text-white py-3  transition-colors rounded-3xl bg-blue-600 hover:bg-blue-700`}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
