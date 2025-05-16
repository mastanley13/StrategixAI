import React, { useState } from 'react';
import { Link } from 'wouter';

interface DebugResponse {
  message: string;
  status: 'success' | 'error';
  statusCode?: number;
  contentType?: string;
  dataSnippet?: string;
  feedUrl?: string;
  error?: string;
  response?: {
    status: number;
    headers: Record<string, string>;
    data: string;
  } | null;
}

export default function BlogDebug() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DebugResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const checkRssFeed = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/debug/rss');
      const data = await response.json();
      setResult(data);
      
      if (!response.ok) {
        setError(`Error ${response.status}: ${data.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      setError(`Failed to check RSS feed: ${err.message}`);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Blog RSS Debug</h1>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Return to Blog
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">RSS Feed Status</h2>
          
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-6"
            onClick={checkRssFeed}
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Check RSS Feed'}
          </button>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {result && (
            <div className={`border-l-4 p-4 mb-6 ${
              result.status === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            }`}>
              <h3 className="font-bold mb-2">{result.message}</h3>
              
              {result.feedUrl && (
                <div className="mb-3">
                  <p className="font-semibold">Feed URL:</p>
                  <div className="bg-gray-100 p-2 rounded overflow-x-auto">
                    <code className="text-sm">{result.feedUrl}</code>
                  </div>
                </div>
              )}
              
              {result.status === 'success' && (
                <>
                  <p className="mb-2">
                    <span className="font-semibold">Status Code:</span> {result.statusCode}
                  </p>
                  
                  <p className="mb-2">
                    <span className="font-semibold">Content Type:</span> {result.contentType}
                  </p>
                  
                  {result.dataSnippet && (
                    <div className="mb-3">
                      <p className="font-semibold">Data Snippet:</p>
                      <div className="bg-gray-100 p-2 rounded overflow-x-auto max-h-56 overflow-y-auto">
                        <pre className="text-xs whitespace-pre-wrap">{result.dataSnippet}</pre>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {result.status === 'error' && result.response && (
                <>
                  <p className="mb-2">
                    <span className="font-semibold">Error:</span> {result.error}
                  </p>
                  
                  {result.response && (
                    <>
                      <p className="mb-2">
                        <span className="font-semibold">Response Status:</span> {result.response.status}
                      </p>
                      
                      <div className="mb-3">
                        <p className="font-semibold">Response Headers:</p>
                        <div className="bg-gray-100 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">
                          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result.response.headers, null, 2)}</pre>
                        </div>
                      </div>
                      
                      {result.response.data && (
                        <div className="mb-3">
                          <p className="font-semibold">Response Data:</p>
                          <div className="bg-gray-100 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">
                            <pre className="text-xs whitespace-pre-wrap">{result.response.data}</pre>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h3 className="font-semibold mb-2">Tips for Troubleshooting</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Make sure the RSS_FEED_URL is correctly set in the .env.local file</li>
              <li>Verify that special characters in the URL are properly encoded (& should be %26)</li>
              <li>Try opening the RSS feed URL directly in your browser to test accessibility</li>
              <li>If the URL is correct but still not working, check if the Go High Level RSS feed is active</li>
              <li>Verify network connectivity to the Go High Level servers</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Blog Sync</h2>
          <SyncBlogPosts />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Blog Posts in Database</h2>
          <FetchBlogPosts />
        </div>
      </div>
    </div>
  );
}

function SyncBlogPosts() {
  const [syncResult, setSyncResult] = useState<{imported: number} | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{count: number; titles: string[]} | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  const handleSync = async () => {
    setSyncLoading(true);
    setSyncError(null);
    
    try {
      const response = await fetch('/api/blog/sync', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setSyncError(`Error ${response.status}: ${data.message || 'Failed to sync blog posts'}`);
      } else {
        setSyncResult(data);
      }
    } catch (err: any) {
      setSyncError(`Failed to sync blog posts: ${err.message}`);
    } finally {
      setSyncLoading(false);
    }
  };
  
  const fetchSummary = async () => {
    setSummaryLoading(true);
    
    try {
      const response = await fetch('/api/blog/summary');
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json();
      setSummary(data);
    } catch (err: any) {
      console.error("Error fetching blog summary:", err);
    } finally {
      setSummaryLoading(false);
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete blog post #${id}?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      // Refresh summary after deletion
      fetchSummary();
    } catch (err: any) {
      alert(`Failed to delete blog post: ${err.message}`);
    }
  };
  
  return (
    <div>
      <div className="flex space-x-4 mb-6">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          onClick={handleSync}
          disabled={syncLoading}
        >
          {syncLoading ? 'Syncing...' : 'Sync RSS Feed Now'}
        </button>
        
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={fetchSummary}
          disabled={summaryLoading}
        >
          {summaryLoading ? 'Loading...' : 'Get Blog Summary'}
        </button>
      </div>
      
      {syncError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{syncError}</p>
        </div>
      )}
      
      {syncResult && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700">
            Blog posts synced successfully! Imported {syncResult.imported} new posts.
          </p>
        </div>
      )}
      
      {summary && (
        <div className="border p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">Blog Posts Summary</h3>
          <p className="mb-2">Total Posts: {summary.count}</p>
          
          {summary.titles.length > 0 ? (
            <div>
              <p className="font-semibold mb-2">Post Titles:</p>
              <ul className="list-disc list-inside">
                {summary.titles.map((title, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{title}</span>
                    <button
                      onClick={() => {
                        // Get the actual post ID from the fetch posts response
                        const postId = index + 1; // Placeholder - this should come from API
                        handleDelete(postId);
                      }} 
                      className="text-red-600 hover:text-red-800 text-sm ml-4"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500">No blog posts found.</p>
          )}
        </div>
      )}
    </div>
  );
}

function FetchBlogPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setPosts(data);
      
      if (!response.ok) {
        setError(`Error ${response.status}: Failed to fetch blog posts`);
      }
    } catch (err: any) {
      setError(`Failed to fetch blog posts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 mb-6"
        onClick={fetchPosts}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Blog Posts'}
      </button>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {posts.length > 0 ? (
        <div>
          <p className="mb-4">Found {posts.length} blog posts in the database:</p>
          
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border p-4 rounded">
                <h3 className="font-bold">{post.title}</h3>
                <p className="text-sm text-gray-500">ID: {post.id}, GHL ID: {post.ghlId || 'N/A'}</p>
                <p className="text-sm text-gray-500">
                  Published: {new Date(post.publishedAt).toLocaleDateString()}
                </p>
                {post.lastFetched && (
                  <p className="text-sm text-gray-500">
                    Last Fetched: {new Date(post.lastFetched).toLocaleString()}
                  </p>
                )}
                <p className="mt-2">{post.excerpt.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        posts.length === 0 && !loading && !error && (
          <p className="text-gray-500">No blog posts found in the database.</p>
        )
      )}
    </div>
  );
} 