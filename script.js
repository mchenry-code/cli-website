// Minimal working CLI with input
const term = new Terminal({
  cursorBlink: true,
  theme: {
    background: '#000000',
    foreground: '#F5F0E6',
    cursor: '#00694E'
  }
});
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);

term.open(document.getElementById('terminal'));
fitAddon.fit();
term.focus();                  // <-- ensure keyboard focus
window.addEventListener('resize', () => fitAddon.fit());

// Simple prompt + input
let buffer = '';
function prompt() { term.write('\r\cli-website:~$ '); }
term.writeln('Test Website — CLI. Type "help".');
prompt();

term.onData(data => {
  if (data === '\r') {
    term.writeln('');
    handle(buffer.trim());
    buffer = '';
    prompt();
    return;
  }
  if (data === '\u007F') { // backspace
    if (buffer.length) {
      term.write('\b \b');
      buffer = buffer.slice(0, -1);
    }
    return;
  }
  // printable
  const code = data.charCodeAt(0);
  if (code >= 32 && code <= 126) {
    buffer += data;
    term.write(data);
  }
});

function handle(cmd) {
  if (!cmd) return;
  if (cmd === 'help') {
    term.writeln('Commands: help, about, clear');
  } else if (cmd === 'about') {
    term.writeln('advisory.');
  } else if (cmd === 'clear' || cmd === 'cls') {
    term.clear();
  } else {
    term.writeln(`command not found: ${cmd}`);
  }
}
