import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="text-center py-16">
            <h1 className="text-6xl font-extrabold text-blue-600">404</h1>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
            <p className="mt-2 text-gray-600">Sorry, the page you are looking for does not exist.</p>
            <div className="mt-6">
                <Link to="/" className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;