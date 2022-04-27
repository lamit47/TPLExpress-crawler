const regexList = {
  description: /<p class="description">(.*)<\/p>/gm,
  detail: /<article class="fck_detail ">(.*?)<\/article>/gs,
  images: /<img.*?alt="(.*)".*class.*?data-src="(.*)">/mg,
  infomation: /<div class="box_brief_info">(.*?)<\/div>/gs,
  author: /<p class="author_mail">.*?<strong>(.*)<\/strong>.*?<\/p>/gs,
  authorWithSource: /<p class="Normal" style="text-align:right;">(.*?)<\/p>/g,
  contents: /<p class="Normal">(.*)<\/p>/gm,
  localStamp: /<span class="location-stamp">(.*?)<\/span>/gs,
  allTag: /<(.|\n)*?>/g,
  aTag: /<a(.|\n)*?>|<\/a>/g,
  divTag: /<div(.|\n)*?>|<\/div>/g,
  normalClass: / class="Normal"/g
}

module.exports = { regexList }