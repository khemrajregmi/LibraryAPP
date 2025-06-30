<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <HeaderComponent @openAddModal="showAddModal = true" />

    <main class="flex-1 container mx-auto py-8 px-4">
      <div class="flex flex-row items-center mb-4 gap-2 justify-between">
        <div class="flex flex-row items-center gap-2">
          <label for="search" class="sr-only">Search Books</label>
          <input id="search" v-model="search" type="text" placeholder="Filter books..." class="border rounded px-3 py-2 w-64 focus:outline-none focus:ring focus:border-blue-300" aria-label="Search Books" />
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center" @click="showAddModal = true">
          <span class="material-icons align-middle mr-1">add</span>
          Add a Book
        </button>
      </div>
      <div class="table-wrapper">
        <div class="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
          <div class="table-container" style="max-height: 700px;">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200"><input type="checkbox" aria-label="Select All Books" /></th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">ID</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Name</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Author</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Genre</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Published Year</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Ratings</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <template v-if="loading || isRefreshing">
                  <tr>
                    <td colspan="8" class="italic text-gray-400 py-2 px-4 border-b bg-white text-center">
                      <SkeletonLoader />
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <template v-for="(interval, idx) in decadeIntervalsFiltered" :key="idx">
                    <tr class="bg-gray-50">
                      <td colspan="8" class="font-semibold py-2 px-4 border-t border-b text-blue-700 bg-gray-50 text-left" aria-label="Decade Interval">{{ interval.label }}</td>
                    </tr>
                    <tr v-if="!interval.books.length">
                      <td colspan="8" class="italic text-gray-400 py-2 px-4 border-b bg-white text-center">No publications</td>
                    </tr>
                    <tr v-for="(book, bIdx) in interval.books.slice(0, recordsPerPage)" :key="book.id" class="hover:bg-blue-50 transition">
                      <td class="px-4 py-3"><input type="checkbox" aria-label="Select Book" /></td>
                      <td class="px-4 py-3">{{ book.id || bIdx + 1 }}</td>
                      <td class="px-4 py-3 flex items-center gap-3">
                        <span class="inline-flex w-8 h-8 rounded-full bg-gray-200 items-center justify-center text-gray-500 font-bold mr-3 text-base align-middle" aria-hidden="true">
                          <span class="m-auto">{{ book.name ? book.name.charAt(0).toUpperCase() : '?' }}</span>
                        </span>
                        <div>
                          <div class="font-medium text-gray-900">{{ book.name }}</div>
                          <div class="text-xs text-gray-500">@{{ book.author }}</div>
                        </div>
                      </td>
                      <td class="px-4 py-3">{{ book.author }}</td>
                      <td class="px-4 py-3">
                        <span class="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{{ book.category }}</span>
                      </td>
                      <td class="px-4 py-3">{{ formatYear(book.publishYear) }}</td>
                      <td class="px-4 py-3">
                        <span v-if="book.ratings && book.ratings.length">
                          <span v-for="(rating, rIdx) in book.ratings" :key="rIdx">
                            <span class="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 mr-1" aria-label="Rating from {{ rating.source }}">{{ rating.source }}: {{ rating.value }}</span>
                          </span>
                        </span>
                        <span v-else>-</span>
                      </td>
                      <td class="px-4 py-3 text-right">
                        <button class="text-gray-400 hover:text-gray-700 transition" aria-label="More Options"><span class="material-icons">more_vert</span></button>
                      </td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <FooterComponent />

    <AddBookModal
      :show="showAddModal"
      :form="addForm"
      :error="addFormError"
      @close="closeAddModal"
      @submit="handleAddBookSubmit"
    />

    <div v-if="successMessage" class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">{{ successMessage }}</div>
    <div v-if="errorMessage" class="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">{{ errorMessage }}</div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBooks } from '../composables/useBooks';


import HeaderComponent from '../components/AppHeader.vue';
import FooterComponent from '../components/AppFooter.vue';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import { defineAsyncComponent } from 'vue';
const AddBookModal = defineAsyncComponent(() => import('../components/AddBookModal.vue'));

const { books, loading, error, fetchBooks } = useBooks();
const search = ref('');
const showAddModal = ref(false);
const addForm = ref({
  name: '',
  author: '',
  publishYear: '',
  category: '',
  ratings: {
    Goodreads: 0,
    'Barnes & Noble': 0,
    Amazon: 0,
  },
});
const addFormError = ref('');
const recordsPerPage = ref(20);
const props = defineProps({
  title: String,
});
const isRefreshing = ref(false);

useHead({
  title: 'My Book Library',
  meta: [
    { name: 'description', content: 'Manage and browse your personal book collection with ease.' }
  ]
})

function groupBooksByDecade(books) {
  if (!Array.isArray(books) || !books.length) return [];
  const years = books.map((b) => b.publishYear).filter(Boolean);
  const maxYear = Math.max(...years, 2030); // Ensure maxYear includes 2030
  const minYear = Math.min(...years);
  const intervals = [];
  let start = Math.floor(maxYear / 10) * 10;
  let end = start - 9;
  let idx = 0;
  while (start >= minYear) {
    const booksInInterval = books
      .filter((b) => b.publishYear >= end && b.publishYear <= start)
      .sort((a, b) => b.publishYear - a.publishYear);
    intervals.push({ start, end, books: booksInInterval });
    start -= 10;
    end -= 10;
    idx++;
  }
  // Handle empty intervals and combine consecutive empty intervals
  const result = [];
  let emptyStart = null;
  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    if (!interval.books.length) {
      if (emptyStart === null) emptyStart = i;
    } else {
      if (emptyStart !== null) {
        // Combine empty intervals
        const first = intervals[emptyStart];
        const last = intervals[i - 1];
        result.push({
          label: `${Math.abs(last.start)}-${Math.abs(first.end)} ${last.start >= 0 ? 'AD' : 'BC'}`,
          books: [],
        });
        emptyStart = null;
      }
      result.push({
        label: `${Math.abs(interval.start)}-${Math.abs(interval.end)} ${interval.start >= 0 ? 'AD' : 'BC'}`,
        books: interval.books,
      });
    }
  }
  if (emptyStart !== null) {
    const first = intervals[emptyStart];
    const last = intervals[intervals.length - 1];
    result.push({
      label: `${first.start}-${last.end}`,
      books: [],
    });
  }
  return result;
}

const decadeIntervals = computed(() => groupBooksByDecade(books.value));
const decadeIntervalsFiltered = computed(() => {
  if (!search.value) return decadeIntervals.value;
  const searchTerm = search.value.toLowerCase();
  return decadeIntervals.value.map((interval) => ({
    ...interval,
    books: interval.books.filter((book) => {
      const nameMatch = book.name?.toLowerCase().includes(searchTerm);
      const authorMatch = book.author?.toLowerCase().includes(searchTerm);
      const genreMatch = book.category?.toLowerCase().includes(searchTerm);
      const yearMatch = book.publishYear?.toString().includes(searchTerm);
      return nameMatch || authorMatch || genreMatch || yearMatch;
    }),
  }));
});

function formatYear(year) {
  return year.toString();
}

function closeAddModal() {
  showAddModal.value = false;
}

async function handleAddBookSubmit(event) {
  if (event.success) {
    showSuccessMessage(event.message);
  } else {
    showErrorMessage(event.message);
  }
  isRefreshing.value = true; // Start refreshing
  await fetchBooks(); // Refresh the book list after a new book is added
  isRefreshing.value = false; // Stop refreshing
}

const successMessage = ref('');
const errorMessage = ref('');

function showSuccessMessage(message) {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
}

function showErrorMessage(message) {
  errorMessage.value = message;
  setTimeout(() => {
    errorMessage.value = '';
  }, 3000);
}
</script>

<style scoped>
.table-container {
  max-height: 400px;
  overflow-y: auto;
}

.table-container thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}

.fixed {
  position: fixed;
  right: 1rem;
  z-index: 1050;
}

.bg-green-500 {
  background-color: #28a745 !important;
}

.bg-red-500 {
  background-color: #dc3545 !important;
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #28a745; /* Green color */
  color: white;
  padding: 1rem;
  border-radius: 5px;
  z-index: 1050; /* Ensure it appears above modal and table */
}
</style>
