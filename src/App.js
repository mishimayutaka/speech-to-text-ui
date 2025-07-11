import React, { useState } from 'react';
import './App.css';

function App() {
  const [blobName, setBlobName] = useState('your-audio-file.mp3'); // Blob Storage内のファイル名
  const [speakerCount, setSpeakerCount] = useState(2);
  const [jobId, setJobId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 関数アプリのURLを取得 (デプロイ後に設定)
  // 例: https://asyncspeechapp-west.azurewebsites.net/api/api
  // Static Web Appsにリンクした後は、相対パス '/api/api' だけで呼び出せます。
  const functionApiUrl = '/api/api';

  const startTranscription = async () => {
    setIsLoading(true);
    setStatusMessage('リクエストを送信中...');
    setJobId('');

    try {
      const response = await fetch(functionApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ blobName, speakerCount })
      });

      if (!response.ok) {
        throw new Error(`エラーが発生しました: ${response.statusText}`);
      }

      const result = await response.json();
      setJobId(result.id);
      setStatusMessage('バックエンドで処理が開始されました！');

    } catch (error) {
      setStatusMessage(`エラー: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>音声ファイル文字起こしシステム</h1>
        <div className="form-group">
          <label>Blob Storageのファイル名:</label>
          <input
            type="text"
            value={blobName}
            onChange={(e) => setBlobName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>話者の人数:</label>
          <input
            type="number"
            value={speakerCount}
            min="1"
            onChange={(e) => setSpeakerCount(parseInt(e.target.value, 10))}
          />
        </div>
        <button onClick={startTranscription} disabled={isLoading}>
          {isLoading ? '処理中...' : '文字起こしを開始'}
        </button>
        {statusMessage && <p className="status">{statusMessage}</p>}
        {jobId && <p className="job-id">処理ID: {jobId}</p>}
      </header>
    </div>
  );
}

export default App;