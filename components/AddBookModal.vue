<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-10" role="dialog" aria-modal="true" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative" @keydown.esc="$emit('close')" tabindex="0">
      <button type="button" @click="$emit('close')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700" aria-label="Close modal">
        <span class="material-icons" aria-hidden="true">close</span>
      </button>
      <h2 class="text-xl font-bold mb-4" id="modal-title">Add a Book</h2>
      <form @submit.prevent="onSubmit" class="space-y-4" aria-labelledby="modal-title">
        <div v-if="errorMessage" class="mb-2 p-2 rounded bg-red-100 text-red-700 text-sm" role="alert">
          {{ errorMessage }}
        </div>
        <div>
          <label for="title" class="block text-sm font-medium mb-1">Title *</label>
          <input id="title" v-model="localForm.name" type="text" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" aria-required="true" aria-describedby="title-description" @input="fieldErrors.name = ''" />
          <p id="title-description" class="mt-1 text-xs" :class="fieldErrors.name ? 'text-red-600' : 'text-gray-500'" aria-live="polite">
            {{ fieldErrors.name ? fieldErrors.name : 'Enter the book title.' }}
          </p>
        </div>
        <div>
          <label for="author" class="block text-sm font-medium mb-1">Author *</label>
          <input id="author" v-model="localForm.author" type="text" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" aria-required="true" aria-describedby="author-description" @input="fieldErrors.author = ''" />
          <p id="author-description" class="mt-1 text-xs" :class="fieldErrors.author ? 'text-red-600' : 'text-gray-500'" aria-live="polite">
            {{ fieldErrors.author ? fieldErrors.author : 'Enter the author\'s name.' }}
          </p>
        </div>
        <div>
          <label for="publishYear" class="block text-sm font-medium mb-1">Published Year *</label>
          <input id="publishYear" v-model="localForm.publishYear" type="number" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" aria-required="true" aria-describedby="publishYear-description" @input="fieldErrors.publishYear = ''" />
          <p id="publishYear-description" class="mt-1 text-xs" :class="fieldErrors.publishYear ? 'text-red-600' : 'text-gray-500'" aria-live="polite">
            {{ fieldErrors.publishYear ? fieldErrors.publishYear : 'Enter the year the book was published.' }}
          </p>
        </div>
        <div>
          <label for="genre" class="block text-sm font-medium mb-1">Genre *</label>
          <input id="genre" v-model="localForm.category" type="text" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300" aria-required="true" aria-describedby="genre-description" @input="fieldErrors.category = ''" />
          <p id="genre-description" class="mt-1 text-xs" :class="fieldErrors.category ? 'text-red-600' : 'text-gray-500'" aria-live="polite">
            {{ fieldErrors.category ? fieldErrors.category : 'Enter the genre of the book.' }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Ratings </label>
          <div v-for="source in ratingSources" :key="source" class="mb-2">
            <label :for="`rating-${source}`" class="block text-sm font-medium mb-1">{{ source }}</label>
            <client-only>
              <StarRating :id="`rating-${source}`" v-model:rating="localForm.ratings[source as RatingSource]" :increment="0.5" :star-size="20" :show-rating="false" aria-label="Rate {{ source }}" />
            </client-only>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" aria-label="Cancel">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" aria-label="Submit" :disabled="loading">
            <span v-if="loading">Loading...</span>
            <span v-else>Add Book</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineAsyncComponent } from 'vue';
import { useRuntimeConfig } from '#app';

type RatingSource = 'Goodreads' | 'Barnes & Noble' | 'Amazon';

interface BookForm {
  name: string;
  author: string;
  publishYear: string | number;
  category: string;
  ratings: Record<RatingSource, number>;
}

const StarRating = defineAsyncComponent(() =>
  import('vue-star-rating')
);

const props = defineProps<{
  show: boolean;
  error: string;
  form: Partial<BookForm>;
}>();
const emit = defineEmits(['close', 'submit']);

const localForm = ref<BookForm>({
  name: props.form?.name ?? '',
  author: props.form?.author ?? '',
  publishYear: props.form?.publishYear ?? '',
  category: props.form?.category ?? '',
  ratings: {
    Goodreads: props.form?.ratings?.Goodreads ?? 0,
    'Barnes & Noble': props.form?.ratings?.['Barnes & Noble'] ?? 0,
    Amazon: props.form?.ratings?.Amazon ?? 0
  }
});
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const fieldErrors = ref<{ [key: string]: string }>({});

// Ensure ratings are always initialized as a reactive object
if (!localForm.value.ratings) {
  localForm.value.ratings = { Goodreads: 0, 'Barnes & Noble': 0, Amazon: 0 };
}

const ratingSources: RatingSource[] = ['Goodreads', 'Barnes & Noble', 'Amazon'];
watch(() => props.form, (val) => {
  localForm.value = {
    name: val?.name ?? '',
    author: val?.author ?? '',
    publishYear: val?.publishYear ?? '',
    category: val?.category ?? '',
    ratings: {
      Goodreads: val?.ratings?.Goodreads ?? 0,
      'Barnes & Noble': val?.ratings?.['Barnes & Noble'] ?? 0,
      Amazon: val?.ratings?.Amazon ?? 0
    }
  };
});

watch(() => props.show, (val) => {
  if (val) {
    // Reset form when modal is opened
    localForm.value = {
      name: '',
      author: '',
      publishYear: '',
      category: '',
      ratings: { Goodreads: 0, 'Barnes & Noble': 0, Amazon: 0 }
    };
    errorMessage.value = '';
    successMessage.value = '';
    fieldErrors.value = {};
  }
});

watch(() => localForm.value.ratings, (newRatings) => {
  console.log('Updated Ratings:', newRatings);
}, { deep: true });

const validateForm = () => {
  const errors: string[] = [];
  fieldErrors.value = {};
  if (!localForm.value.name || !localForm.value.name.trim()) {
    errors.push('Title is required.');
    fieldErrors.value.name = 'Title is required.';
  }
  if (!localForm.value.author || !localForm.value.author.trim()) {
    errors.push('Author is required.');
    fieldErrors.value.author = 'Author is required.';
  }
  // Always get current year at validation time (not module load)
  const year = Number(localForm.value.publishYear);
  // Hardcode current year to 2025 for this project
const currentYear = new Date().getFullYear();
  if (!localForm.value.publishYear || isNaN(year)) {
    errors.push('Published year is required and must be a number.');
    fieldErrors.value.publishYear = 'Published year is required and must be a number.';
  } else if (year > currentYear) {
    errors.push(`Published year cannot be in the future (max ${currentYear}).`);
    fieldErrors.value.publishYear = `Published year cannot be in the future (max ${currentYear}).`;
  }
  if (!localForm.value.category || !localForm.value.category.trim()) {
    errors.push('Genre is required.');
    fieldErrors.value.category = 'Genre is required.';
  }
  return errors;
};

async function onSubmit() {
  const errors = validateForm();
  if (errors.length) {
    // Do not set errorMessage for validation errors; only use fieldErrors
    return;
  }
  loading.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  const formattedRatings = Object.entries(localForm.value.ratings)
    .filter(([_, value]) => value > 0)
    .map(([source, value]) => ({ source, value }));

  const bookData = { ...localForm.value, ratings: formattedRatings };
  console.log('Submitting Book Data:', bookData);
  const config = useRuntimeConfig();
  try {
    await $fetch(String(config.public.NUXT_PUBLIC_API_URL), {
      method: 'POST',
      body: bookData,
    });
    successMessage.value = 'Book added successfully!';
    // Clear form after successful submit
    localForm.value = {
      name: '',
      author: '',
      publishYear: '',
      category: '',
      ratings: { Goodreads: 0, 'Barnes & Noble': 0, Amazon: 0 }
    };
    fieldErrors.value = {};
    errorMessage.value = '';
    emit('close');
    emit('submit', { success: true, message: 'Book added successfully!' });
  } catch (error) {
    console.error('Error submitting book:', error);
    errorMessage.value = 'Failed to add book. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.fixed.inset-0 {
  background: rgba(0, 0, 0, 0.2); /* Light dark shadow */
}
</style>
