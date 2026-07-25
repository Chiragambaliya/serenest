import React from 'react';
import { NavLink } from 'react-router-dom';

function linkClass({ isActive }) {
  return isActive ? 'pro-subnav-link is-active' : 'pro-subnav-link';
}

export default function ProfessionalsSubNav() {
  return (
    <nav className="pro-subnav" aria-label="Professionals section">
      <div className="container pro-subnav-inner">
        <NavLink to="/professionals" end className={linkClass}>
          Overview
        </NavLink>
        <NavLink to="/academy/learn" className={linkClass}>
          Academy learning
        </NavLink>
        <NavLink to="/academy" className={linkClass}>
          Academy · Free
        </NavLink>
        <NavLink to="/professionals/resources" className={linkClass}>
          Resources
        </NavLink>
        <NavLink to="/professionals/guidelines" className={linkClass}>
          Guidelines
        </NavLink>
        <NavLink to="/professionals/apply" className={linkClass}>
          Apply
        </NavLink>
      </div>
    </nav>
  );
}
