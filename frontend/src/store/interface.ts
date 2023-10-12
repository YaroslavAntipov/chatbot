import { TYPE } from "@/app/[lang]/utils/constants";

export interface IUser {
  id: number;
  username: string;
  pricingPlan: string;
  email: string;
}

export interface IType {
  id: number;
  name: TYPE;
}

export interface IQuestionChoices {
  name: string;
  is_correct: boolean;
}

export interface IStrapiStore {
  isAuthenticated: boolean;
  jwt: string;
  user: IUser;
}

export interface IResponse<IData> {
  data: IData;
  meta: {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    };
  };
}

export interface IResponses<IData> {
  data: IData[];
  meta: {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    };
  };
}

export interface IStrapi<IData> {
  id: number;
  attributes: IData & {
    createdAt: string;
    publishedAt: string;
    updatedAt: string;
  };
}

export type IQuestion = {
  order: number;
  name: string;
  correct_answer: string;
  type: IResponse<IStrapi<IType>>;
  question_choices: IResponses<IStrapi<IQuestionChoices>>;
  chatbot: IChatbot
};

export type IChatbot = {
  active: boolean;
  name: string;
  creator: { data: IStrapi<IUser> };
  questions: { data: IStrapi<IQuestion>[] };
};

export type IAnswer = {
  short_answer: string;
  true_false_answer: boolean;
  question_choices_answers: IResponses<IStrapi<IQuestionChoices>>;
  question: IResponse<IStrapi<IQuestion>>;
  user: string;
  question_type: IResponse<IStrapi<IType>>;
}