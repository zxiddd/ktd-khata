import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { X, Check, Plus, BookOpen } from 'lucide-react';

export const BookSelectorModal: React.FC = () => {
  const { books, activeBookId, switchBook, createBook, closeModal, shop } = useKhata();
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newBookName, setNewBookName] = useState('');

  const handleSelect = (bookId: string) => {
    switchBook(bookId);
    closeModal();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookName.trim()) return;
    createBook(newBookName.trim());
    setNewBookName('');
    setShowCreateInput(false);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Select Book</h2>
          <button
            onClick={closeModal}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Books List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {books.map((book) => {
            const isSelected = book.id === activeBookId;
            const initial = book.name ? book.name.charAt(0).toUpperCase() : 'B';

            return (
              <div
                key={book.id}
                onClick={() => handleSelect(book.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-[#e8f7f0] shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#0e8354] text-white font-bold text-xl flex items-center justify-center shadow-xs">
                    {initial}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{book.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{book.role}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#0e8354] text-white flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}

          {showCreateInput ? (
            <form onSubmit={handleCreate} className="p-4 border border-emerald-400 rounded-xl bg-emerald-50/50 mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Book Name</label>
              <input
                type="text"
                value={newBookName}
                onChange={(e) => setNewBookName(e.target.value)}
                placeholder="e.g. Wholesale Ledger, Branch 2"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateInput(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newBookName.trim()}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0e8354] hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-xs"
                >
                  Create
                </button>
              </div>
            </form>
          ) : null}
        </div>

        {/* Bottom CTA */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          {!showCreateInput && (
            <button
              onClick={() => setShowCreateInput(true)}
              className="w-full py-3 px-4 bg-[#0e8354] hover:bg-emerald-700 active:scale-[0.99] transition-all text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Create New ktd khata</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
