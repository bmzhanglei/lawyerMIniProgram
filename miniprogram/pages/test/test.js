const app = getApp()
var subData = require('./data.js');  //引入
Page({
  data: {
    questions: subData.data,
    selQuestion: null,
    anShow: true, //是否显示答案
    answerSel: null,
    loadIshide:false,
    answers: { user: null,answer: [],count:0 },  //用户回答的问题
    ttlIndex:1, //标题序号
    tempAnswer: null,  //当前回答的问题 
    isNavigate:false,   //是否跳转
    answeredQuestion:[], //回答过的题目
    ids: [], //
    idsNums: [11, 17, 24, 58], //四大板块首 num
    tabIndex:1,  //
    curIndex: 0, 
    isMulti:false,
    nextIndex: [],
    disable: true,
    openid: null,
    tab:['已回答问题','回答中……'],
    // date: '1988年12月',
    btnValue: '下一个'
  },
  onLoad: function (options) {
    let reassessment = options.reassessment;//是否重新评估
    if (reassessment){
      this.setData({ loadIshide: true }); 
      return;
    }
    this.data.answers.user = options.nickname;
    let _this = this;
    //获取所选题目
    let answers = wx.getStorageSync('lawyer_' + this.data.answers.user);
    if (answers && answers.length > 0) {
    // if (false) {
      //已回答题目
      // debugger
      let answers2 = wx.getStorageSync('lawyer2_' + this.data.answers.user);
      let curIndex = 0;     
      if (answers2&&answers2.answer.length>0) {
        if (answers2.nextIndex && answers2.nextIndex.length > 0) {          
          curIndex = answers2.nextIndex[0];
          this.setData({ nextIndex: answers2.nextIndex })
        }
        let nexts = wx.getStorageSync('lawyerNext_' + this.data.answers.user);
        let numQuestions = wx.getStorageSync('lawyerNum_' + this.data.answers.user);

        // debugger
        let numSel = [];
        for (let i in answers2.answer){
          numSel.push(answers2.answer[i].num);
        }        
        let subDatas = [];
        subDatas.push(subData.data.question, ...subData.data.commonQuestion, ...subData.data.otherQuestion);   
        let answeredQuestion = subDatas.filter(res => numSel.includes(res.num));
        this.setData({ answeredQuestion: answeredQuestion})

        this.data.answers.answer = answers2.answer;
        this.data.ids = answers2.answer[0].value;
        this.data.answers.nexts = nexts;
        this.data.answers.numQuestions = numQuestions;
        this.setData({ selQuestion: answers, selFirst: true, curIndex: curIndex ,loadIshide:true});
      }
      this.setData({ loadIshide: true }); 
    }else{
      // debugger
      //从服务端获取
      const db = wx.cloud.database();      
      db.collection('lawyer_test').where({
        user: _this.data.answers.user
      }).get({
        success: res => {    
          // debugger  
          if (res.data.length ==1) {
            let numQuestions = res.data[0].numQuestions;
            let allQs = [];
            allQs.push(_this.data.firstQuestion, ..._this.data.commonQuestion, ..._this.data.subData);
            let selQs = allQs.filter(res => numQuestions.includes(res.num));           

            // debugger
            let numSel = [];
            for (let i in res.data[0].answer) {
              numSel.push(res.data[0].answer[i].num);
            }
            let subDatas = [];
            subDatas.push(subData.data.question, ...subData.data.commonQuestion, ...subData.data.otherQuestion);
            let answeredQuestion = subDatas.filter(res => numSel.includes(res.num));
            _this.setData({ answeredQuestion: answeredQuestion });


            let nexts = res.data[0].nexts;
            for(let i in selQs){
              let num = selQs[i].num;
              for(let j in nexts){
                if (nexts[j]&&nexts[j].num == num){
                  for (let k in selQs[i].answer){
                    selQs[i].answer[k].next = [nexts[j].next];
                  }                 
                }
              }
            }
            // debugger
            _this.setData({
              selQuestion: selQs, selFirst: true, curIndex: res.data[0].nextIndex[0], nextIndex: res.data[0].nextIndex, 'answers.nexts': nexts, 'answers.numQuestions': numQuestions, 'answers.answer': res.data[0].answer, ids: res.data[0].answer[0].value});         
            wx.setStorageSync('lawyer_' + _this.data.answers.user, res.data[0]);
          } 
          this.setData({ loadIshide:true}); 
          console.log('[数据库] [查询记录] 成功: ', res.data)
        },
        fail: err => {        
          console.error('[数据库] [查询记录] 失败：', err);
        }
      })
    }
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
      this.setData({ ids: ids.sort(), curIndex:1});
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
          this.setData({ curIndex: an3 });
        }else{
          this.setData({ curIndex: an2[1] });
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
        this.setData({ curIndex: index11 });
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
        this.setData({ curIndex: index17 });
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
        this.setData({ curIndex: this.data.nextIndex[0] });
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
          this.setData({ curIndex: this.data.nextIndex[0] });
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
          this.setData({ curIndex: curIndex37 });
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
                    curIndex58 = 62
                  } else {
                    curIndex58 = -1
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
          this.setData({ curIndex: curIndex58 });
          this.data.answers.answer.push(answer58);
      }
    }

    if (this.data.curIndex < 0) {
      this.tipSubmit();
    }
    //显示回答过的问题
    let answeredQuestions = this.data.answers.answer;
    let tempAnswers = [];
    for (let i in answeredQuestions){
      let answerOne = subData.data.filter(res => res.num == answeredQuestions[i].num); 
      if (answerOne.length>0){
        for (let j in answeredQuestions[i].answer) {          
          for (let k in answerOne[0].answer){
            if (answeredQuestions[i].answer[j]==k){
              answerOne[0].answer[k].checked=true
            }
          }
        }
      }
      tempAnswers.push(answerOne[0]);
    }
    this.setData({ answeredQuestion: tempAnswers});
    
    this.setData({ disable: true, ttlIndex:this.data.answers.answer.length+1 });

    // debugger
    // let nexts = []; //
    // if (this.data.ids.length > 0) {
    //   let allQuestion = this.data.commonQuestion;
    //   for (let i in this.data.ids) {
    //     let arr = this.data.subData.filter(res => res.parentId == this.data.ids[i]);
    //     allQuestion.push(...arr);
    //   }

    //  //设置最后问题 next = -1
    //   for (let i in allQuestion[allQuestion.length-1].answer){
    //     allQuestion[allQuestion.length - 1].answer[i].next[0]=-1;
    //   }
    //   // debugger
    //   nexts.push({ num: allQuestion[allQuestion.length - 1].num,next:-1});

    //   this.setData({ selQuestion: allQuestion, selFirst: true, curIndex: 1,nextIndex:[1],'answers.nexts':nexts });
    //   wx.setStorageSync('lawyer_' + this.data.answers.user, allQuestion);     
    //   wx.setStorageSync('lawyerNext_' + this.data.answers.user, nexts);
    //   //获取题目序号数组save
    //   let numQuestions=[];
    //   for(let i in allQuestion){
    //      numQuestions.push(allQuestion[i].num);
    //   }
    //   this.data.answers.numQuestions = numQuestions.sort((a, b) => parseFloat(a) - parseFloat(b));      
    //   wx.setStorageSync('lawyerNum_' + this.data.answers.user, numQuestions);
    // }
    // this.data.answers.answer.push(this.data.tempAnswer)
  },

  //第二个下一题按钮
  nextQuestion2: function (e) {
    let _this = this;
    //  debugger
    //对于固定值，跳出该之后的内容
    let num = e.target.dataset.num;
    //是否失踪
    if(parseFloat(num)==10){
      // debugger
      if (parseInt(this.data.tempAnswer.value[0])<1){
        if(this.data.ids.includes('3')){
           this.data.nextIndex=[24];
        }else if (this.data.ids.includes('4')){
          this.data.nextIndex = [58];
        }else{
          this.data.nextIndex = [-1]; 
        }
      } 
      //小孩的亲身父母
    } else if (parseFloat(num) == 19){
      if ([2, 3].includes(parseInt(this.data.tempAnswer.value[0]))) {
        if (this.data.ids.includes('3')) {
          this.data.nextIndex = [24];
        } else if (this.data.ids.includes('4')) {
          this.data.nextIndex = [58];
        } else {
          this.data.nextIndex = [-1];
        }
      }
    }   

    // debugger
    if (this.data.tempAnswer) {
      let flag = this.data.answers.answer.some(res => res.num == this.data.tempAnswer.num);
      let idx = this.data.answers.answer.length-1;
      if(flag){
        this.data.answers.answer.splice(idx, 1, this.data.tempAnswer);
      }else{
        this.data.answers.answer.push(this.data.tempAnswer);
      }
      this.data.answers.complete = false;    
      // debugger
      let subDatas = [];
      subDatas.push(subData.data.question, ...subData.data.commonQuestion, ...subData.data.otherQuestion);
      let addAnsweredQuestion = subDatas.filter(res => this.data.tempAnswer.num==res.num)[0];
      this.data.answeredQuestion.push(addAnsweredQuestion);
      this.setData({ answeredQuestion: this.data.answeredQuestion})
    }

    let nextNum = this.data.nextIndex;
    if(nextNum[0]==-1){
      nextNum.shift();
      nextNum.push(-1);
    }
    if(nextNum.length>0){
      // debugger
      this.data.answers.nextIndex = JSON.parse(JSON.stringify(this.data.nextIndex)) ; //临时文件存入 下一个题目数组
      if (nextNum[0]>-1){
        this.setData({ curIndex: nextNum[0], disable: true });      
        this.data.nextIndex.shift();
        //
        if (this.data.curIndex == '40') {
          if (this.data.ids.includes('4')) {
            for (let i in this.data.selQuestion) {
              if (this.data.selQuestion[i].num == 40) {
                let key = `selQuestion[${i}].answer[0].next[0]`;                
                this.setData({[key]:42});
                break;
              }
            }
          }else{
            for (let i in this.data.selQuestion) {
              if (this.data.selQuestion[i].num == 40) {
                let key = `selQuestion[${i}].answer[0].next[0]`;
                this.setData({ [key]: -1 });               
                break;
              }
            }
          }
        }
      }else{
        // debugger
        //提交问题
        this.data.isNavigate = true;
        this.tipSubmit();      
      }    
    }
  },
  checkboxChange2: function (e) {
    let vals = e.detail.value;
    let num = e.target.dataset.num;
    // debugger
    if (vals.length > 0) {
      this.setData({ disable: false });
      let selIndexs = [];
      let nextIndexs = [];
      for (let i in vals) {
        selIndexs.push(vals[i].split(',')[0]);
        nextIndexs.push(...vals[i].split(',').slice(1));
      }
      // debugger
      let nextIdxs = [...new Set(nextIndexs)].sort((a, b) => parseFloat(a) > parseFloat(b));    

      // 37
      if (parseFloat(nextIdxs[0]) == -1){
         nextIdxs.shift();
         nextIdxs.push(-1);
      }

      this.data.nextIndex = nextIdxs; //获取下一组显示的问题
      let fq = { num:num, value: selIndexs }
      this.data.tempAnswer = fq;
    } else {
      this.setData({ disable: true })
    }
    // debugger
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
          console.log('用户点击取消')
        }
      }
    })
  },
  onHide: function (e) {
    // debugger
    this.saveData();
  },
  onUnload: function (e) { //退出页面时调用
    //保存数据
    this.saveData();
  },
  saveData(){
    let _this = this;
    const db = wx.cloud.database();
    db.collection('lawyer_test').where({
      user: _this.data.answers.user
    }).get({
      success: res => {
        // debugger
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
            }
            db.collection('lawyer_test').doc(res.data[0]._id).update({
              data: _this.data.answers,
              success: res => {          
                wx.setStorageSync('lawyer_' + _this.data.answers.user, _this.data.answers);             
                if(_this.data.isNavigate){
                  wx.navigateTo({
                    url: '../test2/test2?curIndex=1&nickname=' + _this.data.answers.user
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
            }
            db.collection('lawyer_test').add({
              data: _this.data.answers,
              success: res => {             
                wx.setStorageSync('lawyer_' + _this.data.answers.user, _this.data.answers);            
                if (_this.data.isNavigate) {
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
  tabChange(e) {
    this.setData({ tabIndex: e.target.dataset.index });
  },
  showAn(e) {
    this.setData({ anShow: true });
    console.log(this.data.anShow)
  },
  showAnswer(e){
    let num = e.target.dataset.num;
    let val = this.data.answers.answer.filter(res => res.num == num)[0].value;

    let subject = this.data.answeredQuestion.filter(res => res.num == num)[0];

    if (subject.multi) {
      this.setData({ isMulti: true })
    } else {
      this.setData({ isMulti: false })
    }

    for (let i in subject.answer) {
      if (subject.answer[i].id) {
        for (let j in val) {
          if (parseInt(i) == parseInt(val[j]) - 1) {
            subject.answer[i].checked = true;
          }
        }
      } else {
        for (let j in val) {
          if (i == val[j]) {
            subject.answer[i].checked = true;
          }
        }
      }
    }
    this.setData({ isDate: false, answerSel: subject.answer, anShow: false });
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