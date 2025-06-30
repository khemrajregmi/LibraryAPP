
// Mock Nuxt's useRuntimeConfig from #app for Vitest
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiUrl: 'http://mocked-api-url.test' // mock value
    }
  })
}));

import { mount } from '@vue/test-utils';
import AddBookModal from '../components/AddBookModal.vue';
import { vi, describe, it, expect } from 'vitest';

// Mock StarRating component as a plain object for Vue Test Utils compatibility
vi.mock('vue-star-rating', () => ({
  __esModule: true,
  default: {
    name: 'StarRating',
    render: () => null,
    __isTeleport: false // for VTU compatibility
  }
}));

describe('AddBookModal.vue', () => {
  it('submits the form and emits success event', async () => {
    // Mock $fetch to resolve
    globalThis.$fetch = vi.fn().mockResolvedValueOnce({});

    const wrapper = mount(AddBookModal, {
      props: {
        show: true,
        form: {
          name: '',
          author: '',
          publishYear: '',
          category: ''
        },
        error: ''
      }
    });

    await wrapper.find('#title').setValue('Test Book');
    await wrapper.find('#author').setValue('Test Author');
    await wrapper.find('#publishYear').setValue(2025);
    await wrapper.find('#genre').setValue('Fiction');

    await wrapper.find('form').trigger('submit.prevent');

    expect(globalThis.$fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({
          name: 'Test Book',
          author: 'Test Author',
          publishYear: 2025,
          category: 'Fiction'
        })
      })
    );

    expect(wrapper.emitted('close')).toBeTruthy();
    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')[0][0]).toEqual({
      success: true,
      message: 'Book added successfully!'
    });
  });

  it('shows error message on failed submission', async () => {
    // Mock $fetch to reject
    globalThis.$fetch = vi.fn().mockRejectedValueOnce(new Error('Failed to add book'));

    const wrapper = mount(AddBookModal, {
      props: {
        show: true,
        form: {
          name: '',
          author: '',
          publishYear: '',
          category: ''
        },
        error: ''
      }
    });

    await wrapper.find('#title').setValue('Test Book');
    await wrapper.find('#author').setValue('Test Author');
    await wrapper.find('#publishYear').setValue(2025);
    await wrapper.find('#genre').setValue('Fiction');

    await wrapper.find('form').trigger('submit.prevent');

    expect(globalThis.$fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({
          name: 'Test Book',
          author: 'Test Author',
          publishYear: 2025,
          category: 'Fiction'
        })
      })
    );

    // Should not emit close or submit on error
    expect(wrapper.emitted('close')).toBeFalsy();
    expect(wrapper.emitted('submit')).toBeFalsy();
    // Should show error message
    expect(wrapper.text()).toContain('Failed to add book');
  });

  it('shows validation errors for empty fields', async () => {
    const wrapper = mount(AddBookModal, {
      props: {
        show: true,
        error: '',
        form: {}
      }
    });
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain('Title is required');
    expect(wrapper.text()).toContain('Author is required');
    expect(wrapper.text()).toContain('Published year is required');
    expect(wrapper.text()).toContain('Genre is required');
  });
});
