const saveBlobAs = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);

  const anchorElem = document.createElement('a');
  anchorElem.href = url;
  anchorElem.download = fileName;

  document.body.appendChild(anchorElem);
  anchorElem.click();

  document.body.removeChild(anchorElem);

  // On Edge, revokeObjectURL should be called only after
  // a.click() has completed, atleast on EdgeHTML 15.15048
  setTimeout(function() {
    window.URL.revokeObjectURL(url);
  }, 1000);
};

export default saveBlobAs;
