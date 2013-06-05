#!-*- coding:utf-8 -*-"

import flask as f
import bp

app = f.Flask(__name__)


@app.route('/')
def index():
    return f.redirect('/vis')


@app.route('/vis', methods=['POST', 'GET'])
def vis_index():
    if f.request.method == "GET":
        return f.render_template("visualization.html", word="", apiData="", keyword="", maching="", key_counts="", query_num=0)
    else:
        word = f.request.form['word']
        query_num = f.request.form['query_num']
        return f.redirect('/vis/' + word + '/' + query_num)


@app.route('/vis/<word>/<query_num>', methods=['POST', 'GET'])
def vis(word, query_num):
    if f.request.method == "GET":
        analyze = bp.AnalyzeKeyword.create(word, query_num)
        return f.render_template("visualization.html", word=word, links=analyze.links, titles=analyze.titles, keyword=analyze.summary_words_top, matching=analyze.matching_array, key_counts=analyze.key_counts, query_num=int(query_num))
    if f.request.method == "POST":
        word = f.request.form['word']
        query_num = f.request.form['query_num']
        return f.redirect('/vis/' + word + '/' + query_num)

if __name__ == '__main__':
    app.debug = True
    app.run()