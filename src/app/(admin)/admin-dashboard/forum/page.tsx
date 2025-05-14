"use client"
import React, { useState, useEffect } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, TrashIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { useSession } from "next-auth/react";
import { showToast } from '@/utils/toast';
import { formatDistanceToNow, format } from 'date-fns'; // Import format for exact time display

interface Comment {
  name: string;
  profile_picture: string;
  date: string;
  comment: string;
  user_id: string;
}

interface ForumQuestion {
  forum_id: string;
  title: string;
  description: string;
  image?: string;
  poster_name: string;
  profile_picture: string;
  posted_date: string;
  total_comments: number;
  user_id: string;
}

interface ForumDetails {
  comments: Comment[];
}

interface NewQuestion {
  title: string;
  description: string;
  image: File | null;
}

const SkeletonLoader = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-4 pt-4 border-t flex justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

const ForumPage: React.FC = () => {
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [questions, setQuestions] = useState<ForumQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeForumId, setActiveForumId] = useState<string | null>(null);
  const [forumDetails, setForumDetails] = useState<ForumDetails | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    description: ''
  });

  // Add new state variables for submission status
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState<boolean>(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [newQuestion, setNewQuestion] = useState<NewQuestion>({
    title: "",
    description: "",
    image: null
  });

  const fetchQuestions = async () => {
    if (!bearerToken) {
      showToast.error("Please login again");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/forum/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.status === "success") {
        setQuestions(data.data);
      } else {
        console.log(data.message || "Failed to fetch questions");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch questions";
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForumDetails = async (forumId: string) => {
    if (!bearerToken) {
      showToast.error("Please login again");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/forum/details/${forumId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.status === "success") {
        setForumDetails(data.data[0]);
        if (isEditing) {
          const question = questions.find(q => q.forum_id === forumId);
          if (question) {
            setEditData({
              title: question.title,
              description: question.description
            });
          }
        }
      } else {
        console.log(data.message || "Failed to fetch forum details");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch forum details";
      console.log(errorMessage);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [bearerToken]);

  useEffect(() => {
    if (activeForumId) {
      fetchForumDetails(activeForumId);
    }
  }, [activeForumId, bearerToken, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewQuestion(prev => ({
      ...prev,
      image: file
    }));
  };

  const formatDate = (dateString: string) => {
    try {
      const utcDate = new Date(dateString);
  
      // Shift to WAT manually (UTC+1, 60 mins ahead)
      const watOffsetMs = 60 * 60 * 1000;
      const watDate = new Date(utcDate.getTime() + watOffsetMs);
  
      const now = new Date();
      const nowWat = new Date(now.getTime() + watOffsetMs);
  
      const diffMs = nowWat.getTime() - watDate.getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
  
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  
      const isSameDay = watDate.getDate() === nowWat.getDate() &&
                        watDate.getMonth() === nowWat.getMonth() &&
                        watDate.getFullYear() === nowWat.getFullYear();
  
      if (isSameDay) return `Today at ${format(watDate, "h:mm a")}`;
  
      const yesterday = new Date(nowWat);
      yesterday.setDate(nowWat.getDate() - 1);
      const isYesterday = watDate.getDate() === yesterday.getDate() &&
                          watDate.getMonth() === yesterday.getMonth() &&
                          watDate.getFullYear() === yesterday.getFullYear();
  
      if (isYesterday) return `Yesterday at ${format(watDate, "h:mm a")}`;
  
      return format(watDate, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };
  
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bearerToken) {
      showToast.error("Please login again");
      return;
    }

    try {
      setIsSubmittingQuestion(true); // Set loading state when submission starts
      
      const formData = new FormData();
      formData.append('title', newQuestion.title);
      formData.append('description', newQuestion.description);
      if (newQuestion.image) {
        formData.append('image', newQuestion.image);
      }

      const response = await fetch(`${API_URL}/forum/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        body: formData
      });
      
      const data = await response.json();

      if (data.status === "success") {
        showToast.success("Question posted successfully");
        fetchQuestions();
        setIsModalOpen(false);
        setNewQuestion({ title: "", description: "", image: null });
      } else {
        showToast.error(data.message || "Failed to post question");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to post question";
      showToast.error(errorMessage);
    } finally {
      setIsSubmittingQuestion(false); // Reset loading state when done
    }
  };

  const handlePostComment = async (forumId: string) => {
    if (!bearerToken) {
      showToast.error("Please login again");
      return;
    }

    if (!newComment.trim()) {
      showToast.error("Please enter a comment");
      return;
    }

    try {
      setIsSubmittingComment(true); // Set loading state
      
      const response = await fetch(`${API_URL}/forum/post_comment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          forum_id: forumId,
          comment: newComment
        })
      });
      
      const data = await response.json();

      if (data.status === "success") {
        showToast.success("Comment posted successfully");
        setNewComment('');
        fetchForumDetails(forumId);
      } else {
        showToast.error(data.message || "Failed to post comment");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to post comment";
      showToast.error(errorMessage);
    } finally {
      setIsSubmittingComment(false); // Reset loading state
    }
  };

  const handleDeletePost = async (forumId: string) => {
    if (!bearerToken) {
      showToast.error("Please login again");
      return;
    }

    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setIsDeleting(forumId);
    try {
      const response = await fetch(`${API_URL}/admin/delete_forum`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: forumId
        })
      });
      
      const data = await response.json();

      if (data.status === "success") {
        showToast.success("Post deleted successfully");
        fetchQuestions();
        if (activeForumId === forumId) {
          setActiveForumId(null);
        }
      } else {
        showToast.error(data.message || "Failed to delete post");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete post";
      showToast.error(errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdatePost = async (forumId: string) => {
    if (!bearerToken) {
      showToast.error("Please login again");
      return;
    }

    try {
      setIsUpdating(true); // Set loading state
      
      const response = await fetch(`${API_URL}/forum/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          forum_id: forumId,
          title: editData.title,
          description: editData.description
        })
      });
      
      const data = await response.json();

      if (data.status === "success") {
        showToast.success("Post updated successfully");
        setIsEditing(null);
        fetchQuestions();
        fetchForumDetails(forumId);
      } else {
        showToast.error(data.message || "Failed to update post");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update post";
      showToast.error(errorMessage);
    } finally {
      setIsUpdating(false); // Reset loading state
    }
  };

  const isAdmin = session?.user?.role === 'admin';
  const currentUserId = session?.user?.userData?.id || session?.user?.id;

  return (
    <div className="bg-gray-50 min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Community Forum</h1>
              <p className="text-gray-600 mt-2">
                Ask questions, share knowledge, and get feedback from other developers.
              </p>
            </div>
            <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
              <Dialog.Trigger asChild>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium rounded-lg transition-colors flex items-center gap-2">
                  <Pencil1Icon className="w-5 h-5" />
                  Ask Question
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none">
                  <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">New Question</Dialog.Title>
                  <form onSubmit={handleSubmitQuestion} className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title*
                      </label>
                      <input
                        id="title"
                        name="title"
                        value={newQuestion.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="What's your question?"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description*
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={newQuestion.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px]"
                        required
                        placeholder="Provide more details about your question..."
                      />
                    </div>
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                        Image (Optional)
                      </label>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        onChange={handleImageChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/*"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <Dialog.Close asChild>
                        <button 
                          type="button" 
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          disabled={isSubmittingQuestion}
                        >
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center min-w-[100px]"
                        disabled={isSubmittingQuestion}
                      >
                        {isSubmittingQuestion ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : "Post Question"}
                      </button>
                    </div>
                  </form>
                  <Dialog.Close asChild>
                    <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" aria-label="Close">
                      <Cross2Icon className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </header>

        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchQuestions}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.forum_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <img
                        src={question.profile_picture}
                        alt={question.poster_name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{question.poster_name}</p>
                        <p className="text-sm text-gray-500" title={format(new Date(question.posted_date), "PPpp")}>
                          {formatDate(question.posted_date)}
                        </p>
                      </div>
                    </div>
                    {(isAdmin || currentUserId === question.user_id) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsEditing(question.forum_id);
                            setEditData({
                              title: question.title,
                              description: question.description
                            });
                          }}
                          className="text-gray-500 hover:text-blue-600 p-1"
                          title="Edit"
                          disabled={isDeleting === question.forum_id}
                        >
                          <Pencil1Icon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(question.forum_id)}
                          className="text-gray-500 hover:text-red-600 p-1"
                          title="Delete"
                          disabled={isDeleting === question.forum_id}
                        >
                          {isDeleting === question.forum_id ? (
                            <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <TrashIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing === question.forum_id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="title"
                        value={editData.title}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                      />
                      <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsEditing(null)}
                          className="px-3 py-1 text-sm border rounded-md"
                          disabled={isUpdating}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdatePost(question.forum_id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md min-w-[60px] flex items-center justify-center"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">{question.title}</h3>
                      <p className="text-gray-700 mb-4 whitespace-pre-line">{question.description}</p>
                      
                      {question.image && (
                        <img 
                          src={question.image} 
                          alt="Question" 
                          className="mb-4 rounded-lg max-w-full h-auto max-h-96 object-contain border" 
                        />
                      )}
                    </>
                  )}

                  {activeForumId === question.forum_id ? (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-4 text-gray-800">Comments ({question.total_comments})</h4>
                      {forumDetails?.comments.length ? (
                        <div className="space-y-4">
                          {forumDetails.comments.map((comment, index) => (
                            <div key={index} className="pl-4 border-l-2 border-gray-200">
                              <div className="flex items-center mb-2">
                                <img
                                  src={comment.profile_picture}
                                  alt={comment.name}
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                                <div>
                                  <p className="font-medium text-gray-800">{comment.name}</p>
                                  <p className="text-xs text-gray-500" title={format(new Date(comment.date), "PPpp")}>
                                    {formatDate(comment.date)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-gray-700 pl-10">{comment.comment}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No comments yet</p>
                      )}
                      
                      <div className="mt-6 flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Write a comment..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !isSubmittingComment) {
                              handlePostComment(question.forum_id);
                            }
                          }}
                          disabled={isSubmittingComment}
                        />
                        <button
                          onClick={() => handlePostComment(question.forum_id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md min-w-[80px] flex items-center justify-center"
                          disabled={isSubmittingComment}
                        >
                          {isSubmittingComment ? (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : "Post"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-gray-600">
                        {question.total_comments} comment{question.total_comments !== 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => setActiveForumId(question.forum_id)}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {question.total_comments ? 'View Discussion' : 'Start Discussion'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;