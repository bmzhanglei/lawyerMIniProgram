const data =[{
    num:0,
    multi: true,
    title:'诊断内容',
    answer:[
      { name: '能否判决离婚', id: 1, next: [1], checked: false },
      { name: '小孩抚养权归属', id: 2, next: [1],checked:false},
      { name: '夫妻财产会如何分配', id: 3, next: [1], checked: false},
      { name: '夫妻共同债务会如何负担', id: 4, next: [1], checked: false}]
  },{
    num:1,
    title:'你们的婚姻有多长时间了？',
    answer: [{ name: ' 1年以下', checked: false, next: [2], score1: 2},
      { name: ' 1-3年', checked: false, next: [2], score1: 2},
      { name: ' 3-7年', checked: false, next: [2], score1: 2},
      { name: ' 7-15年', checked: false, next: [2], score1: 2 },
      { name: ' 15年以上', checked: false, next: [2], score1: 2 }]
  },{
    num: 2,
    title:'您的性别',
      answer: [{ name: '男', checked: false, next: [3], score3: -5},
        { name: '女', checked: false, next: [3], score3: 5}]
    },{
      num: 3,    
      title: "是否有存在家庭暴力的情况",
      answer: [{ name: "我方有", checked: false, next: [4], origin: 80, score2: -20, score3: -5 },
        { name: "对方有", checked: false, next: [4], origin: 75, score2: 20, score3: 5 },
        { name: "都有", checked: false, next: [4], origin: 85},
        { name: "都无", checked: false, next: [4], score1: 0 }]
    }, {
      num: 4,   
      title: "是否有存在遗弃家庭成员的情况",
      answer: [{
        name: "我方有",
        checked: false, next: [5],
        origin:80,
        score1:1,
        score2: -10,
        score3: -5
      }, {
        name: "对方有",
          checked: false, next: [5],
          origin: 75,
          score1: 2,
          score2: 10,
          score3: 5
      }, {
        name: "都有",
          checked: false, next: [5],
          origin: 85,
          score1: 3
      }, {
        name: "都无",
          checked: false, next: [5]
      }]
    }, {
      num: 5,    
      title: "是否有存在赌博、吸毒等恶习屡教不改的情况",
      answer: [{
        name: "我方有",
        checked: false, next: [6],
        origin: 80,
        score1: 1,
        score2: -10,
        score3: -5
      }, {
        name: "对方有",
          checked: false, next: [6],
          origin: 75,
          score1: 2,
          score2: 10,
          score3: 5
      }, {
        name: "都有",
          checked: false, next: [6],
          origin: 85,
          score1: 3          
      }, {
        name: "都无",
        checked: false, next: [6]
      }]
    }, {
      num: 6,   
      title: "是否有存在婚外情的情况",
      answer: [{ name: "仅我方有", checked: false, next: [7] },
        { name: "仅对方有", checked: false, next: [7.1] },
      { name: "都有", checked: false, next: [8] },
        { name: "双方都无", checked: false, next: [9] }
      ]
    }, {
      num: 7,
      parentId: 1,
      title: "是否达到重婚或与第三者同居的程度",
      answer: [{ name: "是", checked: false, next: [9], origin: 80,score1:2,score2:-10,score3:-5 },
        { name: "否", checked: false, next: [9], origin: 50, score1: 1, score2: -5, score3: -3 },
        /* 
        origin: 80, score1: 5, score2: 10,score3:5
        origin: 75, score1: 2, score2: 5,score3:3
        * */
      ]
    }, {
      num: 7.1,
      parentId: 1,
      title: "是否达到重婚或与第三者同居的程度",
      answer: [{ name: "是", checked: false, next: [9], origin: 80, score1: 5, score2: 10, score3: 5 },
      { name: "否", checked: false, next: [9], origin: 75, score1: 2, score2: 5, score3: 3 }]
    },{
      num: 8,
      parentId: 1,
      title: "哪一方达到重婚或与第三者同居的程度",
      answer: [{ name: "我方", checked: false, next: [9], origin: 80, score1: 2, score2: -5 },
        { name: "对方", checked: false, next: [9], origin: 85, score1: 3, score2: 5 },
        { name: "都有", checked: false, next: [9],origin: 90, score1: 4 },
        { name: "都无", checked: false, next: [9], origin: 70, score1: 3 }       
      ]
    },{
      num: 9,
      parentId: 1,
      title: "是否因感情不和分居满两年",
      answer: [{ name: "是", checked: false, next: [10], origin: 80, score1: 2  },
      { name: "否", checked: false, next: [10] }
      ]
    }, {
      num: 10,
      parentId: 1,
      title: "对方是否被宣告失踪？",
      answer: [{ name: "是", checked: false, next: [], origin: 90 },
        { name: "否", checked: false, next: [11], origin: 55}
      ]
    },
    /********************能否判决离婚**********************/  
    {
      num: 11,
      parentId: 1,
      multi:true,
      title: "想离婚的原因？（不定项）",
      answer: [{ name: "追求新的感情", checked: false, next: [12], score1: 2  },
        { name: "没有共同语言，难以共同生活", checked: false, next: [12], score1: 3  },
        { name: "我方/对方父母的影响", checked: false, next: [12], score1: 2  },
        { name: "其他原因（如假离婚购房等）", checked: false, next: [12], score1: 0 }
      ]
    },{
      /*如果对方有家暴、遗弃、赌博、重婚或与第三者同居则概率不下浮 */
      num: 12,
      parentId: 1,    
      title: "是否有一方为现役军人",
      answer: [{ name: "我方", checked: false, next: [13], score1: 0 },
        { name: "对方", checked: false, next: [13], score1: -20  },
        { name: "都是", checked: false, next: [13],score1: -20  },
        { name: "都不是", checked: false, next: [13], score1: 0  }
      ]
    }, {
      num: 13,
      parentId: 1,
      title: "是否有一方患有严重的传染病或精神疾病",
      answer: [{ name: "我方", checked: false, next: [14], score1: 2   },
        { name: "对方", checked: false, next: [14], score1: 1  },
        { name: "都有", checked: false, next: [14], score1: 3 },
        { name: "都无", checked: false, next: [14], score1: 0  }
      ]
    }, {
      num: 14,
      parentId: 1,
      title: "我方与对方亲属的关系如何",
      answer: [{ name: "好", checked: false, next: [15], score1: -3 },
        { name: "不好", checked: false, next: [15], score1:3}
      ]
    }, {
      num: 15,
      parentId: 1,
      title: "自认为是否存在与对方有和好的可能性",
      answer: [{ name: "可能", checked: false, next: [16], score1: -10 },
        { name: "不可能", checked: false, next: [16], score1:3 }
      ]
    }, {
      num: 16,
      parentId: 1,
      title: "以前是否有到法院起诉过离婚？",
      answer: [{ name: "我方起诉过", checked: false, next: [17], score1: 10 },
        { name: "对方起诉过", checked: false, next: [17], score1: 15 },
        { name: "无", checked: false, next: [17], score1: 0 }
      ]
      /* 概率上限90%，下限20% */
    }, { /*********************小孩问题*********************************/
      num: 17,
      parentId: 2,
      title: "小孩是否你们亲生",
      answer: [{ name: "是", checked: false, next:[20],score2:0},
        { name: "否", checked: false, next: [18], score2: 0}       
      ]
    }, {
      num: 18,
      parentId: 2,
      title: "小孩是否为收养？",
      answer: [{ name: "否", checked: false, next: [19], score2: 0},
        { name: "是，且办理了收养登记", checked: false, next: [20], score2: 0},
        { name: "是，但未办理收养登记", checked: false, next: [20], score2: 0 }
      ]
    }, {
      num: 19,
      parentId: 2,
      title: "小孩的亲生父母？",
      answer: [{ name: "小孩是我方和我前任（恋爱对象或配偶）的", checked: false, next: [20],score2: 40 },
        { name: "小孩是对方与其前任（恋爱对象或配偶）的", checked: false, next: [20], score2: -40  },
        { name: "我方和第三者（婚外情）", checked: false, next: []},
        { name: "对方和第三者（婚外情）", checked: false, next: [] }
      ]
    }, {
      num: 20,
      parentId: 2,
      title: "小孩年龄",
      answer: [{ name: "两岁以上", checked: false, next: [21] ,score2:5 },// man -5
        { name: "两岁以下", checked: false, next: [21], score2: 30   } //man -30
      ]
    }, {
      num: 21,
      parentId: 2,
      title: "小孩目前与哪一方共同生活",
      answer: [{ name: "我方/我方父母", checked: false, next: [22], score2: 5  },
        { name: "对方/对方父母", checked: false, next: [22], score2: -5   },
        { name: "双方", checked: false, next: [22], score2: 0 }
      ]
    }, {
      num: 22,
      parentId: 2,
      title: "你方（含父母）与对方（含父母）家庭经济条件对比",
      answer: [{ name: "我方比对方好很多", checked: false, next: [23], score2: 5  },
        { name: "我方比对方差很多", checked: false, next: [23], score2: -5   },
        { name: "我们双方差不多", checked: false, next: [23], score2: 0 }
      ]
    }, {
      num: 23,
      parentId: 2,
      title: "小孩与哪一方更亲近",
      answer: [{ name: "我方", checked: false, next: [], score2: 5  },
        { name: "对方", checked: false, next: [], score2: -5  },
        { name: "都差不多", checked: false, next: [], score2: 0  }
      ]
      /*上限为90，下限20（我方和第三者，对方和第三者为例外） */
    },
     /******************************财产**********************************/
     {   
      num: 24,
      multi:true,
      parentId: 3,
      title: "我方婚前财产？（不定项）",
      answer: [{ name: "车（默认无车贷）", checked: false,next:[25] },
        { name: "房", checked: false, next: [26] },      
        { name: "股票/基金/期货", checked: false, next: [28] },
        { name: "存款", checked: false, next: [29]}       
      ]
    }, {
       num: 25,
       parentId: 3,
       title: "我方是否将车辆过户给了对方？",
       answer: [{ name: "是，婚前过户", you:"我方婚前车辆",checked: false, next: [] },
         { name: "是，婚后过户", both:'我方婚前车辆', checked: false, next: [] },
         { name: "无", checked: false, me:'我方婚前车辆', next: []}]
    },{
       num: 26,
       parentId: 3,
       title: "我方是否将房产过户（含加名）给了对方",
       answer: [{ name: "是，婚前过户（加名）", me:'我方婚前房产证上我方所占份额（对方个人）我方婚前房产证上对方所占份额', checked: false, next: []},
         { name: "是，婚后过户（加名）", both:'我方婚前房产', checked: false, next: [] },
         { name: "无", checked: false, next: [27]}]  //
    }, {
      num: 27,
      parentId: 3,
      title: "我方的房产贷款情况？",
      answer: [{ name: "全款或婚前还清贷款", me: '我方婚前房产', checked: false, next: [] },
      { name: "按揭，目前尚未还清", me: '我方婚前房产（我方需要给对方婚后还贷及对应的房屋增值部分进行补偿，离婚后我方继续还贷）', checked: false, next: [] },
      { name: "按揭，目前已还清", me: '我方婚前房产（需要给对方婚后还贷及对应的房屋增值部分进行补偿）', checked: false, next: [] }]
    },{
      num: 28,
      parentId: 3,
       title: "我方婚前股票/基金/期货账户婚后有无操作？",
       answer: [{ name: "有", both:'我方婚前股票/基金/期货在婚后的增值部分', me:'我方婚前股票/基金/期货的市值', checked: false, next: [] },
         { name: "无", checked: false, me:'我方婚前股票/基金/期货的市值及婚后增值部分',next: [] }]
    }, {
      num: 29,
      parentId: 3,
       title: "我方银行卡中的存款婚后有无使用？",
       answer: [{ name: "有", both:'我方婚后被动用账户中的存款（根据具体情况不排除有概率会被认定为我方个人财产）', checked: false, next: [] },
         { name: "无", me:'我方婚前存款', checked: false, next: [] }]
    },{
      num: 30,
      multi: true,
      parentId: 3,
      title: "对方婚前财产？（不定项）",
      answer: [{ name: "车（默认无车贷）", checked: false,next:[31] },
        { name: "房", checked: false, next: [32] },    
        { name: "股票/基金/期货", checked: false, next: [34] },
        { name: "存款", checked: false, next: [35]}       
      ]
    },{
      num: 31,
      parentId: 3,
      title: "对方是否将车辆过户给了我方？",
       answer: [{ name: "是，婚前过户", me:'对方婚前车辆', checked: false, next: [] },
         { name: "是，婚后过户", both: '对方婚前车辆', checked: false, next: [] },
         { name: "无", you: '对方婚前车辆',  checked: false, next: [] }]
    }, {
      num: 32,
      parentId: 3,
       title: "对方是否将房产过户（含加名）给了我方",
       answer: [{ name: "是，婚前过户（加名）", me:'对方婚前房产证上我方所占份额',you:'对方婚前房产证上对方所占份额', checked: false, next: [] },
         { name: "是，婚后过户（加名）", both:'对方婚前房产', checked: false, next: [] },
      { name: "无", checked: false, next: [33] }]
    }, {
      num: 33,
      parentId: 3,
      title: "对方婚前房产的贷款情况？",
      answer: [{ name: "全款或婚前还清贷款", me: '对方婚前房产', checked: false, next: [] },
      { name: "按揭，目前尚未还清", you: '对方婚前房产（对方需要向我方就婚后还贷及对应的房屋增值部分进行补偿，离婚后对方继续还贷）', checked: false, next: [] },
      { name: "按揭，目前已还清", you: '对方婚前房产（对方需要向我方就婚后还贷及对应的房屋增值部分进行补偿）', checked: false, next: [] }]
    }, {
      num: 34,
      parentId: 3,
      title: "对方婚后有无操作过股票/基金/期货账户？",
       answer: [{ name: "有", you:'对方婚前股票/基金/期货的市值',both:'对方婚前股票/基金/期货在婚后的增值部分', checked: false, next: [] },
         { name: "无", you:'对方婚前股票/基金/期货的市值及婚后增值部分', checked: false, next: [] }]
    }, {
      num: 35,
      parentId: 3,
       title: "对方婚前存款的银行卡中婚后有无使用？",
       answer: [{ name: "有", both:'对方婚后被动用账户中的存款（根据具体情况不排除有概率会被认定为对方个人财产）', checked: false, next: [] },
         { name: "无", you:'对方婚前存款', checked: false, next: [] }]
    }, {
      num: 36,
      parentId: 3,
       title: "双方是否书面约定婚姻关系存续期间所得的财产归各自所有",
      answer: [
        { name: "有", checked: false, fixed:'双方婚后财产按照约定归各自所有', next: [] },//答案为：双方婚后财产按照约定归各自所有（如果回答此选项则该板块结束）
        { name: "没有", checked: false, next: [37]}
      ]
    },{
      num: 37,
      parentId: 3,
      multi:true,
      title: "你们结婚后产生的财产（不定项）",
      answer: [
        { name: "车", both:'双方婚后购置的车辆', checked: false,next:[] },
        { name: "房", checked: false, next: [38]},
        { name: "股票/基金/期货", both: '双方婚后的股票/基金/期货', checked: false, next:[]},
        { name: "存款", both: '双方婚后存款',  checked: false, next: [] },
        { name: "其他", both: '婚后其他财产除与人身密切的财物、以及指定赠与或继承的财物外原则上都是双方共同的', checked: false,next: []  }
      ]
    },{
       num: 38,
       parentId: 3,     
       title: "你们婚后购的房是如何出资的？",
       answer: [
         { name: "全款", checked: false, next: [39] },
         { name: "首付+按揭", checked: false, next: [39] }        
       ]
    }, {
      num: 39,
      parentId: 3,    
       title: "你们婚后购置的房产登记在谁名下?",
      answer: [
        { name: "我方", checked: false, next: [] },
        { name: "对方", checked: false, next: [] },
        { name: "双方", checked: false, next: [] },
        { name: "其他人代持", fixed:'你们双方婚后购置的房产法院原则上不予处理', checked: false, next: [] }//（如果回答此选项则该板块结束）
      ]
    }, {
      num: 40,
      parentId: 3,       
       title: "婚后房产的购房款是否全部由父母支付？",
      answer: [
        { name: "是，由我方父母全额支付", me:'婚后购置的房产', checked: false, next: [] },
        { name: "是，由对方父母全额支付", both:'婚后购置的房产', checked: false, next: [] },
        { name: "是，由双方父母一起全额支付", me:'我方父母出资及对应的房产增值部分',you:'对方父母出资及对应的房产增值部分', checked: false, next: [] },
        { name: "双方父母仅出资了一部分", checked: false, next: [41] },
        { name: "双方父母均未出资", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）及父母出资及对应的房屋增值部分', both:'双方婚后共同财产（如果有）出资及对应的房屋增值部分', checked: false, next: [] }
      ]
    }, {
      num: 41,
      parentId: 3,     
       title: "购房款中双方父母的具体出资情况？",
      answer: [
        { name: "仅我方父母参与出资", checked: false, next: [42] },
        { name: "仅对方父母参与出资", checked: false, next: [43] },
        { name: "双方父母都有出资", me: '我方婚前财产（如果有）及我方父母出资+对应的房屋增值部分', you: '对方婚前财产（如果有）及对方父母出资+对应的房屋增值部分', both:'双方婚后共同财产（如果有）出资及对应的房屋增值部分',checked: false, next: [] }      
      ]
    }, {
      num: 42,
      parentId: 3,      
       title: "我方父母出资是否有明确赠与表示？",
      answer: [
        { name: "明确表示出资赠与给对方", me: '我方婚前财产（如果有）+对应的房屋增值部分', you: '对方婚前财产（如果有）及我方父母出资+对应的房屋增值部分', both:'双方婚后共同财产（如果有）出资及对应的房屋增值部分', checked: false, next: [] },
        { name: "未明确表示出资赠与给谁/明确表示赠与给我方", me: '我方婚前财产（如果有）及我方父母出资+对应的房屋增值部分', you: '对方婚前财产（如果有）+对应的房屋增值部分', both: '双方婚后共同财产（如果有）出资及对应的房屋增值部分', checked: false, next: [] },
        { name: "明确表示赠与给双方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both:'双方婚后共同财产（如果有）及我方父母出资+对应的房屋增值部分', checked: false, next: [] }
      ]
    }, {
      num: 43,
      parentId: 3,    
       title: "对方父母出资是否有明确赠与表示？",
      answer: [
        { name: "明确表示出资赠与给我方", me: '对方婚前财产（如果有）+对应的房屋增值部分', you: '对方婚前财产（如果有）+对应的房屋增值部分', both:'双方婚后共同财产（如果有）出资及对应的房屋增值部分', checked: false, next: [] },
        { name: "明确表示出资赠与给对方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）及父母出资及对应的房屋增值部分', both:'双方婚后共同财产（如果有）出资及对应的房屋增值部分',checked: false, next: [] },
        { name: "未明确表示出资赠与给谁/明确表示赠与给双方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both:'双方婚后共同财产（如果有）及对方父母出资+对应的房屋增值部分', checked: false, next: [] }
      ]
    }, {
      num: 44,
      parentId: 3, 
       title: "购房款是否全部由父母支付？",
      answer: [
        { name: "是，由我方父母全额支付", both:'婚后购置的房产', checked: false, next: [] },
        { name: "是，由对方父母全额支付", you:'婚后购置的房产', checked: false, next: [] },
        { name: "是，由双方父母一起全额支付", me:'我方父母出资及对应的房产增值部分（对方个人）对方父母出资及对应的房产增值部分', checked: false, next: [] },
        { name: "双方父母仅出资了一部分", checked: false, next: [45] },
        { name: "双方父母均未出资", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）及父母出资及对应的房屋增值部分', both:'双方婚后共同财产（如果有）出资及对应的房屋增值部分',checked: false, next: [] }
      ]
    }, {
      num: 45,
      parentId: 3,     
       title: "购房款中父母部分出资的情况？",
      answer: [
        { name: "仅我方父母参与出资", checked: false, next: [46] },
        { name: "仅对方父母参与出资", checked: false, next: [47] },
        { name: "双方父母都有出资", me: '我方婚前财产（如果有）及我方父母出资+对应的房屋增值部分', you: '对方婚前财产（如果有）及对方父母出资+对应的房屋增值部分', both:'双方婚后共同财产（如果有）出资及对应的房屋增值部分', checked: false, next: [] }
      ]
    }, {
      num: 46,
      parentId: 3,     
       title: "我方父母出资是否有明确赠与表示？",
      answer: [
        { name: "明确表示出资赠与给我方", me: '我方婚前财产（如果有）及我方父母出资+对应的房屋增值部分', you: '对方婚前财产（如果有）+对应的房屋增值部分', both:'双方婚后共同财产（如果有）出资及对应的房屋增值部分', checked: false, next: [] },
        { name: "明确表示出资赠与给对方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）及我方父母出资及对应的房屋增值部分', both:'双方婚后共同财产（如果有）出资及对应的房屋增值部分', checked: false, next: [] },
        { name: "未明确表示出资赠与给谁/明确表示赠与给双方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both: '双方婚后共同财产（如果有）及我方父母出资+对应的房屋增值部分', checked: false, next: [] }
      ]
    }, {
      num: 47,
      parentId: 3,    
       title: "对方父母出资是否有明确赠与表示？",
      answer: [
        { name: "明确表示出资赠与给我方", me: '我方婚前财产（如果有）及对方父母出资+对应的房屋增值部分', you: '对方婚前财产（如果有）+对应的房屋增值部分', both:'双方婚后共同财产（如果有）出资及对应的房屋增值部分', checked: false, next: [] },
        { name: "明确表示赠与给双方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both:'双方婚后共同财产（如果有）及对方父母出资+对应的房屋增值部分',checked: false, next: [] },
        { name: "未明确表示出资赠与给谁/明确表示赠与给对方", me: '我方婚前财产（如果有）+对应的房屋增值部分', you: '对方婚前财产（如果有）及对方父母出资+对应的房屋增值部分', both:'双方婚后共同财产（如果有）出资及对应的房屋增值部分', checked: false, next: [] }
      ]
    },{
      num: 48,
      parentId: 3,    
       title: "首期款是否有双方父母参与？",
      answer: [
        { name: "双方父母有参与出资", checked: false, next: [49] },
    { name: "双方父母均未参与出资", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both:'双方婚后还贷+对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）', checked: false, next: [] }      
      ]
    }, {
      num: 49,
      parentId: 3,    
       title: "首期款中父母出资的情况？",
      answer: [
        { name: "仅我方父母参与出资", checked: false, next: [50] },
        { name: "仅对方父母参与出资", checked: false, next: [51] },
        { name: "双方父母都有出资", me: '我方婚前财产（如果有）及我方父母出资+对应的房屋增值部分', you: '对方婚前财产（如果有）及对方父母出资+对应的房屋增值部分', both:'双方婚后还贷+对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）',checked: false, next: [] }
      ]
    }, {
      num: 50,
      parentId: 3,    
       title: "我方父母出资是否有明确赠与表示？",
      answer: [
        { name: "明确表示出资赠与给对方", me: '我方婚前财产（如果有）+对应的房屋增值部分', you: '对方婚前财产（如果有）及我方父母出资+对应的房屋增值部分', both:'双方婚后还贷+对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）', checked: false, next: [] },
        { name: "未明确表示出资赠与给谁/明确表示赠与给我方", me: '我方婚前财产（如果有）及我方父母出资+对应的房屋增值部分 ', you: '对方婚前财产（如果有）+对应的房屋增值部分', both: '双方婚后还贷+对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）', checked: false, next: [] },
        { name: "明确表示赠与给双方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both: '（对方父母出资+双方婚后还贷）及对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）',  checked: false, next: [] }
      ]
    }, {
      num: 51,
      parentId: 3,   
      title: "我方父母出资是否有明确赠与表示？",
      answer: [
        { name: "明确表示出资赠与给我方", me: '我方婚前财产（如果有）及对方父母出资+对应的房屋增值部分', you: '对方婚前财产（如果有）+对应的房屋增值部分', both: '双方婚后还贷+对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）',  checked: false, next: [] },
        { name: "明确表示出资赠与给对方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）及父母出资及对应的房屋增值部分', both: '双方婚后还贷+对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）',  checked: false, next: [] },
        { name: "未明确表示出资赠与给谁/明确表示赠与给双方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both: '（对方父母出资+双方婚后还贷）及对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）',  checked: false, next: [] }
      ]
    }, {
      num: 52,
      parentId: 3,    
       title: "首期款是否有双方父母参与？",
      answer: [
        { name: "双方父母有参与出资", checked: false, next: [53] },
        { name: "双方父母均未参与出资", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both: '双方婚后还贷及对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）', checked: false, next: [] }       
      ]
    }, {
      num: 53,
      parentId: 3,    
       title: "首期款中父母出资的情况？",
      answer: [
        { name: "仅我方父母参与出资", checked: false, next: [54] },
        { name: "仅对方父母参与出资", checked: false, next: [55] },
        { name: "双方父母都有出资", me: '我方婚前财产（如果有）及我方父母出资+对应的房屋增值部分', you: '对方婚前财产（如果有）及对方父母出资+对应的房屋增值部分', both:'双方婚后还贷及对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）', checked: false, next: [] }
      ]
    }, {
      num: 54,
      parentId: 3,   
       title: "我方父母出资是否有明确赠与表示？",
      answer: [
        { name: "明确表示出资赠与给我方", me: '我方婚前财产（如果有）及我方父母出资+对应的房屋增值部分', you: '对方婚前财产（如果有）+对应的房屋增值部分', both: '双方婚后还贷及对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）',checked: false, next: [] },
        { name: "明确表示出资赠与给对方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）及我方父母出资及对应的房屋增值部分', both: '双方婚后共同财产（如果有）出资及对应的房屋增值部分', checked: false, next: [] },
        { name: "未明确表示出资赠与给谁/明确表示赠与给双方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both: '（我方父母出资+双方婚后还贷）及对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）', checked: false, next: [] }
      ]
    }, {
      num: 55,
      parentId: 3,   
       title: "对方父母出资是否有明确赠与表示？",
      answer: [
        { name: "明确表示出资赠与给我方", me: '我方婚前财产（如果有）及对方父母出资+对应的房屋增值部分', you: '对方婚前财产（如果有）+对应的房屋增值部分', both: '双方婚后还贷及对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）', checked: false, next: [] },
        { name: "明确表示赠与给双方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both: '（对方父母出资+双方婚后还贷）及对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）',checked: false, next: [] },
        { name: "未明确表示出资赠与给谁/明确表示赠与给对方", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both: '（对方父母出资+双方婚后还贷）及对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）', checked: false, next: [] }
      ]
    }, {
      num: 56,
      parentId: 3,   
       title: "婚后房产的购房款是否全部由父母支付？",
      answer: [
        { name: "是，由某一方父母全额支付", both: '婚后购置的房产', checked: false, next: [] },
        { name: "双方父母仅出资了一部分", me: '我方婚前财产（如果有）+对应的房屋增值部分', you: '对方婚前财产（如果有）+对应的房屋增值部分', both: '双方婚后共同财产（如果有）+父母出资及对应的房屋增值部分', checked: false, next: [] },
        { name: "双方父母均未出资", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）及对应的房屋增值部分', both: '双方婚后共同财产（如果有）出资及对应的房屋增值部分', checked: false, next: [] }
      ]
    }, {
      num: 57,
      parentId: 3,     
       title: "首期款是否有双方父母参与？",
      answer: [
        { name: "有参与", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both: '（父母出资+双方婚后还贷）及对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）', checked: false, next: [] },
        { name: "双方父母均未参与", me: '我方婚前财产（如果有）出资及对应的房屋增值部分', you: '对方婚前财产（如果有）出资及对应的房屋增值部分', both: '方婚后还贷及对应的房屋增值部分（离婚时如仍有贷款，则由取得房产所有权一方继续偿还）', checked: false, next: [] }        
      ]
    }, { /********************债务板块**********************/
      num: 58,
      parentId: 4,     
       title: "你们婚后债务的性质是？",
      answer: [
        { name: "借款",checked: false, next: [59] },
        { name: "帮人担保产生的债务", both:'帮人担保产生的债务原则上归签字债务人个人承担',checked: false, next: [] },
        { name: "其他债务", both:'其他债务是否属于你们共同债务，建议咨询专业律师',checked: false, next: [] }
      ]
    }, {
      num: 59,
      parentId: 4,
       title: "借款单据上双方是否有签字？",
      answer: [
        { name: "仅我方签字", checked: false, next: [60] }, 
        { name: "仅对方签字",  checked: false, next: [60] },
        { name: "双方都有签字", both:'你们婚后的借款为你们的共同债务，需要向债权人承担连带清偿责任',  checked: false, next: [] }
      ]
    }, {
      num: 60,
      parentId: 4,
       title: "借款资金是否用于家庭生活",
      answer: [
        { name: "全部或大部分", both:'你们婚后的借款为你们的共同债务，需要向债权人承担连带清偿责任', checked: false, next: [] },
        { name: "没有或很少", both: '你们婚后的借款为签字方的个人债务', checked: false, next: [] }      
      ]
    }, {
      num: 61,
      parentId: 4,
       title: "你们双方是否书面约定婚姻关系存续期间各自的收入归各自所有",
      answer: [
        { name: "有", checked: false, next: [62] },
        { name: "没有", checked: false, next: [-1] }
      ]
    }, {
      num: 62,
      parentId: 4,
       title: "债权人是否知晓你们夫妻间实行个人财产制殊约定",
      answer: [
        { name: "知道", checked: false, fixed:'你们婚后的负债为举债方的个人债务', next: [-1] }, // y 49 n -1
        { name: "不知道", checked: false, next: [-1] }
      ]       
    }
]

module.exports = {    //数据暴露出去
  data: data
}