import React, { useContext, createContext, useState, ReactNode } from "react";

// The shape of the User object stored in localStorage/Context
export interface UserProfile {
  userId: number;
  userTag: string; // This is the unique username (e.g., aritra123)
  displayName?: string;
  token?: string;
}

interface UserContextType {
  User: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  Receiver: string; // Stores the Display Name of the active chat
  setReceiver: React.Dispatch<React.SetStateAction<string>>;
}

const userContext = createContext<UserContextType | null>(null);

// Custom Hook
const useUser = (): UserContextType => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<ProviderProps> = ({ children }) => {
  
  // === FIX IS HERE ===
  // Initialize state by reading from localStorage immediately.
  // This persists the login state even if the page is refreshed.
  const [User, setUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem("chatX-User");
    return savedUser 
      ? JSON.parse(savedUser) 
      : { userId: 0, userTag: "", displayName: "" }; // Default if nothing found
  });

  const [Receiver, setReceiver] = useState("Global");

  return (
    <userContext.Provider value={{ User, setUser, Receiver, setReceiver }}>
      {children}
    </userContext.Provider>
  );
};

export default useUser;