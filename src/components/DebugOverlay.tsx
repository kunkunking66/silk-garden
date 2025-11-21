import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DebugOverlay: React.FC = () => {
  const location = useLocation();
  const [errors, setErrors] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState<string>('Testing...');
  const [envInfo, setEnvInfo] = useState<any>({});

  // 1. 捕獲全局報錯 (window.onerror)
  useEffect(() => {
    const errorHandler = (message: any, source: any, lineno: any, colno: any, error: any) => {
      const errorMsg = `[Global Error]: ${message} at ${source}:${lineno}`;
      setErrors(prev => [...prev, errorMsg]);
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      const errorMsg = `[Unhandled Promise]: ${event.reason}`;
      setErrors(prev => [...prev, errorMsg]);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  // 2. 檢查環境和後端
  useEffect(() => {
    // 獲取環境變量
    const isDev = import.meta.env.DEV;
    const apiBase = isDev 
        ? 'http://localhost:3001' 
        : 'https://silk-garden-api.onrender.com';
    
    setEnvInfo({
      mode: isDev ? 'Development (Local)' : 'Production (Netlify)',
      basePath: import.meta.env.BASE_URL,
      apiUrl: apiBase
    });

    // 測試後端連接
    // 我們嘗試請求一個不存在的 endpoint，只要返回 404 而不是 Network Error 就算通
    fetch(`${apiBase}/api/health-check-test`)
      .then(res => {
        if (res.status === 404 || res.ok) {
            setApiStatus('✅ Connected (Online)');
        } else {
            setApiStatus(`⚠️ Status: ${res.status}`);
        }
      })
      .catch(err => {
        setApiStatus(`❌ Failed: ${err.message}`);
        setErrors(prev => [...prev, `API Connection Failed: ${err.message}`]);
      });

  }, []);

  if (process.env.NODE_ENV === 'production' && location.search !== '?debug=true') {
    // 如果你想在生產環境隱藏它，可以取消註釋這行，或者在 URL 後面加 ?debug=true 來強制顯示
    // return null; 
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      zIndex: 999999,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      color: '#00ff00',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      maxWidth: '400px',
      maxHeight: '50vh',
      overflowY: 'auto',
      border: '1px solid #00ff00',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #666', paddingBottom: '5px', color: '#fff' }}>
        🛠️ System Diagnostic
      </h3>

      {/* 基礎信息 */}
      <div style={{ marginBottom: '10px' }}>
        <div><strong>Current Path:</strong> {location.pathname}</div>
        <div><strong>Environment:</strong> {envInfo.mode}</div>
        <div><strong>API Target:</strong> {envInfo.apiUrl}</div>
        <div><strong>API Status:</strong> {apiStatus}</div>
      </div>

      {/* 錯誤日誌 */}
      <div style={{ borderTop: '1px solid #666', paddingTop: '5px' }}>
        <strong style={{ color: errors.length > 0 ? 'red' : '#aaa' }}>
          Errors ({errors.length}):
        </strong>
        {errors.length === 0 && <div style={{color: '#888'}}>No runtime errors detected.</div>}
        {errors.map((err, idx) => (
          <div key={idx} style={{ 
            color: '#ff6b6b', 
            marginTop: '5px', 
            wordBreak: 'break-all',
            borderBottom: '1px dashed #444' 
          }}>
            {err}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugOverlay;