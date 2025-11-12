import React from "react";

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-[80vh] w-full bg-transparent">
            <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-gray-300 dark:border-gray-700"></div>
                <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
            </div>
        </div>
    );
};

export default Loading;
