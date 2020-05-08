// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const infoCollection = db.collection("infos");
const userCollection = db.collection("users");
const banciCollection = db.collection("bancis");

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { bancis, infos, schedule } = event
  var allUser = (await userCollection.get()).data;
  allUser.map(x => x.choosenum = 0)
  var users = []
  var infor = infos
  var ban = bancis
  ban.map(x => x.choosenum = 0)

  infor.map(info => {
    const [userInfo] = users.filter(v => v._id === info.userid);
    if (!userInfo) {
      [tmp] = allUser.filter(x => x._id === info.userid)
      tmp.choosenum = 1;
      users = users.concat(tmp)
    } else {
      users.map(v => {
        if (v._id === info.userid) {
          // console.log(v)
          // console.log(users)
          v.choosenum = v.choosenum + 1
        }
      })
    }
    ban.map(x => {
      if (x._id === info.classid) {
        x.choosenum = x.choosenum + 1
      }
    })
  })

  //根据choosenum快速排序bancis与users做为排班优先级
  var quickSort = function (arr) {
    if (arr.length <= 1) { return arr; }
    var pivotIndex = Math.floor(arr.length / 2);
    var pivote = arr.splice(pivotIndex, 1)[0]
    var pivot = pivote.choosenum;
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].choosenum < pivot) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    // console.log(arr)
    return quickSort(left).concat(pivote, quickSort(right));
  };

  ban = quickSort(ban)
  users = quickSort(users)

  var scheArr = async (banci, user, info) => {
    var infoindex = 0;
    var tmp = 0;
    var newinfo = [];
    var tmpinfo = [];
    for (var i = 0; i < banci.length; i++) {
      for (var k = 0; k < info.length; k++) {
        // console.log("banci"+banci[i]._id)
        // console.log("info"+info[k].classid)
        if (banci[i]._id === info[k].classid && info[k].tendency == true) {
          // console.log((info[k]))
          tmpinfo.push(info[k])
        }
      }
      // console.log(tmpinfo)
      for (var j = 0; j < user.length; j++) {
        for (var m = 0; m < tmpinfo.length; m++) {
          if (user[j]._id === tmpinfo[m].userid && tmp < banci[i].count) {
            // info[infoindex].tendency=false
            tmp++
            newinfo.push(tmpinfo[m])
          }
        }
      }
      // for (var n = 0; n < info.length; n++) {
      //   for (var m = 0; m < newinfo.length; m++) {
      //     if (newinfo[m]._id === info[n]._id) {
      //       info[n].tendency = false
      //     }
      //   }
      // }
      for (var m = 0; m < newinfo.length; m++) {
        await infoCollection.doc(newinfo[m]._id)
          .update({
            data: {
              tendency: false
            }
          })
      }
      tmp = 0

      tmpinfo = []
    }
    return newinfo
  }

  var newinfo = await scheArr(ban, users, infor)
  console.log(newinfo)
  var failnum = 0;
  var leftban = []
  for (var index = 0; index < ban.length; index++) {
    for (var i = 0; i < newinfo.length; i++) {
      if (newinfo[i].classid === ban[index]._id) {
        failnum++
      }
    }
    if (failnum < ban[index].count) {
      leftban.push(ban[index])
    }
    failnum = 0
  }
  console.log(leftban)
  var leftmen = []
  for (var index = 0; index < users.length; index++) {
    for (var i = 0; i < newinfo.length; i++) {
      if (newinfo[i].userid === users[index]._id) {
        tag = true
        // console.log(user[index])
      }
    }
    if (tag == false) {
      leftmen.push(user[index])
    }
    tag = false
  }
  return {
    code: 200,
    infos: newinfo,
    leftban: leftban,
    leftman: leftmen,
  }
}