import { Controller } from "stimulus"

export default class extends Controller {
  static get targets() {
    return ["download"]
  }

  static get values() {
    return { markdown: String }
  };

  connect() {    
    const toolbar = this.element.previousSibling
    
    const h1ButtonHTML = '<button type="button" class="trix-button" data-trix-attribute="heading" title="Heading">H1</button>'
    const h2ButtonHTML = '<button type="button" class="trix-button" data-trix-attribute="subHeading" title="Subheading">H2</button>'
    // const h3ButtonHTML = '<button type="button" class="trix-button" data-trix-attribute="subSubHeading" title="subSubHeading">H3</button>'

    const download = `
        <span class="trix-button-group trix-button-group--download-tools" data-trix-button-group="download-tools">
            <select class="trix-button" data-action="markdown#download" tabindex="-1">
                <option value="" selected="selected">Download</option>
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
            </select>            
        </span>
    `;

    const publish = `
        <span class="trix-button-group trix-button-group--publish-tools" data-trix-button-group="publish-tools">
            <button class="trix-button" type="button" data-action="markdown#publish" tabindex="-1">Publish draft in DEV</button>
        </span>
    `;

    addEventListener("trix-initialize", function(event) {
        const headingButton = toolbar.querySelector('[data-trix-attribute="heading1"]')
        if(headingButton) {
            headingButton.remove()
        }

        const sibling1 = toolbar.querySelector(".trix-button--icon-quote")
        sibling1.insertAdjacentHTML("beforebegin", h1ButtonHTML)

        const sibling2 = toolbar.querySelector("[data-trix-attribute='heading']")
        sibling2.insertAdjacentHTML("afterend", h2ButtonHTML)

        // const sibling3 = toolbar.querySelector("[data-trix-attribute='subHeading']")
        // sibling3.insertAdjacentHTML("afterend", h3ButtonHTML)

        // const sibling4 = toolbar.querySelector("[data-trix-button-group='history-tools']")
        // sibling4.insertAdjacentHTML('afterend', download)
        //
        // const sibling5 = toolbar.querySelector("[data-trix-button-group='download-tools']")
        // sibling5.insertAdjacentHTML('afterend', publish)

        // Code button to behave as block or inline        
        const element = event.target
        const { toolbarElement, editor } = element
      
        const blockCodeButton = toolbarElement.querySelector("[data-trix-attribute=code]")
        const inlineCodeButton = blockCodeButton.cloneNode(true)
      
        inlineCodeButton.hidden = true
        inlineCodeButton.dataset.trixAttribute = "inlineCode"
        blockCodeButton.insertAdjacentElement("afterend", inlineCodeButton)

        element.addEventListener("trix-selection-change", _ => {
          const type = getCodeFormattingType()
          blockCodeButton.hidden = type == "inline"
          inlineCodeButton.hidden = type == "block"
        })
      
        function getCodeFormattingType() {
          if (editor.attributeIsActive("code")) return "block"
          if (editor.attributeIsActive("inlineCode")) return "inline"
      
          const range = editor.getSelectedRange()
          if (range[0] == range[1]) return "block"
      
          const text = editor.getSelectedDocument().toString().trim()
          return /\n/.test(text) ? "block" : "inline"
        }

    }, { once: true })
  
  }

}
