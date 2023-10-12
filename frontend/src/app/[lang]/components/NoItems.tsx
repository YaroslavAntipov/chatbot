export const NoItems = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="w-full h-[250px] flex flex-col justify-center items-center">
      <svg
        className="w-10 h-10 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        ></path>
      </svg>
      <h3 className="font-semibold mt-1 text-gray-300">{title}</h3>
      <p className="mt-1 mx-4 text-gray-400">{subtitle}</p>
    </div>
  );
};
