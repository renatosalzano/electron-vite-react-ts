

export const windowApi = () => {

  if (window.window_api) {
    return window.window_api
  }

  return {
    min() { console.warn('window_api is undefined') },
    max() { console.warn('window_api is undefined') },
    close() { console.warn('window_api is undefined') },
  }
}