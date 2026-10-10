import React from 'react';

type ContextMenuProps = {
  menuConfig: any;
  setMenuConfig: React.Dispatch<any>;
};

export function ContextMenu({ menuConfig, setMenuConfig }: ContextMenuProps) {
  return (
    <div style={{ display: menuConfig?.visible ? 'block' : 'none' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 99998 }} onClick={() => setMenuConfig({ ...menuConfig, visible: false })} />
      <div style={{
        position: 'fixed',
        left: menuConfig?.x || 0,
        top: (menuConfig?.y || 0) + 8,
        zIndex: 99999,
        background: '#1A181C',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        minWidth: 160,
        animation: 'fadeIn 0.15s ease'
      }}>
        {menuConfig?.options?.map((opt: any, i: number) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setMenuConfig({ ...menuConfig, visible: false });
              opt.onClick();
            }}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderBottom: i < menuConfig.options.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              color: opt.destructive ? '#ef4444' : '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
