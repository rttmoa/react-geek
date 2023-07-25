import NavBar from '@/components/NavBar'
import styles from './index.module.scss'



const Video = () => {
  return (
    <div className={styles.root}>
      <NavBar>视频</NavBar>

      {/* FIXME: video-list盒子需要撑起底部浮动盒子，否则最后一个盒子被遮挡住 */}
      <div className="video-list">
        <div className="video-item">
          <h3 className="title">
            T1
          </h3>
          <div className="play">
            <img src="https://img1.baidu.com/it/u=245877632,522862514&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800" alt='' /> 
          </div>
          <span>1563次播放</span>
        </div>
        <div className="video-item">
          <h3 className="title">
            T2
          </h3>
          <div className="play">
            <img src="https://img2.baidu.com/it/u=4228287979,3937167552&fm=253&fmt=auto&app=120&f=JPEG?w=750&h=500" alt='' /> 
          </div>
          <span>1563次播放</span>
        </div> 
        <div className="video-item">
          <h3 className="title">
            格力电器将继续发展手机业务，并将向全产业覆盖！
          </h3>
          <div className="play">
            <img src="https://img1.baidu.com/it/u=3007048469,3759326707&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500" alt='' /> 
          </div>
          <span>1563次播放</span>
        </div> 
        <div className="video-item">
          <h3 className="title">
            你用上5G了吗? 我国5G手机终端达3.1亿 占全球比例超80%
          </h3>
          <div className="play">
            <video src="https://ips.ifeng.com/video19.ifeng.com/video09/2021/05/26/p6803268684325330944-102-8-184104.mp4?reqtype=tsl&vid=ec74b1e4-d1fa-488b-aaf5-71984ca7d13e&uid=1Vun5L&from=v_Free&pver=vHTML5Player_v2.0.0&sver=&se=&cat=&ptype=&platform=pc&sourceType=h5&dt=1622096310639&gid=fg3vsXmseXFv&sign=38e7c790561e1fd1b57e61a1cbd8031c&tm=1622096310639"></video> 
          </div>
          <span>1563次播放</span>
        </div>
      </div>
    </div>
  )
}

export default Video
