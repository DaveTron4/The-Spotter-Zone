import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../clients/SupaBaseClient';

const HeaderComponent = ({ userData, setUserData }) => {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);


  function handleCreatePost() {
    if (userData) {
      navigate('/create-post');
    } else {
      setShowAlert(true);
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserData(null);
    navigate('/');
  };

  return (
    <div className="w-100">
      {showAlert && (
        <div
          className="alert alert-warning alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-2"
          role="alert"
          style={{ zIndex: 1060, width: 'fit-content' }}
        >
          <strong>Login Required!</strong> Please log in to create a post.
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setShowAlert(false)}
          ></button>
        </div>
      )}
      <nav className="navbar navbar-dark bg-dark fixed-top px-3 position-relative">
        <Link className="navbar-brand" to="/">The Spotter Zone</Link>
        <div className="d-flex align-items-center ms-auto">
          {userData ? (
            <>
              <button className="btn btn-success me-2" onClick={handleCreatePost}>
                Create Post
              </button>
              <div className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-white"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {userData.user_metadata.display_name}
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                  style={{ zIndex: 1050 }}
                >
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-success me-2" onClick={handleCreatePost}>
                Create Post
              </button>
              <Link className="btn btn-outline-light" to="/auth">
                Login / Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );  
};

export default HeaderComponent;
