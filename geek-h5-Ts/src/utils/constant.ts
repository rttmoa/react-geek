// /Layout
const tabBar = [
    {
      title: '首页', 
      icon: 'iconbtn_home',
      path: '/home/index',
    }, 
    { 
      title: '测试',
      icon: 'iconbtn_qa',
      path: '/home/ts',
    },
    // { 
    //   title: '问答',
    //   icon: 'iconbtn_qa',
    //   path: '/home/qa',
    // },
    // {
    //   title: '视频',
    //   icon: 'iconbtn_video',
    //   path: '/home/video',
    // },
    {
      title: '我的',
      icon: 'iconbtn_mine',
      path: '/home/profile',
    },
];
/** /Home/component/MoreAction 举报反馈菜单 */
const list = [
  { id: 0, title: '其他问题' },
  { id: 1, title: '标题夸张' },
  { id: 2, title: '低俗色情' },
  { id: 3, title: '错别字多' },
  { id: 4, title: '旧闻重复' },
  { id: 5, title: '广告软文' },
  { id: 6, title: '内容不适' },
  { id: 7, title: '涉嫌违法犯罪' },
  { id: 8, title: '侵权' },
]


export {
    tabBar,
    list
}