/**
 * App - Routes: /admin (dashboard) and main site layout
 */
import { Routes, Route } from 'react-router-dom';
import ApiHealthBanner from './views/components/ApiHealthBanner';
import MainLayout from './views/layouts/MainLayout';
import AdminGate from './views/pages/admin/AdminGate';
import HomeView from './views/pages/HomeView';
import ResumeView from './views/pages/ResumeView';
import ResearchView from './views/pages/ResearchView';
import TeachingView from './views/pages/TeachingView';
import PublicationsView from './views/pages/PublicationsView';
import GrantsView from './views/pages/GrantsView';
import PrismLabView from './views/pages/PrismLabView';
import StudentsView from './views/pages/StudentsView';
import ContactView from './views/pages/ContactView';

function App() {
  return (
    <>
      <ApiHealthBanner />
      <Routes>
      <Route path="/admin/*" element={<AdminGate />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomeView />} />
        <Route path="resume" element={<ResumeView />} />
        <Route path="research" element={<ResearchView />} />
        <Route path="research/areas" element={<ResearchView />} />
        <Route path="research/projects" element={<ResearchView />} />
        <Route path="teaching" element={<TeachingView />} />
        <Route path="teaching/courses" element={<TeachingView />} />
        <Route path="teaching/materials" element={<TeachingView />} />
        <Route path="publications" element={<PublicationsView />} />
        <Route path="grants" element={<GrantsView />} />
        <Route path="prism-lab" element={<PrismLabView />} />
        <Route path="students" element={<StudentsView />} />
        <Route path="contact" element={<ContactView />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
