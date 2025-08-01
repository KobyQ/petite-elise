"use client";

import { Button } from "@/components/ui/button";

interface TableActionsProps {
  rowId: string;
  buttonRefs: React.MutableRefObject<{ [key: string]: HTMLButtonElement | null }>;
  actionMenuOpen: string | null;
  onActionMenuToggle: (rowId: string) => void;
  onMenuPositionUpdate: (position: { x: number; y: number }) => void;
}

const TableActions = ({
  rowId,
  buttonRefs,
  actionMenuOpen,
  onActionMenuToggle,
  onMenuPositionUpdate,
}: TableActionsProps) => {
  return (
    <div className="relative action-menu-container">
      <Button
        ref={(el) => {
          buttonRefs.current[rowId] = el;
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (actionMenuOpen === rowId) {
            onActionMenuToggle("");
          } else {
            const button = buttonRefs.current[rowId];
            if (button) {
              const rect = button.getBoundingClientRect();
              onMenuPositionUpdate({
                x: rect.right - 192, // 192px is the width of the menu
                y: rect.bottom + 5
              });
            }
            onActionMenuToggle(rowId);
          }
        }}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </Button>
    </div>
  );
};

export default TableActions; 