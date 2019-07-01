

var subData = require('../test/data.js');  //引入
Page({
  data: {
    answers:null,
    answeredQuestion:null,
    allData:[],
    isMulti:false,
    anShow:true, //是否显示答案
    answerSel:null,
    isDate:false,
    count:0,
    loadIshide: false,
    score: null,
    nickname:null,
    conclusion: { fixed: '', me: null, you: null, both: null, debt:null}, //财产结论
    tab:["已回答问题","生成报告"],
    curIndex:1
  },
  onShow:function(){
    // let nickname = wx.getStorageSync('nickname');
    // if(nickname){
     
    //   this.getData(nickname);
    // }
    
  },
  onLoad:function(e){
    let nickname = e.nickname;
    this.data.nickname=nickname;
    let _this = this;
    if(e.curIndex){
      this.setData({curIndex:e.curIndex});
    }
    // debugger
    this.getData(nickname);
   
  },
  getData(nickname){
    let _this = this;
    let answers = wx.getStorageSync('lawyer_' + nickname);
    //  debugger
    if(answers&& answers.answer.length > 0) {
      this.doData(answers)
    }else {
      const db = wx.cloud.database();
      db.collection('lawyer_test').where({
        user: nickname
      }).get({
        success: res => {
          let answer = res.data[0];
          _this.doData(answer);
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
      }
  },
  doData(answers){
    // let flag = answers.conclusion.score.every(res=>res==0);
    this.setData({answers:answers})
     delete this.data.answers._id;
    delete this.data.answers._openid;

    let [ids,scores] = [[],[]];
    answers.answer[0].answer.forEach((value,index,array)=>{
       ids.push(parseInt(value)+1);
     })

     for(var i=0;i<3;i++){
       if (ids.includes(i+1)) {
         let val = answers.conclusion.score[i];
         if(val>90){
           val=90
         }else if(val<20){
           val = 20
         }
         scores[i] = val+'%';
       } else {
         scores[i] = null
       }
     }
    this.setData({ score: scores});

    if(answers.conclusion.fixed){
      this.setData({ 'conclusion.fixed': answers.conclusion.fixed})
    }
    if (answers.conclusion.me) {
      this.setData({ 'conclusion.me': answers.conclusion.me })
    }
    if (answers.conclusion.you) {
      this.setData({ 'conclusion.you': answers.conclusion.you }) 
    }
    if (answers.conclusion.both) {
      this.setData({ 'conclusion.both': answers.conclusion.both }) 
    }
    if (answers.conclusion.debt) {
      this.setData({ 'conclusion.debt': answers.conclusion.debt }) 
    }

    this.setData({ loadIshide:true});
    // if(!flag){

    // }
  },
  //重新评估
  reTest(){
    let _this = this;
    // debugger
    if (this.data.answers.id && this.data.answers.count<3){
    wx.showModal({
      title: '提示',
      content: '重新评估将删除本次评估信息！',
      success(res) {
        if (res.confirm) {
         const db = wx.cloud.database();
         _this.data.answers.answer=[];
         _this.data.answers.complete=false;
          _this.data.answers.conclusion = { score: [0, 0, 0], fixed: '', me: null, you: null, both: null, debt: null };

          db.collection('lawyer_test').doc(_this.data.answers.id).update({
            data: _this.data.answers,
            success: res => {
              let nickname = _this.data.nickname;
              wx.setStorageSync('lawyer_' + nickname, null);
              wx.setStorageSync('nickname', nickname);
              wx.setStorageSync('reassessment', 1);

              console.log('[数据库] [修改记录] 成功！');
              wx.navigateTo({
                url: '../test/test?reassessment=1&nickname=' + nickname
              })
            },
            fail: err => {
              console.error('[数据库] [更新记录] 失败：', err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    }else{
      wx.showToast({
        title: '重新评估不能超过三次！',
        icon: 'none',
        duration: 2000
      })

    }
 
  },
  onUnload: function (e) { //退出页面时调用 
    wx.reLaunch({
      url: '../index/index',
    })
  },
  showAn(e){
    this.setData({ anShow:true});
    console.log(this.data.anShow)
  },
  tabChange(e){
    this.setData({ curIndex: e.target.dataset.index}) ;
  },
  showAnswer(e){
    let num = e.target.dataset.num;
    let val = this.data.answers.filter(res=>res.num==num)[0].value;
    let flag = typeof val == 'string';
   
    if(flag){
      this.setData({ isDate: true, answerSel:val})
    }else{
      let subject = this.data.allData.filter(res => res.num == num)[0];

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
    }    
  }
})