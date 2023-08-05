import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import requestHelper from '../../../../common/request-helper';
import type { DataNode } from 'antd/es/tree';
import { Input, Modal, Tree } from 'antd';
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
  const originalPathRef = useRef<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewName, setPreviewName] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [treeData, setTreeData] = React.useState<DataNode[]>([]);

  useEffect(() => {
    (async () => {
      const res = await requestHelper.getZipEntries(props.url.split('/').pop() as any);

      if (!res.result) {
        return;
      }
      originalPathRef.current = res.data;
      setTreeData(buildTree(res.data));
    })();
  }, [props.url]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        event.stopPropagation();

        setShowSearch(true);
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

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

  const handleSearchChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const matchData = originalPathRef.current.filter((path) => path.includes(value));

    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item, dataIndex) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(value);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + value.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className='arsenal-file-preview-zip-tree-search-value'>{value}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );

        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });

    setTreeData(loop(buildTree(matchData)));
  };

  const renderSearchContainer = () => {
    return (
      <div className='arsenal-file-preview-zip-search-box'>
        <Input
          placeholder='请输入搜索内容'
          onChange={handleSearchChanged}
          autoFocus
          className='arsenal-file-preview-zip-search'
        />
      </div>
    );
  };

  return (
    <div style={style} ref={rootRef}>
      {treeData.length ? (
        <DirectoryTree
          rootClassName='arsenal-file-preview-zip-tree'
          multiple
          showLine
          selectable={false}
          defaultExpandAll
          treeData={treeData}
          height={rootRef.current?.offsetHeight}
          onClick={(e, node) => {
            handleClick(node as Node);
          }}
        />
      ) : null}

      {renderFilePreview()}
      {showSearch && renderSearchContainer()}
    </div>
  );
};

export default ZipViewer;
