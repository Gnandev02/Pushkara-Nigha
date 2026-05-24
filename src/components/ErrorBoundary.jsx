import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an uncaught exception:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    fontFamily: 'system-ui, sans-serif',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        maxWidth: '500px',
                        backgroundColor: '#1E293B',
                        borderRadius: '12px',
                        padding: '2.5rem',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        border: '1px solid #334155'
                    }}>
                        <div style={{
                            color: '#EF4444',
                            fontSize: '3rem',
                            marginBottom: '1rem'
                        }}>⚠️</div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Secure Core System Halt</h2>
                        <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
                            An unexpected runtime exception was intercepted by the ICCC Sandbox. Present this report to security engineers to restore node parameters.
                        </p>
                        <div style={{
                            backgroundColor: '#0F172A',
                            borderRadius: '6px',
                            padding: '1rem',
                            fontSize: '0.75rem',
                            fontFamily: 'monospace',
                            color: '#F43F5E',
                            textAlign: 'left',
                            overflowX: 'auto',
                            whiteSpace: 'pre-wrap',
                            border: '1px solid #334155',
                            maxHeight: '150px'
                        }}>
                            {this.state.error && this.state.error.toString()}
                        </div>
                        <button 
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '1.5rem',
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: '#2563EB',
                                border: 'none',
                                color: '#FFFFFF',
                                fontWeight: 'bold',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#1D4ED8'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#2563EB'}
                        >
                            Force Neural Reboot
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
