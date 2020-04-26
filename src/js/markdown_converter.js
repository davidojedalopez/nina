import TurndownService from "turndown";

const htmlToMarkdown = new TurndownService({
  headingStyle: 'atx'
})

htmlToMarkdown.addRule('figure', {
  filter: ['figure'],
  replacement: (content, node) => {
    return "\n![" + node.querySelector('figcaption:last-of-type').innerText + "](" + node.querySelector('a').href + ")\n"
  }
}).addRule('code', {
  filter: ['pre'],
  replacement: (content) => {
    return '\`\`\`\n' + content + '\n\`\`\`'
  }
}).addRule('strikethrough', {
  filter: ['del'],
  replacement: (content) => {
    return '~~' + content + '~~'
  }
})

export {
  htmlToMarkdown
}