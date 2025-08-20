const term = new Terminal({
  cols: 100,
  rows: 30,
  theme: {
    background: '#000000',
    foreground: '#F5F0E6', // ivory
    cursor: '#00694E'      // emerald
  }
});

term.open(document.getElementById('terminal'));
term.writeln('Website CLI v1.0');
term.writeln('Type "help" to get started.');
