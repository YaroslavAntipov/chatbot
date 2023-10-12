import { IHistory } from "../review/[id]/page";
import { TYPE } from "../utils/constants";

export const HistoryEntry = (history: IHistory) => {
  if (history.question?.type.data.attributes.name === TYPE.TRUE_FALSE) {
    return (
      <div className="flex flex-col">
        <p className="m-[10px] p-[10px] m-w-[200px] rounded-md text-black bg-gray-300 self-start">
          {history.question?.name}
        </p>
        {history.answer && (
          <p className="m-[10px] p-[10px] m-w-[200px] rounded-md text-white bg-blue-500 self-end">
            You selected: {String(history.answer?.true_false_answer)}
          </p>
        )}
        {history?.answer && history?.question?.correct_answer && (
          <p className="m-[10px] p-[10px] m-w-[200px] rounded-md text-black bg-gray-300 self-start">
            Correct Answer was: {history.question.correct_answer}
          </p>
        )}
      </div>
    );
  }

  if (history.question?.type.data.attributes.name === TYPE.SHORT_ANSWER) {
    return (
      <div className="flex flex-col">
        <p className="m-[10px] p-[10px] m-w-[200px] rounded-md text-black bg-gray-300 self-start">
          {history.question?.name}
        </p>
        {history.answer && (
          <p className="m-[10px] p-[10px] m-w-[200px] rounded-md text-white bg-blue-500 self-end">
            {history.answer?.short_answer}
          </p>
        )}
        {history?.answer && history?.question?.correct_answer && (
          <p className="m-[10px] p-[10px] m-w-[200px] rounded-md text-black bg-gray-300 self-start">
            Correct Answer was: {history.question.correct_answer}
          </p>
        )}
      </div>
    );
  }

  if (
    history.question?.type.data.attributes.name === TYPE.MULTIPLE_CHOICE ||
    history.question?.type.data.attributes.name === TYPE.MULTIPLE_RESPONSE
  ) {
    const correctChoices = history?.question?.question_choices.data.filter(
      (questionChoice) => questionChoice.attributes.is_correct
    );
    return (
      <div className="flex flex-col">
        <p className="m-[10px] p-[10px] m-w-[200px] rounded-md text-black bg-gray-300 self-start">
          {history.question?.name}
        </p>
        {history.answer &&
          history.answer?.question_choices_answers.data.map(
            (questionChoice) => (
              <p
                key={questionChoice.id}
                className="m-[10px] p-[10px] m-w-[200px] rounded-md text-white bg-blue-500 self-end"
              >
                {questionChoice.attributes.name}
              </p>
            )
          )}
        {history?.answer && correctChoices.length && (
          <>
            <span>{`Correct Answer${
              correctChoices.length > 1 ? "s" : ""
            } was:`}</span>
            {correctChoices.map((correctChoice) => (
              <p
                key={correctChoice.id}
                className="m-[10px] p-[10px] m-w-[200px] rounded-md text-black bg-gray-300 self-start"
              >
                {correctChoice.attributes.name}
              </p>
            ))}
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <p className="m-[10px] p-[10px] m-w-[200px] rounded-md text-black bg-gray-300 self-start">
        {history.question?.name}
      </p>
    </div>
  );
};
