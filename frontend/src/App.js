import MainPage from './components/MainPage.jsx';
import LanguageProvider from './providers/LanguageProvider.jsx';
import AuthorizationProvider from './providers/AuthorizationProvider.jsx';
import NetworkProvider from './providers/NetworkProvider.jsx';
import ApiProvider from './providers/ApiProvider.jsx';
import DarkModeProvider from './providers/DarkModeProvider.jsx';

const App = ({ socket }) => (
  <ApiProvider socket={socket}>
    <NetworkProvider>
      <AuthorizationProvider>
        <LanguageProvider>
          <DarkModeProvider>
            <MainPage />
          </DarkModeProvider>
        </LanguageProvider>
      </AuthorizationProvider>
    </NetworkProvider>
  </ApiProvider>
);

export default App;
