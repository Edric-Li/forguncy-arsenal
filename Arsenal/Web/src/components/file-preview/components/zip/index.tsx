import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import requestHelper from '../../../../common/request-helper';
import type { DataNode } from 'antd/es/tree';
import { Modal, Tree } from 'antd';
import FileUploadEngine from '../../../../common/file-upload-engine';
import FilePreviewInner, { isImage } from '../../file-preview-inner';
import ImageFullScreenPreview from '../../../image-full-screen-preview';

const { DirectoryTree } = Tree;

const style: CSSProperties = {
  display: 'flex',
  width: '100%',
  height: '100%',
};

interface Node {
  title: string;
  key: string;
  children?: Node[];
  isLeaf?: boolean;
}

const buildTree = (paths: string[]): Node[] => {
  const root: Node[] = [];
  const map: Map<string, Node> = new Map();

  for (const path of paths) {
    const parts = path.split('/');

    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const prevPath = currentPath;
      currentPath += '/' + part;

      if (map.has(currentPath)) {
        continue;
      }

      const node: Node = {
        title: part,
        key: currentPath,
        children: [],
        isLeaf: true,
      };

      map.set(currentPath, node);

      if (i === 0) {
        root.push(node);
        continue;
      }

      const parent = map.get(prevPath);

      parent!.isLeaf = false;

      if (part !== '') {
        parent!.children?.push(node);
      }
    }
  }
  return root;
};

const ZipViewer = (props: IPreviewComponentProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewName, setPreviewName] = useState('');

  const [treeData, setTreeData] = React.useState<DataNode[]>([]);

  useEffect(() => {
    (async () => {
      const res = await requestHelper.getZipEntries(props.url.split('/').pop() as any);
      if (!res.result) {
        return;
      }
      setTreeData(buildTree(res.data));
    })();
  }, [props.url]);

  const handleClick = async (node: Node) => {
    if (!node.isLeaf) {
      return;
    }

    const res = await requestHelper.generateTemporaryAccessKeyForZipFile(props.url.split('/').pop() as any, node.key);

    setPreviewOpen(true);
    setPreviewName(node.title);
    setPreviewUrl(FileUploadEngine.getAccessUrl(res.data));
  };

  const handleCancel = () => setPreviewOpen(false);

  const renderFilePreview = () => {
    if (!previewOpen) {
      return null;
    }

    if (isImage(previewUrl)) {
      return <ImageFullScreenPreview url={previewUrl} onClose={handleCancel} />;
    }

    const { url, suffix, evaluateFormula, ...options } = props;

    return (
      <Modal open title={previewName} footer={null} onCancel={handleCancel} centered width={document.body.clientWidth}>
        <div style={{ width: '100%', height: document.body.clientHeight - 105 }}>
          <FilePreviewInner url={previewUrl} evaluateFormula={props.evaluateFormula} options={options} />
        </div>
      </Modal>
    );
  };

  return (
    <div style={style} ref={rootRef}>
      {treeData.length ? (
        <DirectoryTree
          rootClassName='arsenal-file-preview-zip-tree'
          multiple
          showLine
          defaultExpandAll
          treeData={treeData}
          height={rootRef.current?.offsetHeight}
          onClick={(e, node) => {
            handleClick(node as Node);
          }}
        />
      ) : null}

      {renderFilePreview()}
    </div>
  );
};

export default ZipViewer;
