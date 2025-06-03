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
import { grabUserStatus } from "@/services/config/user-optin";

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

// Test mode type for enabling mock data usage
interface TestModeConfig {
  enabled: boolean;
  mockUserId?: string;
  mockEmail?: string;
}

type UserContextType = {
  current: Models.User<Models.Preferences> | null; //check if there's a user
  isLoading: boolean;
  login: (creds: emailpasswordCreds | OtpCreds, otp?: boolean) => Promise<void | Models.Token>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, token: string, type: string | "email", userId: string) => Promise<void>;
  Toast: (message: string) => void;
  testMode: TestModeConfig;
  enableTestMode: (config?: Partial<TestModeConfig>) => void;
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
  const [testMode, setTestMode] = useState<TestModeConfig>({ enabled: false });
  const { initializeUserId } = useStore();

  // Function to enable test mode with optional configuration
  function enableTestMode(config?: Partial<TestModeConfig>): void {
    const newConfig = {
      ...testMode,
      ...config,
      enabled: config?.enabled !== undefined ? config.enabled : true
    };
    setTestMode(newConfig);
    console.log("Test mode enabled:", newConfig);

    // If test mode is enabled and we have mock user data, set it immediately
    if (newConfig.enabled && newConfig.mockUserId) {
      const mockUser = {
        $id: newConfig.mockUserId,
        email: newConfig.mockEmail || "test@example.com",
      } as Models.User<Models.Preferences>;

      setUser(mockUser);
      initializeUserId(mockUser.$id);
      ToastGlue("Test mode active: Using mock user data");
    }
  }

  async function login(
    creds: emailpasswordCreds | OtpCreds,
    otp: boolean = false
  ): Promise<void | Models.Token> {
    try {
      // If test mode is enabled, bypass actual authentication
      if (testMode.enabled) {
        console.log("Test mode active: Bypassing actual authentication");
        const mockUser = {
          $id: testMode.mockUserId || "test-user-id",
          email: testMode.mockEmail || ("email" in creds ? creds.email : "test@example.com"),
        } as Models.User<Models.Preferences>;

        setUser(mockUser);
        initializeUserId(mockUser.$id);
        ToastGlue("Test mode: You are logged in");
        return;
      }

      if (otp) {
        const { email, redirectUrl } = creds as OtpCreds;
        const token = await account.createEmailToken(ID.unique(), email);
        return token;

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
  async function verifyOtp(email: string, token: string, type: string, userId: string): Promise<void> {
    try {
      // If test mode is enabled, bypass actual verification
      if (testMode.enabled) {
        console.log("Test mode active: Bypassing OTP verification");
        const mockUser = {
          $id: testMode.mockUserId || userId || "test-user-id",
          email: testMode.mockEmail || email || "test@example.com",
        } as Models.User<Models.Preferences>;

        setUser(mockUser);
        initializeUserId(mockUser.$id);
        ToastGlue("Test mode: OTP verified");
        return;
      }

      const result = await account.createSession(userId, token);
      console.log("otp data" + token + userId);
      console.log(result);
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
      // If in test mode, just clear the user state without server calls
      if (testMode.enabled) {
        console.log("Test mode active: Bypassing actual logout");
        initializeUserId("");
        setUser(null);
        router.replace("/(app)");
        ToastGlue("Test mode: Logged out");
        return;
      }

      await account.deleteSession("current");

      initializeUserId("");
      setUser(null);
      router.replace("/(app)");
      ToastGlue("Logged out");
    } catch (error) {
      console.error("Logout error:", error);
      ToastGlue("Failed to log out");
      throw error;
    }
  }

  async function register(email: string, password: string): Promise<void> {
    try {
      // If test mode is enabled, bypass actual registration
      if (testMode.enabled) {
        console.log("Test mode active: Bypassing actual registration");
        const mockUser = {
          $id: testMode.mockUserId || "test-user-id",
          email: testMode.mockEmail || email,
        } as Models.User<Models.Preferences>;

        setUser(mockUser);
        initializeUserId(mockUser.$id);
        ToastGlue("Test mode: Account created successfully");
        return;
      }

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

      // If test mode is enabled with mock user data, use that instead of checking session
      if (testMode.enabled && testMode.mockUserId) {
        console.log("Test mode active: Using mock session");
        const mockUser = {
          $id: testMode.mockUserId,
          email: testMode.mockEmail || "test@example.com",
        } as Models.User<Models.Preferences>;

        initializeUserId(mockUser.$id);
        setUser(mockUser);
      } else {
        const loggedIn = await account.get();
        initializeUserId(loggedIn?.$id!);
        setUser(loggedIn!);
        
        // Only check user meta if user is logged in and not finished sign-in
        if (loggedIn) {
          console.log("User is logged in:", loggedIn);
          
          try {
            const userMeta = await grabUserStatus();
            if (
              userMeta.documents &&
              userMeta.documents[0] &&
              userMeta.documents[0]["finished-sign-in"] !== "done"
            ) {
              router.replace("/(app)/(auth)/newUserPage/newUser");
              return;
            }
          } catch (e) {
            // If error in fetching user meta, treat as not finished
            router.replace("/(app)/(auth)/newUserPage/newUser");
            return;
          }
        }
      }
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
      value={{
        current: user,
        isLoading,
        login,
        logout,
        register,
        Toast,
        verifyOtp,
        testMode,
        enableTestMode
      }}
    >
      {children}
    </UserContext.Provider>
  );
}