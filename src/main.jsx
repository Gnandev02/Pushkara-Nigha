import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const mountNode = document.getElementById('root');
if (mountNode) {
    const root = ReactDOM.createRoot(mountNode);
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </React.StrictMode>
    );
} else {
    console.error("React Bootstrapper: Could not find mounting node #root in DOM.");
}
