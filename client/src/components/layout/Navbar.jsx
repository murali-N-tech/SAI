import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-blue-600" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-600 lg:p-0`;

    return (
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto flex flex-wrap justify-between items-center">
                <Link to="/" className="flex items-center">
                    <span className="text-xl font-bold text-gray-800">Khel Pratibha</span>
                </Link>

                <div className="flex items-center lg:order-2">
                    {isAuthenticated ? (
                        <>
                            <span className="text-gray-800 text-sm mr-4 hidden sm:block">Welcome, {user.name}</span>
                            <button
                                onClick={logout}
                                className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none">
                                Log in
                            </Link>
                            <Link to="/register" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none">
                                Get started
                            </Link>
                        </>
                    )}
                    <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                    </button>
                </div>

                <div className={`${isOpen ? 'block' : 'hidden'} justify-between items-center w-full lg:flex lg:w-auto lg:order-1`} id="mobile-menu-2">
                    <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                        <li><NavLink to="/" className={navLinkClass}>Home</NavLink></li>
                        {isAuthenticated && <li><NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink></li>}
                        <li><NavLink to="/leaderboard" className={navLinkClass}>Leaderboard</NavLink></li>
                        <li><NavLink to="/feed" className={navLinkClass}>Feed</NavLink></li>
                        {isAuthenticated && user.role === 'admin' && <li><NavLink to="/admin" className={navLinkClass}>Admin</NavLink></li>}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;