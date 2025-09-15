import axios from "axios";
import { Book } from "@/types/books";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchBookByISBN = async (isbn: string): Promise<Book> => {
  const response = await axios.get<Book>(`${API_BASE_URL}/books/?isbn=${isbn}`);
  return response.data;
};
