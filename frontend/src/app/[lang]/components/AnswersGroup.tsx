import { IAnswer } from "@/store/interface";
import { Answer } from "./Answer";

export const AnswersGroup = ({ answersGroup }: { answersGroup: IAnswer[] }) => {
  return (
    <div className="flex flex-col p-8 bg-white text-gray-700 rounded-md">
      <div className="flex justify-between">
        <span>Question:</span>
        <span>Answer:</span>
      </div>
      {answersGroup.map((answer: IAnswer) => (
        <Answer answer={answer} />
      ))}
    </div>
  );
};
