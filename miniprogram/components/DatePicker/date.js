const date = new Date()
const years = []
const months = []

for (let i = 1900; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

Page({
  data: {
    years,
    year: date.getFullYear(),
    months,
    month: 2,    
    value: [88, 12],
  },

  bindChange(e) {
    const val = e.detail.value
    // debugger
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]]     
    })


    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    // 直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    currPage.setData({
      date: this.data.years[val[0]] + '年' + this.data.months[val[1]]+'月'  
    })

    // this.triggerEvent('getDate', {});
  }
})