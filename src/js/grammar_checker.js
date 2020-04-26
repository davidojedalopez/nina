import alex from 'alex';
import writeGood from 'write-good';
import vfileLocation from 'vfile-location';

function generateWarnings(text) {
  return getWarningsFromAlex(text).concat(getWarningsFromWriteGood(text))
}

function getWarningsFromAlex(text) {
  return alex.text(text).messages.map( warning => {
    return {
      start: warning.location.start.offset,
      line: warning.line,
      message: warning.message
    }
  })
}

function getWarningsFromWriteGood(text) {
  return writeGood(text).map(warning => {
    let vfile = vfileLocation(text).toPosition(warning.index)
    return {
      start: warning.index,
      line: vfile.line,
      message: warning.reason
    }
  })
}

export {
  generateWarnings
}