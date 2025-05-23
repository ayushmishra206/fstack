import React from 'react';

export default function Post({ post }) {
  return (
    <article className="bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex space-x-3">
          <img
            src={post.user.avatar || '/default-avatar.png'}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 truncate">{post.user.name}</span>
              {post.user.username && (
                <span className="text-gray-500">@{post.user.username}</span>
              )}
              <span className="text-gray-500">·</span>
              <time className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
            </div>
            <p className="mt-2 text-gray-900">{post.content}</p>
            {post.images?.length > 0 && (
              <div className={`mt-3 grid gap-2 ${
                post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
              }`}>
                {post.images.map((image, index) => (
                  <div key={index} className="relative pt-[56.25%]">
                    <img
                      src={image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover rounded-xl"
                      onClick={() => window.open(image, '_blank')}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center space-x-8 mt-3 text-gray-500">
              <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm">Reply</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm">Repost</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm">Like</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}