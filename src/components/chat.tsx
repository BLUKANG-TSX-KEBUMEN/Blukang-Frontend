// 'use client'

// import React, { useState, useRef, useEffect } from 'react'
// import { MessageCircle, X, Send, Minimize2, Loader2 } from 'lucide-react'

// interface Message {
//   id: string
//   content: string
//   sender: 'user' | 'admin'
//   senderName?: string
//   createdAt: string
// }

// const ChatPopover: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isMinimized, setIsMinimized] = useState(false)
//   const [messages, setMessages] = useState<Message[]>([])
//   const [inputText, setInputText] = useState('')
//   const [name, setName] = useState('')
//   const [isNameSet, setIsNameSet] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [lastFetch, setLastFetch] = useState<Date>(new Date(0))

//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const intervalRef = useRef<NodeJS.Timeout | null>(null)

//   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

//   // Get or create session ID
//   const getSessionId = () => {
//     if (typeof window === 'undefined') return ''
    
//     let sessionId = localStorage.getItem('chat_session_id')
//     if (!sessionId) {
//       sessionId = crypto.randomUUID()
//       localStorage.setItem('chat_session_id', sessionId)
//     }
//     return sessionId
//   }

//   const sessionId = getSessionId()

//   // Auto scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   // Fetch messages - full or incremental
//   const fetchMessages = async (useSince: boolean = false) => {
//     if (!sessionId) return

//     try {
//       let url = `${BASE_URL}/chat/public/${sessionId}/messages`
      
//       // Use 'since' for polling to get only new messages
//       if (useSince && lastFetch.getTime() > 0) {
//         url = `${BASE_URL}/chat/public/${sessionId}/messages/since?since=${lastFetch.toISOString()}`
//       }

//       const res = await fetch(url)
      
//       if (!res.ok) {
//         throw new Error('Failed to fetch messages')
//       }

//       const data = await res.json()
//       const newMessages = Array.isArray(data) ? data : data.data || data.messages || []

//       if (useSince && newMessages.length > 0) {
//         // Append only new messages
//         setMessages(prev => {
//           const existingIds = new Set(prev.map(m => m.id))
//           const filtered = newMessages.filter((m: Message) => !existingIds.has(m.id))
//           return [...prev, ...filtered]
//         })
//       } else if (!useSince) {
//         // Full refresh
//         setMessages(newMessages)
//       }

//       setLastFetch(new Date())
//     } catch (err) {
//       console.error('Failed to load chat:', err)
//     }
//   }

//   // Start polling when chat is opened and name is set
//   useEffect(() => {
//     if (!isOpen || !isNameSet) {
//       // Clear interval if chat is closed
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current)
//         intervalRef.current = null
//       }
//       return
//     }

//     // Initial full fetch
//     fetchMessages(false)

//     // Poll for new messages every 3 seconds
//     intervalRef.current = setInterval(() => {
//       fetchMessages(true)
//     }, 3000)

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current)
//       }
//     }
//   }, [isOpen, isNameSet])

//   // Send message
//   const handleSendMessage = async () => {
//     if (!inputText.trim() || !isNameSet || loading) return

//     const messageContent = inputText.trim()
//     setInputText('')
//     setLoading(true)

//     try {
//       const res = await fetch(`${BASE_URL}/chat/public/message`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           sessionId,
//           content: messageContent,
//           name,
//         }),
//       })

//       if (!res.ok) {
//         throw new Error('Failed to send message')
//       }

//       // Immediately fetch to show the sent message
//       await fetchMessages(false)
//     } catch (err) {
//       console.error('Send error:', err)
//       alert('Gagal mengirim pesan, silakan coba lagi')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Handle name submission
//   const handleNameSubmit = () => {
//     if (!name.trim()) return
    
//     // Save name to localStorage
//     localStorage.setItem('chat_user_name', name)
//     setIsNameSet(true)
//   }

//   // Load saved name on mount
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const savedName = localStorage.getItem('chat_user_name')
//       if (savedName) {
//         setName(savedName)
//         setIsNameSet(true)
//       }
//     }
//   }, [])

//   // Handle Enter key in name input
//   const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       e.preventDefault()
//       handleNameSubmit()
//     }
//   }

//   // Handle Enter key in message input
//   const handleMessageKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       handleSendMessage()
//     }
//   }

//   // Format time
//   const formatTime = (date: string) => {
//     return new Date(date).toLocaleTimeString('id-ID', {
//       hour: '2-digit',
//       minute: '2-digit',
//     })
//   }

//   return (
//     <>
//       {/* Floating Button */}
//       <button
//         onClick={() => {
//           setIsOpen(true)
//           setIsMinimized(false)
//         }}
//         className={`fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
//           isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
//         }`}
//         aria-label="Open chat"
//       >
//         <MessageCircle className="w-6 h-6" />
//       </button>

//       {/* Chat Window */}
//       <div
//         className={`fixed bottom-6 right-6 z-50 w-96 max-w-[95vw] transition-all duration-300 ${
//           isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
//         }`}
//       >
//         <div
//           className={`bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-300 ${
//             isMinimized ? 'h-14' : 'h-[550px]'
//           }`}
//         >
//           {/* HEADER */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
//                 <MessageCircle className="w-5 h-5" />
//               </div>
//               <div>
//                 <span className="font-semibold text-sm block">Customer Support</span>
//                 <div className="flex items-center gap-1">
//                   <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
//                   <span className="text-[11px] opacity-80">Online</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setIsMinimized(!isMinimized)}
//                 className="p-1 hover:bg-white/20 rounded-lg transition-colors"
//                 aria-label="Minimize chat"
//               >
//                 <Minimize2 className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => {
//                   setIsOpen(false)
//                   setIsMinimized(false)
//                 }}
//                 className="p-1 hover:bg-white/20 rounded-lg transition-colors"
//                 aria-label="Close chat"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* === NAME INPUT SCREEN === */}
//           {!isMinimized && !isNameSet && (
//             <div className="p-6 bg-gradient-to-b from-gray-50 to-white h-[494px] flex flex-col justify-center items-center gap-4">
//               <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
//                 <MessageCircle className="w-8 h-8 text-blue-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800">Selamat Datang!</h3>
//               <p className="text-sm text-gray-600 text-center px-4">
//                 Silakan masukkan nama Anda untuk memulai percakapan
//               </p>
//               <input
//                 placeholder="Masukkan nama anda..."
//                 className="w-72 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 onKeyPress={handleNameKeyPress}
//                 autoFocus
//               />
//               <button
//                 disabled={!name.trim()}
//                 onClick={handleNameSubmit}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
//               >
//                 Mulai Chat
//               </button>
//             </div>
//           )}

//           {/* === CHAT CONTENT === */}
//           {!isMinimized && isNameSet && (
//             <>
//               {/* MESSAGES */}
//               <div className="h-[410px] overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white space-y-3">
//                 {messages.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center h-full text-gray-400">
//                     <MessageCircle className="w-12 h-12 mb-2 opacity-30" />
//                     <p className="text-sm">Mulai percakapan Anda</p>
//                   </div>
//                 ) : (
//                   messages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`flex ${
//                         msg.sender === 'user' ? 'justify-end' : 'justify-start'
//                       }`}
//                     >
//                       <div
//                         className={`px-4 py-2.5 rounded-2xl max-w-[80%] shadow-sm ${
//                           msg.sender === 'user'
//                             ? 'bg-blue-600 text-white rounded-br-sm'
//                             : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
//                         }`}
//                       >
//                         {msg.sender === 'admin' && msg.senderName && (
//                           <div className="text-xs font-semibold text-blue-600 mb-1">
//                             {msg.senderName}
//                           </div>
//                         )}
//                         <div className="text-sm whitespace-pre-wrap break-words">
//                           {msg.content}
//                         </div>
//                         <div
//                           className={`text-[11px] mt-1 ${
//                             msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
//                           }`}
//                         >
//                           {formatTime(msg.createdAt)}
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}

//                 <div ref={messagesEndRef} />
//               </div>

//               {/* INPUT FIELD */}
//               <div className="p-3 border-t bg-white">
//                 <div className="flex gap-2 items-center">
//                   <input
//                     value={inputText}
//                     onChange={(e) => setInputText(e.target.value)}
//                     onKeyPress={handleMessageKeyPress}
//                     placeholder="Ketik pesan..."
//                     disabled={loading}
//                     className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all disabled:opacity-50"
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!inputText.trim() || loading}
//                     className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//                     aria-label="Send message"
//                   >
//                     {loading ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <Send className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// export default ChatPopover