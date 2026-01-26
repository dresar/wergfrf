import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/context/AuthContext';
import Maintenance from '@/pages/Maintenance';
import { useLocation } from 'react-router-dom';

const MaintenanceGuard = ({ children }: { children: React.ReactNode }) => {
  const { settings, isLoading: settingsLoading } = useSettings();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const location = useLocation();

  if (settingsLoading || authLoading) {
     return null; 
  }

  const settingsData = Array.isArray(settings) ? settings[0] : settings;
  // Convert boolean string to boolean if necessary, though backend should send boolean
  const isMaintenance = settingsData?.maintenanceMode === true || settingsData?.maintenanceMode === "true";

  // Debug log
  // console.log("Maintenance Check:", { isMaintenance, isAuthenticated, path: location.pathname });

  if (isMaintenance) {
    // If user is NOT authenticated (Public), show Maintenance page
    // UNLESS they are trying to access login page
    if (!isAuthenticated) {
        if (!location.pathname.startsWith('/login')) {
            return <Maintenance endTime={settingsData?.maintenance_end_time} />;
        }
    } else {
        // If user IS authenticated (Admin)
        // Show banner but allow access
        return (
          <>
            <div className="bg-yellow-500/10 text-yellow-500 text-xs text-center py-1 px-2 border-b border-yellow-500/20 fixed top-0 left-0 right-0 z-50">
              ⚠️ Maintenance Mode is Active (Visible only to Admin)
            </div>
            {children}
          </>
        );
    }
  }

  return <>{children}</>;
};

export default MaintenanceGuard;
