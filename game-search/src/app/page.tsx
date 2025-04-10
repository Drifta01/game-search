'use client';
import React, { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SearchType = 'name' | 'alphabet' | 'provider';

export default function Home(): JSX.Element {
  const [searchType, setSearchType] = useState<SearchType>('name');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (): Promise<void> => {
    setIsLoading(true);
    // Implement search logic here
    setIsLoading(false);
  };

  const handleSearchTypeChange = (type: SearchType): void => {
    setSearchType(type);
    setIsDropdownOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Pokie Game Search</h1>
      </div>
      
      <div className="relative mb-6">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Search Options
        </button>
        {isDropdownOpen && (
          <div className="absolute mt-2 w-full md:w-48 bg-white shadow-lg rounded-lg overflow-hidden z-10">
            <button 
              onClick={() => handleSearchTypeChange('name')}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${searchType === 'name' ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              Search by Name
            </button>
            <button 
              onClick={() => handleSearchTypeChange('alphabet')}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${searchType === 'alphabet' ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              Search by Alphabet
            </button>
            <button 
              onClick={() => handleSearchTypeChange('provider')}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${searchType === 'provider' ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              Search by Provider
            </button>
          </div>
        )}
      </div>
      
      {searchType === 'name' && (
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pokies..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>
      )}
      
      {searchType === 'alphabet' && (
        <div className="grid grid-cols-7 md:grid-cols-14 gap-2 mb-6">
          <button 
            className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
            onClick={() => handleSearch()}
          >
            All
          </button>
        </div>
      )}
      
      <div className="flex justify-end mb-6">
        <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
          Save
        </button>
      </div>
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
