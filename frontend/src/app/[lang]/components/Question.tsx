"use client";
import { useDeleteQuestionMutation } from "@/store/api/authApi";
import { IQuestion, IStrapi } from "@/store/interface";
import React, { useState } from "react";
import { TYPE } from "../utils/constants";
import { Accordion } from "./Accordion";
import Loader from "./Loader";
import { QuestionChoice } from "./QuestionChoice";

export const Question = ({
  question,
  onEdit,
}: {
  question: IStrapi<IQuestion>;
  onEdit: (question: IStrapi<IQuestion>) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [deleteQuestion, { isLoading: isDeleteLoading }] =
    useDeleteQuestionMutation();

  if (isDeleteLoading) {
    return <Loader />;
  }

  const handleQuestionDelete = async (event: React.MouseEvent) => {
    event.preventDefault();

    const agreed = confirm("Do you want to delete this question?");

    if (agreed) {
      try {
        await deleteQuestion({ id: question.id }).unwrap();
      } catch (error) {
        return console.error(error);
      }
    }
    return console.error("User declined");
  };
  return (
    <div className="p-8 flex justify-between bg-white rounded-md">
      <div className="w-[60%]">
        <h3 className="text-xl font-bold text-blue-700 mb-2 ml-2">
          {question.attributes.name}
        </h3>
        <div className="mb-2 ml-2">
          <span className="text-gray-800 text-sm font-semibold">
            Question Type:
          </span>
          <span className="text-gray-600 text-sm ml-1">
            {question.attributes.type.data.attributes.name}
          </span>
        </div>
        {(question.attributes.correct_answer ||
          question.attributes.type.data.attributes.name ===
            TYPE.TRUE_FALSE) && (
          <div className="mb-2 ml-2">
            <span className="text-gray-800 text-sm font-semibold">
              Question Correct Answer:
            </span>
            <span className="text-gray-600 text-sm ml-1">
              {String(question.attributes.correct_answer)}
            </span>
          </div>
        )}
        {question.attributes.order && (
          <div className="mb-2 ml-2">
            <span className="text-gray-800 text-sm font-semibold">
              Question Order:
            </span>
            <span className="text-gray-600 text-sm ml-1">
              {question.attributes.order}
            </span>
          </div>
        )}
        {Boolean(question.attributes.question_choices.data.length) && (
          <Accordion title="Question Choices:">
            {question.attributes.question_choices.data.map((questionChoice) => (
              <QuestionChoice {...questionChoice.attributes} />
            ))}
          </Accordion>
        )}
      </div>
      <div>
        <div className="mb-2">
          <span className="text-gray-800 text-sm font-semibold">
            Created at:
          </span>
          <span className="text-gray-600 text-sm ml-1">
            {new Date(question.attributes.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="mb-2">
          <span className="text-gray-800 text-sm font-semibold">
            Updated at:
          </span>
          <span className="text-gray-600 text-sm ml-1">
            {new Date(question.attributes.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-[10px] justify-start items-start">
        <button
          type="button"
          onClick={() => onEdit(question)}
          className="text-white w-[165px] ml-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
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
          Edit Question
        </button>
        <button
          type="button"
          onClick={handleQuestionDelete}
          className="text-white w-[180px] mx-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center bg-red-600 hover:bg-red-700 focus:ring-red-800"
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
          Delete Question
        </button>
      </div>
    </div>
  );
};
