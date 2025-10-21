import React, { useRef } from 'react';

interface WordInputProps {
  rows: number;
  cols: number;
  words: string[][];
  onWordsChange: (words: string[][]) => void;
}

export const WordInput: React.FC<WordInputProps> = ({
  rows,
  cols,
  words,
  onWordsChange,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  const handleWordChange = (row: number, col: number, value: string) => {
    // 4文字以下に制限
    if (value.length > 4) {
      return;
    }

    const newWords = words.map((r, i) =>
      r.map((w, j) => (i === row && j === col ? value : w))
    );
    onWordsChange(newWords);
  };

  const handleKeyDown = (
    row: number,
    col: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      // 次のフィールドへ移動（最後のセルの場合はデフォルト動作）
      let nextRow = row;
      let nextCol = col + 1;

      if (nextCol >= cols) {
        nextCol = 0;
        nextRow += 1;
      }

      if (nextRow >= rows) {
        // 最後のセルなので、デフォルトのタブ動作に任せる
        return;
      }

      e.preventDefault();
      inputRefs.current[nextRow]?.[nextCol]?.focus();
    } else if (e.key === 'Tab' && e.shiftKey) {
      // 前のフィールドへ移動（最初のセルの場合はデフォルト動作）
      let prevRow = row;
      let prevCol = col - 1;

      if (prevCol < 0) {
        prevCol = cols - 1;
        prevRow -= 1;
      }

      if (prevRow < 0) {
        // 最初のセルなので、デフォルトのタブ動作に任せる
        return;
      }

      e.preventDefault();
      inputRefs.current[prevRow]?.[prevCol]?.focus();
    }
  };

  const getInputStyle = (row: number, col: number): React.CSSProperties => {
    const word = words[row][col];
    const hasError = word.length > 0 && word.length !== 4;

    return {
      width: '100px',
      padding: '8px',
      fontSize: '16px',
      textAlign: 'center',
      border: hasError ? '2px solid red' : '1px solid #ccc',
      borderRadius: '4px',
    };
  };

  // 参照配列の初期化
  if (inputRefs.current.length !== rows) {
    inputRefs.current = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(null));
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>単語入力</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '10px',
          maxWidth: `${cols * 120}px`,
        }}
      >
        {words.map((row, i) =>
          row.map((word, j) => (
            <input
              key={`${i}-${j}`}
              ref={(el) => {
                if (!inputRefs.current[i]) {
                  inputRefs.current[i] = [];
                }
                inputRefs.current[i][j] = el;
              }}
              type="text"
              value={word}
              onChange={(e) => handleWordChange(i, j, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, j, e)}
              placeholder="4文字"
              style={getInputStyle(i, j)}
              maxLength={4}
            />
          ))
        )}
      </div>
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        ※ 各セルに4文字を入力してください
      </div>
    </div>
  );
};
