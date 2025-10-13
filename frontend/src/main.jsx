import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import App from './App';
import store from './redux/store';
import ScrollToTop from './components/ScrollToTop';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </Provider>
  </BrowserRouter>,
);
