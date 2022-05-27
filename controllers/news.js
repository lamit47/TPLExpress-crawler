const asyncHandler = require( "express-async-handler");
const News  = require( "../models/news.js");
const httpStatusCodes = require( "../utils/httpStatusCodes.js");

const getNews = asyncHandler(async (req, res) => {
    let news = await News.find();
    res.json(news);
});

const getNewsById = asyncHandler(async (req, res) => {
    let id = req.params.id;
    let qs = await Question.findById(id);
  
    if (!qs) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({ status: 'error', message: 'Không tìm thấy câu hỏi này' });
    }
  
    return res.status(httpStatusCodes.OK).json(qs);
  });

  module.exports =  {
    getNews,
    getNewsById
};
