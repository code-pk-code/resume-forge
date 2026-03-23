// src/components/MobileNav.jsx
// Bottom tab bar shown only on mobile (< 768px via CSS)

import { IcoUser, IcoEdit, IcoEye } from '../icons.jsx';

/**
 * Props:
 *   activeTab   'sections' | 'form' | 'preview'
 *   onTabChange (tab) => void
 */
export default function MobileNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'sections', label: 'Sections', Icon: IcoUser  },
    { id: 'form',     label: 'Edit',     Icon: IcoEdit  },
    { id: 'preview',  label: 'Preview',  Icon: IcoEye   },
  ];

  return (
    <nav className="mobile-tabs no-print" aria-label="Mobile navigation">
      <div className="mobile-tabs-inner" role="tablist">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`mob-tab${activeTab === id ? ' active' : ''}`}
            onClick={() => onTabChange(id)}
            role="tab"
            aria-selected={activeTab === id}
            aria-label={label}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
