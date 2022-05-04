const { News } = require('../models/news');

const homeView = async function (req, res) {
    let list = await News.find({ success: true }).select('title _id');
    return res.render('home', {
        title: 'Homepage',
        list: list
    });
}

const detailView = async function (req, res) {
    let id = req.params.id || null;
    if (!id) {
        return null; // Replace with 404 page
    }
    let news = await News.findById(id);
    return res.render('detail', {
        title: news.title,
        news: news
    });
}

module.exports =  {
    homeView,
    detailView
};