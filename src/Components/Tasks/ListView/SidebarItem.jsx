// SidebarItem.jsx
import React, { useState } from 'react';

const SidebarItem = ({ item, onFilterSelect, selectedItemId }) => {
  const [collapsed, setCollapsed] = useState(true);
  const hasChildren = item.subCategories && item.subCategories.length > 0;
  const childCount = hasChildren ? item.subCategories.length : 0;
  const isSelected = selectedItemId === (item._id || item.id);

  // Handle click on the item header - triggers filtering AND expands children
  const handleItemClick = (e) => {
    e.stopPropagation();
    if (onFilterSelect) {
      onFilterSelect(item);
    }
    
    // Auto-expand when clicking on an item that has children
    if (hasChildren && collapsed) {
      setCollapsed(false);
    }
  };

  // Toggle expand/collapse without triggering filtering
  const toggleCollapse = (e) => {
    e.stopPropagation();
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar-item ${isSelected ? 'selected' : ''}`}>
      <div className="item-header" onClick={handleItemClick}>
        <div className="item-title">
          {hasChildren ? (
            <button className="collapse-btn" onClick={toggleCollapse}>
              {collapsed ? '▸' : '▾'}
            </button>
          ) : (
            <span className="list-icon">•</span>
          )}
          <span>{item.name}</span>
          {hasChildren && (
            <span className="child-count-badge">{childCount}</span>
          )}
        </div>
      </div>
      
      {hasChildren && !collapsed && (
        <div className="sub-items">
          {item.subCategories.map((subItem, index) => (
            <React.Fragment key={subItem._id || subItem.id}>
              <SidebarItem 
                item={subItem}
                onFilterSelect={onFilterSelect}
                selectedItemId={selectedItemId}
              />
              {index < item.subCategories.length - 1 && (
                <hr className="child-divider" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
