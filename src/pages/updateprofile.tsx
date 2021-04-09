import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Button } from "../components/button";
import { FormError } from "../components/formError";
import { useMe } from "../hooks/useMe";
import {
  editProfileMutation,
  editProfileMutationVariables,
} from "../__generated__/editProfileMutation";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfileMutation($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IEditAccountForm {
  email: string;
  password: string;
}

export const UpdateProfile = () => {
  const client = useApolloClient();
  const history = useHistory();
  const { data: useMeResult } = useMe();
  const {
    register,
    getValues,
    errors,
    handleSubmit,
  } = useForm<IEditAccountForm>({
    mode: "onChange",
    defaultValues: {
      email: useMeResult?.me.email,
    },
  });
  const onCompleted = (data: editProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok) {
      alert("Profile Edited");
      const { email } = getValues();
      if (email) {
        client.writeFragment({
          id: `User:${useMeResult?.me.id}`,
          fragment: gql`
            fragment Me on User {
              email
            }
          `,
          data: {
            email,
          },
        });
      }
      history.push("/");
    }
  };
  const [editProfileMutation, { loading, data }] = useMutation<
    editProfileMutation,
    editProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      editProfileMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
    }
  };
  return (
    <div className="min-h-screen w-full max-w-screen-md mx-auto flex flex-col bg-blue-100 p-4">
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="w-full md:max-w-sm flex-col px-4 lg:p-10 items-center mt-10 lg:mt-28 mx-auto lg:border border-blue-400 rounded-lg">
        <h4 className="w-full text-center mb-5 text-blue-900 text-2xl">
          Edit Profile
        </h4>
        <hr className="border border-blue-200"></hr>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <input
            ref={register({
              required: false,
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            type="email"
            placeholder="Email"
            className="input rounded-3xl"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"Please enter a valid email"} />
          )}
          <input
            ref={register({ required: false })}
            name="password"
            type="password"
            placeholder="Password"
            className="input rounded-3xl"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <Button loading={loading} actionText={"Submit"} />
          {data?.editProfile.error && (
            <FormError errorMessage={data.editProfile.error} />
          )}
        </form>
      </div>
    </div>
  );
};
