'use strict';

class PageParam {
  constructor(page = 1, limit = 10) {
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || page < 1) {
      throw Error('param `page` error');
    }

    if (isNaN(limit) || limit < 1) {
      throw Error('param `limit` error');
    }

    this.page = page;
    this.limit = limit;
  }

  get offset() {
    return (this.page - 1) * this.limit;
  }
}

module.exports = PageParam;
