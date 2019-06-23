const app = getApp()
var subData = require('./data.js');  //引入
Page({
  data: {
    phone: '',
    subData: subData.data.otherQuestion,
    firstQuestion: subData.data.question,
    commonQuestion: subData.data.commonQuestion,
    selQuestion: null,
    anShow: true, //是否显示答案
    answerSel: null,
    loadIshide:false,
    selFirst: false,
    answers: { user: null,numQuestions:[],nexts:[{num:0,next:[]}], nextIndex:null,answer: [],count:0 },  //用户回答的问题
    tempAnswer: null,  
    isNavigate:false,  
    answeredQuestion:[],
    ids: [],
    tabIndex:1,
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
            wx.setStorageSync('lawyer_' + _this.data.answers.user, selQs);   
            wx.setStorageSync('lawyer2_' + _this.data.answers.user, res.data[0]);   
            wx.setStorageSync('lawyerNum_' + _this.data.answers.user, numQuestions);
            wx.setStorageSync('lawyerNext_' + _this.data.answers.user, nexts);        
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
  //选择问题板块
  checkboxChange: function (e) {
    if (e.detail.value.length > 0) {
      this.setData({ disable: false, ids: e.detail.value });
    } else {
      this.setData({ disable: true, ids: [] })
    }
    let firstQeustion = { num: 0, value: e.detail.value }
    this.data.tempAnswer = firstQeustion;
  },

  //题目分类
  nextQuestion: function (option) {
    // debugger
    let nexts = []; //
    if (this.data.ids.length > 0) {
      let allQuestion = this.data.commonQuestion;
      for (let i in this.data.ids) {
        let arr = this.data.subData.filter(res => res.parentId == this.data.ids[i]);
        allQuestion.push(...arr);
      }
      let arr = [11,17,24,42];
      let arr2=[];
      for (var i in this.data.ids){
        let num = this.data.ids[i]-1;
        arr2.push(arr[num]);
      }

      for (let j in allQuestion[10].answer) {
        allQuestion[10].answer[j].next[0] = arr2[0];
        nexts[0] = { num: 10, next: arr2[0]};
      }
    // debugger
      //2...
     if(arr2.length>1){
       for (let i = 1; i < arr2.length; i++) {        
         if (this.data.ids[i-1]==1){
           for (let j in allQuestion) {
             if (allQuestion[j].num == 16) {               
               for (let k in allQuestion[j].answer) {
                 allQuestion[j].answer[k].next[0] = arr2[i]
               }
               nexts[1] = { num: 16, next: arr2[i] };
               break;
             }
           }
         }
         if (this.data.ids[i-1] == 2) {
           for (let j in allQuestion) {
             if (allQuestion[j].num == 23) {
               for (let k in allQuestion[j].answer) {
                 allQuestion[j].answer[k].next[0] = arr2[i]
               }
               nexts[2] = { num: 23, next: arr2[i] };
               break;
             }
           }
         }       
       }
     } 

     //是否删除财产约定 num=48
     if(this.data.ids.includes('3')){
       if(this.data.ids.includes('4')){
         for(let i in allQuestion){
           if (allQuestion[i].num==48){
             allQuestion.splice(parseInt(i), 1); 
           } else if (allQuestion[i].num == 37){
             for(let j in allQuestion[i].answer){
               allQuestion[i].answer[j].next.push(42);
             }
             nexts[3] = { num: 37, next: 42 };
           }
         }
       }else{
         for (let i in allQuestion) {
           if (allQuestion[i].num == 37) {
             for (let j in allQuestion[i].answer) {
               allQuestion[i].answer[j].next.push(-1);
             }
             nexts[3] = { num: 37, next: -1 };
           }
         }         
       }
     }

     //设置最后问题 next = -1
      for (let i in allQuestion[allQuestion.length-1].answer){
        allQuestion[allQuestion.length - 1].answer[i].next[0]=-1;
      }
      // debugger
      nexts.push({ num: allQuestion[allQuestion.length - 1].num,next:-1});

      this.setData({ selQuestion: allQuestion, selFirst: true, curIndex: 1,nextIndex:[1],'answers.nexts':nexts });
      wx.setStorageSync('lawyer_' + this.data.answers.user, allQuestion);     
      wx.setStorageSync('lawyerNext_' + this.data.answers.user, nexts);
      //获取题目序号数组save
      let numQuestions=[];
      for(let i in allQuestion){
         numQuestions.push(allQuestion[i].num);
      }
      this.data.answers.numQuestions = numQuestions.sort((a, b) => parseFloat(a) - parseFloat(b));       wx.setStorageSync('lawyerNum_' + this.data.answers.user, numQuestions);
    }
    this.data.answers.answer.push(this.data.tempAnswer)
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
          this.data.nextIndex = [42];
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
          this.data.nextIndex = [42];
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

  radioChange: function (e) {
    let next = e.detail.value.split(',');  
    
    let val = e.detail.value.split(',')[0];
    let num = e.target.dataset.num;  
    //债权约定
    if (num == 36 && val == '0') {  
      // debugger
      this.data.nextIndex=[42];
      if(this.data.ids.includes('4')){      
        for (let i in this.data.selQuestion) {
          if (this.data.selQuestion[i].num == 36) {
            this.data.selQuestion[i].answer[0].next[0] == 42;           
          } else if (this.data.selQuestion[i].num == 42){          
            this.setData({ [`selQuestion[${i}].answer[2].next[0]`]:49});
          } else if (this.data.selQuestion[i].num == 44){
            this.setData({ [`selQuestion[${i}].answer[0].next[0]`]: 49 });
          } else if (this.data.selQuestion[i].num == 45) {
            this.setData({ [`selQuestion[${i}].answer[0].next[0]`]: 49, [`selQuestion[${i}].answer[1].next[0]`]: 49, [`selQuestion[${i}].answer[2].next[0]`]: 49 });
          } else if (this.data.selQuestion[i].num == 46) {
            this.setData({ [`selQuestion[${i}].answer[0].next[0]`]: 49});
          } else if (this.data.selQuestion[i].num == 47) {
            this.setData({ [`selQuestion[${i}].answer[0].next[0]`]: 49 });
            break
          }
        }
      }else{
        for (let i in this.data.selQuestion) {
          if (this.data.selQuestion[i].num == 36) {
            this.data.selQuestion[i].answer[0].next[0] == -1; 
            break          
          }
        }      
      }      
    } else if(num == 36 && val == '1'){
      for (let i in this.data.selQuestion) {
        if (this.data.selQuestion[i].num == 42) {
          // debugger
          this.setData({ [`selQuestion[${i}].answer[2].next[0]`]: -1 });
        } else if (this.data.selQuestion[i].num == 44) {
          this.setData({ [`selQuestion[${i}].answer[0].next[0]`]: -1 });
        } else if (this.data.selQuestion[i].num == 45) {
          this.setData({ [`selQuestion[${i}].answer[0].next[0]`]: -1, [`selQuestion[${i}].answer[1].next[0]`]: -1, [`selQuestion[${i}].answer[2].next[0]`]: -1 });
        } else if (this.data.selQuestion[i].num == 46) {
          this.setData({ [`selQuestion[${i}].answer[0].next[0]`]: -1 });
        } else if (this.data.selQuestion[i].num == 47) {
          this.setData({ [`selQuestion[${i}].answer[0].next[0]`]: -1 });
          break
        }
      }
    }else if(num==40){
      if(val==1 || val==2){
        this.data.nextIndex.push(41);
        this.data.nextIndex.sort((a, b) => parseFloat(a) > parseFloat(b));
        if(this.data.nextIndex.includes(-1)){
          this.data.nextIndex.shift();
          this.data.nextIndex.push(-1);
        }
      }
    }
   
    if (num != 40 &&next.slice(1)[0].length > 0 && next.slice(1)[0]!=''){
      this.data.nextIndex = next.slice(1);
    }    
    this.data.tempAnswer = { num: num, value: [val] };
    // debugger
    this.setData({ disable: false });
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
                wx.setStorageSync('lawyer_' + _this.data.answers.user, _this.data.selQuestion);
                wx.setStorageSync('lawyer2_' + _this.data.answers.user, _this.data.answers);
                wx.setStorageSync('lawyerNext_' + _this.data.answers.user, _this.data.answers.nexts);
                wx.setStorageSync('lawyerNum_' + _this.data.answers.user, _this.data.answers.numQuestions);
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
                wx.setStorageSync('lawyer_' + _this.data.answers.user, _this.data.selQuestion);
                wx.setStorageSync('lawyer2_' + _this.data.answers.user, _this.data.answers);
                wx.setStorageSync('lawyerNext_' + _this.data.answers.user, _this.data.answers.nexts);
                wx.setStorageSync('lawyerNum_' + _this.data.answers.user, _this.data.answers.numQuestions);
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