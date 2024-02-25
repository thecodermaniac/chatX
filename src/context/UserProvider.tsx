import { useContext, createContext, useState } from "react";

interface userType {
  name: string;
  updateValue: (newValue: string) => void;
}

interface ProviderProps {
  children: any;
}
const userContext = createContext<userType | null>(null);

const useUser = (): userType => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};

export const UserProvider: React.FC<ProviderProps> = ({ children }) => {
  const [name, setName] = useState<string>("");

  const updateValue = (newValue: string) => {
    setName(newValue);
  };

  return (
    <userContext.Provider value={{ name, updateValue }}>
      {children}
    </userContext.Provider>
  );
};

export default useUser;
