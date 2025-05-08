/* eslint-disable import/no-unresolved */
import {
  Bars3Icon,
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  EyeIcon,
  UserCircleIcon,
  FilmIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const moviesMock = [
    {
      title: 'Dune',
      year: 2021,
      userRating: 6.1,
      imdbRating: 6.93,
      poster: 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    },
    {
      title: 'The Matrix',
      year: 1999,
      userRating: 6.5,
      imdbRating: 8.57,
      poster: 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg',
    },
    {
      title: 'Interstellar',
      year: 2014,
      userRating: 6.1,
      imdbRating: 6.98,
      poster: 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    },
    {
      title: 'The Dark Knight',
      year: 2008,
      userRating: 6.5,
      imdbRating: 7.75,
      poster: 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    },
    {
      title: 'Pulp Fiction',
      year: 1994,
      userRating: 6.1,
      imdbRating: 8.79,
      poster: 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg',
    },
    {
      title: 'Fight Club',
      year: 1999,
      userRating: 6.5,
      imdbRating: 7.75,
      poster: 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    },
    {
      title: 'Forrest Gump',
      year: 1994,
      userRating: 8.1,
      imdbRating: 8.95,
      poster: 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    },
    {
      title: 'The Social Network',
      year: 2010,
      userRating: 7.5,
      imdbRating: 9.0,
      poster: 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg',
    },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-blue-950 text-white transition-transform duration-200 
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    sm:relative sm:translate-x-0 sm:inset-0`}>
        <div className="flex items-center px-4 py-4">
          <FilmIcon className="w-8 h-8 text-blue-300 mr-2" />
          <span className="text-lg font-semibold">MovieTracker</span>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <a href="#" className="flex items-center px-4 py-2 bg-blue-700 bg-opacity-50 rounded-md">
                <HomeIcon className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 mt-2 hover:bg-blue-700 hover:bg-opacity-50 rounded-md">
                <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
                <span>Browse</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 mt-2 hover:bg-blue-700 hover:bg-opacity-50 rounded-md">
                <HeartIcon className="w-5 h-5 mr-3" />
                <span>Favorites</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-2 mt-2 hover:bg-blue-700 hover:bg-opacity-50 rounded-md">
                <EyeIcon className="w-5 h-5 mr-3" />
                <span>Watched</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col p-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              className="sm:hidden p-2 text-gray-400 hover:text-gray-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 ml-2 sm:ml-0">MovieTracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300">
              <UserCircleIcon className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-500">Total Movies</h3>
            <p className="text-3xl font-bold text-gray-800">128</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-500">To Watch</h3>
            <p className="text-3xl font-bold text-gray-800">32</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-500">Watched</h3>
            <p className="text-3xl font-bold text-gray-800">96</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Movie List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {moviesMock.map((movie) => (
            <div key={movie.title} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={movie.poster} alt={movie.title} className="w-full h-auto object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {movie.title} <span className="font-normal text-gray-500">({movie.year})</span>
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded mr-2">
                    {movie.userRating}
                  </span>
                  <span className="bg-gray-100 text-gray-800 font-medium px-2 py-1 rounded mr-2">
                    {movie.imdbRating}
                  </span>
                  <button className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200">
                    Add to Favorites
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
