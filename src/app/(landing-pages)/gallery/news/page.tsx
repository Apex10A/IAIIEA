// "use client";
// import React, { useState, useEffect } from 'react';
// import '@/app/index.css';
// import Image from 'next/image';
// import Upcoming from './UpcomingSeminars';
// import ActiveConferences from './UpcomingConferences';
// import { format } from 'date-fns';
// import { useSession } from 'next-auth/react';

// const Page = () => {
//   const { data: session, status } = useSession();
//   const [news, setNews] = useState<NewsItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   interface NewsItem {
//     news_id: string;
//     title: string;
//     date: string;
//     time: string;
//     image?: string;
//     description: string;
//   }

//   const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const bearerToken = session?.user?.token || session?.user?.userData?.token;

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         // Get the bearer token from your authentication system
        
        
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/list_news`, {
//           headers: {
//             'Authorization': `Bearer ${`eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDIzMzM3NjUsImV4cCI6MTc3Mzg2OTc2NSwidWlkIjoxLCJ1c2VyX3R5cGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIn0.ZjVj1ZpHDVF6RteWrz-_PpWKn13yZz75jYTEf8Zvt-M`}`
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch news');
//         }
        
//         const result = await response.json();
//         if (result.status === 'success' && result.data) {
//           setNews(result.data);
//           // Set the first news item as selected by default
//           if (result.data.length > 0) {
//             setSelectedNews(result.data[0]);
//           }
//         } else {
//           throw new Error('No news data available');
//         }
//       } catch (err) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError('An unknown error occurred');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchNews();
//   }, []);

//   // Format date to display in a more readable format
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return format(date, 'MMMM do, yyyy');
//   };

//   // Calculate pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(news.length / itemsPerPage);

//   // Handle pagination
//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   // Handle news selection
//   const handleNewsSelect = (newsItem: any) => {
//     setSelectedNews(newsItem);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <div className='flex flex-col lg:flex-row lg:h-full py-28 px-6 md:px-10 gap-6'>
//       {/* Main content */}
//       <div className='lg:w-[70%] w-full bg-gray-100 py-6 px-8 md:px-10 rounded-lg'>
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : error ? (
//           <div className="text-red-500 text-center py-8">
//             <p>{error}</p>
//             <button 
//               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               onClick={() => window.location.reload()}
//             >
//               Retry
//             </button>
//           </div>
//         ) : selectedNews ? (
//           <>
//             <div className='w-full'>
//               <h1 className='text-2xl md:text-3xl lg:text-4xl max-w-2xl font-semibold text-[#0B142F] pb-3'>
//                 {selectedNews.title}
//               </h1>
//             </div>
//             <div className='flex items-center justify-between text-sm md:text-base'>
//               <div>
//                 <p>News</p>
//               </div>
//               <div>
//                 <p>{formatDate(selectedNews.date)}</p>
//                 <p>{selectedNews.time}</p>
//               </div>
//             </div>
            
//             <div className='w-full md:w-[80%] lg:w-[90%] xl:w-[700px] py-4'>
//               {selectedNews.image ? (
//                 <Image 
//                   src={selectedNews.image} 
//                   alt={selectedNews.title} 
//                   width={700} 
//                   height={200} 
//                   className='rounded-lg object-cover'
//                 />
//               ) : (
//                 <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
//                   <p className="text-gray-500">No image available</p>
//                 </div>
//               )}
//             </div>
            
//             <div className='py-6'>
//               <div className="text-sm md:text-lg" dangerouslySetInnerHTML={{ __html: selectedNews.description }} />
//             </div>
//           </>
//         ) : (
//           <div className="text-center py-8">
//             <p>No news available at this time.</p>
//           </div>
//         )}
        
//         {/* News Archive */}
//         {news.length > 0 && (
//           <div className="mt-8 border-t pt-6">
//             <h2 className="text-xl font-semibold mb-4">News Archive</h2>
//             <div className="space-y-4">
//               {currentNews.map((item: NewsItem) => (
//                 <div 
//                   key={item.news_id} 
//                   className={`p-4 rounded-lg cursor-pointer transition-all ${selectedNews && selectedNews.news_id === item.news_id ? 'bg-blue-100' : 'bg-white hover:bg-gray-50'}`}
//                   onClick={() => handleNewsSelect(item)}
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="w-24 h-24 flex-shrink-0">
//                       {item.image ? (
//                         <img 
//                           src={item.image} 
//                           alt={item.title} 
//                           className="w-full h-full object-cover rounded"
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
//                           <span className="text-xs text-gray-500">No image</span>
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex-grow">
//                       <h3 className="font-medium text-[#0B142F] line-clamp-2">{item.title}</h3>
//                       <p className="text-sm text-gray-500 mt-1">{formatDate(item.date)}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-6 gap-2">
//                 <button 
//                   onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
//                   disabled={currentPage === 1}
//                   className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//                 >
//                   Previous
//                 </button>
//                 {[...Array(totalPages)].map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => paginate(index + 1)}
//                     className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}
//                 <button 
//                   onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
//                   disabled={currentPage === totalPages}
//                   className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
      
//       {/* Sidebar content */}
//       <div className='lg:w-[30%] w-full flex flex-col gap-4'>
//         <Upcoming/>
//         <ActiveConferences/>
//       </div>
//     </div>
//   );
// };

// export default Page;
"use client";
import React, { useState, useEffect } from 'react';
import '@/app/index.css';
import Image from 'next/image';
import Upcoming from './UpcomingSeminars';
import ActiveConferences from './UpcomingConferences';
import { format, parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';
import { ChevronLeft, ChevronRight, RefreshCw, Calendar, Clock } from 'lucide-react';

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
  const itemsPerPage = 5;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/list_news`, {
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
    <div className='flex flex-col lg:flex-row gap-6 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
      {/* Main content */}
      <div className='lg:w-[70%] w-full bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6'>
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
        <Upcoming/>
        <ActiveConferences/>
      </div>
    </div>
  );
};

export default NewsPage;
