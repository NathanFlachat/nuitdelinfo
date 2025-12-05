import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/music", label: "Music" },
    { to: "/decathlon", label: "Decathlon" },
    { to: "/femme", label: "Tech for Everyone" },
    { to: "/autre", label: "Calculator" },

  ];

  return (
    <header className="nav-header">
      <nav className="nav">
        <div className="brand">MyApp</div>
        <ul className="nav-list" role="menu" aria-label="Main">
          {links.map((l) => (
            <li key={l.to} role="none">
              <NavLink
                to={l.to}
                end={l.to === "/"}
                role="menuitem"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
