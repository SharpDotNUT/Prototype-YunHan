function replaceColorTags(text: string) {
  const regex = /<color=#[0-9A-Fa-f]{6,8}>(.*?)<\/color>/g;
  const result = text.replace(regex, (match, content) => {
    const color = (match.match(/#[0-9A-Fa-f]{6,8}/) ?? ['FFF'])[0];
    return `<span style="color: ${color};">${content}</span>`;
  });
  return result;
}

function replaceRubyTags(text: string) {
  const regex = /\{RUBY#\[([^\]]+)\]([^\}]+)\}/g;
  const result = text.replace(
    regex,
    '<span class="ruby"><div class="height"></div><span>$2</span></span>'
  );
  return result;
}

export function replaceBrTags(text: string) {
  return text.replace(/\\n/g, '<br>');
}

export function renderMessage(text: string) {
  if (!text) return '';
  return replaceColorTags(replaceRubyTags(replaceBrTags(text)));
}
