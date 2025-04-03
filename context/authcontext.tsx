import { ID } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { account } from "@/services/config/appwrite";
import { toast } from "@/components/atoms/toast/toast";

// Define types for the user and context
type User = {
  $id: string;
  email: string;
  // Add other user properties as needed
};

type UserContextType = {
  current: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  toast: (message: string) => void;
};

// Create the context with an initial undefined value
const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export default function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  async function login(email: string, password: string): Promise<void> {
    await account.createEmailPasswordSession(email, password);
    const userDetails = await account.get();
    setUser(userDetails as User);
    toast('Welcome back. You are logged in');
  }

  async function logout(): Promise<void> {
    await account.deleteSession("current");
    setUser(null);
    toast('Logged out');
  }

  async function register(email: string, password: string): Promise<void> {
    await account.create(ID.unique(), email, password);
    await login(email, password);
    toast('Account created');
  }

  async function init(): Promise<void> {
    try {
      const loggedIn = await account.get();
      setUser(loggedIn as User);
      toast('Welcome back. You are logged in');
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{ current: user, login, logout, register, toast }}>
      {children}
    </UserContext.Provider>
  );
}