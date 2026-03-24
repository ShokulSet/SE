'use client'
import { Provider as ReactReduxProvider } from "react-redux";
import { store } from "./store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

let reduxPersistor = persistStore(store) // ย้ายออกมานอก component เพื่อไม่ให้ recreate ทุก render

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <ReactReduxProvider store={store}>
            <PersistGate loading={null} persistor={reduxPersistor}>
                {children}
            </PersistGate>
        </ReactReduxProvider>
    );
}