import Header from '../Header/Header';
import Stream from '../Stream/Stream';
import './App.scss';

const App: React.FC<{}> = () => {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Stream />
      </main>
    </div>
  );
};

export default App;
