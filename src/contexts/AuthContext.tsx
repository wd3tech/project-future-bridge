
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: SignUpData) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

interface SignUpData {
  name: string;
  role: 'STUDENT' | 'COMPANY' | 'SCHOOL_ADMIN' | 'TEACHER';
  companyName?: string;
  city?: string;
  state?: string;
  sector?: string;
  description?: string;
  schoolName?: string;
  website?: string;
  bio?: string;
  schoolCity?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: SignUpData) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: userData.name,
            role: userData.role,
            company_name: userData.companyName,
            city: userData.city,
            state: userData.state,
            sector: userData.sector,
            description: userData.description,
            school_name: userData.schoolName,
            website: userData.website,
            bio: userData.bio,
            school_city: userData.schoolCity
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Sign up successful:', data);
        
        // Create the profile manually after successful signup
        if (data.user) {
          await createUserProfile(data.user.id, userData);
        }
        
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta.",
        });
      }

      return { error };
    } catch (err: any) {
      console.error('Sign up exception:', err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (userId: string, userData: SignUpData) => {
    try {
      // Create main profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          name: userData.name,
          role: userData.role
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return;
      }

      // Create specific profile based on role
      if (userData.role === 'STUDENT') {
        await supabase
          .from('student_profiles')
          .insert({
            user_id: userId,
            bio: userData.bio
          });
      } else if (userData.role === 'COMPANY') {
        await supabase
          .from('company_profiles')
          .insert({
            user_id: userId,
            company_name: userData.companyName || userData.name,
            description: userData.description,
            sector: userData.sector,
            city: userData.city || '',
            state: userData.state || 'SP'
          });
      } else if (userData.role === 'SCHOOL_ADMIN') {
        await supabase
          .from('school_profiles')
          .insert({
            user_id: userId,
            city: userData.schoolCity || userData.city || '',
            state: userData.state || 'SP',
            about: userData.description,
            website: userData.website
          });
      }
    } catch (err) {
      console.error('Error creating user profile:', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta!",
        });
      }

      return { error };
    } catch (err: any) {
      console.error('Sign in exception:', err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Até logo!",
        });
      }
    } catch (err: any) {
      console.error('Sign out exception:', err);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
