import { useState, useEffect } from 'react'
import { ChatBar } from './components/ChatBar'

// Bionic reading: bold the first portion of each word
function toBionic(text) {
  return text.split(/(\s+)/).map((segment, i) => {
    // If it's whitespace, return as-is
    if (/^\s+$/.test(segment)) {
      return segment
    }
    // For words, bold the first ~40% of letters
    const boldLength = Math.ceil(segment.length * 0.4)
    const boldPart = segment.slice(0, boldLength)
    const normalPart = segment.slice(boldLength)
    return (
      <span key={i}>
        <strong>{boldPart}</strong>{normalPart}
      </span>
    )
  })
}

function App() {
  const [bookData, setBookData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [bookmarks, setBookmarks] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [bionicMode, setBionicMode] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [jumpToPage, setJumpToPage] = useState('')

  // Load book data
  useEffect(() => {
    fetch('/behavior_ops_manual.json')
      .then(res => res.json())
      .then(data => setBookData(data))
  }, [])

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookmarks')
    if (saved) setBookmarks(JSON.parse(saved))

    const savedDark = localStorage.getItem('darkMode')
    if (savedDark) setDarkMode(JSON.parse(savedDark))

    const savedBionic = localStorage.getItem('bionicMode')
    if (savedBionic !== null) setBionicMode(JSON.parse(savedBionic))

    const savedPage = localStorage.getItem('currentPage')
    if (savedPage) setCurrentPage(JSON.parse(savedPage))
  }, [])

  // Auto-scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [currentPage])

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Save bionic mode preference
  useEffect(() => {
    localStorage.setItem('bionicMode', JSON.stringify(bionicMode))
  }, [bionicMode])

  // Save current page
  useEffect(() => {
    localStorage.setItem('currentPage', JSON.stringify(currentPage))
  }, [currentPage])

  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter(p => p !== currentPage))
    } else {
      setBookmarks([...bookmarks, currentPage].sort((a, b) => a - b))
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim() || !bookData) return

    const results = []
    const query = searchQuery.toLowerCase()

    bookData.pages.forEach(page => {
      if (page.content.toLowerCase().includes(query)) {
        const index = page.content.toLowerCase().indexOf(query)
        const start = Math.max(0, index - 50)
        const end = Math.min(page.content.length, index + query.length + 50)
        const snippet = '...' + page.content.slice(start, end) + '...'
        results.push({ page: page.page, snippet })
      }
    })

    setSearchResults(results)
  }

  const handleJumpToPage = (e) => {
    e.preventDefault()
    const pageNum = parseInt(jumpToPage)
    if (pageNum >= 1 && pageNum <= bookData.total_pages) {
      setCurrentPage(pageNum)
      setJumpToPage('')
    }
  }

  if (!bookData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  const currentContent = bookData.pages[currentPage - 1]?.content || ''
  const isBookmarked = bookmarks.includes(currentPage)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 px-4 py-3 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold truncate">{bookData.title}</h1>
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => { setShowSearch(!showSearch); setShowBookmarks(false) }}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Bookmarks button */}
            <button
              onClick={() => { setShowBookmarks(!showBookmarks); setShowSearch(false) }}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Bookmarks"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {/* Bionic reading toggle */}
            <button
              onClick={() => setBionicMode(!bionicMode)}
              className={`p-2 rounded-lg font-bold text-sm ${bionicMode ? 'bg-blue-600 text-white' : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Toggle bionic reading"
              title="Bionic Reading"
            >
              <span className="w-5 h-5 flex items-center justify-center"><strong>B</strong>io</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search Panel */}
      {showSearch && (
        <div className={`px-4 py-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search in book..."
                className={`flex-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className={`max-h-60 overflow-y-auto rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                {searchResults.map((result, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentPage(result.page); setShowSearch(false) }}
                    className={`w-full text-left px-3 py-2 border-b last:border-b-0 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}
                  >
                    <div className="font-medium text-sm">Page {result.page}</div>
                    <div className="text-xs opacity-70 truncate">{result.snippet}</div>
                  </button>
                ))}
              </div>
            )}
            {searchResults.length === 0 && searchQuery && (
              <p className="text-sm opacity-70">No results found</p>
            )}
          </div>
        </div>
      )}

      {/* Bookmarks Panel */}
      {showBookmarks && (
        <div className={`px-4 py-4 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-medium mb-2">Bookmarks</h2>
            {bookmarks.length === 0 ? (
              <p className="text-sm opacity-70">No bookmarks yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {bookmarks.map(page => (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); setShowBookmarks(false) }}
                    className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Page {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className={`p-8 rounded-xl min-h-[60vh] whitespace-pre-wrap leading-loose text-center text-xl md:text-2xl lg:text-3xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
            {bionicMode ? toBionic(currentContent) : currentContent}
          </div>
        </div>
      </main>

      {/* Bottom fixed container for footer + chat */}
      <div className="sticky bottom-0 z-10">
        {/* Footer Navigation */}
        <footer className={`px-4 py-3 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Prev button */}
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg disabled:opacity-30 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Previous page"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page info and jump */}
            <div className="flex items-center gap-3">
              <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
                <input
                  type="number"
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.target.value)}
                  placeholder={currentPage.toString()}
                  min="1"
                  max={bookData.total_pages}
                  className={`w-16 px-2 py-1 text-center rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
                <span className="text-sm opacity-70">/ {bookData.total_pages}</span>
              </form>

              {/* Bookmark current page */}
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>

            {/* Next button */}
            <button
              onClick={() => setCurrentPage(p => Math.min(bookData.total_pages, p + 1))}
              disabled={currentPage === bookData.total_pages}
              className={`p-2 rounded-lg disabled:opacity-30 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Next page"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </footer>

        {/* Chat Bar */}
        <ChatBar
          darkMode={darkMode}
          currentPage={currentPage}
          pageContent={currentContent}
          bookTitle={bookData.title}
        />
      </div>
    </div>
  )
}

export default App
