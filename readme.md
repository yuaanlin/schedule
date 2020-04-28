## 数据结构

### 班表 Schedule (对应数据库的 schedules 集合)

```typescript
export default class Schedule:{
    
    // 班次id
    id:string;

    //创建者id
    ownerID:string;

    //班表标题
    title:string;

    //班表描述
    description:string;

    //参与者所需标识
    tag: string;
}
```

### 班次 Banci (对应数据库的 Banci 集合)

```typescript
export default class Banci:{

    // 班次 id
    id: string;

    // 对应班表
    scheid: string;

    // 需要人数
    count: number;

    // 班次开始时间
    startTime: Date;

    // 班次结束时间
    endTime: Date;
}
```

### 用户 User (对应数据库的 User 集合)

```typescript
export default class User:{

    // openID
    _id: string;

    // 头像 url
    avatarUrl: string;

    // 性别
    gender: number;
    
    // 名称
    name: string;
}
```

### 「用户」和「班次」的对应关系 info (对应数据库的 info 集合)

```typescript
export default class info:{

    // id
    id:string;

    // openid
    userid:string;

    // 班次 id
    classid:string;

    // 用户区分 tag
    tag:string;

    // 是否确定
    tendency:string;
}
```

## Cloud Functions 后端接口

### 用户相关

1. 用户信息权限: getuserinfo(e)
2. 用户登录: login()

### 改动信息

1. 创建班表：createsche()
2. 删除班表：deletsche(scheid)
3. 读取班表与班次信息：readscheinfo(scheid)
4. 读取用户信息：readuserinfo(scheid)
5. 手动添加参与者：adduser(user[],scheid,classid)
6. 分享链接：sharesche()
7. 自动排班：arrangesche(scheid,classid[],userid[])
8. 完成班表创建：completesche()
9. 编辑更新班表：editsche(scheid)

### 查看信息
获取班表信息：getscheinfo(scheid)
获取班次信息：getclassinfo(scheid,classid)
获取用户信息：getuserinfo(scheid,userid)
查看日历以及班次信息（非必须）：showdata(scheid,userid)

## 核心功能

### 自动排班：
班次 id 与 user:tendency 中数值的对应，并受限于 class:count
逻辑流程：？
排班的类型预设
个人信息、重复提示
固定团队
1d1104975e9dbc5400a55ed013d612dc
oN5Aw5RCzplappt06XDm3eR7JHrY
