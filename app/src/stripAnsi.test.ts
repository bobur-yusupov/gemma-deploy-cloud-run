import stripAnsi from 'strip-ansi';

describe('stripAnsi', () => {
  test('strips ANSI escape codes from text', () => {
    const textWithAnsi = 'ssignment\x1b[?25l\x1b[?25h:**\x1b[?25l\x1b[?25h The';
    const expected = 'ssignment:** The';
    
    expect(stripAnsi(textWithAnsi)).toBe(expected);
  });

  test('strips cursor visibility ANSI codes', () => {
    const textWithCursorCodes = 'print\x1b[?25l\x1b[?25h() function';
    const expected = 'print() function';
    
    expect(stripAnsi(textWithCursorCodes)).toBe(expected);
  });

  test('handles text without ANSI codes', () => {
    const plainText = 'Hello, world!';
    
    expect(stripAnsi(plainText)).toBe(plainText);
  });

  test('strips multiple ANSI codes from complex text', () => {
    const complexText = 'ssignment\x1b[?25l\x1b[?25h:**\x1b[?25l\x1b[?25h The\x1b[?25l\x1b[?25h \x1b[?25l\x1b[?25hprint\x1b[?25l\x1b[?25h()';
    const expected = 'ssignment:** The print()';
    
    expect(stripAnsi(complexText)).toBe(expected);
  });

  test('handles empty string', () => {
    expect(stripAnsi('')).toBe('');
  });
});
