

Page({
   data:{
     nickname:null,
     tab:['已测试','测试中'],
     curIndex:1,
     score:null,
     sel:'sel'
   },
   onLoad:function(e){
    //  let nickname = e.nickname;
     let nickname = '小磊子';
    //  this.nickname=nickname;
    //  console.log(this.nickname);

    //
     let answers = wx.getStorageSync('lawyer2_' + nickname);
     let questions = wx.getStorageSync('lawyer_'+nickname);
  
// debugger
     let [orgin1, orgin2,orgin3] = [0,50,50];
     let [score1, score2, score3] = [0, 0, 0];
     let getOrigion1 = true;
     let getOrigion2 =false;
    //  debugger
     if(answers.answer.length>0){     
       let answers_10 = answers.answer.filter(res=>res.num==10)[0];
       if (answers_10.value[0]==0){
         orgin1=90;
       }else{
         for (let i = 1; i < answers.answer.length; i++) {
          //  debugger
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
                // debugger
                score2 += score22;
              }
              if (score33) {
                // debugger
                score3 += score33;
              }
           } else if (answers.answer[i].num < 17) {
             if (score11) {
               score1 += score11;
             }            
           }else if(answers.answer[i].num<24){             
             if (answers.answer[i].num==19){
               if (answers.answer[i].value[0] == 2) {
                  orgin2 = 99;
                  getOrigion2 = true;
               } else if (answers.answer[i].value[0] == 3){
                 orgin2 = 1;
                 getOrigion2=true;
               }else{
                 if (score22) {
                   score2 += score22;
                 }  
               }
             }            
           }
         }
         console.log(score1, score2, score3)
         orgin1 = orgin1 + score1;
         if (!getOrigion2){
           orgin2 = orgin2 + score2;
         }        
         orgin3 = orgin3 + score3;
         this.setData({ score: [orgin1, orgin2, orgin3]});

       }     
     }

   },
  tabChange:function(e){
    this.setData({curIndex:e.target.dataset['index']})
  }

})