class Manga {
    constructor(title) {
      this.title = title;
      this.chapters = [];
    }
  
    addChapter(chapter) {
      this.chapters.push(chapter);
    }
  }

  module.exports = Manga;