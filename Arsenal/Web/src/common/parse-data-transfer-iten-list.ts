import { RcFile } from 'antd/es/upload';

const parseDataTransferItemList = (items: DataTransferItemList, callback: (file: CustomFile) => void) => {
  const traverseDirectory = (directory: FileSystemEntry) => {
    // @ts-ignore
    const reader = directory.createReader();

    reader.readEntries(function (entries: FileSystemEntry[]) {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (entry.isDirectory) {
          // 处理子文件夹
          traverseDirectory(entry);
        } else {
          // @ts-ignore
          entry.file((file: File) => {
            const customFile = file as CustomFile;
            customFile.uid = new Date().getTime().toString() + '-' + Math.ceil(Math.random() * 1000000000);
            customFile.relativePath = entry.fullPath.substring(1);
            callback(customFile);
          });
        }
      }
    });
  };

  if (items && items.length) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item && item.isDirectory) {
        traverseDirectory(item);
        continue;
      }

      const file = items[i].getAsFile() as RcFile;
      file.uid = new Date().getTime().toString() + '-' + Math.ceil(Math.random() * 1000000000);
      callback(file);
    }
  }
};

export default parseDataTransferItemList;
