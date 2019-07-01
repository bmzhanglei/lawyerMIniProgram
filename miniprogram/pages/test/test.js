const app = getApp()
var subData = require('./data.js');  //引入
Page({
  data: {
    questions: subData.data,
    anShow: true, //是否显示答案
    answerSel: null,
    loadIshide:false,
    answers: { user: null, answer: [], count: 0, curIndex: 0, conclusion: { score: [0,0,0], fixed: '', me: null, you: null, both: null, debt: null}},  //用户回答的问题
    ttlIndex:1, //标题序号
    tempAnswer: null,  //当前回答的问题  
    answeredQuestion:[], //回答过的题目
    ids: [], //
    idsNums: [11, 17, 24, 58], //四大板块首 num
    tabIndex:1,  //
    isMulti:false,
    nextIndex: [],
    disable: true,
    // openid: null,
    tab:['已回答问题','回答中……'],
    // date: '1988年12月',
    btnValue: '下一个',
    showup:'showup'
  },
  onShow:function(){
   let nickname = wx.getStorageSync('nickname');
   let reassessment = wx.setStorageSync('reassessment');
   if(nickname){
     this.data.answers.user = nickname;
   }
    
    if (reassessment) {
      this.setData({ loadIshide: true });
      return;
    }
    // this.data.answers.user = options.nickname;
  },
  onLoad: function (options) {
    let reassessment = options.reassessment;//是否重新评估
    if (reassessment){
      this.setData({ loadIshide: true }); 
      return;
    }
    this.data.answers.user = options.nickname;
    // debugger
    let _this = this;
    //获取所选题目
    let answers = wx.getStorageSync('lawyer_' + this.data.answers.user);
    if (answers && answers.answer.length > 0) {
    // if (false) {      
      // debugger
      this.initLoad(answers);    
    }else{
      // debugger
      //从服务端获取
      const db = wx.cloud.database();      
      db.collection('lawyer_test').where({
        user: _this.data.answers.user
      }).get({
        success: res => {    
          // debugger  
          if (res.data.length == 1 && res.data[0].answer.length>0) {
            this.initLoad(res.data[0]);           
          }else{
            this.setData({loadIshide: true})
          }
          console.log('[数据库] [查询记录] 成功: ', res.data)
        },
        fail: err => {        
          console.error('[数据库] [查询记录] 失败：', err);
        }
      })
    }
  },
  initLoad: function (answers){
    this.data.answers.answer = answers.answer;
    let answerOne = answers.answer.filter(res => res.num == 0)[0].answer;
    for (let i in answerOne) {
      this.data.ids.push(parseInt(answerOne[i]) + 1);
    }
    //已回答题目
    this.getAnsweredQuestion();
    this.setData({ loadIshide: true, 'answers.curIndex': answers.curIndex, ttlIndex: answers.answer.length + 1 }); 
  },
  checkboxChange: function (e) {
    let val = e.detail.value;
    let num = e.target.dataset.num;
    if (e.detail.value.length > 0) {
      this.setData({ disable: false});
      this.data.tempAnswer = { num: num, value:val };
    }   
  },
  radioChange: function (e) {
    let val = e.detail.value;
    let num = e.target.dataset.num;
    this.data.tempAnswer = { num: num, value: val };   
    this.setData({ disable: false });
  },
  //题目
  nextQuestion: function (e) {
    // debugger
    let index = e.target.dataset.index;
    let num = e.target.dataset.num;    
    let vals = this.data.tempAnswer.value;
    if (vals.length > 0) {
    if(num<1){
      let ids = [];
      let an = [];
      for(var i in vals){
        ids.push(parseInt(vals[i].split(',')[0]) + 1);
        an.push(vals[i].split(',')[0]);
      }
      this.setData({ ids: ids.sort(), 'answers.curIndex':1});
      let answer = {num:num,answer:an}
      this.data.answers.answer.push(answer);          
    }else if(num<11){     
        let an2 = vals.split(',');
        let answer2 = { num: num, answer: [an2[0]] } 
        //对方是否被宣告失踪
        if(num==10){ 
          let an3 = -1;
          if (an2[0]==1){
            an3 = this.data.idsNums[this.data.ids[0]-1];
          }else{
            if(this.data.ids.includes(3)){
              an3 = this.data.idsNums[2]
            } else if (this.data.ids.includes(4)){
              an3 = this.data.idsNums[3]
            }
          }
          this.setData({ 'answers.curIndex': an3 });
        }else{
          this.setData({ 'answers.curIndex': an2[1] });
        }
        this.data.answers.answer.push(answer2);      
    } else if (num < 17) {  //能否判决离婚
        let index11 = 12
        let an11 = [];
        if(num==11){         
          for(let i in vals){
            an11.push(vals[i].split(',')[0]); 
          }          
        }else{
          index11 = vals.split(',')[1];
          if (num == 16) {          
            index11 = this.data.ids.length > 1 ? this.data.idsNums[this.data.ids[1]-1] : -1 ;
          }
          an11 = [vals.split(',')[0]];
        }
        let answer4 = { num: num, answer: an11 } 
      this.setData({ 'answers.curIndex': index11 });
        this.data.answers.answer.push(answer4);
      }else if(num<24){  //小孩板块
        let index17 = vals.split(',')[1];
        let an17 = vals.split(',')[0];
        if ((num == 19 && (an17 == 2 || an17 == 3)) || num == 23){
          if (this.data.ids.includes(3)) {
            index17 = 24
          } else if (this.data.ids.includes(4)) {
            index17 = 58
          } else {
            index17 = -1;
          }     
        }
        let answer5 = { num: num, answer: an17 } 
        this.setData({ 'answers.curIndex': index17 });
        this.data.answers.answer.push(answer5);
      }else if(num<30){ //财产板块        
        let an24 = [];
        let arr24 = [];
        if(num==24){
          for (let i in vals) {
            an24.push(vals[i].split(',')[0]);
            arr24.push(vals[i].split(',')[1]);
          }
          arr24.push(30);
          this.data.nextIndex=arr24;
        }else{
          an24=vals[0].split(',')[0];
          if (num == 26 && an24==2){
            this.data.nextIndex.unshift(27);
          }
        }
        let answer24 = { num: num, answer: an24 } 
      this.setData({ 'answers.curIndex': this.data.nextIndex[0] });
        this.data.answers.answer.push(answer24);
        this.data.nextIndex.shift();
      }else if(num<37){
          let an30 = [];
          let arr30 = [];
          if (num == 30) {
            for (let i in vals) {
              an30.push(vals[i].split(',')[0]);
              arr30.push(vals[i].split(',')[1]);
            }
            arr30.push(36);
            this.data.nextIndex = arr30;
          } else {
            an30 = vals[0].split(',')[0];
            if (num == 32 && an30 == 2) {
              this.data.nextIndex.unshift(33);
            } else if (num == 36) {
                if(an30==0){
                  arr30.push(58);
                }else{
                  arr30.push(37);
                }
              this.data.nextIndex.push(arr30)
            }
          }       
          let answer30 = { num: num, answer: an30 }
          this.setData({ 'answers.curIndex': this.data.nextIndex[0] });
          this.data.answers.answer.push(answer30);
          this.data.nextIndex.shift();
      }else if(num<58){
          let an37 = [];
          let curIndex37 = 38   
          if(num==37){                   
            for(let i in vals){
              an37.push(vals[i].split(',')[0]);
            } 
            if(!an37.includes('1')){
              if (this.data.ids.includes(4)){
                curIndex37=58;
              }else{
                curIndex37=-1;
              }
            }       
          }else if(num==38){                      
            an37 = [vals.split(',')[0]]
            curIndex37 = vals.split(',')[1]          
          }else if(num==39){
            an37 = [vals.split(',')[0]]
            let prevAns = this.data.answers.answer.slice(-1)[0].answer[0];
            if(an37==3){
              curIndex37 = this.data.ids.includes(4) ? 58 : -1;
            }else if (an37 == 0 && prevAns == 0) { //全款+我方
              curIndex37=40
            } else if (an37 == 0 && prevAns == 1) { //全款+对方
              curIndex37 = 44
            } else if (an37 == 0 && prevAns == 2) { //全款+双方
              curIndex37 = 56
            } else if (an37 == 1 && prevAns == 0) { //按揭+我方
              curIndex37 = 48
            } else if (an37 == 1 && prevAns == 1) { //按揭+对方
              curIndex37 = 52
            } else if (an37 == 1 && prevAns == 2) { //按揭+双方
              curIndex37 = 57
            }
          } else if (num > 43) { 
            an37 = [vals.split(',')[0]]
            curIndex37 = vals.split(',')[1];
            if (!curIndex37){
              curIndex37 = this.data.ids.includes(4) ? 58 : -1;
            }        
          }
          let answer37 = { num: num, answer: an37 }
          this.setData({ 'answers.curIndex': curIndex37 });
          this.data.answers.answer.push(answer37);
      } else if (num > 57) {  //债务板块
          let an58 = [vals.split(',')[0]];
          let curIndex58 = vals.split(',')[1];
          if (!curIndex58){            
            if(num<61){
              let answered = this.data.answers.answer
              for (let i in answered) {
                if (answered[i].num == 36) {
                  if (answered[i].answer[0] == 1) {
                    curIndex58 = -1
                  } else {
                    curIndex58 = 62
                  }
                  break;
                }
              }
              if (!curIndex58) {
                curIndex58 = 61;
              }    
            }                  
          }
          let answer58 = { num: num, answer: an58 }
          this.setData({ 'answers.curIndex': curIndex58 });
          this.data.answers.answer.push(answer58);
      }
    }

    if (this.data.answers.curIndex < 0) {
      this.tipSubmit();
    }else{
      //显示回答过的问题
      this.getAnsweredQuestion();
      this.setData({ disable: true, ttlIndex: this.data.answers.answer.length + 1 });
    }   
  },
  getAnsweredQuestion:function(){
    let answeredQuestions = this.data.answers.answer;
    let tempAnswers = [];
    for (let i in answeredQuestions) {
      let answerOne = subData.data.filter(res => res.num == answeredQuestions[i].num);
      if (answerOne.length > 0) {
        for (let j in answeredQuestions[i].answer) {
          for (let k in answerOne[0].answer) {
            if (answeredQuestions[i].answer[j] == k) {
              answerOne[0].answer[k].checked = true
            }
          }
        }
      }
      tempAnswers.push(answerOne[0]);
    }
    this.setData({ answeredQuestion: tempAnswers });
  },
  tipSubmit: function () {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '回答完毕，确定提交！',
      success(res) {
        if (res.confirm) {
          console.log(_this.data.answers);
          _this.data.answers.complete=true;         
          _this.saveData();         
        } else if (res.cancel) {
          _this.setData({ 'answers.curIndex': _this.data.answers.answer.slice(-1)[0].num});      
          _this.setData({ disable: true, tempAnswer:null});
          _this.data.answers.complete=false;
          // debugger
          _this.data.answers.answer.pop();
        }
      }
    })
  },
  onHide: function (e) {
    this.saveData();
  },
  onUnload: function (e) { //退出页面时调用
    this.saveData();  
  },
  saveData(){
    let _this = this;
    const db = wx.cloud.database();
    // debugger
    db.collection('lawyer_test').where({
      user: _this.data.answers.user
    }).get({      
      success: res => {   
        console.log('[数据库] [查询记录] 成功: ', res)
        _this.data.answers.date = new Date().toLocaleString('en-GB');
        if (res.data.length == 1) {
          // debugger
          if (_this.data.answers.answer.length != res.data[0].answer.length){
            //修改该条数据   
            if(_this.data.answers.complete){
              let count = res.data[0].count;
              if (!!count){
                count += 1;
              }
              _this.data.answers.count = count||1;   
              //结论
              _this.getConclusion();                         
            }
            // debugger
            _this.data.answers.id = res.data[0]._id;
            db.collection('lawyer_test').doc(_this.data.answers.id).update({
              data: _this.data.answers,
              success: res => {          
                wx.setStorageSync('lawyer_' + _this.data.answers.user, _this.data.answers);             
                if (_this.data.answers.complete){
                  wx.navigateTo({
                    url: '../test2/test2?curIndex=1&nickname=' + _this.data.answers.user
                  })
                }else{
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }               
                console.error('[数据库] [更新记录] 成功！', res);
              },
              fail: err => {
                console.error('[数据库] [更新记录] 失败：', err)
              }
            }) 
          }          
        }else{
          if (_this.data.answers.answer.length > 1){
            if (_this.data.answers.complete) {
              _this.data.answers.count = 1;
              //结论
              _this.getConclusion();  
            }
            db.collection('lawyer_test').add({
              data: _this.data.answers,
              success: res => {    
                _this.data.answers.id = res._id;        
                wx.setStorageSync('lawyer_' + _this.data.answers.user, _this.data.answers);            
                if (_this.data.answers.complete) {
                  wx.navigateTo({
                    url: '../test2/test2?curIndex=1&nickname=' + _this.data.answers.user
                  })
                }    
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
              },
              fail: err => {
                console.log('[数据库] [新增记录] 新增记录失败 ');
              }
            })
          } 
        }
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  getConclusion(){ //生成结论
    let [orgin1, orgin2, orgin3] = [0, 50, 50];
    let [score1, score2, score3] = [0, 0, 0];
    let getOrigion1 = true;
    let getOrigion2 = false;
    let isViolence = false; //是否有家暴、遗弃、赌博、重婚或与第三者同居

    // this.setData({ answers: answers });
    // delete this.data.answers._id;
    // delete this.data.answers._openid;
 

    let answers_10 = this.data.answeredQuestion.filter(res => res.num == 10)[0].answer[0].checked;
    //如果对方失踪
    if (answers_10) {
      orgin1 = 90;
      orgin2 = 90;
      for (let i=2;i<this.data.answeredQuestion.length;i++) {
        let numLast = this.data.answeredQuestion[i].num;
        let anLast = this.data.answeredQuestion[i].answer;
        for(let j in anLast){
          if (anLast[j].checked && anLast[j].score3){
            score3 += anLast[j].score3
          }
        }
        if (parseInt(numLast)>=8){
          break;
        }
      }
      this.setData({ 'answers.conclusion.score': [orgin1, orgin2, orgin3+score3]});
    } else {
      //20 小孩年龄
      if (this.data.answeredQuestion[2].answer[0].checked) {
        for (let i in this.data.answeredQuestion) {
          if (this.data.answeredQuestion[i].num == 20) {
            // debugger
            this.data.answeredQuestion[i].answer[0].score2 = -5;
            this.data.answeredQuestion[i].answer[1].score2 = -30;
            break;
          }
        }
      }

      for (let i = 1; i < this.data.answeredQuestion.length; i++) {
        let curAnswers = this.data.answeredQuestion[i].answer.filter(res => res.checked);
        let curAnswer = curAnswers[0];
        let score11 = curAnswer.score1;
        let score22 = curAnswer.score2;
        let score33 = curAnswer.score3;
        if (this.data.answeredQuestion[i].num < 11) {
          if (curAnswer.origin && getOrigion1) {
            orgin1 = curAnswer.origin;
            getOrigion1 = false;
          } else if (score11) {
            score1 += score11;
          }
          if (score22) {
            score2 += score22;
          }
          if (score33) {
            score3 += score33;
          }
          // if (this.data.answeredQuestion[i].num == 10){
          //   debugger
          // }
        } else if (this.data.answeredQuestion[i].num < 17) {
          if (this.data.answeredQuestion[i].num == 11) {
            if (curAnswers.length > 1) {
              for (let i = 1; i < curAnswers.length; i++) {
                score1 += curAnswers[i].score1
              }
            } //如果对方有家暴、遗弃、赌博、重婚或与第三者同居则概率不下浮
          } else if (this.data.answeredQuestion[i].num == 12) {
            let ruleOut = this.data.answeredQuestion.filter(res => [3, 4, 5, 7.1, 8].includes(res.num));
            for (let i in ruleOut) {
              if (ruleOut[i].num == 7.1) {
                if (ruleOut[i].answer[0].checked) {
                  isViolence = true;
                  break;
                }
              } else {
                if (ruleOut[i].answer[1].checked || ruleOut[i].answer[2].checked) {
                  isViolence = true;
                  break;
                }
              }
            }
            if (isViolence) {
              score11 = 0;
            }
          }
          if (score11) {
            score1 += score11;
          }
        } else if (this.data.answeredQuestion[i].num < 24) {
          if (this.data.answeredQuestion[i].num == 19) {
            if (this.data.answeredQuestion[i].answer[2].checked) {
              orgin2 = 99;
              getOrigion2 = true;
            } else if (this.data.answeredQuestion[i].answer[3].checked) {
              orgin2 = 1;
              getOrigion2 = true;
            } else {
              if (score22) {
                score2 += score22;
              }
            }
          } else {
            if (score22) {
              score2 += score22;
            }
          }
        }

      }
      // console.log(score1, score2, score3)
      orgin1 = orgin1 + score1;
      if (!getOrigion2) {
        orgin2 = orgin2 + score2;
      }
      orgin3 = orgin3 + score3;
      this.setData({ 'answers.conclusion.score': [orgin1, orgin2, orgin3 ] });     
    }
    //财产
    let [me, you, both, fixs] = [[], [], [],[]];
    if (this.data.ids.includes(3)) {
      for (let i = 1; i < this.data.answeredQuestion.length; i++) {
        let num2 = this.data.answeredQuestion[i].num;
        if (num2 > 24 && num2 < 58) {
          if (num2 == 36) {
            if (this.data.answeredQuestion[i].answer[0].checked) {
              fixs.push(this.data.answeredQuestion[i].answer[0].fixed);
              break;
            }
          } else if (num2 == 39) {
            if (this.data.answeredQuestion[i].answer[3].checked) {
              fixs.push(this.data.answeredQuestion[i].answer[3].fixed);
              break;
            }
          }

          let ans = this.data.answeredQuestion[i].answer;
          for (let j in ans) {
            if (ans[j].checked && ans[j].me) {
              me.push(ans[j].me);
            }
            if (ans[j].checked && ans[j].you) {
              you.push(ans[j].you);
            }
            if (ans[j].checked && ans[j].both) {
              both.push(ans[j].both);
            }
          }
        }
      }
      console.log('me,you,both--->', [me, you, both]);
      console.log('fixs--->', fixs);
      if (fixs.length > 0) {
        this.setData({ 'answers.conclusion.fixed': fixs })
      } else {
        this.setData({ 'answers.conclusion.me': me, 'answers.conclusion.you': you, 'answers.conclusion.both': both })
      }
    }
    //债务
    let debt = [];
    if (this.data.ids.includes(4)) {
      for (let i = 1; i < this.data.answeredQuestion.length; i++) {
        let num3 = this.data.answeredQuestion[i].num;
        if (num3 > 57) {
          let ans57 = this.data.answeredQuestion[i].answer
          for (let j in ans57) {
            if (ans57[j].checked && ans57[j].both) {
              debt.push(ans57[j].both);
            }
          }
          // debugger        
          if (num3 > 60 && num3<62){
            let an36 = this.data.answeredQuestion.filter(res => res.num == 36);
            if ((an36 && an36.answer[1].checked) || (num3 == 61 && ans57[1].checked)){
              break;
            } 
          } 
          if (num3 == 62) {
            if (ans57[0].checked) {
              debt = [ans57[0].fixed];
            }
          }
        }
      }
      this.setData({ 'answers.conclusion.debt': debt });
    }
  },
  tabChange(e) {
    this.setData({ tabIndex: e.target.dataset.index });
  },
  showAn(e) {
    this.setData({ anShow: true });
    console.log(this.data.anShow)
  },
  showAnswer(e){
    let num = e.target.dataset.num;    
    let subject = this.data.answeredQuestion.filter(res => res.num == num)[0];
    if (subject.multi) {
      this.setData({ isMulti: true })
    } else {
      this.setData({ isMulti: false })
    }
    this.setData({  answerSel: subject.answer, anShow: false });
  },

  onGotUserInfo: function (options) {
    var that = this;
    console.log(options)
    if (options.detail.rawData) {
      // var str = "answers.user"
      // debugger
      let users = JSON.parse(options.detail.rawData).nickName;
      that.setData({ ["answers.user"]: users });
      console.log(that.data.answers.user);
    }
    wx.checkSession({
      success(res) {
        console.log(res)
        console.log("success")
      },
      fail() {

        //登录
        wx.login({
          success(res) {
            if (res.code) {
              //获取code
              // debugger
              var code = res.code;
              //在小程序规定请求地址通过appId，appSecret，登录时获取的code 来获得json数据
              var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + that.data.appId + '&secret=' + that.data.secret + 'SECRET&js_code=' + code + '&grant_type=authorization_code';
              //向服务器发起请求获取session_key，openid
              wx.request({
                url: url,
                data: {
                  session_key: "",
                  openid: ""
                }
              })
            }
            else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      }
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        content: '不能获取手机号码',
        showCancel: false
      })
      return;
    }
    wx.showLoading({
      title: '获取手机号中...',
    })
    wx.cloud.callFunction({
      name: 'getToken',  // 对应云函数名
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionCode: app.globalData.sessionCode    // 这个通过wx.login获取，去了解一下就知道。这不多描述
      },
      success: res => {

        wx.hideLoading()
        wx.showToast({
          title: '获取手机号成功',
          icon: 'none'
        })
        // 成功拿到手机号，跳转首页
        // wx.switchTab({
        //   url: '../index/index' // 这里是要跳转的路径
        // })
      },
      fail: err => {
        console.error(err);
        wx.showToast({
          title: '获取手机号失败',
          icon: 'none'
        })
      }
    })
  }
})