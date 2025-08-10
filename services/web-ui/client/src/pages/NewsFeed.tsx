import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Search } from 'lucide-react';
import { Article } from '../types';
import { getMarketNews } from '../services/api';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import Modal from '../components/Modal';

const NewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyword, setKeyword] = useState('market');
  const { isLoading, setIsLoading } = useAppContext();

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        const newsData = await getMarketNews(keyword);
        setArticles(newsData.articles);
      } catch (error) {
        console.error('Failed to load news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, [setIsLoading, keyword]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newKeyword = formData.get('keyword') as string;
    setKeyword(newKeyword);
  };

  const openArticle = (article: Article) => {
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
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            name="keyword"
            defaultValue={keyword}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            placeholder="Search news..."
          />
          <button
            type="submit"
            className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <Card key={index}>
            <div
              className="cursor-pointer group"
              onClick={() => openArticle(article)}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                {article.author}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {article.source.name}
                </div>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedArticle?.title || ''}
      >
        {selectedArticle && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
              {selectedArticle.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
              {selectedArticle.author}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {selectedArticle.source.name}
              </div>
              <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NewsFeed;