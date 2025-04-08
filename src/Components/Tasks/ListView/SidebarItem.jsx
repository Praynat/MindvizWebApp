// SidebarItem.jsx
import React, { useState } from 'react';

const SidebarItem = ({ item }) => {
  const [collapsed, setCollapsed] = useState(true);
  const hasChildren = item.subCategories && item.subCategories.length > 0;

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="sidebar-item">
      <div className="item-header" onClick={hasChildren ? toggleCollapse : undefined}>
        <span>{item.name}</span>
        {hasChildren && (
          <button className="collapse-btn" onClick={toggleCollapse}>
            {collapsed ? '+' : '-'}
          </button>
        )}
      </div>
      {hasChildren && !collapsed && (
        <div className="sub-items">
          {item.subCategories.map((subItem) => (
            <SidebarItem key={subItem.id} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarItem;
