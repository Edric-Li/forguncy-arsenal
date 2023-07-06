import FileUploadEngine, { FileUploadOptions } from '../common/file-upload-engine';
import { useEffect, useRef } from 'react';

const useFileUploadEngine = (options: FileUploadOptions) => {
  const instance = useRef<FileUploadEngine>(new FileUploadEngine(options));

  return instance.current;
};
export default useFileUploadEngine;
