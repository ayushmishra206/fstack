import React from "react";

export default function LoginIllustration() {
  return (
    <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-blue-100 p-8">
      <img
        src="/user.svg"
        alt="Welcome"
        className="w-80 h-80 object-contain"
      />
      <h2 className="mt-6 text-2xl font-bold text-blue-700 text-center">
        Welcome to Fstack!
      </h2>
      <p className="text-blue-500 text-center mt-2">
        Manage your users and data with ease.
      </p>
    </div>
  );
}