import { useContext, createContext, useState } from "react";

interface DynamicObject {
  [key: string]: any;
}
interface userType {
  User: DynamicObject;
  setUser: React.Dispatch<React.SetStateAction<DynamicObject>>;
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

  return (
    <userContext.Provider value={{ User, setUser }}>
      {children}
    </userContext.Provider>
  );
};

export default useUser;
