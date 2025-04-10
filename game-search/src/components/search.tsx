'use client';
import React, { useState, useEffect, useCallback, JSX } from 'react';

interface GameStats {
  maxPay?: string;
  rtp?: string;
  lastWin?: string;
  totalBet?: string;
}

interface GameStatsMap {
  [key: string]: GameStats;
}

export default function Search(): JSX.Element {
  const [currentLetter, setCurrentLetter] = useState<string>('all');
  const [gameList, setGameList] = useState<string>('');
  const [gameStats, setGameStats] = useState<GameStatsMap>({});
  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const formatGameLink = (gameName: string): string => {
    return `https://wildz.com/nz/play/${gameName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')}`;
  };

  const search = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!searchTerm.trim() && currentLetter === 'all') {
        setResults([]);
        return;
      }

      if (!gameList) {
        const response = await fetch('/api/games');
        const newGameList = await response.text();
        setGameList(newGameList);
      }

      let filteredResults = gameList
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('#'));

      if (currentLetter !== 'all') {
        filteredResults = filteredResults.filter(game => {
          const firstChar = game.trim().charAt(0).toLowerCase();
          return currentLetter === '0-9' 
            ? !isNaN(Number(firstChar))
            : firstChar === currentLetter.toLowerCase();
        });
      }

      if (searchTerm.trim()) {
        filteredResults = filteredResults.filter(game => 
          game.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
      }

      setResults(filteredResults);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, currentLetter, gameList]);

  const handleStatUpdate = async (gameName: string, statType: keyof GameStats, value: string) => {
    setGameStats(prev => ({
      ...prev,
      [gameName]: {
        ...prev[gameName],
        [statType]: value
      }
    }));
    setPendingChanges(prev => new Set(prev).add(gameName));
  };

  const saveAllStats = async () => {
    if (isSaving || pendingChanges.size === 0) return;
    setIsSaving(true);

    try {
      const promises = Array.from(pendingChanges).map(async (gameName) => {
        const stats = gameStats[gameName];
        const response = await fetch(`/api/stats/${encodeURIComponent(gameName)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stats)
        });

        if (!response.ok) throw new Error(`Failed to save stats for ${gameName}`);
        return response.json();
      });

      await Promise.all(promises);
      setPendingChanges(new Set());
    } catch (error) {
      console.error('Error saving stats:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Search Input */}
        <div className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search games..."
          />
          <button
            onClick={() => search()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Alphabet Filter */}
        <div className="grid grid-cols-9 md:grid-cols-14 gap-2">
          <button
            onClick={() => setCurrentLetter('all')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              currentLetter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-blue-100'
            }`}
          >
            All
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setCurrentLetter(letter.toLowerCase())}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentLetter === letter.toLowerCase()
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-blue-100'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results.map((game) => (
            <div key={game} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <a
                  href={formatGameLink(game)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  {game}
                </a>
                <div className="flex gap-4">
                  {/* Game Stats Inputs */}
                  {/* Add your game stats inputs here */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}