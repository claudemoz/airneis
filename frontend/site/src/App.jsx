import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { Provider } from "react-redux";
import PuffLoader from "react-spinners/PuffLoader";
import Layout from "./layouts/Layout";
import { persistor, store } from "./redux/store";
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={store}>
      <Layout>
        <Suspense fallback={ 
          <PuffLoader
            color="#000"
            loading={true}
            cssOverride={{
              display: "flex",
              margin: "15% auto 0  auto",
              borderColor: "#000",
            }}
            size={80}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        }>
          <PersistGate loading={null} persistor={persistor}>
            <Outlet />
          </PersistGate>
        </Suspense>
      </Layout>
    </Provider>
  );
}
export default App;
