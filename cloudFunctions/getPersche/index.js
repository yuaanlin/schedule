// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const scheduleform = db.collection('Schedules')
// 云函数入口函数
exports.main = async (event, context) => {
  let sche;
  let sche_ban;
  let tmp;
  let ban = [];
  let info;
  let i;
  const wxContext = cloud.getWXContext()
  const open_id = wxContext.OPENID
  console.log(open_id)
  console.log(scheduleform)
  sche = await db.collection('Schedules').where({
    ownerID: open_id
  })
    .get()
  await db.collection('info')
    .aggregate()
    .match({
      userid: open_id
    })
    .lookup({
      from: 'Banci',
      localField: 'classid',
      foreignField: '_id',
      as: 'bancilist',
    })
    .end()
    .then(res => {
      info = res
    })
    .catch(err => console.error(err))
  sche = sche.data
  console.log(info)
  console.log(sche)
  for (i = 0; i < info.list.length; i++) {
    ban = ban.concat(info.list[i].bancilist)
  }
  for (i = 0; i < ban.length; i++) {
    const [scheinfo] = sche.filter(v => v._id === ban[i].scheid)
    if (!scheinfo) {
      tmp = await scheduleform.where({
        _id: ban[i].scheid
      }).get()
      sche.push(tmp)
    }
  }
  info = info.list
  return {
    data:{
      schedule:sche,
      info:info
    }
  }
}