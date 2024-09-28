// pages/404.tsx

import Link from 'next/link';
import { FC } from 'react';

const Custom404: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <Link href="/">
        <a className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
          Go Back Home
        </a>
      </Link>
    </div>
  );
};

export default Custom404;
