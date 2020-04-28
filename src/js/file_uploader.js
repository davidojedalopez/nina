function uploadFileAttachment(attachment) {
  uploadFile(attachment.file, setProgress, setAttributes)

  function setProgress(progress) {
    attachment.setUploadProgress(progress)
  }

  function setAttributes(attributes) {
    attachment.setAttributes(attributes)
  }
}

async function uploadFile(file, progressCallback, successCallback) {
  let key = createStorageKey(file)
  let url = new URL('/upload/get_signed_url')
  let params = {
    key: key,
    content_type: file.type
  }
  url.search = new URLSearchParams(params).toString()

  let response = await fetch(url)
  let json = await response.json()
  signedUpload(file, key, json.url, progressCallback, successCallback)
}

function createStorageKey(file) {
  let date = new Date()
  let day = date.toISOString().slice(0, 10)
  let name = `${date.getTime()}-${file.name}`
  return `tmp/${day}/${name}`
}

function signedUpload(file, key, url, progressCallback, successCallback) {
  let xhr = new XMLHttpRequest()

  xhr.open('PUT', url, true)
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
  xhr.setRequestHeader('Content-Type', file.type)

  xhr.upload.addEventListener('progress', (event) => {
    let progress = event.loaded / event.total * 100
    progressCallback(progress)
  })

  xhr.addEventListener('load', (event) => {
    let finalUrl = "https://d1f6qu3m1nxo77.cloudfront.net/"
    if(xhr.status === 200) {
      let attributes = {
        url: finalUrl + key,
        href: `${finalUrl}${key}?content-disposition=attachment`
      }
      successCallback(attributes)
    }
  })

  xhr.send(file)
}

function postUpload(file, key, progressCallback, successCallback) {
  let xhr = new XMLHttpRequest()

  xhr.open('POST', 'https://just-blog.s3.amazonaws.com/', true)
  let data = new FormData()
  
  data.append('key', key)
  data.append('acl', 'public-read')
  data.append('Content-Type', 'image/png')
  data.append('x-amz-meta-uuid', '14365123651274')
  data.append('x-amz-server-side-encryption', 'AES256')
  data.append('x-amz-credential', 'AKIAIOSFODNN7EXAMPLE')
  data.append('a-amz-algorith', 'AWS4-HMAC-SHA256')
  data.append('x-amz-date', '20151229T000000Z')
  data.append('x-amz-meta-tag', '')
  data.append('Policy', btoa(postPolicy))
  data.append('x-amz-signature')
}

const postPolicy = `{ "expiration": "2020-12-30T12:00:00.000Z",
"conditions": [
  {"bucket": "just-blog"},
  ["starts-with", "$key", "temp/"],
  {"acl": "public-read"},  
  ["starts-with", "$Content-Type", "image/"],
  {"x-amz-meta-uuid": "14365123651274"},
  {"x-amz-server-side-encryption": "AES256"},
  ["starts-with", "$x-amz-meta-tag", ""],

  {"x-amz-credential": "AKIAIOSFODNN7EXAMPLE/20151229/us-east-1/s3/aws4_request"},
  {"x-amz-algorithm": "AWS4-HMAC-SHA256"},
  {"x-amz-date": "20151229T000000Z" }
]
}`

console.info(btoa(postPolicy))