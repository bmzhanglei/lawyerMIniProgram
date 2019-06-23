

var subData = require('../test/data.js');  //引入
Page({
  data: {
    answers:null,
    allData:[],
    isMulti:false,
    anShow:true, //是否显示答案
    answerSel:null,
    isDate:false,
    _id:0,
    count:0,
    loadIshide: false,
    score: null,
    nickname:null,
    tab:["已回答问题","生成报告"],
    curIndex:0
  },
  onLoad:function(e){
    let nickname = e.nickname;
    this.data.nickname=nickname;
    if(e.curIndex){
      this.setData({curIndex:e.curIndex});
    }
    let answers = wx.getStorageSync('lawyer2_' + nickname);
    let questions = wx.getStorageSync('lawyer_' + nickname);

    // debugger
    let [orgin1, orgin2, orgin3] = [0, 50, 50];
    let [score1, score2, score3] = [0, 0, 0];
    let getOrigion1 = true;
    let getOrigion2 = false;
    //  debugger
    if (answers.answer.length > 0) {
      let answers_10 = answers.answer.filter(res => res.num == 10)[0];
      if (answers_10 && answers_10.value[0] == 0) {
        orgin1 = 90;
      } else {
        for (let i = 1; i < answers.answer.length; i++) {
          let anNo = answers.answer[i].num;
          let curQuestion = questions.filter(res => res.num == anNo)[0];
          let selAnswer = answers.answer[i].value[0];
          let score11 = curQuestion.answer[selAnswer].score1;
          let score22 = curQuestion.answer[selAnswer].score2;
          let score33 = curQuestion.answer[selAnswer].score3;
          if (answers.answer[i].num > 0 && answers.answer[i].num < 11) {
            if (selAnswer != curQuestion.answer.length - 1) {
              if (curQuestion.answer[selAnswer].origin && getOrigion1) {
                orgin1 = curQuestion.answer[selAnswer].origin;
                getOrigion1 = false;
              } else if (score11) {
                score1 += score11;
              }
            }
            if (score22) {            
              score2 += score22;
            }
            if (score33) {             
              score3 += score33;
            }
          } else if (answers.answer[i].num < 17) {
            //如果对方有家暴、遗弃、赌博、重婚或与第三者同居则概率不下浮
            if (answers.answer[i].num==12){
              // debugger
              let ruleOut = answers.answer.filter(res=>[3,4,5,7,8].includes(res.num));
              let flag = ruleOut.some(res=>res.value[0]==1);
              if(!flag){
                score11=0;
              }
            }
            if (score11) {
              score1 += score11;
            }
          } else if (answers.answer[i].num < 24) {
            if (answers.answer[i].num == 19) {
              if (answers.answer[i].value[0] == 2) {
                orgin2 = 99;
                getOrigion2 = true;
              } else if (answers.answer[i].value[0] == 3) {
                orgin2 = 1;
                getOrigion2 = true;
              } else {
                if (score22) {
                  score2 += score22;
                }
              }
            }
          }
        }
        console.log(score1, score2, score3)
        orgin1 = orgin1 + score1;
        if (!getOrigion2) {
          orgin2 = orgin2 + score2;
        }
        orgin3 = orgin3 + score3;
        this.setData({ score: [orgin1, orgin2, orgin3] });
      }
    }else{

    }

// debugger
    const db = wx.cloud.database();   
    db.collection('lawyer_test').where({
      user: nickname
    }).get({
      success: res => {       
        let answer = res.data[0].answer;
        //count 获取重新评估的次数
        this.setData({ answers: answer, _id: res.data[0]._id, count: res.data[0].count});       
        let arr = [];
        for(let i in answer){
          arr.push(answer[i].num);
        }
        let subDatas = [];
        subDatas.push(subData.data.question, ...subData.data.commonQuestion, ...subData.data.otherQuestion);      

        let datas = subDatas.filter(res => arr.includes(res.num));
        this.setData({ allData: datas, loadIshide: true });       
        console.log(datas)
        console.log('[数据库] [查询记录] 成功: ', this.data.allData )
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  reTest(){
    let _this = this;
    // debugger
    if (this.data._id){
    wx.showModal({
      title: '提示',
      content: '重新评估将删除本次评估信息！',
      success(res) {
        if (res.confirm) {
         const db = wx.cloud.database();
         _this.data.answers.answer=[];
         _this.data.answers.complete=false;
          _this.data.answers.nextIndex=[];
          _this.data.answers.nexts=[];
          _this.data.answers.numQuestions=[];
          db.collection('lawyer_test').doc(res.data[0]._id).update({
            data: _this.data.answers,
            success: res => {
              wx.setStorageSync('lawyer_' + _this.data.nickname, null);
              wx.setStorageSync('lawyer2_' + _this.data.nickname, null);
              wx.setStorageSync('lawyerNext_' + _this.data.nickname, null);
              wx.setStorageSync('lawyerNum_' + _this.data.nickname, null);
              console.log('[数据库] [修改记录] 成功！');
              wx.navigateTo({
                url: '../test/test?reassessment=1&nickname=' + _this.data.nickname
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
    }
 
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