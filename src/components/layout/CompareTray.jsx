import { AnimatePresence, motion } from 'motion/react';
import { Scale, X } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';
import { useAllPropertiesQuery } from '../../features/properties/useProperties';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ComparisonMatrix } from '../../features/comparison/ComparisonMatrix';

export function CompareTray() {
  const compareIds = usePropertyStore((state) => state.compareIds);
  const compareNotice = usePropertyStore((state) => state.compareNotice);
  const removeCompare = usePropertyStore((state) => state.removeCompare);
  const clearCompare = usePropertyStore((state) => state.clearCompare);
  const isCompareModalOpen = usePropertyStore((state) => state.isCompareModalOpen);
  const openCompareModal = usePropertyStore((state) => state.openCompareModal);
  const closeCompareModal = usePropertyStore((state) => state.closeCompareModal);

  const { data: allProperties = [] } = useAllPropertiesQuery();

  const selectedProperties = compareIds
    .map((id) => allProperties.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <>
      <AnimatePresence>
        {selectedProperties.length > 0 && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-[#B69A69]/40 bg-[#171816]/95 px-4 py-3.5 text-[#F7F5F0] backdrop-blur-md shadow-2xl sm:px-8"
          >
            <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B69A69]">
                  <Scale className="h-4 w-4" strokeWidth={1.5} />
                  <span>Compare ({selectedProperties.length}/4)</span>
                </span>

                <div className="hidden items-center gap-2 md:flex">
                  {selectedProperties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center gap-2 border border-[#F7F5F0]/15 bg-[#222320] py-1 pl-2.5 pr-1.5 text-xs"
                    >
                      <span className="max-w-[140px] truncate text-[#F7F5F0]">
                        {property.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCompare(property.id)}
                        aria-label={`Remove ${property.title} from compare`}
                        className="p-0.5 text-[#E8E1D5]/60 hover:text-[#B69A69]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {compareNotice && (
                  <span role="status" className="text-xs text-[#CBB389]">
                    {compareNotice}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearCompare}
                  className="text-[11px] uppercase tracking-[0.18em] text-[#E8E1D5]/70 transition-colors hover:text-[#F7F5F0]"
                >
                  Clear
                </button>
                <Button
                  variant="gold"
                  size="sm"
                  disabled={selectedProperties.length < 2}
                  onClick={openCompareModal}
                >
                  {selectedProperties.length < 2
                    ? 'Add 1 More to Compare'
                    : 'Compare Residences'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={isCompareModalOpen}
        onClose={closeCompareModal}
        eyebrow="Side-by-Side Evaluation"
        title="Residence Comparison"
        maxWidth="max-w-6xl"
      >
        <ComparisonMatrix
          properties={selectedProperties}
          onNavigate={closeCompareModal}
        />
      </Modal>
    </>
  );
}
