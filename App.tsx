import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { ViewState } from './types';

// Components
import BottomNav from './src/components/BottomNav';

// Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import AuthScreen from './src/screens/AuthScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import UpdatePasswordScreen from './src/screens/UpdatePasswordScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import HomeScreen from './src/screens/HomeScreen';
import PublicStoreScreen from './src/screens/PublicStoreScreen';
import PrivateProfileScreen from './src/screens/PrivateProfileScreen';
import ProfessionalProfileScreen from './src/screens/ProfessionalProfileScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import VisibilityScreen from './src/screens/VisibilityScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import MyItemsScreen from './src/screens/MyItemsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SearchScreen from './src/screens/SearchScreen';
import ContactsScreen from './src/screens/ContactsScreen';
import CompleteProfileScreen from './src/screens/CompleteProfileScreen';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME); // Start at HOME
  const [session, setSession] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const checkProfile = async (currentSession: any): Promise<boolean> => {
    if (!currentSession?.user) {
      setHasProfile(false);
      setIsLoadingProfile(false);
      return false;
    }

    try {
      const { data } = await supabase.from('users').select('id, name, avatar_url').eq('id', currentSession.user.id).single();
      const exists = !!(data && data.name);
      setHasProfile(exists);
      if (data) {
        setUserAvatar(data.avatar_url);
      }
      return exists;
    } catch (error) {
      console.error("Profile check error:", error);
      setHasProfile(false);
      return false;
    } finally {
      setIsLoadingProfile(false);
    }
  };


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkProfile(session);
      } else {
        setView(ViewState.AUTH);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (event === 'PASSWORD_RECOVERY') {
        setView(ViewState.UPDATE_PASSWORD);
      } else if (session) {
        const hasProfile = await checkProfile(session);
        // Only redirect based on auth events if we are in an entry screen
        // or just logged in.

        // If coming from Magic Link (often triggers INITIAL_SESSION or SIGNED_IN)
        setView(v => {
          // If we are already in the app, stays there (unless profile is missing).
          // If we are coming from AUTH/WELCOME/FORGOT (login flow), we decide based on profile.
          if ([ViewState.AUTH, ViewState.WELCOME, ViewState.FORGOT_PASSWORD].includes(v)) {
            return hasProfile ? ViewState.HOME : ViewState.COMPLETE_PROFILE;
          }
          // If we are already elsewhere, check consistency
          if (!hasProfile && ![ViewState.COMPLETE_PROFILE, ViewState.UPDATE_PASSWORD].includes(v)) {
            return ViewState.COMPLETE_PROFILE;
          }
          return v;
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleViewChange = (targetView: ViewState) => {
    const protectedRoutes = [
      ViewState.HOME, ViewState.PROFILE_PERSONAL, ViewState.PROFILE_PROFESSIONAL,
      ViewState.MY_ITEMS, ViewState.CHAT_LIST, ViewState.CHAT, ViewState.SETTINGS,
      ViewState.NOTIFICATIONS, ViewState.CONTACTS, ViewState.SEARCH, ViewState.EDIT_PROFILE,
      ViewState.VISIBILITY
    ];

    if (protectedRoutes.includes(targetView)) {
      if (!session) {
        setView(ViewState.AUTH);
        return;
      }
      if (!isLoadingProfile && !hasProfile) {
        setView(ViewState.COMPLETE_PROFILE);
        return;
      }
    }

    if (targetView === ViewState.PROFILE_PERSONAL) {
      setSelectedUserId(null);
    } else if ([ViewState.HOME, ViewState.MY_ITEMS, ViewState.CHAT_LIST, ViewState.NOTIFICATIONS, ViewState.SEARCH].includes(targetView)) {
      setSelectedUserId(null);
    }

    setView(targetView);
  };

  const renderView = () => {
    switch (view) {
      case ViewState.WELCOME:
        return <WelcomeScreen onStart={() => setView(ViewState.PRIVACY)} onLogin={() => setView(ViewState.AUTH)} />;
      case ViewState.AUTH:
        return <AuthScreen
          onLogin={() => {
            checkProfile(session).then(() => setView(ViewState.HOME));
          }}
          onCompleteProfile={() => setView(ViewState.COMPLETE_PROFILE)}
          onForgotPassword={() => setView(ViewState.FORGOT_PASSWORD)}
        />;
      case ViewState.FORGOT_PASSWORD:
        return <ForgotPasswordScreen onBack={() => setView(ViewState.AUTH)} onSent={() => { }} />;
      case ViewState.UPDATE_PASSWORD:
        return <UpdatePasswordScreen onComplete={() => setView(ViewState.HOME)} />;
      case ViewState.COMPLETE_PROFILE:
        return <CompleteProfileScreen onComplete={() => {
          setHasProfile(true);
          setView(ViewState.HOME);
        }} />;
      case ViewState.PRIVACY:
        return <PrivacyScreen onSync={() => setView(ViewState.HOME)} onBack={() => setView(ViewState.WELCOME)} />;
      case ViewState.HOME:
        return <HomeScreen
          onChangeView={handleViewChange}
          onSelectUser={(id) => { setSelectedUserId(id); setView(ViewState.PROFILE_PERSONAL); }}
        />;
      case ViewState.PROFILE_PERSONAL:
        // Now distinguishes between My Profile (Private) and Viewing Someone (Public)
        if (selectedUserId) {
          return <PublicStoreScreen
            onChangeView={handleViewChange}
            onBack={() => setView(ViewState.HOME)}
            targetUserId={selectedUserId}
          />;
        } else {
          return <PrivateProfileScreen
            onChangeView={handleViewChange}
            onBack={() => setView(ViewState.HOME)}
          />;
        }

      case ViewState.PROFILE_PROFESSIONAL:
        return <ProfessionalProfileScreen onChangeView={handleViewChange} onBack={() => setView(ViewState.PROFILE_PERSONAL)} />;
      case ViewState.SERVICE_DETAIL:
        return <ServiceDetailScreen onChangeView={handleViewChange} onBack={() => setView(ViewState.PROFILE_PROFESSIONAL)} />;
      case ViewState.PRODUCT_DETAIL:
        return <ProductDetailScreen onChangeView={handleViewChange} onBack={() => setView(ViewState.PROFILE_PERSONAL)} />;
      case ViewState.VISIBILITY:
        return <VisibilityScreen onConfirm={() => setView(ViewState.MY_ITEMS)} onBack={() => setView(ViewState.HOME)} />;
      case ViewState.CHAT:
        return <ChatScreen onBack={() => setView(ViewState.CHAT_LIST)} />;
      case ViewState.CHAT_LIST:
        return <ChatListScreen onChangeView={handleViewChange} onBack={() => setView(ViewState.HOME)} />;
      case ViewState.MY_ITEMS:
        return <MyItemsScreen onChangeView={handleViewChange} />;
      case ViewState.SETTINGS:
        return <SettingsScreen onChangeView={handleViewChange} />;
      case ViewState.NOTIFICATIONS:
        return <NotificationsScreen onChangeView={handleViewChange} />;
      case ViewState.SEARCH:
        return <SearchScreen onBack={() => setView(ViewState.HOME)} />;
      case ViewState.CONTACTS:
        return <ContactsScreen onBack={() => setView(ViewState.CHAT_LIST)} onChat={() => setView(ViewState.CHAT)} />;
      case ViewState.EDIT_PROFILE:
        return <EditProfileScreen onBack={() => {
          // Reload user data slightly
          checkProfile(session);
          setView(ViewState.PROFILE_PERSONAL);
        }} />;
      default:
        return <HomeScreen
          onChangeView={handleViewChange}
          onSelectUser={(id) => { setSelectedUserId(id); setView(ViewState.PROFILE_PERSONAL); }}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-300">
      {renderView()}
      {!([
        ViewState.WELCOME,
        ViewState.AUTH,
        ViewState.FORGOT_PASSWORD,
        ViewState.UPDATE_PASSWORD,
        ViewState.COMPLETE_PROFILE,
        ViewState.EDIT_PROFILE,
        ViewState.PRIVACY
      ].includes(view)) && (
          <BottomNav activeView={view} onChangeView={handleViewChange} userAvatar={userAvatar} />
        )}
    </div>
  );
};

export default App;
