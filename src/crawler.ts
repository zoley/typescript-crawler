import fs from 'fs'
import path from 'path'
import superagent from 'superagent'
import Analyse from './analyse'

interface Analyser {
  analyseData: (text: string, filePath: string) => string
}

class Crawler {
  /**
   * 获取HTML内容
   * @returns 
   */
  private async getHtmlContent() {
    const html = await superagent.get(this.url)
    return html.text
  }

  /**
   * 初始化进程
   */
  private async initCrawlerProcess() {
    const filePath = path.resolve(__dirname, '../data/data.json')
    let text = await this.getHtmlContent()
    let content = this.analyser.analyseData(text, filePath)
    fs.writeFileSync(filePath, content)
  }
  constructor(private analyser: Analyser, private url: string) {
    this.initCrawlerProcess()
  }
}

const url = 'https://tophub.today/'
const analyser = Analyse.getInstance()
new Crawler(analyser, url)