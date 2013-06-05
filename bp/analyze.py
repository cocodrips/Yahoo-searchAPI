# coding: UTF-8
import xml.etree.ElementTree as ElementTree
import nltk
import urllib
import urllib2
import re
import lxml.html


class AnalyzeKeyword():
    query_num = 1
    links = []
    key_counts = []
    titles = []
    summaries = []
    matching_array = []
    data = []

    def __init__(self, keyword, query_num):
        self.query_num = query_num
        self.access_api(keyword)
        self._round_robin_urls()

    @property
    def summary_words_top(self):
        return self._count_summery_keyword(self.summaries)

    def access_api(self, keyword):
        appId = "あなたのYahooAPIのappId"
        apiUrl = "http://search.yahooapis.jp/WebSearchServicePro/V1/webSearch?"
        yahooTag = "{urn:yahoo:jp:srch}"
        params = urllib.urlencode(
            {'appid': appId,
             'query': keyword,
             'results': self.query_num,
             'language':"en",
            })

        response = urllib.urlopen(apiUrl+params).read()
        tree = ElementTree.fromstring(response)

        for title in tree.getiterator(yahooTag+"Title"):
            self.titles.append(title.text)

        for summary in tree.getiterator(yahooTag+"Summary"):
            self.summaries.append(summary.text)

        top_keywords = self.summary_words_top
        for url in tree.getiterator(yahooTag+"ClickUrl"):
            dom = self._create_dom(str(url.text))
            print dom
        #*** plain *****
            plaintext = self._extract_plain_text(dom)
            self._count_plain_text_keyword(plaintext, top_keywords)

        #*** url child *****
            urls = self._extract_links(dom, url.text)
            data = {"url": url.text, "childUrl": urls}
            self.links.append(data)

    def _create_dom(self, url):
        try:
            html = urllib2.urlopen(url).read()
            return lxml.html.fromstring(html)
        except urllib2.URLError, e:
            return lxml.html.fromstring("<html><body><a herf=""></a></body></html>")

    def _extract_links(self, dom, url):
        urls = []
        urls.append(url)
        html_pattern = re.compile(r'(http://[A-Za-z0-9\'~+\-=_.,/%\?!;:@#\*&\(\)]+)')
        try:
            links= dom.xpath('//a')
            for _a in links:
                href = _a.attrib['href']
                if href != None:
                    url = html_pattern.match(str(href.encode('utf_8')))
                    if url != None:
                        urls.append(href)
            return urls
        except:
            return urls

    def _extract_plain_text(self, dom):
        try:
            body = dom.body
            return body.text_content()
        except:
            return ""


    def _round_robin_urls(self):
        self.matching_array =  [[False for j in range(self.query_num)] for i in range(self.query_num)]
        cnt = 1
        for i in range(self.query_num):
            for j in range(cnt, self.query_num):
                ans = self._matching_urls(self.links[i], self.links[j])
                self.matching_array[i][j] = ans
                self.matching_array[j][i] = ans
                cnt += 1

    def _matching_urls(self, links1, links2):
        for src in links1["childUrl"]:
            for tar in links2["childUrl"]:
                if src == tar :
                    print src
                    return True
#            if src in links2["childUrl"]:
#                return True
        return False

    def _count_summery_keyword(self, target):
        words = {}
        for p in target:
            keys = self._split_word(p)
            for key in keys:
                if key in words:
                    words[key] = words[key] + 1
                else:
                    words[key] = 1
        words = sorted(words.items(), key=lambda x:x[1], reverse=True)
        return self._extract_subject_keyword(words)

    def _count_plain_text_keyword(self, text, key):
        key_counts = []
#        text = self._split_word(text)
        for _k in key:
            count = text.count(_k)
            key_counts.append(count)
        self.key_counts.append(key_counts)

    def _extract_subject_keyword(self, words):
        words_list = [h[0] for h in words]
        tagged = nltk.pos_tag(words_list)
        key_words = []
        for t in tagged:
            if t[1] == "NNP":
                key_words.append(t[0])
#                if len(key_words) > 10:
#                    break
        print key_words
        return key_words

    def _calc_keywords_tf_idf(self, keywords):
        pass


    def _split_word(self, text):
        text = text.replace('.', ' ').replace(',', ' ')
        return text.split(' ')



    @classmethod
    def create(cls, keyword, query_num):
        analyze = AnalyzeKeyword(keyword, int(query_num))
        return analyze

