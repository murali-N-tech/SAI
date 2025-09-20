import React from 'react';
import Spinner from './Spinner';

const Button = ({
    children,
    type = 'button',
    onClick,
    variant = 'primary',
    disabled = false,
    loading = false,
    className = '',
}) => {
    const baseClasses = "w-full inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
        >
            {loading ? <Spinner /> : children}
        </button>
    );
};

export default Button;