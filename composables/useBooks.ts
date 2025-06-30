
import { useRuntimeConfig, useFetch } from '#app';
import { ref, onMounted } from 'vue';

interface Book {
  id: string
  name: string
  author: string
  publishYear: number
  category: string
  ratings: { source: string; value: number }[]
}

export function useBooks() {
  const config = useRuntimeConfig();
  const apiUrl = config.public.NUXT_PUBLIC_API_URL as string;

  const books = ref<Book[] | null>(null);
  const loading = ref(false);
  const error = ref<any>(null);

  const fetchBooks = async () => {
    loading.value = true;
    error.value = null;
    try {
      books.value = await $fetch(apiUrl);
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  // Fetch on composable use
  onMounted(fetchBooks);

  return {
    books,
    loading,
    error,
    fetchBooks
  };
}
