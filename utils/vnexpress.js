const convert = require('xml-js');
const axios = require('axios');
const { News } = require('../models/news');
const { regexList } = require('./regex_list');

async function getRSSData(url) {
  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      return;
    }
    
    let result = convert.xml2json(response.data, { compact: true, spaces: 4 });
    let data = JSON.parse(result)
    let rss = data.rss.channel.item;
    for (let item of rss) {
      let news = { 
        title: item.title._text, 
        pubDate: item.pubDate._text, 
        link: item.link._text 
      };
      storeRSS(news);
    }
  } catch (e) {
    console.error(e);
  }
}

async function autoGetData(limit) {
  let list = await News.find({ success: false }).select('_id').limit(limit);
  for (let item of list) {
    await storePostData(item._id);
  }
}

async function storeRSS(data) {
  return await News.create(data);
}

async function storePostData(id) {
  let news = await News.findById(id);
  let html = await getPostData(news.link);
  if (!html) {
    return;
  }

  let description = await getMatch(html, regexList.description);
  let localStamp = await getMatch(description, regexList.localStamp);
  if (localStamp) {
    description = description.replace(regexList.localStamp, `<span>${localStamp}<\/span> - `);
  }
  let detail = await getMatch(html, regexList.detail);
  let images = await regexImage(detail, regexList.images);
  let information = await getMatch(detail, regexList.infomation);
  if (information) {
    information = information.replace('\n', '').trim();
  }
  let author = await getMatch(detail, regexList.author);
  if (!author) {
    try {
      author = await getMatch(detail, regexList.authorWithSource);
      author = author.replace(regexList.allTag, '');
      detail = detail.replace(regexList.authorWithSource, '');
    } catch (e) {
      author = await getMatch(detail, regexList.author2);
    }
  } else {
    detail = detail.replace(regexList.author, '');
  }
  let contents = await getMatchAll(detail, regexList.contents);
  let content = '';
  for (let item of contents) {
    item = item.replace(regexList.aTag, '').replace(regexList.divTag, '').replace(regexList.normalClass, '');
    content += `<p>${item}</p>`;
  }
  
  news.content = content;
  news.description = description;
  news.information = information;
  news.author = author;
  news.images = images;
  news.success = true;
  news = await news.save();
}

async function getPostData(url) {
  try {
    let res = await axios(url);
    if (res.status !== 200) {
      return null;
    }
    return res.data;
  } catch (e) {
    console.error(e);
  }
}

async function getMatchAll(string, regex) {
  let matches, out = [];
  while (matches = regex.exec(string)) {
    out.push(matches[1]);
  }
  return out;
}

async function getMatch(string, regex) {
  let matches, out = [];
  while (matches = regex.exec(string)) {
    out.push(matches[1]);
  }
  if (out) {
    return out[0];
  }
  return null;
}

async function regexImage(string, regex) {
  let matches, out = [];
  while (matches = regex.exec(string)) {
    out.push({
      description: matches[1],
      link: matches[2]
    });
  }
  return out;
}

module.exports = { getRSSData, autoGetData }
