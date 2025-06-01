import React, { useState } from 'react';
import styles from './Header.module.css';

import { MdAnalytics, MdOutlineTableBar } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FaClipboardList, FaHome, FaUserCog } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { PiDiscordLogoLight } from "react-icons/pi"

const navItems = [
  { icon: <MdDashboard/>, path: '/', title: 'Dashboard' },
  { icon: <MdOutlineTableBar />, path: '/table', title: 'Tables' },
  { icon: <FaClipboardList />, path: '/orderpage', title: 'Orders' },
  { icon: <FaUserCog />, path: '/contact', title: 'contact' },
  { icon: <PiDiscordLogoLight/>, path: '/menu', title: 'menu page' },
];

const Header = () => {
  return (
    <div className={styles.container}>
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            `${styles.icondiv} ${isActive ? styles.active : ''}`
          }
          title={item.title}
        >
          <div className={styles.icons}>{item.icon}</div>
        </NavLink>
      ))}
    </div>
  );
};

export default Header;
