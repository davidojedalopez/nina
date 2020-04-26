import { Controller } from "stimulus"
import { saveAs } from 'file-saver';

import { debounce, notifyInfo, notifySuccess } from '../js/common'
import { htmlToMarkdown } from '../js/markdown_converter'
import { generateWarnings } from '../js/grammar_checker'


export default class extends Controller {
  static get targets() { 
    return [ "editor", "title", "count", 'warning' ]
  }

  static get values() {
    return {
      markdown: String,
      postId: String,
      characterCount: Number
    }
  }

  connect() {
    this.editor = this.editorTarget.editor;

    this.setupTrixEventListeners();

    if(localStorage[this.storageKey]) {
      let article = JSON.parse(localStorage[this.storageKey]);
      this.editor.loadJSON(article.content);
      this.titleTarget.value = article.title;
    }

    this.setCharacterCount();

    window.addEventListener("beforeunload", () => {
      let leave = 'Content has not been saved, save now and leave?';
      if(leave) {
        return undefined;
      } else {
        return leave;
      }
    });

    window.addEventListener("keydown", (event) => {
      if(event.metaKey && event.key.toLowerCase() === 's') {
        let notieAlert = document.querySelector('.notie-textbox');
        if(notieAlert) {
          return;
        }

        event.preventDefault();      
        notifyInfo('Your article is saved automatically 😉 Press CMD + S again to save page.')        

      }
    });

  }

  setCharacterCount() {
    this.characterCountValue = this.editor.getDocument().toString().trim().length;
    this.countTarget.innerText = this.characterCountValue;
  }

  setupTrixEventListeners() {
    document.addEventListener('trix-change', debounce((e) => {
      this.checkWriting();
    }, 500));

    document.addEventListener('trix-change', (event) => {    
      setTimeout(() => {
        this.markdownValue = htmlToMarkdown.turndown(event.target);
        localStorage[this.storageKey] = JSON.stringify({
          title: this.titleTarget.value,
          content: this.editor
        })
      }, 0);
      this.setCharacterCount();
    });

    document.addEventListener('trix-attachment-add', (event) => {  
      if(event.attachment.file) {
        this.uploadFileAttachment(event.attachment)
      }
    });
  
    document.addEventListener('trix-before-paste', (event) => {
      
    });

    document.addEventListener('trix-selection-change', (event) => {
      // console.info(this.editor.getSelectedRange());
      // var rect = this.editor.getClientRectAtPosition(this.editor.getSelectedRange()[0]);
      // console.info({rect});
      // let elm = document.elementFromPoint(rect.x, rect.y);
      // console.info({elm});
    });
  }

  get storageKey() {      
    return `editor-state-post-${this.postIdValue}`;  
  }

  get fileName() {
    let regExp = new RegExp(' ', 'g');
    return this
        .titleTarget
        .value
        .toLowerCase()
        .replace(/[^a-zA-Z 0-9]+/g, '')
        .replace(regExp, '_');
  }

  publish(event) {
    let payload = {
      article: {
        title: this.titleTarget.value,
        published: false,
        body_markdown: this.markdownValue
      }
    };
    fetch('/article/publish', {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json();
    }).then(data => {
      notifySuccess(`<a href="${data.url}/edit" target="_blank" rel="noopener">Go to your post!</a>`)      
    }).catch(error => {
      console.error({error});
    });

  }

  download(event) {
    let select = event.target;
    let option = select.selectedOptions[0].value;
    if(!option) {
      return;
    }

    if(option === 'html') {
      this.downloadHTML();
    } else {
      this.downloadMarkdown()
    }

    select.selectedIndex = 0;
  }

  downloadMarkdown() {
    this.markdownValue = htmlToMarkdown.turndown(this.editorTarget);
    let blob = new Blob([this.markdownValue], { type: "text/markdown; charset=UTF-8" });
    saveAs(blob, `${this.fileName}.md`);
  }

  downloadHTML() {
    let blob = new Blob([this.editorTarget.value], { type: "text/html; charset=UTF-8" });
    saveAs(blob, `${this.fileName}.html`);
  }

  uploadFileAttachment(attachment) {
    this.uploadFile(attachment.file, setProgress, setAttributes);
    
    function setProgress(progress) {
      attachment.setUploadProgress(progress)
    }
    
    function setAttributes(attributes) {
      attachment.setAttributes(attributes)
    }
  }

  uploadFile(file, progressCallback, successCallback) {
    let key = this.createStorageKey(file);
    
    var url = new URL('/upload/get_signed_url', 'http://localhost:3000')
    var params = {
      key: key,
      content_type: file.type
    };
    url.search = new URLSearchParams(params).toString();
      
    fetch(url)
      .then( (response) => {
        return response.json()
      }).then( (json) => {
        return json.url
      }).then( (url) => {
        this.signedUpload(file, key, url, progressCallback, successCallback)
      })    
  }

  signedUpload(file, key, url, progressCallback, successCallback) {
    let xhr = new XMLHttpRequest();

    xhr.open("PUT", url, true);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('Content-Type', file.type);

    xhr.upload.addEventListener("progress", function (event) {
      let progress = event.loaded / event.total * 100;
      progressCallback(progress)
    });

    xhr.addEventListener("load", function (event) {
      let finalUrl = "https://d1f6qu3m1nxo77.cloudfront.net/";
      if (xhr.status === 200) {
        let attributes = {
          url: finalUrl + key,
          href: finalUrl + key + "?content-disposition=attachment"
        };
        successCallback(attributes);
      }
    });

    xhr.send(file)
  }
  
  createStorageKey(file) {
    let date = new Date();
    let day = date.toISOString().slice(0,10);
    let name = date.getTime() + "-" + file.name;
    return [ "tmp", day, name ].join("/")
  }

  checkWriting() {
    let documentString = this.editor.getDocument().toString();

    let allWarnings = generateWarnings(documentString)
    let range = this.editor.getSelectedRange();

    let previousWarnings = this.warningTargets;
    previousWarnings.forEach( (it) => { it.remove() });

    let previousTooltips = document.querySelectorAll('span[data-tooltip="warning-tooltip"]');
    previousTooltips.forEach( (it) => { it.remove() });

    // for(let warning of warnings) {
    for(let warning of allWarnings) {
      // let startOffset = warning.location.start.offset;
      let startOffset = warning.start;

      let span = document.querySelector(`span[data-line="${warning.line}"]`);
      // let span = document.querySelector(`span[data-line="${warning.start}"]`);
      if(span) {
        span.setAttribute('data-title', `${span.getAttribute('title')}\n ${warning.message}` );

        let tooltip = document.querySelector(`span[data-tooltip="warning-tooltip"][data-line="${warning.line}"]`);
        // let tooltip = document.querySelector(`span[data-tooltip="warning-tooltip"][data-line="${warning.start}"]`);

        tooltip.innerText = tooltip.innerText + `${warning.message}. `;
        continue;
      }

      span = document.createElement('span');
      span.setAttribute('data-markdown-target', 'warning');

      span.setAttribute('data-line', warning.line);
      // span.setAttribute('data-line', warning.start);

      let rect = this.editor.getClientRectAtPosition(startOffset);      
      if(!rect) {
        continue;
      }
      // span.style.top = `${rect.y - 125}px`;
      span.style.top = `${rect.top + window.pageYOffset - 127}px`;

      let icon = document.createElement('i');
      icon.classList.add('fas', 'fa-exclamation-circle');
      span.setAttribute('data-title', warning.message);
      span.classList.add('absolute', 'cursor-pointer', 'text-accent-warning', 'ml-1');
      span.append(icon);
      // document.querySelector('section.trix-container').append(span);

      let tooltip = document.createElement('span');
      tooltip.innerText = `${warning.message}. `;
      // tooltip.style.top = `${rect.y - 160}px`;      
      tooltip.style.top = `${rect.y + window.pageYOffset - 127 - rect.height}px`;
      // tooltip.style.left = "-10px";
      tooltip.style.left = "20px";
      tooltip.classList.add('warning-tooltip', 'absolute');
      tooltip.setAttribute('data-tooltip', 'warning-tooltip');
      tooltip.setAttribute('hidden', 'hidden');

      tooltip.setAttribute('data-line', warning.line);
      // tooltip.setAttribute('data-line', warning.start);

      span.addEventListener('mouseenter', (event) => {
        let target = event.target;
        let warningTooltip = document.querySelector(`span[data-tooltip="warning-tooltip"][data-line="${target.getAttribute('data-line')}"]`);
        warningTooltip.removeAttribute('hidden');
      });

      span.addEventListener('mouseleave', (event) => {
        let target = event.target;
        let warningTooltip = document.querySelector(`span[data-tooltip="warning-tooltip"][data-line="${target.getAttribute('data-line')}"]`);
        warningTooltip.setAttribute('hidden', 'hidden');
      });

      document.querySelector('div.actual-editor').append(span);
      document.querySelector('div.actual-editor').append(tooltip);
      // span.append(tooltip);
    }
  }
}