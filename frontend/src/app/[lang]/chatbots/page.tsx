"use client";
import {
  useAddNewChatbotMutation,
  useGetChatbotsQuery,
} from "@/store/api/authApi";
import { useAppSelector } from "@/store/hook";
import Link from "next/link";
import React, { useState } from "react";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { NoItems } from "../components/NoItems";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

export interface INewChatbotForm {
  name: string;
  creator: number;
  active: string;
}

export default function Chatbots() {
  const id = useAppSelector((state) => state.main.user.id);
  const [isOpen, setIsOpen] = useState(false);
  const {
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm<INewChatbotForm>({
    // @ts-ignore
    resolver: yupResolver(schema),
  });
  const {
    data: chatbots,
    isLoading: isLoadingChatbots,
    refetch,
  } = useGetChatbotsQuery({ id });
  const [addNewChatbot, { isLoading: isLoadingAddNew }] =
    useAddNewChatbotMutation();

  if (isLoadingChatbots) {
    return <Loader />;
  }

  const handleNewChatbotClick = (event: React.MouseEvent) => {
    event.preventDefault();

    setIsOpen(true);
  };

  const onSubmit = async () => {
    try {
      const data = await getValues();
      await addNewChatbot({ ...data, creator: id }).unwrap();
      setIsOpen(false);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleNewChatbotClick}
          className="text-white w-[190px] mx-16 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
        >
          <svg
            className="w-5 h-5 mr-1 text-gray-800 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
          Add New Chatbot
        </button>
      </div>

      {chatbots?.data && chatbots.data.length ? (
        <div className="grid grid-cols-1 gap-4 my-8 mx-16">
          {chatbots.data.map((chatbot) => (
            <Link
              href={`/en/chatbot/${chatbot.id}`}
              key={chatbot.id}
              className="bg-white rounded-lg overflow-hidden p-4 shadow-lg transition-all duration-700 hover:scale-105 "
            >
              <div className="p-8 flex justify-between items-center">
                <div className="flex grow justify-between mr-10">
                  <div>
                    <h3 className="text-xl font-bold text-blue-700 mb-2">
                      {chatbot.attributes.name}
                    </h3>
                    <div className="mb-2">
                      <span className="text-gray-800 text-sm font-semibold">
                        Created by:
                      </span>
                      <span className="text-gray-600 text-sm ml-1">
                        {chatbot.attributes.creator.data.attributes.username}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        chatbot.attributes.active
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {chatbot.attributes.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="mb-2">
                    <span className="text-gray-800 text-sm font-semibold">
                      Created at:
                    </span>
                    <span className="text-gray-600 text-sm ml-1">
                      {new Date(chatbot.attributes.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-800 text-sm font-semibold">
                      Updated at:
                    </span>
                    <span className="text-gray-600 text-sm ml-1">
                      {new Date(chatbot.attributes.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <NoItems
          title="No Chatbots"
          subtitle="Get started by creating a new chatbot"
        />
      )}
      <Modal
        title="Add New Chatbot"
        isOpen={isOpen}
        isLoading={isLoadingAddNew}
        onSave={() => handleSubmit(onSubmit)()}
        onClose={() => setIsOpen(false)}
      >
        <div className="grid grid-cols-1 gap-4 my-4">
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  id="name"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Name"
                />
              )}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex">
            <label htmlFor="isActive" className="block w-18 text-gray-300">
              Is Active:
            </label>
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <input
                  id="isActive"
                  type="checkbox"
                  className="h-4 w-4 mt-1 ml-2 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  {...field}
                />
              )}
            />
          </div>
          {errors.active && (
            <p className="text-red-500">{errors.active.message}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
