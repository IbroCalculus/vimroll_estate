import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_COMPARE_ITEMS = 4;

export const usePropertyStore = create(
  persist(
    (set, get) => ({
      savedIds: [],
      compareIds: [],
      currency: 'USD',
      areaUnit: 'sqm',
      isCompareModalOpen: false,
      isCommandSearchOpen: false,
      compareNotice: '',
      toasts: [],

      pushToast: ({ title, detail = '', actionLabel = '', actionTo = '' }) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set((state) => ({
          toasts: [
            ...state.toasts.slice(-2),
            { id, title, detail, actionLabel, actionTo },
          ],
        }));
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, 3400);
      },

      dismissToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      setCurrency: (currency) => {
        if (get().currency === currency) return;
        set({ currency });
        get().pushToast({
          title: `Display currency set to ${currency}`,
          detail: 'All guide prices and map markers updated.',
        });
      },

      setAreaUnit: (areaUnit) => {
        if (get().areaUnit === areaUnit) return;
        set({ areaUnit });
        get().pushToast({
          title: `Floor area set to ${areaUnit === 'sqft' ? 'Square Feet (sq ft)' : 'Square Metres (sqm)'}`,
        });
      },

      toggleSaved: (propertyId, propertyTitle = 'Residence') => {
        const exists = get().savedIds.includes(propertyId);
        set((state) => ({
          savedIds: exists
            ? state.savedIds.filter((id) => id !== propertyId)
            : [...state.savedIds, propertyId],
        }));
        get().pushToast({
          title: exists ? 'Removed from Saved Shortlist' : 'Saved to Private Shortlist',
          detail: propertyTitle,
          actionLabel: exists ? '' : 'View Shortlist',
          actionTo: exists ? '' : '/saved',
        });
      },

      removeSaved: (propertyId) =>
        set((state) => ({
          savedIds: state.savedIds.filter((id) => id !== propertyId),
        })),

      clearSaved: () => {
        set({ savedIds: [] });
        get().pushToast({ title: 'Saved shortlist cleared' });
      },

      isSaved: (propertyId) => get().savedIds.includes(propertyId),

      toggleCompare: (propertyId, propertyTitle = 'Residence') => {
        const current = get().compareIds;
        if (current.includes(propertyId)) {
          set({
            compareIds: current.filter((id) => id !== propertyId),
            compareNotice: '',
          });
          get().pushToast({
            title: 'Removed from comparison',
            detail: propertyTitle,
          });
          return { status: 'removed' };
        }
        if (current.length >= MAX_COMPARE_ITEMS) {
          const msg = `Up to ${MAX_COMPARE_ITEMS} residences can be compared at once.`;
          set({ compareNotice: msg });
          get().pushToast({
            title: 'Comparison limit reached',
            detail: msg,
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
        get().pushToast({
          title: 'Added to side-by-side comparison',
          detail: propertyTitle,
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

      openCommandSearch: () => set({ isCommandSearchOpen: true }),
      closeCommandSearch: () => set({ isCommandSearchOpen: false }),
    }),
    {
      name: 'vimroll-estate-preferences',
      partialize: (state) => ({
        savedIds: state.savedIds,
        compareIds: state.compareIds,
        currency: state.currency,
        areaUnit: state.areaUnit,
      }),
    }
  )
);
