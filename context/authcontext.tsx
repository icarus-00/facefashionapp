// context/authcontext.tsx
import { ID } from "react-native-appwrite";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { account } from "@/services/config/appwrite";
import { ToastGlue } from "@/context/toastContext";

// Define types for the user and context
type User = {
  $id: string;
  email: string;
  // Add other user properties as needed
};

type UserContextType = {
  current: User | null;
  isLoading: boolean; // Add loading state
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  Toast: (message: string) => void;
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

export default function UserProvider({
  children,
}: UserProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function login(email: string, password: string): Promise<void> {
    try {
      await account.createEmailPasswordSession(email, password);
      const userDetails = await account.get();
      setUser(userDetails as User);
      ToastGlue("Welcome back. You are logged in");
    } catch (error) {
      console.error("Login error:", error);
      ToastGlue("Login failed. Please check your credentials.");
      throw error;
    }
  }

  async function logout(): Promise<void> {
    try {
      await account.deleteSession("current");
      setUser(null);
      ToastGlue("Logged out");
    } catch (error) {
      console.error("Logout error:", error);
      ToastGlue("Failed to log out");
      throw error;
    }
  }

  async function register(email: string, password: string): Promise<void> {
    try {
      await account.create(ID.unique(), email, password);
      await login(email, password);
      ToastGlue("Account created");
    } catch (error) {
      console.error("Registration error:", error);
      ToastGlue("Registration failed");
      throw error;
    }
  }

  async function init(): Promise<void> {
    setIsLoading(true);
    try {
      const loggedIn = await account.get();
      setUser(loggedIn as User);
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  function Toast(message: string): void {
    ToastGlue(message);
  }

  useEffect(() => {
    init();
  }, []); // Remove the dependencies to prevent infinite loops

  return (
    <UserContext.Provider
      value={{ current: user, isLoading, login, logout, register, Toast }}
    >
      {children}
    </UserContext.Provider>
  );
}
