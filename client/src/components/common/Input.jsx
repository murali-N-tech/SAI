import React from 'react';

const Input = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false,
}) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1">
                <input
                    id={id}
                    name={id}
                    type={type}
                    required={required}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
            </div>
        </div>
    );
};

export default Input;