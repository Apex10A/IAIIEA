import React, { useState, useEffect } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useSession } from "next-auth/react";

const ForumPage = () => {
  const { data: session } = useSession();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeForumId, setActiveForumId] = useState(null);
  const [forumDetails, setForumDetails] = useState(null);
  const [newComment, setNewComment] = useState('');

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    image: null
  });

  // Fetch all questions
  const fetchQuestions = async () => {
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
      }
    } catch (err) {
      setError("Failed to fetch questions");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch forum details
  const fetchForumDetails = async (forumId) => {
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
      }
    } catch (err) {
      console.error("Failed to fetch forum details:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (activeForumId) {
      fetchForumDetails(activeForumId);
    }
  }, [activeForumId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewQuestion(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmitQuestion = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    try {
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
        fetchQuestions(); // Refresh the questions list
        setIsModalOpen(false);
        setNewQuestion({ title: "", description: "", image: null });
      }
    } catch (err) {
      console.error("Failed to post question:", err);
    }
  };

  const handlePostComment = async (forumId: any) => {
    try {
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
        setNewComment('');
        fetchForumDetails(forumId);
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="bg-gray-200 px-5 py-5 mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Community Forum</h1>
        </div>
      </header>

      <div className="container mx-auto px-4">
        {/* Forum Description and Ask Button */}
        <div className="flex items-center justify-between mb-8">
          <p className="max-w-[60%]">
            Ask questions, share knowledge, and get feedback from other developers.
          </p>
          <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Dialog.Trigger asChild>
              <button className="bg-[#203a87] text-white px-6 py-3 font-semibold rounded-full hover:bg-[#1a2f6e] transition-colors">
                + Ask Question
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
              <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none">
                <form onSubmit={handleSubmitQuestion} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      value={newQuestion.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newQuestion.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md min-h-[150px]"
                      required
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
                      className="w-full"
                      accept="image/*"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button type="submit" className="bg-[#203a87] text-white px-4 py-2 rounded-md">
                      Post Question
                    </button>
                  </div>
                </form>
                <Dialog.Close asChild>
                  <button className="absolute top-4 right-4" aria-label="Close">
                    <Cross2Icon />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        {/* Questions List */}
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.forum_id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={question.profile_picture}
                    alt={question.poster_name}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{question.poster_name}</p>
                    <p className="text-sm text-gray-500">{new Date(question.posted_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3">{question.title}</h3>
                <p className="text-gray-700 mb-4">{question.description}</p>
                
                {question.image && (
                  <img src={question.image} alt="Question" className="mb-4 rounded-lg max-w-[60%]" />
                )}

                {activeForumId === question.forum_id ? (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold mb-4">Comments</h4>
                    {forumDetails?.comments.map((comment, index) => (
                      <div key={index} className="mb-4 pl-4 border-l-2">
                        <div className="flex items-center mb-2">
                          <img
                            src={comment.profile_picture}
                            alt={comment.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <p className="font-medium">{comment.name}</p>
                            <p className="text-sm text-gray-500">{new Date(comment.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-md"
                        placeholder="Write a comment..."
                      />
                      <button
                        onClick={() => handlePostComment(question.forum_id)}
                        className="bg-[#203a87] text-white px-4 py-2 rounded-md"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-gray-600">
                      {question.total_comments} comments
                    </span>
                    <button
                      onClick={() => setActiveForumId(question.forum_id)}
                      className="text-[#203a87] hover:underline"
                    >
                      View Discussion
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;