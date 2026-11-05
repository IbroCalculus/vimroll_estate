import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_COMPARE_ITEMS = 4;

export const usePropertyStore = create(
  persist(
    (set, get) => ({
      savedIds: [],
      compareIds: [],
      isCompareModalOpen: false,
      compareNotice: '',

      toggleSaved: (propertyId) =>
        set((state) => {
          const exists = state.savedIds.includes(propertyId);
          return {
            savedIds: exists
              ? state.savedIds.filter((id) => id !== propertyId)
              : [...state.savedIds, propertyId],
          };
        }),

      removeSaved: (propertyId) =>
        set((state) => ({
          savedIds: state.savedIds.filter((id) => id !== propertyId),
        })),

      clearSaved: () => set({ savedIds: [] }),

      isSaved: (propertyId) => get().savedIds.includes(propertyId),

      toggleCompare: (propertyId) => {
        const current = get().compareIds;
        if (current.includes(propertyId)) {
          set({
            compareIds: current.filter((id) => id !== propertyId),
            compareNotice: '',
          });
          return { status: 'removed' };
        }
        if (current.length >= MAX_COMPARE_ITEMS) {
          set({
            compareNotice: `Up to ${MAX_COMPARE_ITEMS} residences can be compared at once.`,
          });
          setTimeout(() => {
            set({ compareNotice: '' });
          }, 3500);
          return { status: 'limit_reached', max: MAX_COMPARE_ITEMS };
        }
        set({
          compareIds: [...current, propertyId],
          compareNotice: '',
        });
        return { status: 'added' };
      },

      removeCompare: (propertyId) =>
        set((state) => ({
          compareIds: state.compareIds.filter((id) => id !== propertyId),
          compareNotice: '',
        })),

      clearCompare: () =>
        set({ compareIds: [], isCompareModalOpen: false, compareNotice: '' }),

      openCompareModal: () => set({ isCompareModalOpen: true }),
      closeCompareModal: () => set({ isCompareModalOpen: false }),
    }),
    {
      name: 'vimroll-estate-preferences',
      partialize: (state) => ({
        savedIds: state.savedIds,
        compareIds: state.compareIds,
      }),
    }
  )
);
