// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const infoCollection = db.collection("infos");
const userCollection = db.collection("users");
const banciCollection = db.collection("bancis");
const scheCollection = db.collection("schedules");

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { bancis, infos, schedule } = event;
    var allUser = (await userCollection.get()).data;
    allUser.map(x => (x.choosenum = 0));
    var users = [];
    var infor = infos;
    var ban = bancis;

    ban.map(x => (x.choosenum = 0));

    infor.map(info => {
        const [userInfo] = users.filter(v => v._id === info.userid);
        if (!userInfo) {
            [tmp] = allUser.filter(x => x._id === info.userid);
            tmp.choosenum = 1;
            users = users.concat(tmp);
        } else {
            users.map(v => {
                if (v._id === info.userid) {
                    v.choosenum = v.choosenum + 1;
                }
            });
        }
        ban.map(x => {
            if (x._id === info.classid) {
                x.choosenum = x.choosenum + 1;
            }
        });
    });

    //根据choosenum快速排序bancis与users做为排班优先级
    var quickSort = function(arr) {
        if (arr.length <= 1) {
            return arr;
        }
        var pivotIndex = Math.floor(arr.length / 2);
        var pivote = arr.splice(pivotIndex, 1)[0];
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
        return quickSort(left).concat(pivote, quickSort(right));
    };

    ban = quickSort(ban);
    users = quickSort(users);

    var scheArr = async (banci, user, info) => {
        var infoindex = 0;
        var tmp = 0;
        var newinfo = [];
        var tmpinfo = [];
        for (var i = 0; i < banci.length; i++) {
            for (var k = 0; k < info.length; k++) {
                if (banci[i]._id === info[k].classid && info[k].tendency == true) {
                    tmpinfo.push(info[k]);
                }
            }
            for (var j = 0; j < user.length; j++) {
                for (var m = 0; m < tmpinfo.length; m++) {
                    if (user[j]._id === tmpinfo[m].userid && tmp < banci[i].count) {
                        tmp++;
                        tmpinfo[m].tendency = false;
                        newinfo.push(tmpinfo[m]);
                    }
                }
            }
            tmp = 0;
            tmpinfo = [];
        }
        return newinfo;
    };

    var newinfo = await scheArr(ban, users, infor);
    var failinfo = [];
    infor.map(x => {
        if (x.tendency === true) {
            failinfo.push(x);
        }
    });
    

    var failnum = 0;
    var leftban = [];
    for (let index in ban) {
        for (let i in newinfo) {
            if (newinfo[i].classid === ban[index]._id) {
                failnum++;
            }
        }
        if (failnum < ban[index].count) {
            leftban.push(ban[index]);
        }
        failnum = 0;
    }

    for (let index in leftban) {
      for (let i in failinfo) {
        if (failinfo[i].classid === leftban[index]._id) {
          failinfo[i].tendency = false
          newinfo.push(failinfo[i])
          failinfo = [...failinfo.filter(x=>x._id!=failinfo[i]._id)]

        }
      }
    }

    failnum = 0;
    leftban = [];
    for (let index in ban) {
      for (let i in newinfo) {
        if (newinfo[i].classid === ban[index]._id) {
          failnum++;
        }
      }
    if (failnum < ban[index].count) {
      leftban.push(ban[index]);
    }
    failnum = 0;
  }

    var leftmen = [];
    var tag = false;
    for (var index = 0; index < users.length; index++) {
        for (var i = 0; i < newinfo.length; i++) {
            if (newinfo[i].userid === users[index]._id) {
                tag = true;
                break;
            }
        }
        if (tag == false) {
            leftmen.push(users[index]);
        }
        tag = false;
    }
    let tmpfinal =[]
    leftmen.map(y=>{
      failinfo.map(x => {
        if(x.userid === y._id){
          tmpfinal.push(x)
        }})
    })
    failinfo = tmpfinal
    return {
        code: 200,
        infos: newinfo,
        leftban: leftban,
        leftman: leftmen,
        failinfo: failinfo
    };
};
