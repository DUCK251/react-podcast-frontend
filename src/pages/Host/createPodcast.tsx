import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
  createPodcastMutation,
  createPodcastMutationVariables,
} from "../../__generated__/createPodcastMutation";
import { CATEGORIES } from "../../constants";

const CREATE_PODCAST_MUTATION = gql`
  mutation createPodcastMutation($input: CreatePodcastInput!) {
    createPodcast(input: $input) {
      ok
      id
      error
    }
  }
`;

interface ICreatePodcastForm {
  title: string;
  category: string;
  description: string;
  file: FileList;
}

export const CreatePodcast = () => {
  const [uploading, setUploading] = useState(false);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    setValue,
  } = useForm<ICreatePodcastForm>({
    mode: "onChange",
  });
  const history = useHistory();
  const onCompleted = (data: createPodcastMutation) => {
    const {
      createPodcast: { ok },
    } = data;
    setUploading(false);
    if (ok) {
      history.push("/");
    }
  };
  const [createPodcastMutation] = useMutation<
    createPodcastMutation,
    createPodcastMutationVariables
  >(CREATE_PODCAST_MUTATION, {
    onCompleted,
  });
  const onSubmit = async () => {
    if (!uploading) {
      setUploading(true);
      try {
        const { title, category, description, file } = getValues();
        const actualFile = file[0];
        const formBody = new FormData();
        formBody.append("file", actualFile);
        const { url: coverImage } = await (
          await fetch("https://nestjs-podcast-backend.herokuapp.com/uploads/", {
            method: "POST",
            body: formBody,
          })
        ).json();
        createPodcastMutation({
          variables: {
            input: { title, category, description, coverImage },
          },
        });
      } catch (e) {
        setUploading(false);
      }
    }
  };
  return (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-100 p-4">
      <Helmet>
        <title>Create Podcast</title>
      </Helmet>
      <div className="flex flex-col w-full">
        <h4 className="w-full text-center mb-5 text-2xl">Create Podcast</h4>
        <hr className="border border-blue-200"></hr>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 w-full my-5"
        >
          <input
            ref={register({
              required: "Title is required",
            })}
            name="title"
            required
            type="text"
            placeholder="Title"
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
              placeholder="Category"
              className="input rounded-xl"
            />
          )}
          <p className="w-full text-center text-xl">Description</p>
          <textarea
            ref={register({
              required: "Description is required",
            })}
            name="description"
            placeholder="Description"
            rows={5}
            className="focus:outline-none focus:border-blue-500 p-2 border w-full border-blue-200 transition-colors mb-2 rounded-xl"
          />
          <input
            type="file"
            name="file"
            accept="image/*"
            ref={register({ required: true })}
          />
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
