import {defineBoot} from "#q-app/wrappers";


export default defineBoot(({app}) => {
  app.config.errorHandler = (err, instance, info) => {
    console.error('全局错误处理器捕获：', err);
    console.log('组件实例：', instance);
    console.log('错误信息：', info);
  };
});
