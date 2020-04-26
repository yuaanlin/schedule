// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const scheduleform = db.collection('Schedules')
// const $ = db.command.aggregate()
// 云函数入口函数
exports.main = async event => {
  let a
  let b
  let c = []
  let i
  const wxContext = cloud.getWXContext()
  const { scheid } = event;
  console.log(scheid)

  b = await db.collection('Schedules').doc(scheid).get()
  await db.collection('Banci')
    .aggregate()
    .match({
      scheid: scheid
    })
    .lookup({
      from: 'info',
      localField: '_id',
      foreignField: 'classid',
      as: 'userlist',
    })
    .end()
    .then(res => {
      a = res
    })
    .catch(err => console.error(err))

  console.log(a)
  for (i = 0; i < a.list.length; i++)
    c = c.concat(a.list[i].userlist)
  console.log(c)
  console.log(b)
  return {
    schedule: b.data,
    banci: a.list,
    userinfo: c
  }
}