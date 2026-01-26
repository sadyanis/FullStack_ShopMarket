import { ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './assets/App.css';
import { Layout } from './components';
import { AppProvider, myTheme, ToastProvider } from './context';
import routes from './routes/routes';
import React from "react";

const App = () => {
    return (
        <div className="App">
            <AppProvider>
                <ThemeProvider theme={myTheme}>
                    <ToastProvider>
                        <BrowserRouter>
                            <Routes>
                                {routes.map((route) => (
                                    <Route
                                        key={route.name}
                                        path={route.path}
                                        element={
                                            <Layout>
                                               <> {React.createElement(route.element)} </>
                                            </Layout>
                                        }
                                    />
                                ))}
                            </Routes>
                        </BrowserRouter>
                    </ToastProvider>
                </ThemeProvider>
            </AppProvider>
        </div>
    );
};

export default App;
