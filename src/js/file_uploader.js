import { Storage } from 'aws-amplify'

async function uploadFileAttachment(attachment) {

  let key = 'test.png'
  let res = await Storage.put(key, attachment.file, {
    contentType: 'image/png',
    progressCallback(progress) {
      let prg = progress.loaded/progress.total * 100
      console.info('Uploaded: ' + prg)
      attachment.setUploadProgress(prg)      
    }    
  })
  let finalUrl = "https://d1f6qu3m1nxo77.cloudfront.net/public/"
  let attributes = {
    url: finalUrl + res.key,
    href: `${finalUrl}${key}?content-disposition=attachment`
  }
  attachment.setAttributes(attributes)

  console.info({res}) 
}

export {
  uploadFileAttachment
}