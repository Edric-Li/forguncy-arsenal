const notSupportedStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
};

const NotSupport = () => {
  return <div style={notSupportedStyle}>暂不支持该文件类型</div>;
};

export default NotSupport;
