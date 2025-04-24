import SortableImageGrid from "../components/SortableImageGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-red-100 pl-[20px] pr-[20px]">
      <header className="flex justify-between h-[70px] pl-[10px] items-center p-4 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white shadow-lg rounded-xl mx-4 my-6 border border-zinc-200 dark:border-zinc-700 transition-all">
        <div className="flex items-center gap-3">
          <span className="font-700 text-4xl">TOK Software</span>
        </div>
        <h2 className="text-xl font-semibold text-center">
          Image Dragging Operations
        </h2>
        <div className="flex items-center gap-4"></div>
      </header>

      <div className="bg-yellow-100">
        <div className="max-w-4xl mx-auto bg-green-300 p-4 mt-[100px] ">
          <SortableImageGrid />
        </div>
      </div>
    </main>
  );
}
