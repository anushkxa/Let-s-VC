import { Link } from "react-router-dom";
import "../App.css";

function HeaderPage() {
    return (
        <nav className="custom-navbar">
            <div className="navbar-container">
                <Link className="logo-section" to="/">
                    <div className="logo-icon">
                        <i className="fa-solid fa-video"></i>
                    </div>
                    <span className="logo-text">Let-s-VC</span>
                </Link>

                <div className="nav-actions">
                    <Link to="/login" className="btn btn-dark">
                        Sign In
                    </Link>

                    <Link to="/signup" className="btn btn-primary">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default HeaderPage;