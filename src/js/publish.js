import { notifySuccess } from './common'

const PUBLISH_URL = '/article/publish'

async function publish(title, markdown) {
  let payload = {
    article: {
      title: title,
      body_markdown: markdown,
      published: false
    }
  }
  try {
    let res = await fetch(PUBLISH_URL, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let data = await res.json()
    notifySuccess(`<a href="${data.url}/edit" target="_blank" rel="noopener">Go to your post!</a>`)
  } catch(err) {
    console.error(err)
  }

}