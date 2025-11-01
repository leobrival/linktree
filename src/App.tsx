import './styles/globals.css';
import { useLinktreeData } from './hooks/useLinktreeData';
import { useGithubProfile } from './hooks/useGithubProfile';
import { Home } from './pages/Home';

function App(): React.ReactElement {
  const { data, loading: dataLoading, error: dataError } = useLinktreeData();
  const { avatar, loading: avatarLoading } = useGithubProfile(data?.profile.gitHubUsername);

  return (
    <Home
      data={data}
      avatarUrl={avatar}
      dataLoading={dataLoading}
      avatarLoading={avatarLoading}
      dataError={dataError}
    />
  );
}

export default App;
