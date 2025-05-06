// context/authcontext.tsx
import { ID, Models } from "react-native-appwrite";
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
import { router } from "expo-router";
//import { client } from "@/utils/config/supabase";
//import { EmailOtpType, Session,User as UserInterface } from '@supabase/supabase-js'// Define types for the user and context
import { makeRedirectUri } from 'expo-auth-session'

type User = {
  $id: string;
  email: string;
  // Add other user properties as needed
};
type UserBool = {
  current: boolean;

}
interface emailpasswordCreds {
  email: string;
  password: string;
}
interface OtpCreds {
  email: string;
  redirectUrl: string;
}

type UserContextType = {
  current: Models.User<Models.Preferences> | null; //check if there's a user
  isLoading: boolean;
  login: (creds: emailpasswordCreds | OtpCreds, otp?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, token: string, type: string | "email") => Promise<void>;
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
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { initializeUserId } = useStore();
  async function login(
    creds: emailpasswordCreds | OtpCreds,
    otp: boolean = false
  ): Promise<void> {
    try {
      if (otp) {
        const { email, redirectUrl } = creds as OtpCreds;
        await account.createEmailToken(ID.unique(), email);
        //await client.auth.signInWithOtp({email:email })
      }
      else {

        const { email, password } = creds as emailpasswordCreds;
        const appwriteLogin = await account.createEmailPasswordSession(email, password);
        const getaccount = await account.get();
        const userDetails = await account.get();
        console.log("user details acquired");
        initializeUserId(userDetails.$id!);

        setUser(userDetails!);
        console.log(user);

        ToastGlue("Welcome back. You are logged in");
      }
    } catch (error) {
      //console.error("Login error:", error);
      ToastGlue("Login failed. Please check your credentials.");
      throw error;
    }
  }
  async function verifyOtp(email: string, token: string, type: string): Promise<void> {
    try {
      //      const result = await account.createSession;
      const userDetails = await account.get()
      console.log("user details acquired");
      initializeUserId(userDetails.$id!);

      setUser(userDetails!);
      console.log(user);

      ToastGlue("Welcome back. You are logged in");
    }
    catch (e) {

    }
    finally {

    }
  }

  async function logout(): Promise<void> {
    try {
      await account.deleteSession("current");

      initializeUserId("");
      setUser(null);
      //router.replace("/(app)");
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
      const result = await login({ email, password });
      console.log(result);
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
      initializeUserId(loggedIn?.$id!);
      setUser(loggedIn!);
    } catch (err) {
      initializeUserId("");
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
      value={{ current: user, isLoading, login, logout, register, Toast, verifyOtp }}
    >
      {children}
    </UserContext.Provider>
  );
}
