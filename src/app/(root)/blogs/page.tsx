"use client"
import BlogCard from '@/components/blogs/BlogCard';
import HeroSection from '@/components/shared/HeroSection';
import React, { useState } from 'react';

const Blogs: React.FC = () => {
  // Example data for blog posts
  const blogs = [
    {
      title: "The Future of Web Development",
      excerpt: "A deep dive into the emerging trends in web development and how they will shape the future of the internet.",
      imageUrl: "https://via.placeholder.com/500x300",
      date: "Dec 13, 2024",
      author: "John Doe",
      category: "Programming"
    },
    {
      title: "JavaScript ES2024 Features",
      excerpt: "Exploring the new features of JavaScript and how they improve developer productivity and code readability.",
      imageUrl: "https://via.placeholder.com/500x300",
      date: "Dec 10, 2024",
      author: "John Doe",
      category: "Programming"
    },
    {
      title: "Designing for Mobile First",
      excerpt: "A guide on how to design modern websites that are optimized for mobile first, with best practices and tips.",
      imageUrl: "https://via.placeholder.com/500x300",
      date: "Dec 5, 2024",
      author: "Elizabeth Sey Doe",
      category: "Design"
    },
    // Add more blog data as needed
  ];

  // Get unique categories from the blog data
  const categories = Array.from(new Set(blogs.map(blog => blog.category)));

  // State to manage the selected category
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter blogs based on the selected category
  const filteredBlogs = selectedCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  return (
    <>
      <HeroSection 
        image="https://images.unsplash.com/photo-1701889297494-16eb5bc8dca6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
        title="Let's Talk" 
        subTitle='My Insightful Blogs' 
      />
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Category filter */}
        <div className="mb-8 flex justify-center space-x-4">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === 'All' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800 hover:bg-primary hover:text-white'}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800 hover:bg-primary hover:text-white'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Display filtered blogs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog, index) => (
            <BlogCard key={index} blog={blog} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Blogs;
