'use client';
import { useState } from "react";
import { fetchBookByISBN } from "@/lib/utils/api";
import { Book } from "@/types/books";
import Image from "next/image";
import { Search, BookOpen, Users, Building2, Calendar } from "lucide-react";

export default function Home() {
  const [isbn, setIsbn] = useState<string>("");
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string>("");

  const handleSearch = async () => {
  setError("");
  setBook(null);

  const trimmedIsbn = isbn.trim().replace(/[^0-9Xx]/g, ""); 
  if (!trimmedIsbn) {
    setError("Please enter a valid ISBN");
    return;
  }

  try {
    const data = await fetchBookByISBN(trimmedIsbn);
    setBook(data);
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message || "Failed to fetch book");
    } else {
      setError("Unexpected error occurred");
    }
  }
};



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 via-purple-50 to-blue-50 p-6">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-purple-600 text-white p-3 rounded-2xl shadow-lg">
            <BookOpen size={28} />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          ISBN Book Finder
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Discover detailed information about any book using its ISBN
        </p>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Enter ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleSearch}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
        >
          Search Book
        </button>
      </div>

      {error && (
        <p className="text-red-500 mt-4 font-medium">{error}</p>
      )}

      {book && (
        <div className="mt-10 w-full max-w-xl bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col items-center p-6">
            {book.cover ? (
              <Image
                src={book.cover}
                alt={book.title}
                width={180}
                height={260}
                className="rounded-md shadow-md mb-6"
              />
            ) : (
              <div className="w-[180px] h-[260px] bg-gray-200 rounded-md mb-6 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              {book.title}
            </h2>

            <div className="w-full space-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <Users size={18} className="text-purple-600" />
                <span className="font-semibold">Authors:</span>{" "}
                {book.authors.join(", ")}
              </p>
              <p className="flex items-center gap-2">
                <Building2 size={18} className="text-blue-600" />
                <span className="font-semibold">Publishers:</span>{" "}
                {book.publishers.join(", ")}
              </p>
              <p className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-600" />
                <span className="font-semibold">Publish Date:</span>{" "}
                {book.publish_date}
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="mt-8 text-sm text-gray-500">
        Try searching with ISBN:{" "}
        <span className="font-mono">0451526538</span>
      </p>
    </div>
  );
}
