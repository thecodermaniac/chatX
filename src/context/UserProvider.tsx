import { useContext, createContext, useState } from "react";

interface DynamicObject {
  [key: string]: any;
}
interface userType {
  User: DynamicObject;
  setUser: React.Dispatch<React.SetStateAction<DynamicObject>>;
  Receiver: string;
  setReceiver: React.Dispatch<React.SetStateAction<string>>;
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
  const [User, setUser] = useState<Object>({});
  const [Receiver, setReceiver] = useState("");

  return (
    <userContext.Provider value={{ User, setUser, Receiver, setReceiver }}>
      {children}
    </userContext.Provider>
  );
};

export default useUser;
