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
import useStore from "@/store/lumaGeneration/useStore";
// Define types for the user and context
type User = {
  $id: string;
  email: string;
  // Add other user properties as needed
};

type UserContextType = {
  current: User | null; //check if there's a user
  isLoading: boolean;
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
  const {initializeUserId} = useStore();
  async function login(email: string, password: string): Promise<void> {
    try {
      await account.createEmailPasswordSession(email, password);
      const userDetails = await account.get();
      initializeUserId(userDetails.$id)

      setUser(userDetails as User);
      ToastGlue("Welcome back. You are logged in");
    } catch (error) {
      //console.error("Login error:", error);
      ToastGlue("Login failed. Please check your credentials.");
      throw error;
    }
  }

  async function logout(): Promise<void> {
    try {
      await account.deleteSession("current");
      initializeUserId("")
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
      ToastGlue("Account created successfully");
    } catch (error) {
      console.error("Registration error:", error);
      ToastGlue("Registration failed");
      throw error;
    }
  }

  async function checkSession(): Promise<void> {
    try {
      setIsLoading(true);
      const loggedIn = await account.get();
      initializeUserId(loggedIn.$id)
      setUser(loggedIn as User);
    } catch (err) {
      initializeUserId("")
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  function Toast(message: string): void {
    ToastGlue(message);
  }

  // Only check session once on component mount
  useEffect(() => {
    checkSession();
  }, []); // Empty dependency array prevents infinite loop

  return (
    <UserContext.Provider
      value={{ current: user, isLoading, login, logout, register, Toast }}
    >
      {children}
    </UserContext.Provider>
  );
}
