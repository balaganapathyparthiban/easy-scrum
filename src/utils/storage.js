const storageUtil = {};

storageUtil.get = (key) => {
  try {
    const data = window.localStorage.getItem(key);
    return data;
  } catch {
    return null;
  }
};

storageUtil.set = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

storageUtil.remove = (key) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export default storageUtil;
