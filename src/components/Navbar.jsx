import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
    return (
        <nav className="nav">
            {/* 1. Logo is now a clickable Link to home */}
            <Link to="/" className="logo">
                PulseTrack AI
            </Link>

            <div className="links">
                {/* 2. NavLink provides an "isActive" state for styling */}
                <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                        isActive ? "btn-design active" : "btn-design"
                    }
                    end /* Ensures "Home" is only active at exactly "/" */
                >
                    Home
                </NavLink>

                <NavLink 
                    to="/predict" 
                    className={({ isActive }) => 
                        isActive ? "btn-design active" : "btn-design"
                    }
                >
                    Predict
                </NavLink>
            </div>
        </nav>
    );
}