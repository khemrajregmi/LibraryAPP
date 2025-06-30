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
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <input type="checkbox" aria-label="Select All Books" v-model="selectAll" @change="toggleSelectAll" />
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer" @click="sortBy('id')">
                    ID <span v-if="sortKey === 'id'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer" @click="sortBy('name')">
                    Name <span v-if="sortKey === 'name'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer" @click="sortBy('author')">
                    Author <span v-if="sortKey === 'author'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer" @click="sortBy('category')">
                    Genre <span v-if="sortKey === 'category'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer" @click="sortBy('publishYear')">
                    Published Year <span v-if="sortKey === 'publishYear'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 cursor-pointer" @click="sortBy('ratingAvg')">
                    Ratings <span v-if="sortKey === 'ratingAvg'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
                  </th>
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
                  <template v-for="(interval, idx) in paginatedDecadeIntervals" :key="idx">
                    <tr class="bg-gray-50">
                      <td colspan="8" class="font-semibold py-2 px-4 border-t border-b text-blue-700 bg-gray-50 text-left" aria-label="Decade Interval">{{ interval.label }}</td>
                    </tr>
                    <tr v-if="!interval.books.length">
                      <td colspan="8" class="italic text-gray-400 py-2 px-4 border-b bg-white text-center">No publications</td>
                    </tr>
                    <tr v-for="(book, bIdx) in interval.books" :key="book.id" class="hover:bg-blue-50 transition cursor-pointer" @click="openBookDetails(book)">
                      <td class="px-4 py-3"><input type="checkbox" aria-label="Select Book" v-model="selectedBooks" :value="book.id" @click.stop /></td>
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
                      <td class="px-4 py-3">
                        {{ Math.abs(book.publishYear) }} {{ book.publishYear < 0 ? 'BC' : 'AD' }}
                      </td>
                      <td class="px-4 py-3">
                        <span v-if="book.ratings && book.ratings.length">
                          <span v-for="(rating, rIdx) in book.ratings" :key="rIdx">
                            <span class="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 mr-1" aria-label="Rating from {{ rating.source }}">{{ rating.source }}: {{ rating.value }}</span>
                          </span>
                        </span>
                        <span v-else>-</span>
                      </td>
                      <td class="px-4 py-3 text-right">
                        <button class="text-gray-400 hover:text-gray-700 transition" aria-label="More Options" @click.stop><span class="material-icons">more_vert</span></button>
                      </td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
            <!-- Pagination Controls -->
            <div class="flex justify-between items-center py-4">
              <div>
                <button class="px-3 py-1 rounded bg-gray-200 mr-2" :disabled="currentPage === 1" @click="prevPage">Prev</button>
                <span>Page {{ currentPage }} of {{ totalPages }}</span>
                <button class="px-3 py-1 rounded bg-gray-200 ml-2" :disabled="currentPage === totalPages" @click="nextPage">Next</button>
              </div>
            </div>
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

    <!-- Book Details Modal (styled to match AddBookModal, listing visible) -->
    <template v-if="showBookDetailsModal && bookDetails">
      <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <!-- Light overlay, pointer-events only for modal -->
        <div class="absolute inset-0 bg-gray-900 bg-opacity-10" aria-hidden="true"></div>
        <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative z-10 pointer-events-auto" role="dialog" aria-modal="true" @keydown.esc="closeBookDetails" tabindex="0" @click.self="closeBookDetails">
          <button type="button" @click="closeBookDetails" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700" aria-label="Close modal">
            <span class="material-icons" aria-hidden="true">close</span>
          </button>
          <h2 class="text-xl font-bold mb-4" id="modal-title">Book Details</h2>
          <div class="mb-2"><strong>Name:</strong> {{ bookDetails.name }}</div>
          <div class="mb-2"><strong>Author:</strong> {{ bookDetails.author }}</div>
          <div class="mb-2"><strong>Genre:</strong> {{ bookDetails.category }}</div>
          <div class="mb-2"><strong>Published Year:</strong> {{ Math.abs(bookDetails.publishYear) }} {{ bookDetails.publishYear < 0 ? 'BC' : 'AD' }}</div>
          <div class="mb-2"><strong>Ratings:</strong>
            <span v-if="bookDetails.ratings && bookDetails.ratings.length">
              <span v-for="(rating, idx) in bookDetails.ratings" :key="idx" class="inline-block px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold mr-1">{{ rating.source }}: {{ rating.value }}</span>
            </span>
            <span v-else>-</span>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" @click="closeBookDetails" class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" aria-label="Close">Close</button>
          </div>
        </div>
      </div>
    </template>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useBooks } from '../composables/useBooks';


import HeaderComponent from '../components/AppHeader.vue';
import FooterComponent from '../components/AppFooter.vue';
import SkeletonLoader from '../components/SkeletonLoader.vue';
import { defineAsyncComponent } from 'vue';
const AddBookModal = defineAsyncComponent(() => import('../components/AddBookModal.vue'));

const { books, loading, error, fetchBooks } = useBooks();
const search = ref('');
// Reset to first page when search changes
watch(search, () => {
  currentPage.value = 1;
});
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
const props = defineProps({
  title: String,
});
const isRefreshing = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const selectedBooks = ref([]);
const selectAll = ref(false);
const sortKey = ref('id');
const sortOrder = ref('asc');
const bookDetails = ref(null);
const showBookDetailsModal = ref(false);

useHead({
  title: 'My Book Library',
  meta: [
    { name: 'description', content: 'Manage and browse your personal book collection with ease.' }
  ]
})

// Remove old decadeIntervals, decadeIntervalsFiltered, paginatedBooks, totalBooks, totalPages


// 1. Flatten, filter, and sort all books globally
const allFilteredSortedBooks = computed(() => {
  let allBooks = books.value ? [...books.value] : [];
  // Filter
  if (search.value) {
    const searchTerm = search.value.toLowerCase();
    allBooks = allBooks.filter((book) => {
      const nameMatch = book.name?.toLowerCase().includes(searchTerm);
      const authorMatch = book.author?.toLowerCase().includes(searchTerm);
      const genreMatch = book.category?.toLowerCase().includes(searchTerm);
      const yearMatch = book.publishYear?.toString().includes(searchTerm);
      return nameMatch || authorMatch || genreMatch || yearMatch;
    });
  }
  // Sort
  if (sortKey.value) {
    allBooks.sort((a, b) => {
      let aVal = a[sortKey.value];
      let bVal = b[sortKey.value];
      if (sortKey.value === 'ratingAvg') {
        aVal = a.ratings && a.ratings.length ? a.ratings.reduce((s, r) => s + r.value, 0) / a.ratings.length : 0;
        bVal = b.ratings && b.ratings.length ? b.ratings.reduce((s, r) => s + r.value, 0) / b.ratings.length : 0;
      }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return allBooks;
});

// 2. Group all filtered/sorted books by decade
const allDecadeIntervals = computed(() => groupBooksByDecade(allFilteredSortedBooks.value));

// 3. Flatten grouped books for pagination (preserving decade groupings)
const flattenedBooks = computed(() => {
  return allDecadeIntervals.value.flatMap(interval => interval.books.map(book => ({ ...book, _decadeLabel: interval.label })));
});

const totalBooks = computed(() => flattenedBooks.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalBooks.value / pageSize.value)));

// 4. Paginate the flattened array
const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return flattenedBooks.value.slice(start, start + pageSize.value);
});

// 5. Regroup the paginated books by decade for display
const paginatedDecadeIntervals = computed(() => {
  // Use the _decadeLabel property to group
  const groups = {};
  paginatedBooks.value.forEach(book => {
    const label = book._decadeLabel || 'Unknown';
    if (!groups[label]) groups[label] = [];
    groups[label].push(book);
  });
  // Preserve order from allDecadeIntervals
  return allDecadeIntervals.value
    .filter(interval => groups[interval.label])
    .map(interval => ({
      label: interval.label,
      books: groups[interval.label] || []
    }));
});

// Update toggleSelectAll to select all books on current page
function toggleSelectAll() {
  if (selectAll.value) {
    const allIds = paginatedBooks.value.map(book => book.id);
    selectedBooks.value = allIds;
  } else {
    selectedBooks.value = [];
  }
}

// Update exportSelected to use only selected books from all books
function exportSelected() {
  // Export selected books as JSON
  const selected = allFilteredSortedBooks.value.filter(book => selectedBooks.value.includes(book.id));
  const blob = new Blob([JSON.stringify(selected, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'selected-books.json';
  a.click();
  URL.revokeObjectURL(url);
}

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

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function sortBy(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
}



async function deleteSelected() {
  if (!selectedBooks.value.length) return;
  if (!confirm('Are you sure you want to delete the selected books?')) return;
  const config = useRuntimeConfig();
  let deletedCount = 0;
  for (const bookId of selectedBooks.value) {
    try {
      await $fetch(`${config.public.NUXT_PUBLIC_API_URL}/${bookId}`, { method: 'DELETE' });
      deletedCount++;
    } catch (e) {
      // Optionally handle error per book
    }
  }
  showSuccessMessage(`${deletedCount} book(s) deleted.`);
  selectedBooks.value = [];
  selectAll.value = false;
  isRefreshing.value = true;
  await fetchBooks();
  isRefreshing.value = false;
}



function openBookDetails(book) {
  bookDetails.value = book;
  showBookDetailsModal.value = true;
}
function closeBookDetails() {
  showBookDetailsModal.value = false;
  bookDetails.value = null;
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
