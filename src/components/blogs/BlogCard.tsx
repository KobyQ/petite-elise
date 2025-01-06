/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
// import Link from 'next/link';

const BlogCard = ({ blog }: { blog: any }) => {
  return (
    <div className="bg-gradient-to-tl from-blue-50 to-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
      <img className="w-full h-56 object-cover rounded-t-2xl" src={blog.imageUrl} alt={blog.title} />
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 hover:text-primary transition duration-200">{blog.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>{blog.date}</p>
          <span className="bg-primary text-white py-1 px-3 rounded-full text-xs">{blog.category}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700">
          <span>By <strong>{blog.author}</strong></span>
        </div>
        <p className="text-gray-700 text-base">{blog.excerpt}</p>
        {/* <Link href={`/blog/${blog.slug}`}> */}
          <span className="text-primary font-semibold mt-4 inline-block hover:text-blue-600 transition duration-300 cursor-pointer">Read More</span>
        {/* </Link> */}
      </div>
    </div>
  );
};

export default BlogCard;
