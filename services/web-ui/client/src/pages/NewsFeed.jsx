import React, { useState, useEffect } from 'react';
import { fetchMarketNews } from '../services/api';
import { Clock, ExternalLink, X } from 'lucide-react';

function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const data = await fetchMarketNews();
        setNews(data);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const filteredNews = news.filter(article => {
    if (filter === 'all') return true;
    return article.sentiment === filter;
  });

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-success-50 text-success-700 border-success-200';
      case 'negative':
        return 'bg-danger-50 text-danger-700 border-danger-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Market News
        </h1>
        
        {/* Filter buttons */}
        <div className="flex space-x-2">
          {['all', 'positive', 'neutral', 'negative'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="grid gap-6">
        {filteredNews.map((article) => (
          <article
            key={article.id}
            className="card p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedArticle(article)}
          >
            <div className="flex items-start space-x-4">
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSentimentColor(article.sentiment)}`}>
                    {article.sentiment}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(article.publishedAt).toLocaleString()}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {article.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                  {article.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-600">
                    {article.source}
                  </span>
                  
                  <div className="flex space-x-1">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSelectedArticle(null)} />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getSentimentColor(selectedArticle.sentiment)}`}>
                    {selectedArticle.sentiment}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedArticle.source}
                  </span>
                </div>
                
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-6">
                {selectedArticle.imageUrl && (
                  <img
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedArticle.title}
                </h1>
                
                <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(selectedArticle.publishedAt).toLocaleString()}
                  </div>
                  <div className="flex space-x-1">
                    {selectedArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {selectedArticle.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsFeed;