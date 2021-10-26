import cheerio from 'cheerio'
import fs from 'fs'

interface MachiningData {
  time: number;
  data: ChildData[];
}

interface ChildData {
  title: string
  exponent: string
  [propName: string]: string | undefined
}

interface DataContent {
  [propName: number]: ChildData[]
}

export default class Analyse {
  private static instance: Analyse
  static getInstance() {
    if (!this.instance) {
      this.instance = new Analyse()
    }
    return this.instance
  }
  /**
   * 分析数据
   * @param html 
   */
  private analyseContentData(html: string): MachiningData {
    let $ = cheerio.load(html)
    let uls = $('.cc-cd-cb-l.nano-content .cc-cd-cb-ll')
    let childData: ChildData[] = []
    uls.each((index: number, ele: any) => {
      if (index > 9) return
      let title = $(ele).find('.t').text()
      let exponent = $(ele).find('.e').text()
      let link = $(ele).parent().attr('href')
      childData.push({ title, exponent, link })
    })
    return {
      time: (new Date()).getTime(),
      data: childData
    }
  }

  /**
   * 生成json
   * @param machiningData e
   * @returns 
   */
  private generateToJson(machiningData: MachiningData, filePath: string): DataContent {
    let content: DataContent = {}
    if (fs.existsSync(filePath)) {
      content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
    content[machiningData.time] = machiningData.data
    return content
  }

  public analyseData(text: string, filePath: string) {
    let machiningData = this.analyseContentData(text)
    let tempData = this.generateToJson(machiningData, filePath)
    return JSON.stringify(tempData)
  }
  private constructor() { }

}