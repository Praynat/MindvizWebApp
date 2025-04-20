import React from 'react';
import SidebarItem from './SidebarItem';
import '../Css/Sidebar.css';

const Sidebar = ({ categories = [], onFilterSelect, selectedItemId }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-items">
        {/* Main categories - limit to first 7 if needed */}
        {categories.slice(0, 7).map(category => (
          <SidebarItem 
            key={category._id || category.id} 
            item={category} 
            onFilterSelect={onFilterSelect}
            selectedItemId={selectedItemId}
          />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;