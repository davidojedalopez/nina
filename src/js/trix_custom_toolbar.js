import Trix from 'trix'
console.info('ding so')
Trix.config.blockAttributes.heading = {
  tagName: "h1",
  terminal: true,
  breakOnReturn: true,
  group: false
}

Trix.config.blockAttributes.subHeading = {
  tagName: "h2",
  terminal: true,
  breakOnReturn: true,
  group: false
}

Trix.config.blockAttributes.subSubHeading = {
  tagName: "h3",
  terminal: true,
  breakOnReturn: true,
  group: false
}

Trix.config.textAttributes.inlineCode = { 
  tagName: "code", 
  inheritable: true 
}

Trix.config.attachments.preview.caption.name = false
Trix.config.attachments.preview.caption.size = false