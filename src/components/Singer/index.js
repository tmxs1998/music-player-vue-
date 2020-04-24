// singer页面数据处理
function dealData (data) {
  let obj = { hot: [] }
  for (let i = 0; i < data.length; i++) {
    let { Findex, Fother_name, Fsinger_mid, Fsinger_name } = data[i]
    let avator = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${Fsinger_mid}.jpg?max_age=2592000`
    let singerItem = { Findex, Fother_name, Fsinger_mid, Fsinger_name, avator }
    // 将获取的前10条数据加入hot数组
    if(i < 10) {
      obj.hot.push(singerItem)
    }
    // 将对象中没有出现过的首字母加入对象中
    if(!obj[Findex]){
      obj[Findex] = [singerItem]
    } else {
    // 向首字母数组中添加歌手
      obj[Findex].push(singerItem)
    }
  }

  // 将对象变为数组
  let hot = []
  let other = []
  for(const key in obj) {
    if(key === 'hot'){
      hot.push({ Findex: key, list: obj[key] })    
    } else if(key != 9) {
      other.push({ Findex:key, list: obj[key] })
    }
  }

  // 按照首字母进行排序
  other.sort((a, b) => {
    return a.Findex.charCodeAt() - b.Findex.charCodeAt()
  })
  // 合并两个数组
  let result = hot.concat(other)
  return result
}
export { dealData }