
import { useRuntimeConfig, useFetch } from '#app';

interface Book {
  id: string
  name: string
  author: string
  publishYear: number
  category: string
  ratings: { source: string; value: number }[]
}

export function useBooks() {
const apiUrl = "https://63c10327716562671870f959.mockapi.io/books"; // useFetch returns refs: data, pending, error, refresh
  const { data, pending, error, refresh } = useFetch<Book[]>(apiUrl, {
    key: 'books-list',
    server: true,
    lazy: false,
    default: () => []
  });

  return {
    books: data,
    loading: pending,
    error,
    fetchBooks: refresh // keep API compatible with old usage
  };
}
