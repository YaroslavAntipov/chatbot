import { IAnswer } from "@/store/interface";
import { TYPE } from "../utils/constants";
import { QuestionChoice } from "./QuestionChoice";

export const Answer = ({ answer }: { answer: IAnswer }) => {
  console.log(answer);
  const type = answer.question_type?.data?.attributes?.name;
  return (
    <div className="flex justify-between">
      <span className="text-gray-800 text-sm font-semibold">{`${
        answer.question?.data?.attributes?.order || ""
      }. ${answer.question?.data?.attributes?.name || ""}`}</span>
      <span></span>
      <span className="text-gray-600 text-sm ml-1">
        {type === TYPE.TRUE_FALSE && String(answer.true_false_answer)}
        {type === TYPE.SHORT_ANSWER && String(answer.short_answer)}
        {(type === TYPE.MULTIPLE_CHOICE || type === TYPE.MULTIPLE_RESPONSE) &&
          answer.question_choices_answers?.data?.map((questionChoice) => (
            <QuestionChoice name={questionChoice?.attributes?.name} />
          ))}
      </span>
    </div>
  );
};
