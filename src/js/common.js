import notie from 'notie/dist/notie';

const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    const boundFunc = func.bind(this, ...args);
    clearTimeout(timerId);
    timerId = setTimeout(boundFunc, delay);
  }
};

const notifySuccess = (text) => {
  notify('success', text)
}

const notifyInfo = (text) => {
  notify('info', text)
}

const notify = (type, text, time = 4) => {
  notie.alert({type, text, time})
}

export {
  debounce,
  notifyInfo,
  notifySuccess
}