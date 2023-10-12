import { IEditChatbotForm } from "@/app/[lang]/chatbot/[id]/page";
import { INewChatbotForm } from "@/app/[lang]/chatbots/page";
import { IAddEditQuestionForm } from "@/app/[lang]/components/AddEditQuestionModal";
import { IAddAnswer } from "@/app/[lang]/review/[id]/page";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IUser,
  IChatbot,
  IResponses,
  IQuestion,
  IStrapi,
  IType,
  IResponse,
  IQuestionChoices,
  IAnswer,
} from "../interface";
import { RootState } from "../store";

// API endpoint for fetching data
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_STRAPI_API_URL,
    prepareHeaders: (headers, api) => {
      const state = (api.getState() as RootState).main;

      headers.set("Authorization", `Bearer ${state.jwt}`);

      return headers;
    },
  }),
  tagTypes: ["USER", "CHATBOTS", "QUESTIONS", "QUESTION_TYPES", "ANSWERS"],
  endpoints: (builder) => ({
    getUser: builder.query<IUser, void>({
      query: () => ({
        url: "/api/users/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),
    updatePricingPlan: builder.mutation<
      IUser,
      { pricingPlan: string; id: number }
    >({
      query: ({ pricingPlan, id }) => ({
        url: `/api/users/${id}`,
        method: "PUT",
        body: { pricingPlan },
      }),
      invalidatesTags: ["USER"],
    }),
    getChatbots: builder.query<IResponses<IStrapi<IChatbot>>, { id: number }>({
      query: ({ id }) => ({
        url: `/api/chatbots?populate=*&filters[creator][id][$eq]=${id}&sort[0]=createdAt:desc&sort[1]=updatedAt:desc`,
        method: "GET",
      }),
      providesTags: ["CHATBOTS"],
    }),
    getChatbot: builder.query<IResponse<IStrapi<IChatbot>>, { id: number }>({
      query: ({ id }) => ({
        url: `/api/chatbots/${id}?populate=*`,
        method: "GET",
      }),
      providesTags: ["CHATBOTS"],
    }),
    getQuestions: builder.query<IResponses<IStrapi<IQuestion>>, { id: number }>(
      {
        query: ({ id }) => ({
          url: `/api/questions?populate=*&filters[chatbot][id][$eq]=${id}&sort=order`,
          method: "GET",
        }),
        providesTags: ["QUESTIONS"],
      }
    ),
    updateChatbot: builder.mutation<
      IResponse<IStrapi<IChatbot>>,
      IEditChatbotForm & { id: number }
    >({
      query: ({ id, ...data }) => ({
        url: `/api/chatbots/${id}`,
        method: "PUT",
        body: { data },
      }),
      invalidatesTags: ["CHATBOTS"],
    }),
    deleteChatbot: builder.mutation<
      IResponse<IStrapi<IChatbot>>,
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/api/chatbots/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CHATBOTS"],
    }),
    addNewChatbot: builder.mutation<void, INewChatbotForm>({
      query: (data) => ({
        url: `/api/chatbots`,
        method: "POST",
        body: { data },
      }),
      invalidatesTags: ["CHATBOTS"],
    }),
    updateQuestion: builder.mutation<
      IResponse<IStrapi<IQuestion>>,
      IAddEditQuestionForm & { id: number }
    >({
      query: ({ id, type, ...data }) => ({
        url: `/api/questions/${id}`,
        method: "PUT",
        body: {
          data,
          type: { set: [type?.id!] },
          question_choices: { set: [] },
        },
      }),
      invalidatesTags: ["QUESTIONS"],
    }),
    addQuestion: builder.mutation<
      IResponse<IStrapi<IQuestion>>,
      IAddEditQuestionForm
    >({
      query: ({ type, chatbot, ...data }) => ({
        url: "/api/questions",
        method: "POST",
        body: {
          data: {
            ...data,
            chatbot: { connect: [chatbot] },
            type: { connect: [type?.id!] },
          },
        },
      }),
      invalidatesTags: ["QUESTIONS"],
    }),
    addQuestionChoice: builder.mutation<
      IQuestion,
      IQuestionChoices & { question: number }
    >({
      query: ({ question, ...data }) => ({
        url: "/api/question-choices",
        method: "POST",
        body: { data: { ...data, question: { connect: [question] } } },
      }),
      invalidatesTags: ["QUESTIONS"],
    }),
    deleteQuestionChoice: builder.mutation<IQuestion, number>({
      query: (id) => ({
        url: `/api/question-choices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["QUESTIONS"],
    }),
    deleteQuestion: builder.mutation<IQuestion, { id: number }>({
      query: ({ id }) => ({
        url: `/api/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["QUESTIONS"],
    }),
    getQuestionTypes: builder.query<IResponses<IStrapi<IType>>, void>({
      query: () => ({
        url: `/api/question-types`,
        method: "GET",
      }),
      providesTags: ["QUESTION_TYPES"],
    }),
    addAnswer: builder.mutation<IResponse<IStrapi<IAnswer>>, IAddAnswer>({
      query: ({
        question,
        question_type,
        question_choices_answers,
        chatbot,
        ...data
      }) => ({
        url: `/api/question-answers?populate=*`,
        method: "POST",
        body: {
          data: {
            ...data,
            chatbot: { connect: [chatbot] },
            question: { connect: [question] },
            question_type: { connect: [question_type.id] },
            question_choices_answers: { connect: question_choices_answers },
          },
        },
      }),
    }),
    getAnswers: builder.query<IResponses<IStrapi<IAnswer>>, { id: number }>({
      query: ({ id }) => ({
        url: `/api/question-answers?populate=*&filters[chatbot][id][$eq]=${id}&sort=user`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdatePricingPlanMutation,
  useGetChatbotsQuery,
  useGetChatbotQuery,
  useAddNewChatbotMutation,
  useUpdateChatbotMutation,
  useDeleteChatbotMutation,
  useGetQuestionsQuery,
  useAddQuestionMutation,
  useAddQuestionChoiceMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetQuestionTypesQuery,
  useDeleteQuestionChoiceMutation,
  useAddAnswerMutation,
  useGetAnswersQuery,
} = authApi;
