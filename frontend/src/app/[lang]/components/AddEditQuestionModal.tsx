"use client";

import {
  useAddQuestionChoiceMutation,
  useAddQuestionMutation,
  useDeleteQuestionChoiceMutation,
  useGetQuestionsQuery,
  useGetQuestionTypesQuery,
  useUpdateQuestionMutation,
} from "@/store/api/authApi";
import { IQuestion, IQuestionChoices, IStrapi, IType } from "@/store/interface";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import Modal from "./Modal";
import { TYPE } from "../utils/constants";
import { QuestionChoice } from "./QuestionChoice";
import { useState } from "react";
import { useEffect } from "react";

export interface IAddEditQuestionForm {
  chatbot: number;
  name: string;
  type?: IType;
  correct_answer: string;
  order: number;
  question_choices: IQuestionChoices[];
}

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  type: yup
    .object()
    .shape({ name: yup.string() })
    .default(undefined)
    .required("Question Type is required"),
  question_choices: yup
    .array()
    .test("is-unique", "Items must be unique by Name", function (values) {
      const names = values?.map((item) => item.name) || [];
      const uniqueNames = [...new Set(names)];

      return names.length === uniqueNames.length;
    })
    .test(
      "only-one-correct",
      "Multiple choice question should have only 1 correct choice",
      function (values) {
        if (this.parent.type.name === TYPE.MULTIPLE_CHOICE) {
          return (
            (values?.filter((item) => item?.is_correct) || []).length === 1
          );
        }

        return true;
      }
    )
    .default(undefined)
    .required("Question Choice is required"),
});

export enum QuestionVariant {
  ADD = "ADD",
  EDIT = "EDIT",
}

export const AddQuestionModal = ({
  isOpen,
  chatbotId,
  variant,
  question,
  setIsOpen,
}: {
  isOpen: boolean;
  chatbotId: number;
  variant: QuestionVariant;
  question: IStrapi<IQuestion> | null;
  setIsOpen: (arg: boolean) => void;
}) => {
  const [newQuestionChoiceName, setNewQuestionChoiceName] = useState("");
  const [newQuestionChoiceIsCorrect, setNewQuestionIsCorrect] = useState(false);

  const { data: questions, isLoading: isQuestionsLoading } =
    useGetQuestionsQuery(
      { id: chatbotId },
      { refetchOnMountOrArgChange: true }
    );
  const { data: types, isLoading: isQuestionTypesLoading } =
    useGetQuestionTypesQuery();

  const [addQuestion, { isLoading: isAddLoading }] = useAddQuestionMutation();
  const [updateQuestion, { isLoading: isUpdateLoading }] =
    useUpdateQuestionMutation();
  const [addQuestionChoice, { isLoading: isAddQuestionChoiceLoading }] =
    useAddQuestionChoiceMutation();
  const [deleteQuestionChoice, { isLoading: isDeleteQuestionChoiceLoading }] =
    useDeleteQuestionChoiceMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    resetField,
    watch,
    setValue,
  } = useForm<IAddEditQuestionForm>({
    // @ts-ignore
    resolver: yupResolver(schema),
  });

  const isTrueFalse = watch("type")?.name === TYPE.TRUE_FALSE;
  const isShortAnswer = watch("type")?.name === TYPE.SHORT_ANSWER;
  const isMultipleChoice = watch("type")?.name === TYPE.MULTIPLE_CHOICE;
  const isMultipleResponse = watch("type")?.name === TYPE.MULTIPLE_RESPONSE;

  useEffect(() => {
    reset({
      name: question?.attributes.name,
      type: question?.attributes.type.data.id
        ? {
            ...question?.attributes.type.data.attributes,
            id: question?.attributes.type.data.id,
          }
        : undefined,
      correct_answer: question?.attributes.correct_answer,
      question_choices: question?.attributes.question_choices.data.map(
        (choice) => choice.attributes
      ),
    });
  }, [question, isQuestionsLoading, isQuestionTypesLoading]);

  const handleAddQuestion: SubmitHandler<IAddEditQuestionForm> = async (
    data
  ) => {
    try {
      if (variant === QuestionVariant.ADD) {
        const newQuestion = await addQuestion({
          name: data.name,
          type: data.type,
          chatbot: chatbotId,
          correct_answer:
            data.type!.name === TYPE.TRUE_FALSE
              ? String(data.correct_answer)
              : data.correct_answer,
          order: (questions?.data?.length || 0) + 1,
          question_choices: [],
        }).unwrap();

        data.question_choices.map(async (questionChoice) => {
          await addQuestionChoice({
            ...questionChoice,
            question: newQuestion.data.id,
          }).unwrap();
        });
      } else if (variant === QuestionVariant.EDIT) {
        const updatedQuestion = await updateQuestion({
          id: question?.id!,
          name: data.name,
          type: data.type,
          chatbot: chatbotId,
          correct_answer:
            data.type!.name === TYPE.TRUE_FALSE
              ? String(data.correct_answer)
              : data.correct_answer,
          order: question?.attributes.order!,
          question_choices: [],
        }).unwrap();

        question?.attributes.question_choices.data.forEach(
          async (questionChoice) => {
            await deleteQuestionChoice(questionChoice.id).unwrap();
          }
        );

        data.question_choices.forEach(async (questionChoice) => {
          await addQuestionChoice({
            ...questionChoice,
            question: updatedQuestion.data.id,
          }).unwrap();
        });
      }

      reset();
      setIsOpen(false);
    } catch (error) {
      return console.error(error);
    }
  };

  return (
    <Modal
      title={
        variant === QuestionVariant.ADD ? "Add New Question" : "EDIT QUESTION"
      }
      isOpen={isOpen}
      isLoading={
        isAddLoading ||
        isUpdateLoading ||
        isQuestionsLoading ||
        isQuestionTypesLoading ||
        isAddQuestionChoiceLoading ||
        isDeleteQuestionChoiceLoading
      }
      onSave={() => handleSubmit(handleAddQuestion)()}
      onClose={() => {
        reset();
        setIsOpen(false);
      }}
    >
      <div className="my-4">
        <div>
          <label htmlFor="Name" className="block w-18 text-gray-300">
            Name
          </label>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                id="Name"
                type="string"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Question Name"
              />
            )}
          />
          <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
        </div>
        <div>
          <label htmlFor="type" className="block w-18 text-gray-300">
            Question Type:
          </label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                onChange={(newValue) => {
                  field.onChange(newValue);
                  setValue("question_choices", []);
                  setValue("correct_answer", "");
                }}
                getOptionLabel={(data) => data.name}
                getOptionValue={(data) => data.name}
                options={types?.data.map((data) => ({
                  ...data.attributes,
                  id: data.id,
                }))}
                isClearable={true}
                menuPortalTarget={document.body}
                placeholder="Question Type"
              />
            )}
          />
          <p className="text-red-500 text-xs mt-1">{errors.type?.message}</p>
        </div>

        {isTrueFalse && (
          <div className="flex">
            <label htmlFor="isActive" className="block w-18 text-gray-300">
              Correct Answer:
            </label>
            <Controller
              name="correct_answer"
              control={control}
              defaultValue="false"
              render={({ field }) => (
                <input
                  id="isActive"
                  type="checkbox"
                  className="h-4 w-4 mt-1 ml-2 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={
                    typeof field.value === "string"
                      ? field.value === "true"
                      : field.value
                  }
                  {...field}
                />
              )}
            />
          </div>
        )}

        {isShortAnswer && (
          <div>
            <label
              htmlFor="correct_answer"
              className="block w-18 text-gray-300"
            >
              Correct Answer:
            </label>
            <Controller
              name="correct_answer"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  id="correct_answer"
                  type="string"
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Correct Answer:"
                />
              )}
            />
            <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
          </div>
        )}

        {(isMultipleChoice || isMultipleResponse) && (
          <>
            <Controller
              name="question_choices"
              control={control}
              render={({ field }) => (
                <>
                  <div>
                    <div className="flex flex-col">
                      <label htmlFor="Name" className="text-gray-300">
                        Question Choice:
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          id="Name"
                          type="string"
                          className="relative grow block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="Question Choice Name"
                          value={newQuestionChoiceName}
                          onChange={(event) =>
                            setNewQuestionChoiceName(event.target.value)
                          }
                        />
                        <div className="flex">
                          <label htmlFor="isActive" className="text-gray-300">
                            Is Correct:
                          </label>
                          <input
                            id="isActive"
                            type="checkbox"
                            className="h-4 w-4 mt-1.5 ml-2 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={newQuestionChoiceIsCorrect}
                            onChange={(event) =>
                              setNewQuestionIsCorrect(event.target.checked)
                            }
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            newQuestionChoiceName &&
                              field.onChange([
                                ...(field.value || []),
                                {
                                  name: newQuestionChoiceName,
                                  is_correct: newQuestionChoiceIsCorrect,
                                },
                              ]);
                            setNewQuestionChoiceName("");
                            setNewQuestionIsCorrect(false);
                          }}
                          className="text-white w-[218px] focus:ring-4 focus:outline-none focus:ring-blue-300 font-small rounded-lg flex py-1 px-3 text-sm text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
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
                          Add New Question Choice
                        </button>
                      </div>
                    </div>
                  </div>

                  {(field.value || []).map((choice) => (
                    <QuestionChoice
                      {...choice}
                      onDelete={({ name }) =>
                        field.onChange(
                          (field.value || []).filter(
                            (data) => data.name !== name
                          )
                        )
                      }
                    />
                  ))}
                </>
              )}
            />

            {errors.question_choices && (
              <p className="text-red-500 text-xs mt-1">{errors.question_choices.message}</p>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
