import SortableImageGrid from "../components/SortableImageGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-red-100">
      <div className="bg-yellow-100">
        <div className="max-w-4xl mx-auto bg-green-300 p-4 mt-[100px] ">
          <h1 className="text-3xl font-bold mb-6 text-center mb-[30px]">
            Görselleri Sürükleyerek Sırala
          </h1>
          <SortableImageGrid />
        </div>
      </div>
    </main>
  );
}
