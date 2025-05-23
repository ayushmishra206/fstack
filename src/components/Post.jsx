import React from 'react';

export default function Post({ post }) {
  return (
    <div className="p-4 border-b">
      <div className="flex space-x-3">
        <img
          src={post.user.avatar || '/default-avatar.png'}
          alt=""
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-1">
            <span className="font-bold">{post.user.name}</span>
            {post.user.username && (
              <span className="text-gray-500">@{post.user.username}</span>
            )}
            <span className="text-gray-500">·</span>
            <time className="text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>
          <p className="mt-2">{post.content}</p>
          {post.images && post.images.length > 0 && (
            <div className={`mt-3 grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt=""
                  className="rounded-lg w-full object-cover"
                  style={{ maxHeight: '300px' }}
                  onClick={() => window.open(image, '_blank')}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}