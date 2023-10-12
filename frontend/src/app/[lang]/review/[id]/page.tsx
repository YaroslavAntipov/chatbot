"use client";

import {
  useAddAnswerMutation,
  useGetChatbotQuery,
  useGetQuestionsQuery,
} from "@/store/api/authApi";
import {
  IAnswer,
  IQuestion,
  IQuestionChoices,
  IStrapi,
  IType,
} from "@/store/interface";
import React, { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import { HistoryEntry } from "../../components/HistoryEntry";
import Loader from "../../components/Loader";
import { NoItems } from "../../components/NoItems";
import { QuestionChoice } from "../../components/QuestionChoice";
import { TYPE } from "../../utils/constants";

interface IProps {
  params: {
    id: number;
    lang: string;
  };
}

export interface IAddAnswer {
  question: number;
  short_answer?: string;
  true_false_answer?: string;
  question_choices_answers?: number[];
  user: string;
  question_type: IStrapi<IType>;
  chatbot: number;
}

export interface IHistory {
  question?: IQuestion;
  answer?: IAnswer;
}

export default function Review({ params }: IProps) {
  const { data: chatbot, isLoading: isChatbotLoading } = useGetChatbotQuery(
    { id: params.id },
    { refetchOnMountOrArgChange: true }
  );
  const { data: questions, isLoading: isQuestionsLoading } =
    useGetQuestionsQuery(
      { id: params.id },
      { refetchOnMountOrArgChange: true }
    );
  const [addAnswer, { isLoading: isAddLoading }] = useAddAnswerMutation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [history, setHistory] = useState<IHistory[]>([]);

  const currentUser = useMemo(() => String(Math.random() * 100000), []);

  const currentQuestion = questions?.data[currentQuestionIndex]?.attributes;
  const currentQuestionId = questions?.data[currentQuestionIndex]?.id;

  useEffect(() => {
    if (currentQuestionId) {
      setHistory([...history, { question: currentQuestion }]);
    }
  }, [currentQuestionId]);

  if (isQuestionsLoading || isChatbotLoading || isAddLoading) {
    return <Loader />;
  }

  if (!chatbot?.data) {
    return (
      <NoItems
        title="This Chatbot doesn't exist"
        subtitle="Please check the url you use"
      />
    );
  }

  if (!chatbot?.data.attributes.active) {
    return (
      <NoItems
        title="This Chatbot is not active"
        subtitle="Please make sure you are allowed to answer"
      />
    );
  }

  if (!questions?.data.length) {
    return (
      <>
        <div className="p-4 bg-gray-700">
          <h3 className="text-lg">{chatbot?.data?.attributes?.name}</h3>
          <span className="text-sm text-gray-400">{`by ${chatbot?.data?.attributes?.creator?.data?.attributes?.username}`}</span>
        </div>
        <NoItems
          title="No Questions"
          subtitle="Please wait till answers will be added"
        />
      </>
    );
  }

  const handleAnswerSubmit = async (event: any) => {
    event.preventDefault();
    if (
      currentQuestion?.type.data.attributes.name === TYPE.MULTIPLE_RESPONSE &&
      ![...(event.target?.multipleChoice || [])].filter((item) => item.checked)
        .length
    ) {
      return alert("Please select one value!");
    }

    try {
      const answer = await addAnswer({
        user: currentUser,
        chatbot: chatbot?.data.id,
        short_answer: event.target?.shortAnswer?.value,
        true_false_answer: event.target?.trueFalse?.value,
        question_choices_answers: event.target?.multipleChoice?.length
          ? [...(event.target?.multipleChoice || [])]
              .filter((item) => item.checked)
              .map((item) => Number(item.value))
          : [],
        question: currentQuestionId!,
        question_type: currentQuestion?.type.data!,
      }).unwrap();

      const [lastItem, ...items] = history.reverse();
      setHistory([...items, { ...lastItem, answer: answer.data.attributes }]);
      setCurrentQuestionIndex((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-md flex flex-col items-between h-[500px]">
      <div className="p-4 bg-gray-700">
        <h3 className="text-lg">{chatbot?.data?.attributes?.name}</h3>
        <span className="text-sm text-gray-400">{`by ${chatbot?.data?.attributes?.creator?.data?.attributes?.username}`}</span>
      </div>
      <div className="grow overflow-y">
        <div>
          {history?.map((historyEntry, index) => (
            <HistoryEntry key={index} {...historyEntry} />
          ))}
        </div>
      </div>
      {currentQuestionIndex + 1 <= questions.data.length ? (
        <>
          {currentQuestion?.type.data.attributes.name === TYPE.TRUE_FALSE && (
            <form
              onSubmit={handleAnswerSubmit}
              className="flex justify-between p-2"
            >
              <div className="flex items-center ml-4">
                <input
                  type="radio"
                  name="trueFalse"
                  value="true"
                  required
                  className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-600 focus:ring-2 bg-gray-700 border-gray-600"
                />
                <label className="ml-2 mr-4 text-sm font-medium text-gray-300">
                  True
                </label>
                <input
                  type="radio"
                  name="trueFalse"
                  value="false"
                  required
                  className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-600 focus:ring-2 bg-gray-700 border-gray-600"
                />
                <label className="ml-2 text-sm font-medium text-gray-300">
                  False
                </label>
              </div>
              <button
                className="p-2 bg-gray-500 rounded-md hover:bg-gray-700"
                type="submit"
              >
                Send
              </button>
            </form>
          )}

          {currentQuestion?.type.data.attributes.name === TYPE.SHORT_ANSWER && (
            <form onSubmit={handleAnswerSubmit} className="flex p-2">
              <input
                className="rounded-l-md p-2 grow text-gray-700"
                name="shortAnswer"
                type="text"
                required
                placeholder="Please type"
              />
              <button
                className="p-2 bg-gray-500 rounded-r-md hover:bg-gray-700"
                type="submit"
              >
                Send
              </button>
            </form>
          )}

          {currentQuestion?.type.data.attributes.name ===
            TYPE.MULTIPLE_CHOICE && (
            <form
              onSubmit={handleAnswerSubmit}
              className="flex flex-col justify-between p-2"
            >
              <div className="flex flex-col items-center justify-stretch mb-2">
                {currentQuestion.question_choices.data.map(
                  (questionChoice, index) => (
                    <div
                      className="bg-gray-500 rounded-md py-2 px-4 m-1"
                      key={index}
                    >
                      <input
                        type="radio"
                        name="multipleChoice"
                        required
                        value={questionChoice.id}
                        className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-600 focus:ring-2 bg-gray-700 border-gray-600"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-200">
                        {questionChoice.attributes.name}
                      </label>
                    </div>
                  )
                )}
              </div>
              <button
                className="p-2 bg-gray-500 rounded-md hover:bg-gray-700"
                type="submit"
              >
                Send
              </button>
            </form>
          )}

          {currentQuestion?.type.data.attributes.name ===
            TYPE.MULTIPLE_RESPONSE && (
            <form
              onSubmit={handleAnswerSubmit}
              className="flex flex-col justify-between p-2"
            >
              <div className="flex flex-col items-center justify-stretch mb-2">
                {currentQuestion.question_choices.data.map(
                  (questionChoice, index) => (
                    <div
                      className="bg-gray-500 rounded-md py-2 px-4 m-1"
                      key={index}
                    >
                      <input
                        type="checkbox"
                        name="multipleChoice"
                        value={questionChoice.id}
                        className="w-4 h-4 text-blue-600 bg-gray-100 focus:ring-blue-600 focus:ring-2 bg-gray-700 border-gray-600"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-200">
                        {questionChoice.attributes.name}
                      </label>
                    </div>
                  )
                )}
              </div>
              <button
                className="p-2 bg-gray-500 rounded-md hover:bg-gray-700"
                type="submit"
              >
                Send
              </button>
            </form>
          )}
        </>
      ) : (
        <NoItems title="That's all" subtitle="Thanks for your response!" />
      )}
    </div>
  );
}
