"use client";
import {
  useDeleteChatbotMutation,
  useGetAnswersQuery,
  useGetChatbotQuery,
  useGetQuestionsQuery,
  useUpdateChatbotMutation,
} from "@/store/api/authApi";
import React, { useState } from "react";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { NoItems } from "../../components/NoItems";
import { Question } from "../../components/Question";
import { useRouter } from "next/navigation";
import {
  AddQuestionModal,
  QuestionVariant,
} from "../../components/AddEditQuestionModal";
import { IAnswer, IQuestion, IStrapi } from "@/store/interface";
import { Accordion } from "../../components/Accordion";
import { getScriptText, groupBy } from "../../utils/constants";
import { Answer } from "../../components/Answer";
import { AnswersGroup } from "../../components/AnswersGroup";

interface IProps {
  params: {
    id: number;
  };
}

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

export interface IEditChatbotForm {
  id: number;
  name: string;
  creator: number;
  active: boolean;
}

export default function Chatbot({ params }: IProps) {
  const router = useRouter();

  const {
    data: chatbot,
    isLoading,
    refetch,
  } = useGetChatbotQuery(
    { id: params.id },
    { refetchOnMountOrArgChange: true }
  );
  const { data: questions, isLoading: isQuestionsLoading } =
    useGetQuestionsQuery(
      { id: params.id },
      { refetchOnMountOrArgChange: true }
    );
  const { data: answers, isLoading: isAnswersLoading } = useGetAnswersQuery(
    { id: params.id },
    { refetchOnMountOrArgChange: true }
  );

  const [editChatbot, { isLoading: isEditChatbotLoading }] =
    useUpdateChatbotMutation();
  const [deleteChatbot, { isLoading: isChatbotDeleting }] =
    useDeleteChatbotMutation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionToUpdate, setQuestionToUpdate] =
    useState<IStrapi<IQuestion> | null>(null);

  const {
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm<IEditChatbotForm>({
    // @ts-ignore
    resolver: yupResolver(schema),
  });

  if (
    !chatbot ||
    isLoading ||
    isQuestionsLoading ||
    isChatbotDeleting ||
    isAnswersLoading
  ) {
    return <Loader />;
  }

  const onEditChatbot = async () => {
    try {
      const data = await getValues();
      await editChatbot({ ...data, id: params.id }).unwrap();
      setIsEditModalOpen(false);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteChatbotClick = async (event: React.MouseEvent) => {
    event.preventDefault();

    const agreed = confirm("Do you want to delete this chatbot?");

    if (agreed) {
      try {
        await deleteChatbot({ id: params.id }).unwrap();
        router.push("/en/chatbots");
      } catch (error) {
        return console.error(error);
      }
    }
    return console.error("User declined");
  };

  return (
    <div className="my-8 mx-16">
      <div className="p-8 flex justify-between items-center bg-white rounded-md">
        <div className="flex flex-col grow justify-between">
          <h3 className="text-xl font-bold text-blue-700 mb-2 ml-2">
            {chatbot.data.attributes.name}
          </h3>
          <div className="mb-2 ml-2">
            <span className="text-gray-800 text-sm font-semibold">
              Created by:
            </span>
            <span className="text-gray-600 text-sm ml-1">
              {chatbot.data.attributes.creator.data.attributes.username}
            </span>
          </div>
          <div className="mb-2">
            <Accordion title="Copy Chatbot Script">
              <textarea
                className="border-2 w-full rounded-md h-20"
                readOnly
                value={getScriptText(chatbot.data.id)}
              />
            </Accordion>
          </div>
        </div>
        <div className="flex items-center mx-6">
          <span
            className={`px-2 py-1 rounded-full text-sm font-semibold ${
              chatbot.data.attributes.active
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {chatbot.data.attributes.active ? "Active" : "Inactive"}
          </span>
        </div>
        <div>
          <div className="mb-2">
            <span className="text-gray-800 text-sm font-semibold">
              Created at:
            </span>
            <span className="text-gray-600 text-sm ml-1">
              {new Date(chatbot.data.attributes.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="mb-2">
            <span className="text-gray-800 text-sm font-semibold">
              Updated at:
            </span>
            <span className="text-gray-600 text-sm ml-1">
              {new Date(chatbot.data.attributes.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-[10px] justify-start items-start">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="text-white w-[155px] ml-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
          >
            <svg
              className="w-6 h-6 text-white mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z" />
              <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z" />
            </svg>
            Edit Chatbot
          </button>
          <button
            type="button"
            onClick={handleDeleteChatbotClick}
            className="text-white w-[175px] mx-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center bg-red-600 hover:bg-red-700 focus:ring-red-800"
          >
            <svg
              className="w-6 h-6 text-white mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Delete Chatbot
          </button>
        </div>
        <Modal
          title="Edit Chatbot"
          isOpen={isEditModalOpen}
          isLoading={isEditChatbotLoading}
          onSave={() => handleSubmit(onEditChatbot)()}
          onClose={() => setIsEditModalOpen(false)}
        >
          <div className="grid grid-cols-1 gap-4 my-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue={chatbot.data.attributes.name}
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
                defaultValue={chatbot.data.attributes.active}
                render={({ field }) => (
                  <input
                    id="isActive"
                    type="checkbox"
                    className="h-4 w-4 mt-1 ml-2 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={field.value}
                    onChange={field.onChange}
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
      <div className="inline-flex items-center justify-center w-full">
        <hr className="w-[80%] h-px my-8 bg-gray-200 border-0 bg-gray-700" />
        <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-black left-1/2 text-white ">
          Questions attached to the Chatbot:
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {questions?.data.length ? (
          questions?.data.map((question) => (
            <Question
              question={question}
              onEdit={(question: IStrapi<IQuestion>) => {
                setQuestionToUpdate(question);
                setIsQuestionModalOpen(true);
              }}
            />
          ))
        ) : (
          <NoItems
            title="No Questions"
            subtitle="Get started by adding a new question"
          />
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setQuestionToUpdate(null);
            setIsQuestionModalOpen(true);
          }}
          className="text-white w-[190px] my-5 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
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
          Add New Question
        </button>
        <AddQuestionModal
          chatbotId={params.id}
          question={questionToUpdate}
          variant={
            questionToUpdate ? QuestionVariant.EDIT : QuestionVariant.ADD
          }
          isOpen={isQuestionModalOpen}
          setIsOpen={setIsQuestionModalOpen}
        />
      </div>
      <div className="inline-flex items-center justify-center w-full">
        <hr className="w-[80%] h-px my-8 bg-gray-200 border-0 bg-gray-700" />
        <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-black left-1/2 text-white ">
          Responses:
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {answers?.data.length ? (
          groupBy<IAnswer>(
            answers?.data.map((answer) => answer.attributes),
            ({ user }) => user
          ).map((answersGroup) => <AnswersGroup answersGroup={answersGroup} />)
        ) : (
          <NoItems
            title="No Responses"
            subtitle="Get started by publishing your chatbor"
          />
        )}
      </div>
    </div>
  );
}
