import React from 'react';
import SidebarItem from './SidebarItem';
import '../Css/Sidebar.css';

const Sidebar = ({ categories = [] }) => {
  return (
    <aside className="sidebar">
      <div className="folders">
        {categories.map(category => (
          <div key={category._id || category.id} className="folder">
            <h3>{category.name}</h3>
            {category.items && category.items.map(item => (
              <SidebarItem key={item._id || item.id} item={item} />
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;