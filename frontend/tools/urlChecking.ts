export const isValidURL = (url ) => {
    const res = url.match(/^(https?:\/\/)?(([\da-z.-]+)\.([a-z.]{2,6})|(([0-9]{1,3}\.){3}[0-9]{1,3}))([:0-9]*)([/\w .-]*)*\/?$/);
    return (res !== null);
};
      
