import { Outlet } from "react-router-dom";
import { Suspense, useState } from "react";
import { Provider } from "react-redux";
import MainLayout from "./layouts/MainLayout";
import { store } from "./redux/store";
import { ConfigProvider } from "antd";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "rgb(71 85 105)",
        },
      }}
    >
      <Provider store={store}>
        <MainLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </MainLayout>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
