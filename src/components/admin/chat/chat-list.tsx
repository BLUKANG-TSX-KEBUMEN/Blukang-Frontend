// "use client"

// import { useEffect, useState, useRef } from "react"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Badge } from "@/components/ui/badge"
// import { MessageSquare, Send, Clock, CheckCircle2, User } from "lucide-react"

// interface Message {
//   id: string
//   content: string
//   sender: 'user' | 'admin'
//   senderName?: string
//   createdAt: string
// }

// interface PendingSession {
//   sessionId: string
//   userName?: string
//   lastMessage?: string
//   unreadCount?: number
//   createdAt: string
// }

// export default function AdminChat() {
//   const [pending, setPending] = useState<PendingSession[]>([])
//   const [messages, setMessages] = useState<Message[]>([])
//   const [activeSession, setActiveSession] = useState<string | null>(null)
//   const [replyText, setReplyText] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [lastFetch, setLastFetch] = useState<Date>(new Date(0))
  
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const intervalRef = useRef<NodeJS.Timeout | null>(null)

//   const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null
//   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

//   // Auto scroll to bottom
// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
// //   }, [messages])

//   // Fetch pending sessions
//   const loadPending = async () => {
//     if (!token) return
    
//     try {
//       const res = await fetch(`${BASE_URL}/chat/admin/pending`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       })
      
//       if (!res.ok) throw new Error('Failed to fetch pending sessions')
      
//       const data = await res.json()
//       setPending(Array.isArray(data) ? data : data.data || [])
//     } catch (error) {
//       console.error('Error loading pending sessions:', error)
//     }
//   }

//   // Fetch messages for active session with polling
//   const loadMessages = async (sessionId: string, useSince: boolean = false) => {
//     if (!token) return
    
//     try {
//       let url = `${BASE_URL}/chat/public/${sessionId}/messages`
      
//       // Use 'since' parameter for polling to get only new messages
//       if (useSince && lastFetch.getTime() > 0) {
//         url = `${BASE_URL}/chat/public/${sessionId}/messages/since?since=${lastFetch.toISOString()}`
//       }
      
//       const res = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       })
      
//       if (!res.ok) throw new Error('Failed to fetch messages')
      
//       const data = await res.json()
//       const newMessages = Array.isArray(data) ? data : data.data || []
      
//       if (useSince && newMessages.length > 0) {
//         // Append new messages only
//         setMessages(prev => [...prev, ...newMessages])
//       } else if (!useSince) {
//         // Full refresh
//         setMessages(newMessages)
//       }
      
//       setLastFetch(new Date())
//     } catch (error) {
//       console.error('Error loading messages:', error)
//     }
//   }

//   // Handle session selection
//   const handleSelectSession = (sessionId: string) => {
//     setActiveSession(sessionId)
//     setLastFetch(new Date(0)) // Reset last fetch time
//     loadMessages(sessionId, false) // Full load
    
//     // Clear existing interval
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current)
//     }
    
//     // Start polling for new messages every 3 seconds
//     intervalRef.current = setInterval(() => {
//       loadMessages(sessionId, true)
//     }, 3000)
//   }

//   // Send admin reply
//   const sendReply = async () => {
//     if (!replyText.trim() || !activeSession || !token) return

//     setLoading(true)
//     try {
//       const res = await fetch(`${BASE_URL}/chat/admin/${activeSession}/reply`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ content: replyText })
//       })

//       if (!res.ok) throw new Error('Failed to send reply')

//       setReplyText("")
      
//       // Reload messages to show the new reply
//       await loadMessages(activeSession, false)
      
//       // Refresh pending list
//       await loadPending()
//     } catch (error) {
//       console.error('Error sending reply:', error)
//       alert('Gagal mengirim pesan')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Admin takeover (start handling conversation)
//   const handleTakeover = async () => {
//     if (!activeSession || !token) return

//     setLoading(true)
//     try {
//       const res = await fetch(`${BASE_URL}/chat/admin/${activeSession}/takeover`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ 
//           content: "Halo, saya dari tim support. Ada yang bisa saya bantu?" 
//         })
//       })

//       if (!res.ok) throw new Error('Failed to takeover')

//       await loadMessages(activeSession, false)
//       await loadPending()
//     } catch (error) {
//       console.error('Error taking over:', error)
//       alert('Gagal mengambil alih percakapan')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Format timestamp
//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleTimeString('id-ID', {
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   // Initial load and cleanup
//   useEffect(() => {
//     loadPending()
    
//     // Refresh pending list every 10 seconds
//     const pendingInterval = setInterval(loadPending, 10000)
    
//     return () => {
//       clearInterval(pendingInterval)
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current)
//       }
//     }
//   }, [])

//   // Handle keyboard shortcut (Ctrl/Cmd + Enter to send)
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
//       e.preventDefault()
//       sendReply()
//     }
//   }

//   return (
//     <div className="grid grid-cols-12 gap-6 h-[85vh] p-4">

//       {/* Left panel — Pending Sessions */}
//       <Card className="col-span-4 flex flex-col">
//         <CardHeader className="border-b">
//           <div className="flex items-center justify-between">
//             <CardTitle className="flex items-center gap-2">
//               <MessageSquare className="w-5 h-5" />
//               Pending Chats
//             </CardTitle>
//             <Badge variant="secondary">{pending.length}</Badge>
//           </div>
//         </CardHeader>
        
//         <ScrollArea className="flex-1">
//           <CardContent className="space-y-2 pt-4">
//             {pending.length === 0 ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
//                 <p className="text-sm">Tidak ada chat pending</p>
//               </div>
//             ) : (
//               pending.map((session) => (
//                 <Button
//                   key={session.sessionId}
//                   variant={activeSession === session.sessionId ? "default" : "outline"}
//                   className="w-full justify-start h-auto py-3 px-3"
//                   onClick={() => handleSelectSession(session.sessionId)}
//                 >
//                   <div className="flex flex-col items-start gap-1 w-full">
//                     <div className="flex items-center justify-between w-full">
//                       <div className="flex items-center gap-2">
//                         <User className="w-4 h-4" />
//                         <span className="font-semibold text-sm">
//                           {session.userName || 'Anonymous'}
//                         </span>
//                       </div>
//                       {session.unreadCount && session.unreadCount > 0 && (
//                         <Badge variant="destructive" className="text-xs">
//                           {session.unreadCount}
//                         </Badge>
//                       )}
//                     </div>
//                     <span className="text-xs opacity-70 truncate w-full text-left">
//                       {session.sessionId.substring(0, 8)}...
//                     </span>
//                   </div>
//                 </Button>
//               ))
//             )}
//           </CardContent>
//         </ScrollArea>
//       </Card>

//       {/* Right panel — Chat Messages */}
//       <Card className="col-span-8 flex flex-col">
//         <CardHeader className="border-b">
//           <div className="flex items-center justify-between">
//             <CardTitle className="flex items-center gap-2">
//               {activeSession ? (
//                 <>
//                   <CheckCircle2 className="w-5 h-5 text-green-500" />
//                   Chat Session
//                   <Badge variant="outline" className="font-mono text-xs">
//                     {activeSession.substring(0, 8)}
//                   </Badge>
//                 </>
//               ) : (
//                 <>
//                   <Clock className="w-5 h-5" />
//                   Pilih Sesi Chat
//                 </>
//               )}
//             </CardTitle>
            
//             {activeSession && (
//               <Button 
//                 size="sm" 
//                 variant="secondary"
//                 onClick={handleTakeover}
//                 disabled={loading}
//               >
//                 Ambil Alih
//               </Button>
//             )}
//           </div>
//         </CardHeader>

//         {!activeSession ? (
//           <CardContent className="flex-1 flex items-center justify-center">
//             <div className="text-center text-muted-foreground">
//               <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
//               <p className="text-lg font-medium">Pilih sesi chat</p>
//               <p className="text-sm">untuk memulai percakapan</p>
//             </div>
//           </CardContent>
//         ) : (
//           <>
//             {/* Messages Area */}
//             <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-slate-50 to-white">
//               {messages.length === 0 ? (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <p className="text-sm">Belum ada pesan</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {messages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`flex ${
//                         msg.sender === "admin" ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
//                           msg.sender === "admin"
//                             ? "bg-blue-600 text-white rounded-br-sm"
//                             : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
//                         }`}
//                       >
//                         {msg.senderName && msg.sender === 'user' && (
//                           <p className="text-xs font-semibold mb-1 opacity-70">
//                             {msg.senderName}
//                           </p>
//                         )}
//                         <p className="text-sm whitespace-pre-wrap break-words">
//                           {msg.content}
//                         </p>
//                         <p className={`text-xs mt-1 ${
//                           msg.sender === "admin" ? "text-blue-100" : "text-gray-500"
//                         }`}>
//                           {formatTime(msg.createdAt)}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                   <div ref={messagesEndRef} />
//                 </div>
//               )}
//             </ScrollArea>

//             {/* Reply Input */}
//             <div className="p-4 border-t bg-white space-y-3">
//               <Textarea
//                 placeholder="Ketik balasan... (Ctrl+Enter untuk kirim)"
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 className="min-h-[80px] resize-none"
//                 disabled={loading}
//               />
//               <div className="flex gap-2">
//                 <Button 
//                   className="flex-1" 
//                   onClick={sendReply}
//                   disabled={!replyText.trim() || loading}
//                 >
//                   <Send className="w-4 h-4 mr-2" />
//                   {loading ? 'Mengirim...' : 'Kirim Pesan'}
//                 </Button>
//               </div>
//             </div>
//           </>
//         )}
//       </Card>

//     </div>
//   )
// }