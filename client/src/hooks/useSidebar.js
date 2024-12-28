import { useState } from "react";

const useSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    try {
      setSidebarOpen((prev) => !prev);
    } catch (error) {
      console.error("An error occurred while toggling the sidebar:", error);
    }
  };

  return {
    sidebarOpen,
    toggleSidebar,
  };
};

export default useSidebar;
