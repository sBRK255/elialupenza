import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card"; // Updated import path
import { Button } from "./components/ui/button"; // Updated import path
import { Input } from "./components/ui/input"; // Updated import path
import { FaMoon, FaSun } from "react-icons/fa";
import { db } from "./firebase/config"; // Updated import path
import { onSnapshot, collection, addDoc } from "firebase/firestore"; // Removed updateDoc and doc
import { createPortal } from "react-dom"; // Import createPortal for rendering emojis outside the main DOM tree
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique IDs

export default function TributePage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderName, setSenderName] = useState(""); // New state for sender's name
  const [candles, setCandles] = useState(0); // Track total candles
  const [theme, setTheme] = useState("dark");
  const [emojis, setEmojis] = useState([]); // State to track animated emojis
  const [userCandles, setUserCandles] = useState({}); // Track candles lighted by each person

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(fetchedMessages.sort((a, b) => (b.candles || 0) - (a.candles || 0))); // Sort by candles
    });
    return () => unsubscribe();
  }, []);

  const triggerEmojiAnimation = (count) => {
    const newEmojis = Array.from({ length: count }, () => ({
      id: uuidv4(), // Generate a unique ID for each emoji
      left: Math.random() * 100, // Random horizontal position
    }));
    setEmojis((prev) => [...prev, ...newEmojis]);

    // Remove emojis after animation
    setTimeout(() => {
      setEmojis((prev) => prev.filter((emoji) => !newEmojis.includes(emoji)));
    }, 3000); // Match animation duration
  };

  const addMessage = async () => {
    if (newMessage.trim() && senderName.trim()) {
      const candlesByUser = userCandles[senderName] || 0; // Get the current candle count for the user
      const messageData = { text: newMessage, sender: senderName, candles: candlesByUser };
      await addDoc(collection(db, "messages"), messageData); // Add the message with the correct candle count
      setNewMessage("");
      setSenderName("");
      triggerEmojiAnimation(candlesByUser); // Trigger emoji animation with the number of candles lighted
      setUserCandles((prev) => ({
        ...prev,
        [senderName]: 0, // Reset the user's candle count AFTER posting the message
      }));
      setCandles(0); // Reset the total candle count
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    document.documentElement.classList.toggle("dark");
  };

  const lightCandle = (name) => {
    setCandles((prev) => prev + 1); // Increment the total candle count
    setUserCandles((prev) => ({
      ...prev,
      [name]: (prev[name] || 0) + 1, // Increment the user's candle count
    }));
  };

  return (
    <div className={`flex flex-col items-center min-h-screen ${theme === "dark" ? "bg-dark-pattern text-white" : "bg-light-pattern text-black"} p-6`}>
      <audio autoPlay loop controls style={{ display: "none" }}>
        <source src="/background-music.mp3" type="audio/mpeg" />
        <source src="/background-music.ogg" type="audio/ogg" />
        <source src="/background-music.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
      <header className="w-full py-4 bg-opacity-80 backdrop-blur-md shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-3xl font-bold tracking-wide glow-text">In Loving Memory of Elia Lupenza</h1>
          <Button onClick={toggleTheme} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform">
            {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
          </Button>
        </div>
      </header>
      <div className="flex flex-col items-center mt-8">
        <img src="/elia.jpeg" alt="Elia Lupenza" className="w-40 h-40 rounded-full shadow-lg mb-6 border-4 border-white" />
        <p className="text-lg text-center italic">Gone but never forgotten. May his soul rest in peace. 🕊️</p>
      </div>
      
      <div className="flex items-center mt-8">
        <Button onClick={() => lightCandle(senderName)} className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105">
          Light a Candle ({candles})
        </Button>
      </div>
      
      <div className="mt-10 w-full max-w-lg">
        <Input
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="Your Name"
          className="text-black mb-4 border-gray-300 rounded-lg shadow-lg"
        />
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Leave a message..."
          className="text-black border-gray-300 rounded-lg shadow-lg"
        />
        <Button onClick={addMessage} className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-lg font-bold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105">Post Message</Button>
      </div>
      
      <div className="mt-10 w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center glow-text">Messages</h2>
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className="mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">{msg.sender}</p>
                  <p className="text-sm italic text-gray-200">Candles: {msg.candles || 0}</p>
                </div>
                <p className="text-sm text-gray-100">{msg.text}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Render animated emojis */}
      {createPortal(
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          {emojis.map((emoji) => (
            <div
              key={emoji.id}
              className="absolute text-3xl animate-float"
              style={{
                left: `${emoji.left}%`,
                animationDuration: "3s",
              }}
            >
              ❤️
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
