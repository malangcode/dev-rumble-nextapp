"use client";

export default function HomePageSkeleton() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-12 flex flex-col items-center justify-center text-center animate-pulse">
      <div className="max-w-4xl w-full">
        <div className="h-10 sm:h-12 bg-blue-200 rounded w-2/3 mx-auto mb-4"></div>
        <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>

        <div className="w-full flex justify-center mb-10">
          <div className="w-[500px] h-[300px] bg-gray-200 rounded-xl"></div>
        </div>

        <div className="space-x-4 mb-8 flex justify-center">
          <div className="w-32 h-10 bg-gray-300 rounded-md"></div>
          <div className="w-32 h-10 bg-gray-300 rounded-md"></div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 w-full max-w-5xl mt-8 px-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-3 items-center"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
            <div className="w-1/2 h-5 bg-gray-300 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded mt-2"></div>
            <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      <div className="mt-16 w-2/3 h-4 bg-gray-300 rounded"></div>
    </section>
  );
}