"use client";
import React, { useState, useEffect, useRef } from 'react';
import '@/app/index.css';
import Image from 'next/image';
import Upcoming from './UpcomingSeminars';
import ActiveConferences from './UpcomingConferences';
import { format, parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';
import { ChevronLeft, ChevronRight, RefreshCw, Calendar, Clock, Bold, Italic, Underline, Image as ImageIcon, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface NewsItem {
  news_id: string;
  title: string;
  date: string;
  time: string;
  image?: string;
  description: string;
}

const NewsPage = () => {
  const { data: session, status } = useSession();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newNews, setNewNews] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    image: null as File | null
  });
  const itemsPerPage = 5;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/list_news`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const result = await response.json();
      if (result.status === 'success' && result.data) {
        setNews(result.data);
        if (result.data.length > 0) {
          setSelectedNews(result.data[0]);
        }
      } else {
        throw new Error('No news data available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bearerToken) {
      fetchNews();
    }
  }, [bearerToken]);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM do, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hourNum = parseInt(hours);
      const period = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum % 12 || 12;
      return `${displayHour}:${minutes} ${period}`;
    } catch {
      return timeString;
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(news.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsSelect = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshNews = () => {
    setCurrentPage(1);
    setSelectedNews(null);
    setLoading(true);
    setError(null);
    fetchNews();
  };

  // Rich text formatting functions
  const formatText = (formatType: 'bold' | 'italic' | 'underline') => {
    if (!descriptionRef.current) return;
    
    const textarea = descriptionRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (!selectedText) return;
    
    let formattedText = '';
    switch (formatType) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
    }
    
    const newValue = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end);
    
    setNewNews({ ...newNews, description: newValue });
    
    // Focus back on the textarea and restore selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewNews({ ...newNews, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      if (!newNews.image) {
        throw new Error('Cover image is required');
      }
      
      const formData = new FormData();
      formData.append('title', newNews.title);
      formData.append('description', newNews.description);
      formData.append('date', newNews.date);
      formData.append('time', newNews.time);
      formData.append('image', newNews.image);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/add_news`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to add news');
      }
      
      if (result.status === 'success') {
        setShowAddModal(false);
        setNewNews({
          title: '',
          description: '',
          date: '',
          time: '',
          image: null
        });
        refreshNews();
      } else {
        throw new Error(result.message || 'Failed to add news');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state using basic divs
  const LoadingPlaceholder = () => (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );

  return (
    <div className='flex flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24 ]'>
      {/* Main content */}
      <div className='lg:w-[70%] w-full bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6'>
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">News & Updates</h1>
          {/* <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add News
          </Button> */}
        </div>

        {loading ? (
          <LoadingPlaceholder />
        ) : error ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
            <button 
              onClick={refreshNews}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : selectedNews ? (
          <>
            <div className='space-y-4'>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
                {selectedNews.title}
              </h1>
              
              <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300'>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedNews.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(selectedNews.time)}</span>
                </div>
              </div>
              
              <div className='relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700'>
                {selectedNews.image ? (
                  <Image 
                    src={selectedNews.image} 
                    alt={selectedNews.title} 
                    fill
                    className='object-cover'
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/placeholder-news.jpg';
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No image available</p>
                  </div>
                )}
              </div>
              
              <div className='prose dark:prose-invert max-w-none pt-4'>
                <div dangerouslySetInnerHTML={{ __html: selectedNews.description }} />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No news available at this time.</p>
          </div>
        )}
        
        {/* News Archive */}
        {news.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">News Archive</h2>
            <div className="space-y-4">
              {currentNews.map((item) => (
                <div 
                  key={item.news_id} 
                  className={`p-4 rounded-lg transition-all cursor-pointer ${
                    selectedNews?.news_id === item.news_id 
                      ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' 
                      : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                  }`}
                  onClick={() => handleNewsSelect(item)}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-20 h-20 relative rounded overflow-hidden bg-gray-200 dark:bg-gray-600">
                      {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/placeholder-news.jpg';
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded-md ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white'
                            : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Sidebar content */}
      <div className='lg:w-[30%] w-full space-y-6'>
        <div className='max-h-[150px] overflow-y-scroll'>
        <Upcoming/>
        </div>
        <div className='max-h-[150px] overflow-y-scroll'>
        <ActiveConferences/>
        </div>
      </div>

      {/* Add News Modal */}
      <Modal 
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormError(null);
        }}
        title="Add New News"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-md text-red-700 dark:text-red-300">
              {formError}
            </div>
          )}
          
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newNews.title}
              onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={newNews.date}
              onChange={(e) => setNewNews({ ...newNews, date: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={newNews.time}
              onChange={(e) => setNewNews({ ...newNews, time: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="image">Cover Image (Required)</Label>
            <div className="mt-1 flex items-center gap-2">
              <Label 
                htmlFor="image-upload"
                className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                {newNews.image ? newNews.image.name : 'Choose Image'}
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                required
              />
              {newNews.image && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setNewNews({ ...newNews, image: null })}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <div className="mb-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('bold')}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('italic')}
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => formatText('underline')}
              >
                <Underline className="w-4 h-4" />
              </Button>
            </div>
            <Textarea
              id="description"
              ref={descriptionRef}
              value={newNews.description}
              onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
              rows={8}
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Use HTML tags or the buttons above to format text
            </p>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setFormError(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NewsPage;