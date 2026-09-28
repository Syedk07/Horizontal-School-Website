import { useState, useEffect } from 'react';
import { api } from './services/api';
import { User, SchoolStats, Announcement, EventItem, NewsItem, GalleryItem } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { CampusLifePage } from './pages/CampusLifePage';
import { EventsPage } from './pages/EventsPage';
import { NewsPage } from './pages/NewsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { PortalLogin } from './pages/PortalLogin';
import { StudentPortal } from './pages/StudentPortal';
import { TeacherPortal } from './pages/TeacherPortal';
import { AdminPortal } from './pages/AdminPortal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    setLoading(true);
    try {
      // Check existing authenticated user
      const user = await api.getMe();
      if (user) {
        setCurrentUser(user);
      }

      // Fetch public content from Python Flask backend
      const [statsRes, annRes, evRes, newsRes, galRes] = await Promise.all([
        api.getStats().catch(() => null),
        api.getAnnouncements().catch(() => []),
        api.getEvents().catch(() => []),
        api.getNews().catch(() => []),
        api.getGallery().catch(() => []),
      ]);

      if (statsRes) setStats(statsRes);
      setAnnouncements(annRes);
      setEvents(evRes);
      setNews(newsRes);
      setGallery(galRes);
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('portal');
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setActiveTab('home');
  };

  const handleOpenPortal = () => {
    if (currentUser) {
      setActiveTab('portal');
    } else {
      setActiveTab('login');
    }
  };

  const renderContent = () => {
    // Portal Routes
    if (activeTab === 'login') {
      return (
        <PortalLogin
          onLoginSuccess={handleLoginSuccess}
          onNavigateHome={() => setActiveTab('home')}
        />
      );
    }

    if (activeTab === 'portal') {
      if (!currentUser) {
        return (
          <PortalLogin
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => setActiveTab('home')}
          />
        );
      }

      if (currentUser.role === 'student') {
        return (
          <StudentPortal
            user={currentUser}
            onLogout={handleLogout}
            onNavigateHome={() => setActiveTab('home')}
          />
        );
      }

      if (currentUser.role === 'teacher') {
        return (
          <TeacherPortal
            user={currentUser}
            onLogout={handleLogout}
            onNavigateHome={() => setActiveTab('home')}
          />
        );
      }

      if (currentUser.role === 'admin') {
        return (
          <AdminPortal
            user={currentUser}
            onLogout={handleLogout}
            onNavigateHome={() => setActiveTab('home')}
          />
        );
      }
    }

    // Public Pages
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            stats={stats}
            announcements={announcements}
            events={events}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenPortal={handleOpenPortal}
          />
        );
      case 'about':
        return <AboutPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'academics':
        return <AcademicsPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'admissions':
        return <AdmissionsPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'campus-life':
        return <CampusLifePage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'events':
        return (
          <EventsPage
            events={events}
            loading={loading}
            onRefresh={() => api.getEvents().then(setEvents)}
          />
        );
      case 'news':
        return <NewsPage news={news} loading={loading} />;
      case 'gallery':
        return <GalleryPage gallery={gallery} loading={loading} />;
      case 'contact':
        return <ContactPage />;
      default:
        return (
          <HomePage
            stats={stats}
            announcements={announcements}
            events={events}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenPortal={handleOpenPortal}
          />
        );
    }
  };

  const isPortalView = activeTab === 'portal';

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
      {!isPortalView && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenPortal={handleOpenPortal}
        />
      )}

      <main className="flex-1">
        {renderContent()}
      </main>

      {!isPortalView && (
        <Footer
          onNavigate={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPortal={handleOpenPortal}
        />
      )}
    </div>
  );
}
