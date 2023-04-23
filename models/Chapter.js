class Chapter {
    constructor(number) {
      this.number = number;
      this.pages = [];
    }
  
    addPage(page) {
      this.pages.push(page);
    }
  }

  module.exports = Chapter;