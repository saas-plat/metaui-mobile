import {
  UIStore,
  ContainerModel,
  SimpleModel,
  TableModel,
  ReportModel,
  ReferModel,
  FilterModel,
  ListModel,
  TreeModel
} from '@saas-plat/metaui';
// layout
import Layout from './Layout';
import Group from './Group';
import Tabs from './Tabs';
// input
import Navbar from './Navbar';
import Footbar from './Footbar';
import Button from './Button';
import Input from './Input';
import EditTable from './EditTable';
import Search from './Search';
// display
import DataTable from './DataTable';
import Chart from './Chart';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

UIStore.register({
  // layout
  view: [Layout, ContainerModel],
  group: [Group, ContainerModel],
  tabs: [Tabs, ContainerModel],
  navbar: [Navbar, ContainerModel],
  footbar: [Footbar, ContainerModel],

  // input
  button: [Button, SimpleModel],
  text: [Input, SimpleModel],
  decimal: [Input, SimpleModel],
  number: [Input, SimpleModel],
  textarea: [Input, SimpleModel],
  check: [Input, SimpleModel],
  switch: [Input, SimpleModel],
  datetime: [Input, SimpleModel],
  date: [Input, SimpleModel],
  month: [Input, SimpleModel],
  daterange: [Input, SimpleModel],
  week: [Input, SimpleModel],
  time: [Input, SimpleModel],
  select: [Input, SimpleModel],
  // 对象引用
  refer: [Input, ReferModel],
  // 子表编辑器
  subtable: [Input, TableModel],
  // 可编辑主表
  edittable: [EditTable, TableModel],
  search: [Search, FilterModel],

  // display
  table: [DataTable, TableModel],
  // treetable: [TreeTable, ContainerModel],
  chart: [Chart, ReportModel],
})
