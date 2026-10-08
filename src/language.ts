import { categorySets, dictionary as polishDictionary, type Dictionary } from './data'
import { languageDictionaryExtensions } from './language-extra'
import type { CategorySetId, GameLanguage } from './types'

export const languageOptions: Record<GameLanguage, { nativeName: string; short: string; note: string; locale: string }> = {
  pl: { nativeName: 'Polski', short: 'PL', note: 'Klasyczna wersja z polskimi znakami', locale: 'pl-PL' },
  en: { nativeName: 'English', short: 'EN', note: 'Answers and categories in English', locale: 'en-GB' },
  ru: { nativeName: 'Русский', short: 'RU', note: 'Ответы на русском языке', locale: 'ru-RU' },
  zh: { nativeName: '中文 · Pinyin', short: '中文', note: '汉字 lub pinyin · pierwsza litera wymowy', locale: 'zh-CN' }
}

const labels: Record<Exclude<GameLanguage, 'pl'>, Record<string, string>> = {
  en: { country: 'Country', city: 'City', name: 'Name', animal: 'Animal', plant: 'Plant', thing: 'Thing' },
  ru: { country: 'Страна', city: 'Город', name: 'Имя', animal: 'Животное', plant: 'Растение', thing: 'Предмет' },
  zh: { country: '国家 · Country', city: '城市 · City', name: '名字 · Name', animal: '动物 · Animal', plant: '植物 · Plant', thing: '物品 · Thing' }
}

const setCopy: Record<GameLanguage, { name: string; note: string }> = {
  pl: { name: categorySets.standard.name, note: categorySets.standard.note },
  en: { name: 'Classic', note: 'Six categories. Answers in English.' },
  ru: { name: 'Классика', note: 'Шесть категорий. Ответы на русском.' },
  zh: { name: '经典 · Classic', note: '六个类别。可用汉字或拼音回答。' }
}

export function getCategorySets(language: GameLanguage) {
  if (language === 'pl') return categorySets
  return {
    ...categorySets,
    standard: {
      ...setCopy[language],
      categories: categorySets.standard.categories.map((category) => ({ ...category, label: labels[language][category.id] ?? category.label }))
    }
  }
}

export const availableSetIds = (language: GameLanguage): CategorySetId[] => language === 'pl' ? ['standard', 'hard', 'funny'] : ['standard']

export const lettersByLanguage: Record<GameLanguage, string[]> = {
  pl: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','U','W','Z'],
  en: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','U','V','W','Y','Z'],
  ru: ['А','Б','В','Г','Д','И','К','М','Н','П','Р','С','Т','Ф','Я'],
  zh: ['B','D','F','H','J','M','R','T','X','Y','Z']
}

export const polishChaosLetters = ['Ą','Ć','Ę','Ł','Ń','Ó','Ś','Ź','Ż']

const englishDictionary: Dictionary = {
  country: { A:['Argentina','Australia'],B:['Belgium','Brazil'],C:['Canada','China'],D:['Denmark'],E:['Egypt','Estonia'],F:['France','Finland'],G:['Germany','Greece'],H:['Hungary','Haiti'],I:['India','Ireland'],J:['Japan','Jamaica'],K:['Kenya'],L:['Latvia','Lebanon'],M:['Mexico','Malta'],N:['Norway','Nepal'],O:['Oman'],P:['Poland','Portugal'],R:['Romania','Rwanda'],S:['Spain','Sweden'],T:['Thailand','Tunisia'],U:['Ukraine','Uganda'],V:['Vietnam'],Y:['Yemen'],Z:['Zambia','Zimbabwe'] },
  city: { A:['Amsterdam','Athens'],B:['Berlin','Boston'],C:['Chicago','Cairo'],D:['Dublin','Dubai'],E:['Edinburgh'],F:['Florence','Frankfurt'],G:['Geneva','Glasgow'],H:['Helsinki','Hamburg'],I:['Istanbul'],J:['Jakarta'],K:['Krakow','Kyoto'],L:['London','Lisbon'],M:['Madrid','Miami'],N:['Naples','New York'],O:['Oslo','Oxford'],P:['Paris','Prague'],R:['Rome','Riga'],S:['Sydney','Seoul'],T:['Tokyo','Toronto'],U:['Utrecht'],V:['Venice','Vienna'],W:['Warsaw'],Y:['York'],Z:['Zurich'] },
  name: { A:['Alice','Adam'],B:['Barbara','Benjamin'],C:['Clara','Charles'],D:['Diana','Daniel'],E:['Emily','Edward'],F:['Fiona','Frank'],G:['Grace','George'],H:['Helen','Henry'],I:['Iris','Isaac'],J:['Julia','James'],K:['Kate','Kevin'],L:['Lucy','Leo'],M:['Mary','Michael'],N:['Nina','Noah'],O:['Olivia','Oscar'],P:['Paul','Patricia'],R:['Robert','Rose'],S:['Sarah','Samuel'],T:['Thomas','Tina'],V:['Victoria','Victor'],W:['William','Wendy'],Y:['Yasmin'],Z:['Zoe'] },
  animal: { A:['antelope','alligator'],B:['bear','beaver'],C:['cat','camel'],D:['dog','dolphin'],E:['elephant','emu'],F:['fox','flamingo'],G:['giraffe','gorilla'],H:['horse','hyena'],I:['ibis','iguana'],J:['jaguar'],K:['kangaroo','koala'],L:['lion','lemur'],M:['monkey','mouse'],N:['newt'],O:['otter','owl'],P:['panda','parrot'],R:['rabbit','rhino'],S:['sheep','seal'],T:['tiger','turtle'],V:['vulture'],W:['wolf','whale'],Y:['yak'],Z:['zebra'] },
  plant: { A:['aloe','aster'],B:['birch','basil'],C:['cactus','cedar'],D:['daisy','dahlia'],E:['eucalyptus'],F:['fern','fig'],G:['geranium','grass'],H:['heather','hibiscus'],I:['iris','ivy'],J:['jasmine'],K:['kale'],L:['lavender','lily'],M:['mint','maple'],N:['nettle'],O:['oak','orchid'],P:['palm','peony'],R:['rose','rosemary'],S:['sage','sunflower'],T:['tulip','thyme'],V:['violet'],W:['willow'],Y:['yucca'],Z:['zinnia'] },
  thing: { A:['album','anchor'],B:['book','bottle'],C:['chair','cup'],D:['desk','door'],E:['envelope'],F:['fork','frame'],G:['glass','glove'],H:['hammer','hat'],I:['iron'],J:['jar'],K:['key','kettle'],L:['lamp','ladder'],M:['mirror','mug'],N:['notebook','needle'],O:['oven'],P:['pencil','phone'],R:['radio','ruler'],S:['spoon','sofa'],T:['table','ticket'],U:['umbrella'],V:['vase'],W:['watch','wallet'],Y:['yarn'],Z:['zipper'] }
}

const russianDictionary: Dictionary = {
  country: { А:['Австрия','Аргентина'],Б:['Бельгия','Бразилия'],В:['Венгрия','Вьетнам'],Г:['Германия','Греция'],Д:['Дания'],И:['Индия','Италия'],К:['Канада','Китай'],М:['Мексика','Мальта'],Н:['Норвегия','Непал'],П:['Польша','Португалия'],Р:['Россия','Румыния'],С:['Сербия','Словакия'],Т:['Таиланд','Турция'],Ф:['Франция','Финляндия'],Я:['Япония'] },
  city: { А:['Амстердам','Афины'],Б:['Берлин','Брюссель'],В:['Варшава','Вена'],Г:['Гданьск','Гамбург'],Д:['Дублин','Дубай'],И:['Иркутск','Иваново'],К:['Краков','Киев'],М:['Москва','Мадрид'],Н:['Неаполь','Ницца'],П:['Париж','Прага'],Р:['Рим','Рига'],С:['Сочи','Сеул'],Т:['Токио','Торонто'],Ф:['Флоренция'],Я:['Ярославль'] },
  name: { А:['Анна','Александр'],Б:['Борис','Белла'],В:['Виктор','Вера'],Г:['Галина','Георгий'],Д:['Дарья','Дмитрий'],И:['Ирина','Игорь'],К:['Катя','Кирилл'],М:['Мария','Максим'],Н:['Наталья','Николай'],П:['Павел','Полина'],Р:['Роман','Раиса'],С:['София','Сергей'],Т:['Татьяна','Тимур'],Ф:['Фёдор'],Я:['Яна','Ярослав'] },
  animal: { А:['акула','антилопа'],Б:['барсук','бобр'],В:['волк','выдра'],Г:['гепард','горилла'],Д:['дельфин','дикобраз'],И:['индюк'],К:['кот','кенгуру'],М:['медведь','мышь'],Н:['носорог','норка'],П:['панда','попугай'],Р:['рысь','рак'],С:['слон','собака'],Т:['тигр','тюлень'],Ф:['фламинго'],Я:['ягуар','як'] },
  plant: { А:['алоэ','астра'],Б:['берёза','базилик'],В:['василёк','верба'],Г:['герань','гвоздика'],Д:['дуб','дыня'],И:['ирис','ива'],К:['кактус','клён'],М:['мята','мак'],Н:['нарцисс','незабудка'],П:['папоротник','пион'],Р:['роза','ромашка'],С:['сосна','сирень'],Т:['тюльпан','тимьян'],Ф:['фиалка'],Я:['яблоня'] },
  thing: { А:['альбом','аппарат'],Б:['бутылка','блокнот'],В:['ваза','вилка'],Г:['гитара','глобус'],Д:['диван','дверь'],И:['игла','игрушка'],К:['книга','ключ'],М:['молоток','миска'],Н:['нож','ноутбук'],П:['письмо','подушка'],Р:['радио','ручка'],С:['стол','стул'],Т:['телефон','тарелка'],Ф:['фонарь'],Я:['ящик'] }
}

const chineseDictionary: Dictionary = {
  country: { B:['巴西|baxi','比利时|bilishi'],D:['德国|deguo'],F:['法国|faguo'],H:['韩国|hanguo','荷兰|helan'],J:['加拿大|jianada'],M:['美国|meiguo','墨西哥|moxige'],R:['日本|riben'],T:['泰国|taiguo'],X:['西班牙|xibanya','新加坡|xinjiapo'],Y:['英国|yingguo','印度|yindu'],Z:['中国|zhongguo','智利|zhili'] },
  city: { B:['北京|beijing'],D:['大连|dalian'],F:['福州|fuzhou'],H:['杭州|hangzhou'],J:['济南|jinan'],M:['马德里|madeli'],R:['日内瓦|rineiwa'],T:['天津|tianjin'],X:['西安|xian'],Y:['烟台|yantai'],Z:['郑州|zhengzhou'] },
  name: { B:['白露|bailu'],D:['冬梅|dongmei'],F:['芳芳|fangfang'],H:['海涛|haitao'],J:['建国|jianguo'],M:['明月|mingyue'],R:['若兰|ruolan'],T:['天天|tiantian'],X:['小雨|xiaoyu'],Y:['雅文|yawen'],Z:['志强|zhiqiang'] },
  animal: { B:['豹|bao'],D:['大象|daxiang'],F:['蜂|feng'],H:['虎|hu'],J:['鸡|ji'],M:['猫|mao'],R:['绒猴|ronghou'],T:['兔|tu'],X:['熊|xiong'],Y:['羊|yang'],Z:['蜘蛛|zhizhu'] },
  plant: { B:['百合|baihe'],D:['杜鹃|dujuan'],F:['枫|feng'],H:['荷花|hehua'],J:['菊花|juhua'],M:['牡丹|mudan'],R:['榕树|rongshu'],T:['桃树|taoshu'],X:['仙人掌|xianrenzhang'],Y:['玉米|yumi'],Z:['竹子|zhuzi'] },
  thing: { B:['杯子|beizi'],D:['电脑|diannao'],F:['风扇|fengshan'],H:['花瓶|huaping'],J:['剪刀|jiandao'],M:['门|men'],R:['日历|rili'],T:['台灯|taideng'],X:['鞋|xie'],Y:['雨伞|yusan'],Z:['桌子|zhuozi'] }
}

function mergeDictionary(base: Dictionary, extra: Dictionary): Dictionary {
  const categoryIds = new Set([...Object.keys(base), ...Object.keys(extra)])
  return Object.fromEntries([...categoryIds].map((categoryId) => {
    const baseCategory = base[categoryId] ?? {}
    const extraCategory = extra[categoryId] ?? {}
    const letters = new Set([...Object.keys(baseCategory), ...Object.keys(extraCategory)])
    return [categoryId, Object.fromEntries([...letters].map((letter) => [letter, [...new Set([...(baseCategory[letter] ?? []), ...(extraCategory[letter] ?? [])])]]))]
  }))
}

export const dictionaries: Record<GameLanguage, Dictionary> = {
  pl: polishDictionary,
  en: mergeDictionary(englishDictionary, languageDictionaryExtensions.en),
  ru: mergeDictionary(russianDictionary, languageDictionaryExtensions.ru),
  zh: mergeDictionary(chineseDictionary, languageDictionaryExtensions.zh)
}

export const entryVariants = (entry: string) => entry.split('|').map((part) => part.trim())
export const displayEntry = (entry: string) => entryVariants(entry)[0]

export function learnedKey(language: GameLanguage, categoryId: string) { return `${language}:${categoryId}` }
