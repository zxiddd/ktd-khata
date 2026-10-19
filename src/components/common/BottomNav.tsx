import React from 'react';
import { useKhata, ActiveTab } from '../../context/KhataContext';
import { Users, Banknote, Wrench, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setActiveContact } = useKhata();

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'loans', label: 'Loans', icon: Banknote },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveContact(null);
    setActiveTab(tabId);
  };

  return (
    <nav className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-20 max-w-lg mx-auto shadow-lg select-none">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-all duration-150 ${
                isActive
                  ? 'text-[#0e8354] font-semibold'
                  : 'text-slate-500 hover:text-slate-800 font-normal'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0e8354] rounded-full"></span>
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
