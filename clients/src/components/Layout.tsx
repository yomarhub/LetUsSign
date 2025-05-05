import React from "react";
import { Outlet, Link } from "react-router-dom";
import profile from '../assets/profile-user.png';

const Layout = () => {
    return (
        <>
            <nav>
                <Link to="/" className="logo" style={{ backgroundImage: "url('logo.png')" }}></Link>
                <h1>LetUsSign</h1>
                <Link to="/signin" className="logo" style={{ backgroundImage: `url(${profile})` }}></Link>
            </nav>

            <Outlet />
        </>
    );
};

export default Layout;
