import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBooks } from '../composables/useBooks';
import { nextTick } from 'vue';

// Mock Nuxt's useRuntimeConfig for the composable
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      NUXT_PUBLIC_API_URL: 'http://mocked-api-url.test'
    }
  })
}));

describe('useBooks composable', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches books successfully', async () => {
    const mockBooks = [
      { id: '1', name: 'Book 1', author: 'Author 1', publishYear: 2020, category: 'Fiction', ratings: [] },
      { id: '2', name: 'Book 2', author: 'Author 2', publishYear: 2021, category: 'Nonfiction', ratings: [] }
    ];
    globalThis.$fetch = vi.fn().mockResolvedValueOnce(mockBooks);
    const { books, loading, error, fetchBooks } = useBooks();
    await fetchBooks();
    await nextTick();
    expect(globalThis.$fetch).toHaveBeenCalledWith('http://mocked-api-url.test');
    expect(books.value).toEqual(mockBooks);
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it('handles fetch error', async () => {
    globalThis.$fetch = vi.fn().mockRejectedValueOnce(new Error('API error'));
    const { books, loading, error, fetchBooks } = useBooks();
    await fetchBooks();
    await nextTick();
    expect(globalThis.$fetch).toHaveBeenCalledWith('http://mocked-api-url.test');
    expect(books.value).toBeNull();
    expect(loading.value).toBe(false);
    expect(error.value).toBeInstanceOf(Error);
    expect(error.value.message).toBe('API error');
  });
});
