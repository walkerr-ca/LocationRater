import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { star, pin, person } from "ionicons/icons";

import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import RatingsPage from "./pages/ratings";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

import { useAuth } from "./hooks/auth";

setupIonicReact();

const GuestGuard = () => {
  const { accessToken } = useAuth();

  if (accessToken && accessToken.data.exp > Date.now() / 1000) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const AuthGuard = () => {
  const { accessToken } = useAuth();

  if (!accessToken || accessToken.data.exp < Date.now() / 1000) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const ProtectedRoutes = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/ratings" element={<RatingsPage />} />
        <Route path="/locations" element={<RatingsPage />} />
        <Route path="/account" element={<RatingsPage />} />
        <Route path="/" element={<Navigate to="/ratings" replace />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="ratings" href="/ratings">
          <IonIcon aria-hidden="true" icon={star} />
          <IonLabel>Ratings</IonLabel>
        </IonTabButton>
        <IonTabButton tab="locations" href="/locations">
          <IonIcon aria-hidden="true" icon={pin} />
          <IonLabel>Locations</IonLabel>
        </IonTabButton>
        <IonTabButton tab="account" href="/account">
          <IonIcon aria-hidden="true" icon={person} />
          <IonLabel>Account</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <Routes>
          <Route element={<GuestGuard />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<AuthGuard />}>
            <Route path="/*" element={<ProtectedRoutes />} />
          </Route>
        </Routes>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
