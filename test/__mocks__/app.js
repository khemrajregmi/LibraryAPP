// Mock for Nuxt's #app composable for Vitest
export function useRuntimeConfig() {
  return {
    public: {
      apiUrl: 'http://mocked-api-url.test'
    }
  };
}

