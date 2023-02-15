let arr = [
  { id: 1, value: "20" },
  { id: 2, value: "15" },
  { id: 3, value: "12" },
  { id: 2, value: "8" },
  { id: 1, value: "11" },
];

const res = [
  { cupboard: "01", demand: 30, material: "B1" },
  { cupboard: "01", demand: 30, material: "A1" },
  { cupboard: "01", demand: 30, material: "C1" },
  { cupboard: "01", demand: 40, material: "A1" },
  { cupboard: "01", demand: 30, material: "B1" },
];
// 项目号、物料代码、物料名称、规格型号都相同才行、   合并后到库中查找，因为是Mes的数据，所以带上id，到后面可以查出箱号
// 如果有相同的数据、材料数量进行相加
const ids = {};
const newArr = res.filter((val, index) => {
  if (val.material in ids) {
    res[ids[val.material]].demand += val.demand;
    return false;
  } else {
    ids[val.material] = index;
    return true;
  }
});
console.log(ids);
console.log(newArr);
