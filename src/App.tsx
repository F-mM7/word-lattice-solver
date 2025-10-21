import { useState, useEffect } from 'react';
import { GridSizeInput } from './components/GridSizeInput';
import { WordInput } from './components/WordInput';
import { SolutionDisplay } from './components/SolutionDisplay';

function App() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [words, setWords] = useState<string[][]>(
    Array(2)
      .fill(null)
      .map(() => Array(2).fill(''))
  );

  // 行数・列数が変更されたら、words配列をリサイズ
  useEffect(() => {
    setWords((prevWords) => {
      const newWords = Array(rows)
        .fill(null)
        .map((_, i) =>
          Array(cols)
            .fill(null)
            .map((_, j) => {
              // 既存の入力を可能な限り保持
              if (i < prevWords.length && j < prevWords[i].length) {
                return prevWords[i][j];
              }
              return '';
            })
        );
      return newWords;
    });
  }, [rows, cols]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>triptrip</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        単語格子ソルバー - 格子点に文字を配置して全てのセルの単語を構成
      </p>

      <GridSizeInput
        rows={rows}
        cols={cols}
        onRowsChange={setRows}
        onColsChange={setCols}
      />

      <WordInput
        rows={rows}
        cols={cols}
        words={words}
        onWordsChange={setWords}
      />

      <SolutionDisplay rows={rows} cols={cols} words={words} />
    </div>
  );
}

export default App;
