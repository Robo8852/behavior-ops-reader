import { useState, useEffect, useRef } from 'react'
import { useAction, useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useVoiceRecording } from '../hooks/useVoiceRecording'

export function ChatBar({ darkMode, currentPage, pageContent, bookTitle }) {
  const [input, setInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const { isRecording, transcript, isSupported, startRecording, stopRecording, clearTranscript } = useVoiceRecording()

  // Convex hooks
  const messages = useQuery(api.chat.getMessages) || []
  const sendMessage = useMutation(api.chat.sendMessage)
  const askClaude = useAction(api.agent.askClaude)

  // Auto-fill input when voice recording completes
  useEffect(() => {
    if (transcript && !isRecording) {
      setInput(transcript)
      clearTranscript()
    }
  }, [transcript, isRecording, clearTranscript])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const question = input.trim()
    setInput('')
    setIsExpanded(true)
    setIsLoading(true)

    try {
      // Save user message
      await sendMessage({
        content: question,
        role: 'user',
        pageNumber: currentPage
      })

      // Get AI response
      await askClaude({
        question,
        pageContent,
        pageNumber: currentPage,
        bookTitle
      })
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const bgColor = darkMode ? 'bg-gray-800' : 'bg-white'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300'
  const messageBg = darkMode ? 'bg-gray-700' : 'bg-gray-100'

  return (
    <div className={`${bgColor} border-t ${borderColor}`}>
      {/* Messages area - shows when expanded */}
      {isExpanded && messages.length > 0 && (
        <div className={`max-h-48 overflow-y-auto px-4 py-3 border-b ${borderColor}`}>
          <div className="max-w-4xl mx-auto space-y-2">
            {messages.slice(-10).map((msg) => (
              <div
                key={msg._id}
                className={`text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : messageBg
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <span className={`inline-block px-3 py-2 rounded-lg ${messageBg}`}>
                  <span className="animate-pulse">Thinking...</span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-2">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? 'Listening...' : 'Ask about this page...'}
            disabled={isLoading}
            className={`flex-1 px-3 py-2 rounded-lg border text-sm ${inputBg} disabled:opacity-50`}
          />

          {/* Mic button */}
          {isSupported && (
            <button
              type="button"
              onClick={handleMicClick}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : darkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
              } disabled:opacity-50`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>

      {/* Collapse button when expanded */}
      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className={`w-full py-1 text-xs opacity-50 hover:opacity-100 ${borderColor} border-t`}
        >
          Hide chat
        </button>
      )}
    </div>
  )
}
