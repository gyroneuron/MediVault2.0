import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Alert } from "react-native";
import { router } from "expo-router";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState([])
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Checking for existing user

      try {
        setLoading(true);
        const { data: { user }} = await supabase.auth.getUser();
        
        if (user) {
          setIsLoggedIn(true);
          await fetchProfile(user.id);
        }
      } catch (error) {
        Alert.alert("Unexpected Error occured!", error);
      } finally {
        setLoading(false);
      }


      //Listen for auth state Changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async(event, session) => {
          console.log(event)

          if (event === "INITIAL_SESSION") {
            // handle initial session
            setLoading(true);
            if (session) {
              setIsLoggedIn(true);
              await fetchProfile(session.user.id);
            }
            setLoading(false);
          } else if (event === "SIGNED_IN") {
            // handle sign in event
            // await getUserDetails(session.user.id);
            setLoading(true);
            await fetchProfile(session.user.id);
            setLoading(false);
          } else if (event === "SIGNED_OUT") {
            // handle sign out event
            setLoading(true);
            setUserDetails(null);
            setIsLoggedIn(false);
            setLoading(false);

          } else if (event === "PASSWORD_RECOVERY") {
            // handle password recovery event
            router.navigate('/(auth)/ForgotPassword')
          } else if (event === "TOKEN_REFRESHED") {
            // handle token refreshed event
          } else if (event === "USER_UPDATED") {
            // handle user updated event
            setLoading(true);
            await fetchProfile(true);
            setIsLoggedIn(true);
            setLoading(false);
          }
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching user Info:", error);
        setUserDetails(null);
        setIsLoggedIn(false);
      } else {
        setUserDetails(data);
      }
    } catch (error) {
      Alert.alert(error);
    } finally {
      setLoading(false);
    }
  };

  

  const Login = async (email, password) => {
    try {
      setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
    
          if (error) {
            Alert.alert(error.name, error.message);
            console.log('Login Error SS');
            setIsLoggedIn(false);
          } else {
            setIsLoggedIn(true);
            router.replace({ pathname: "/(tabs)/home"});
            return data;
          }
    } catch (error) {
        return error;
    } finally {
      setLoading(false);
    }
}

const Logout = async () => {
  try {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Logout Error", error.message);
    } else {
      setIsLoggedIn(false);
      router.replace({ pathname: "/(auth)/login" });
    }
  } catch (error) {
    Alert.alert("Unexpected Error occured!", error);
  } finally {
    setLoading(false);
  }
}

  return (
    <GlobalContext.Provider
      value={{
        userDetails,
        loading,
        isLoggedIn,
        fetchProfile,
        Login,
        Logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export async function fetchDocuments (userId, bucketName) {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from(`${bucketName}`)
      .select()
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching user documents:", error);
      setUserDetails(null);
      setIsLoggedIn(false);
    } else {
      return data;
    }
  } catch (error) {
    Alert.alert(error);
  } finally {
    setLoading(false);
  }
}
