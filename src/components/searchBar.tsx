import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory } from "react-router";

interface ISearchForm {
  titleQuery: string;
}

export const SearchBar = () => {
  const history = useHistory();
  const { register, handleSubmit } = useForm<ISearchForm>();
  const onSubmit: SubmitHandler<ISearchForm> = (data) => {
    history.push(`/search?title=${data.titleQuery}`);
  };
  return (
    <div className="flex items-center mt-2">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row">
        <input
          ref={register({
            required: "Title is required",
          })}
          name="titleQuery"
          required
          type="text"
          placeholder="Title"
          className="py-1 px-4 mr-2 focus:outline-none rounded-3xl w-full"
        />
        <button className="py-1 px-2 text-white bg-blue-400 hover:bg-blue-600 rounded-3xl focus:outline-none">
          Search
        </button>
      </form>
    </div>
  );
};
