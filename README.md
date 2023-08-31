# RSS Aggregator
### Hexlet tests and linter status:
[![Actions Status](https://github.com/po1inakoroleva/frontend-project-11/workflows/hexlet-check/badge.svg)](https://github.com/po1inakoroleva/frontend-project-11/actions)
[![Node CI](https://github.com/po1inakoroleva/frontend-project-11/actions/workflows/nodejs.yml/badge.svg)](https://github.com/po1inakoroleva/frontend-project-11/actions/workflows/nodejs.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/9c80cbcdb705288ae252/maintainability)](https://codeclimate.com/github/po1inakoroleva/frontend-project-11/maintainability)  

⭐ An RSS aggregator is an application that collects RSS feeds from dispersed sources and provides a single consolidated view.  
⭐ RSS is XML-formatted plain text. The RSS format itself is relatively easy to read both by automated processes and by humans alike. An example feed could have contents such as the following:  
```
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
 <title>RSS Title</title>
 <description>This is an example of an RSS feed</description>
 <link>http://www.example.com/main.html</link>
 <copyright>2020 Example.com All rights reserved</copyright>
 <lastBuildDate>Mon, 6 Sep 2010 00:01:00 +0000</lastBuildDate>
 <pubDate>Sun, 6 Sep 2009 16:20:00 +0000</pubDate>
 <ttl>1800</ttl>

 <item>
  <title>Example entry</title>
  <description>Here is some text containing an interesting description.</description>
  <link>http://www.example.com/blog/post/1</link>
  <guid isPermaLink="false">7bd204c6-1655-4c27-aeee-53f933c5395f</guid>
  <pubDate>Sun, 6 Sep 2009 16:20:00 +0000</pubDate>
 </item>

</channel>
</rss>
```
⭐ Let's try! 👇  

### Website
[RSS Aggregator](https://po1inakoroleva-rss-aggregator.vercel.app/)  

### Installation
```
git clone git@github.com:po1inakoroleva/frontend-project-11.git
```
```
make install
```
##### To develop
```
make develop
```
##### To production
```
make build
```
