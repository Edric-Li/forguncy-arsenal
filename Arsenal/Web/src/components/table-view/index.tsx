import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { Space, Table, TableProps } from 'antd';
import ResizeObserver from 'rc-resize-observer';
import { FolderOutlined } from '@ant-design/icons';

interface DataType {
  key: React.Key;
  name: string;
  size: number;
  type: string;
  updatedAt: number;
  isFolder: boolean;
}

const dataSource = [
  {
    key: '1',
    name: 'test',
    size: 123,
    type: 'folder',
    isFolder: true,
    updatedAt: 123456789,
  },
  {
    key: '2',
    name: 'test',
    size: 123,
    type: 'folder',
    updatedAt: 123456789,
  },
];

const TableView = forwardRef<IReactCellTypeRef, IProps>((props, ref) => {
  /* const [tableScrollY, setTableScrollY] = useState<number>(0);
     const columns = [
         {
             title: '文件名',
             dataIndex: 'name',
             key: 'name',
             render: (text: string, record: DataType) => {
                 if (record.isFolder) {
                     return <div>
                         <FolderOutlined/>
                         <a style={{marginLeft: 5}}>{text}/</a>
                     </div>;
                 }
                 return <span>{text}</span>;
             },
         },
         {
             title: '大小',
             dataIndex: 'size',
             key: 'size',
         },
         {
             title: '文件类型',
             dataIndex: 'type',
             key: 'type',
         }, {
             title: '修改时间',
             dataIndex: 'updatedAt',
             key: 'updatedAt',
         },
         {
             title: 'Action',
             key: 'action',
             render: (a, record) => {
                 if (record.isFolder) {
                     return;
                 }
                 return (
                     <Space size="middle">
                         <a>预览</a>
                         <a>下载</a>
                         <a>删除</a>
                     </Space>
                 );
             },
         },
     ];

     const rowSelection = {
         onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
             //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
         },
         getCheckboxProps: (record: DataType) => ({
             disabled: record.name === 'Disabled User', // Column configuration not to be checked
             name: record.name,
         }),
         columnWidth: 60
     };

     useEffect(() => {
         props.cellType.setValueToElement = (jelement, value) => {

         };
     }, []);

     const tableScroll = useMemo<TableProps<unknown>['scroll']>(
         () => (dataSource ? {y: tableScrollY} : undefined),
         [dataSource, tableScrollY],
     );

     return (
         <div className="arsenal-table-view-root">
             <ResizeObserver onResize={(size) => {
                 setTableScrollY(size.height);
             }}>
                 <Table
                     style={{width: '100%'}}
                     dataSource={dataSource}
                     columns={columns}
                     size="middle" pagination={false}
                     rowSelection={rowSelection}
                     scroll={tableScroll}
                 />
             </ResizeObserver>
         </div>
     );*/

  return null;
});

export default TableView;
