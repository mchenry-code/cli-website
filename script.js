// Minimal fullscreen CLI test (no branding)

(function () {
  // Ensure xterm is present
  if (typeof window.Terminal !== 'function') {
    console.error('xterm not loaded');
    return;
  }

  // Init terminal
  const term = new window.Terminal({
    cursorBlink: true,
    theme: { background: '#000000', foreground: '#DDDDDD', cursor: '#CCCCCC' }
  });

  // Init FitAddon (cdnjs exposes a global; handle both common globals)
  let fitAddon = null;
  try {
    if (window.FitAddon && typeof window.FitAddon.FitAddon === 'function') {
      // Some builds expose namespace object with constructor
      fitAddon = new window.FitAddon.FitAddon();
    } else if (typeof window.FitAddon === 'function') {
      // Some builds expose constructor directly
      fitAddon = new window.FitAddon();
    }
  } catch (e) {
    console.warn('FitAddon not available:', e);
  }

  if (fitAddon) term.loadAddon(fitAddon);

  const el = document.getElementById('terminal');
  term.open(el);
  if (fitAddon) fitAddon.fit();
  term.focus();

  // Basic prompt + echo so you can verify input works
  let buf = '';
  writeLine('CLI Test Environment');
  prompt();

  term.onData(d => {
    if (d === '\r') { // Enter
      term.writeln('');
      handle(buf.trim());
      buf = '';
      prompt();
      return;
    }
    if (d === '\u007F') { // Backspace
      if (buf.length) {
        term.write('\b \b');
        buf = buf.slice(0, -1);
      }
      return;
    }
    const code = d.charCodeAt(0);
    if (code >= 32 && code <= 126) { // printable
      buf += d;
      term.write(d);
    }
  });

  window.addEventListener('resize', () => { if (fitAddon) fitAddon.fit(); });

  // ---- helpers ----
  function prompt() { term.write('\r\n$ '); }
  function writeLine(s) { term.writeln(s); }
  function handle(cmd) {
    if (!cmd) return;
    if (cmd === 'help') {
      writeLine('Commands: help, about, clear');
    } else if (cmd === 'about') {
      writeLine('Generic CLI test. No branding.');
    } else if (cmd === 'clear' || cmd === 'cls') {
      term.clear(); if (fitAddon) fitAddon.fit();
    } else {
      writeLine('command not found: ' + cmd);
    }
  }
})();
