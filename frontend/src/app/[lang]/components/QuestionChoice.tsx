import { IQuestionChoices } from "@/store/interface";

export const QuestionChoice = ({
  name,
  is_correct,
  onDelete,
}: Omit<IQuestionChoices, 'is_correct'> & { onDelete?: (arg: IQuestionChoices) => void, is_correct?: boolean }) => {
  return (
    <div className="flex text-gray-300 justify-between items-center bg-gray-500 px-3 py-1 my-2 rounded-md">
      <span>{name}</span>
      <div className="flex">
        {(is_correct === true || is_correct === false) && (
          <span className="flex gap-[5px] items-center">
            Is Correct?
            {is_correct ? (
              <svg
                className="w-4 h-4 mt-0.5"
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
                  d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 mt-0.5"
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
                  d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
          </span>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete({ name, is_correct: Boolean(is_correct) })}
            className="ml-2 flex bg-red-700 p-2 text-white rounded-md hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 border-none"
          >
            <svg
              className="w-4 h-4 mt-1 mr-2"
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
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
