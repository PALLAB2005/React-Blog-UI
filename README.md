# React Blog UI:

A modern and responsive React-based blog interface that displays blog posts dynamically from a JSON file. The project includes search and filter functionality to help users quickly find relevant posts.

## 🚀 Project Overview:

This project is built with React and demonstrates how to create a dynamic blog layout using reusable components.

Blog posts are stored in a JSON file and rendered dynamically using React. Users can search for posts by title or content and filter posts based on categories.

## 🎯 Objectives:

- Build a React-based blog layout
- Display blog posts dynamically from JSON data
- Create reusable React components
- Implement search functionality
- Implement category filtering
- Practice React state management
- Practice dynamic rendering
- Create a responsive user interface

## ✨ Features:

- 📝 Dynamic blog post cards
- 🔍 Search blog posts
- 🏷️ Filter posts by category
- 📄 JSON-based blog data
- ⚛️ Reusable React components
- 📱 Responsive design
- 🎨 Clean and modern UI
- ⚡ Fast client-side filtering

## 🧩 Main Components:

### Header:

Contains the blog title and navigation elements.

### SearchBar:

Allows users to search blog posts by entering keywords.

```jsx
<SearchBar
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
/>
