# LibraryApp

A Nuxt 3 + Vue 3 Library App for managing and browsing books, with decade grouping, add modal, and full API integration.

## ✅ Acceptance Criteria

- [x] **AC.01: Display a list of books on the homepage**
  - [x] AC.01.1: The list of books must be fetched from the provided API (see `.env.example`).
  - [x] AC.01.2: Books are categorized into 10-year intervals based on their publishedYear, from most recent to oldest.
  - [x] AC.01.3: If no books are published within a specific 10-year interval, display "No publications" for that range.
  - [x] AC.01.4: If consecutive 10-year intervals have no publications, combine these intervals and display "No publications" for the combined range.
  - [x] AC.01.5: Within each decade, books are displayed in descending order, from most recent to oldest.
- [x] **AC.02: Book Addition Modal**
  - [x] AC.02.1: The Home Page includes an "Add a Book" button that opens a modal.
  - [x] AC.02.2: The modal contains a form with fields for title, author, publishedYear, genre, and ratings.
  - [x] AC.02.3: All fields are mandatory except for ratings, which can be left empty.
  - [x] AC.02.4: The form validates all mandatory fields before submission.
  - [x] AC.02.5: On successful submission, a POST request is made to the API, the modal closes, and the new book appears in the correct decade.

## Technical Requirements

- [x] Stack: Vue 3, Nuxt 3, Tailwind CSS, Material Icons, vue-star-rating
- [x] API: Uses the provided OpenAPI spec (see `.env.example`)
- [x] All code is TypeScript-ready
- [x] Unit tests with Vitest for modal and API composables
- [x] Skeleton loader and error states
- [x] Accessibility and i18n best practices

## Getting Started

1. **Clone the repo:**
   ```sh
   git clone <your-repo-url>
   cd LibraryApp
   ```
2. **Copy the example environment file:**
   ```sh
   cp .env.example .env
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```
   or for a production build:
   ```sh
   npx nuxi build && npx nuxi preview
   ```

## .env Example

```
NUXT_PUBLIC_API_URL=https://63c10327716562671870f959.mockapi.io/books
```

Replace the value if you have a different API endpoint.

## Output Screenshots

Below are screenshots of the Library App in action:

<p align="center">
  <img src="./assets/images/Screenshot%202025-06-30%20at%2016.30.37.png" alt="Book List" width="600" />
  <br>
  <img src="./assets/images/Screenshot%202025-06-30%20at%2016.30.48.png" alt="Add Book Modal" width="600" />
  <br>
  <img src="./assets/images/Screenshot%202025-06-30%20at%2016.31.13.png" alt="Validation Error" width="600" />
  <br>
  <img src="./assets/images/Screenshot%202025-06-30%20at%2016.33.06.png" alt="Grouped by Decade" width="600" />
  <br>
  <img src="./assets/images/Screenshot%202025-06-30%20at%2016.33.35.png" alt="No Publications State" width="600" />
</p>

## Testing

Run all unit tests with:
```sh
npm run test
```

---

For more details, see the code and comments. Contributions and suggestions welcome!
