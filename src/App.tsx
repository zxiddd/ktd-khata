import React, { useState } from 'react';
import { KhataProvider, useKhata } from './context/KhataContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { ContactsTab } from './components/contacts/ContactsTab';
import { LoansTab } from './components/loans/LoansTab';
import { ToolsTab } from './components/tools/ToolsTab';
import { SettingsTab } from './components/settings/SettingsTab';
import { CustomerDetailView } from './components/contacts/CustomerDetailView';
import { BookSelectorModal } from './components/common/BookSelectorModal';
import { AddContactModal } from './components/contacts/AddContactModal';
import { TransactionEntryModal } from './components/transactions/TransactionEntryModal';
import { EntrySavedModal } from './components/transactions/EntrySavedModal';
import { CreateLoanModal } from './components/loans/CreateLoanModal';
import { DayBookModal } from './components/tools/DayBookModal';
import { ReportsModal } from './components/tools/ReportsModal';
import { BulkReminderModal } from './components/tools/BulkReminderModal';
import { RecycleBinModal } from './components/tools/RecycleBinModal';
import { EmiCalculatorModal } from './components/tools/EmiCalculatorModal';
import { StandardCalculatorModal } from './components/tools/StandardCalculatorModal';
import { ReceiptShareModal } from './components/common/ReceiptShareModal';
import { MasterChecklistModal } from './components/common/MasterChecklistModal';
import { AppLockScreen } from './components/common/AppLockScreen';
import { AuthView } from './components/auth/AuthView';
import { ApkDownloadModal } from './components/common/ApkDownloadModal';
import {
  AppLockSettingsModal,
  ChangeLanguageModal,
  CustomizeLabelsModal,
  ShopProfileModal,
  SyncStatusModal,
} from './components/common/PreferenceModals';

const MainAppContent: React.FC = () => {
  const { activeTab, activeContact, activeModal, modalProps, isAppLocked, user } = useKhata();
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  if (!user) {
    return <AuthView />;
  }

  if (isAppLocked) {
    return <AppLockScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-start sm:p-2 md:p-4">
      {/* Container - Mobile viewport or full layout */}
      <div
        className={`w-full bg-[#f7f9fa] shadow-2xl relative min-h-screen flex flex-col ${
          isMobileFrame
            ? 'max-w-lg md:rounded-3xl md:overflow-hidden md:border md:border-slate-800 md:my-2 md:min-h-[860px]'
            : 'max-w-4xl rounded-none'
        }`}
      >
        {/* Header - Not rendered if inside CustomerDetailView which has its own header */}
        {!activeContact && (
          <Header isMobileFrame={isMobileFrame} setIsMobileFrame={setIsMobileFrame} />
        )}

        {/* Main Body */}
        <main className="flex-1 overflow-x-hidden">
          {activeContact ? (
            <CustomerDetailView contact={activeContact} />
          ) : (
            <>
              {activeTab === 'contacts' && <ContactsTab />}
              {activeTab === 'loans' && <LoansTab />}
              {activeTab === 'tools' && <ToolsTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </>
          )}
        </main>

        {/* Persistent Bottom Nav - Hidden when in individual customer ledger view */}
        {!activeContact && <BottomNav />}

        {/* Modal Registry */}
        {activeModal === 'SELECT_BOOK' && <BookSelectorModal />}
        {activeModal === 'ADD_CONTACT' && <AddContactModal />}
        {activeModal === 'TRANSACTION_ENTRY' && modalProps?.contact && (
          <TransactionEntryModal
            contact={modalProps.contact}
            initialType={modalProps.initialType}
          />
        )}
        {activeModal === 'ENTRY_SAVED' && modalProps?.contact && modalProps?.entry && (
          <EntrySavedModal contact={modalProps.contact} entry={modalProps.entry} />
        )}
        {activeModal === 'CREATE_LOAN' && (
          <CreateLoanModal
            contact={modalProps?.contact}
            presetPrincipal={modalProps?.presetPrincipal}
            presetNotes={modalProps?.presetNotes}
          />
        )}
        {activeModal === 'DAY_BOOK' && <DayBookModal />}
        {activeModal === 'REPORT' && <ReportsModal />}
        {activeModal === 'BULK_REMINDER' && <BulkReminderModal />}
        {activeModal === 'RECYCLE_BIN' && <RecycleBinModal />}
        {activeModal === 'EMI_CALCULATOR' && <EmiCalculatorModal />}
        {activeModal === 'CALCULATOR' && <StandardCalculatorModal />}
        {activeModal === 'RECEIPT_SHARE' && modalProps?.contact && (
          <ReceiptShareModal contact={modalProps.contact} entries={modalProps.entries || []} />
        )}
        {activeModal === 'MASTER_CHECKLIST' && <MasterChecklistModal />}
        {activeModal === 'APP_LOCK_SETTINGS' && <AppLockSettingsModal />}
        {activeModal === 'CHANGE_LANGUAGE' && <ChangeLanguageModal />}
        {activeModal === 'CUSTOMIZE_LABELS' && <CustomizeLabelsModal />}
        {activeModal === 'SYNC_STATUS' && <SyncStatusModal />}
        {activeModal === 'SHOP_PROFILE' && <ShopProfileModal />}
        {activeModal === 'APK_DOWNLOAD' && <ApkDownloadModal />}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <KhataProvider>
      <MainAppContent />
    </KhataProvider>
  );
}
