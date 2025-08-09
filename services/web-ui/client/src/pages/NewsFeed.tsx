import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types';
import { getMarketNews } from '../services/api';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import Modal from '../components/Modal';

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoading, setIsLoading } = useAppContext();

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        const newsData = await getMarketNews();
        setArticles(newsData);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, [setIsLoading]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success-500 bg-success-50 dark:bg-success-900/20';
      case 'negative':
        return 'text-error-500 bg-error-50 dark:bg-error-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-700';
    }
  };

  const openArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market News</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Card key={article.id}>
            <div
              className="cursor-pointer group"
              onClick={() => openArticle(article)}
            >
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-200"
              />
              
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getSentimentColor(article.sentiment)}`}
                >
                  {article.sentiment}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{article.source}</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                {article.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                {article.summary}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {formatDate(article.publishedAt)}
                </div>
                <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Article Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedArticle?.title || ''}
      >
        {selectedArticle && (
          <div className="space-y-4">
            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getSentimentColor(selectedArticle.sentiment)}`}
              >
                {selectedArticle.sentiment}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{selectedArticle.source}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar size={16} className="mr-2" />
              {formatDate(selectedArticle.publishedAt)}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-4">
                {selectedArticle.summary}
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedArticle.content}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NewsFeed;