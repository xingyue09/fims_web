import instance from '../index';
const preUrlPath = '';
//获取计划列表
const search = {
  p: ['get,/previews'],
  r: params => {
    return instance.get(`${preUrlPath}/plan/findplansandpreviews`, {params})
  }
};

export {
  search
}
