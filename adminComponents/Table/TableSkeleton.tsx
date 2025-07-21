const TableSkeleton = () => {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className=" animate-pulse h-24 w-full bg-gray-200 rounded-lg"
        ></div>
      ))}
      </>
  );
};

export default TableSkeleton;
