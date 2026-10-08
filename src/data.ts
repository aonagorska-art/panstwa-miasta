import type { Category, CategorySetId } from './types'
import { dictionaryExtensions } from './dictionary-extra'
import { polishDictionaryMore } from './polish-dictionary-more'

export const categorySets: Record<CategorySetId, { name: string; note: string; categories: Category[] }> = {
  standard: { name: 'Klasyczne', note: 'Sześć kategorii. Zero wymówek.', categories: [
    { id: 'country', label: 'Państwo' }, { id: 'city', label: 'Miasto' }, { id: 'name', label: 'Imię' },
    { id: 'animal', label: 'Zwierzę' }, { id: 'plant', label: 'Roślina' }, { id: 'thing', label: 'Rzecz' }
  ]},
  hard: { name: 'Trudne', note: 'Dla ludzi, którzy czytali przypisy.', categories: [
    { id: 'capital', label: 'Stolica' }, { id: 'water', label: 'Rzeka lub jezioro' }, { id: 'job', label: 'Zawód' },
    { id: 'historical', label: 'Postać historyczna' }, { id: 'title', label: 'Tytuł książki lub filmu' },
    { id: 'food', label: 'Potrawa' }, { id: 'brand', label: 'Marka' }, { id: 'foreign', label: 'Słowo obcego pochodzenia' }
  ]},
  funny: { name: 'Niekonwencjonalne', note: 'Logika wyszła. Absurd został.', categories: [
    { id: 'late', label: 'Wymówka za spóźnienie', funny: true }, { id: 'fridge', label: 'Nie chcesz znaleźć w lodówce', funny: true },
    { id: 'church', label: 'Nie wolno robić w kościele', funny: true }, { id: 'passive', label: 'Tekst pasywno-agresywny', funny: true },
    { id: 'gift', label: 'Prezent, którego nikt nie chce', funny: true }, { id: 'basement', label: 'Coś podejrzanego w piwnicy', funny: true },
    { id: 'pet', label: 'Imię dla zwierzaka, nie człowieka', funny: true }, { id: 'boss', label: 'Co chcesz usłyszeć od przełożonego', funny: true }
  ]}
}

export const normalLetters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','U','W','Z']
export const chaosLetters = [...normalLetters, 'Ą','Ć','Ę','Ł','Ń','Ó','Ś','Ź','Ż']

export type Dictionary = Record<string, Record<string, string[]>>
const baseDictionary: Dictionary = {
  country: { A:['Albania','Argentyna'],B:['Belgia','Brazylia'],C:['Chile','Chiny'],D:['Dania','Dominikana'],E:['Egipt','Estonia'],F:['Francja','Finlandia'],G:['Grecja','Ghana'],H:['Hiszpania','Haiti'],I:['Indie','Irlandia'],J:['Japonia','Jamajka'],K:['Kanada','Kenia'],L:['Litwa','Liban'],M:['Meksyk','Malta'],N:['Norwegia','Nepal'],O:['Oman'],P:['Polska','Portugalia'],R:['Rumunia','Rwanda'],S:['Szwecja','Serbia'],T:['Turcja','Tunezja'],U:['Ukraina','Uganda'],W:['Węgry','Wietnam'],Z:['Zambia','Zimbabwe'] },
  city: { A:['Augustów','Ateny'],B:['Berlin','Białystok'],C:['Chicago','Cieszyn'],D:['Dublin','Dębica'],E:['Ełk','Edynburg'],F:['Florencja','Frankfurt'],G:['Gdańsk','Gdynia'],H:['Helsinki','Hamburg'],I:['Iława','Inowrocław'],J:['Jelenia Góra','Jasło'],K:['Kraków','Katowice'],L:['Lublin','Londyn'],M:['Madryt','Malbork'],N:['Neapol','Nysa'],O:['Opole','Oslo'],P:['Paryż','Poznań'],R:['Rzym','Radom'],S:['Sopot','Szczecin'],T:['Toruń','Tokio'],U:['Ustka','Utrecht'],W:['Warszawa','Wiedeń'],Z:['Zamość','Zurych'],Ł:['Łódź','Łomża'],Ż:['Żary','Żywiec'] },
  name: { A:['Anna','Adam'],B:['Barbara','Bartosz'],C:['Celina','Cezary'],D:['Dorota','Daniel'],E:['Ewa','Emil'],F:['Filip','Felicja'],G:['Grzegorz','Gabriela'],H:['Hanna','Hubert'],I:['Iga','Igor'],J:['Julia','Jan'],K:['Klara','Kamil'],L:['Lena','Leon'],M:['Maria','Marek'],N:['Natalia','Norbert'],O:['Olga','Oskar'],P:['Paweł','Patrycja'],R:['Robert','Róża'],S:['Sara','Sebastian'],T:['Tomasz','Tamara'],U:['Urszula'],W:['Wiktor','Weronika'],Z:['Zofia','Zenon'],Ł:['Łukasz'],Ż:['Żaneta'] },
  animal: { A:['antylopa','aligator'],B:['borsuk','bocian'],C:['chomik','czapla'],D:['delfin','dzik'],E:['emu'],F:['foka','flaming'],G:['gepard','goryl'],H:['hiena','homar'],I:['ibis','indyk'],J:['jeleń','jaguar'],K:['kot','kangur'],L:['lis','lama'],M:['małpa','mors'],N:['nosorożec','norka'],O:['orzeł','owca'],P:['pies','papuga'],R:['ryś','rak'],S:['słoń','sarna'],T:['tygrys','tukan'],U:['uchatka'],W:['wilk','wiewiórka'],Z:['zebra','zając'],Ż:['żaba','żyrafa'] },
  plant: { A:['aloes','aster'],B:['brzoza','bez'],C:['cyprys','cebula'],D:['dąb','dalie'],E:['eukaliptus'],F:['fiołek','fasola'],G:['geranium','groszek'],H:['hortensja','hiacynt'],I:['irys'],J:['jabłoń','jaśmin'],K:['kaktus','klon'],L:['lawenda','lilia'],M:['mak','mięta'],N:['narcyz','nagietek'],O:['orchidea','owies'],P:['paproć','piwonia'],R:['róża','rumianek'],S:['sosna','stokrotka'],T:['tulipan','tymianek'],U:['uczepa'],W:['wierzba','wrzos'],Z:['zawilec','ziemniak'],Ż:['żonkil','żyto'] },
  thing: { A:['aparat','album'],B:['but','biurko'],C:['czajnik','czapka'],D:['długopis','drabina'],E:['ekran','etui'],F:['fotel','filiżanka'],G:['garnek','guzik'],H:['hamak','hulajnoga'],I:['igła','imbryk'],J:['jajko','jacht'],K:['krzesło','klucz'],L:['lampa','linijka'],M:['młotek','miska'],N:['nóż','notes'],O:['okulary','obraz'],P:['parasol','plecak'],R:['rower','radio'],S:['stół','szafa'],T:['telefon','talerz'],U:['ulotka','uchwyt'],W:['wazon','walizka'],Z:['zegar','zeszyt'],Ł:['łyżka','łóżko'],Ż:['żelazko','żarówka'] },
  capital: { A:['Amsterdam','Ankara'],B:['Berlin','Bruksela'],D:['Dublin','Damaszek'],H:['Helsinki','Hawana'],K:['Kair','Kijów'],L:['Lizbona','Londyn'],M:['Madryt','Meksyk'],N:['Nairobi','Nassau'],O:['Oslo','Ottawa'],P:['Paryż','Praga'],R:['Rzym','Ryga'],S:['Sofia','Sztokholm'],T:['Tallinn','Tokio'],W:['Warszawa','Wiedeń'] },
  water: { A:['Amazonka','Amur'],B:['Bałtyk','Bug'],D:['Dunaj','Drawa'],G:['Ganges','Gopło'],J:['Jeziorak','Jordan'],M:['Missisipi','Mamry'],N:['Nil','Narew'],O:['Odra','Ontario'],R:['Ren','Raba'],S:['Sekwana','San'],W:['Wisła','Warta'] },
  job: { A:['aktor','architekt'],B:['barista','bibliotekarz'],C:['cukiernik','chirurg'],D:['dentysta','dekarz'],E:['elektryk','ekonomista'],F:['farmaceuta','fotograf'],G:['grafik','geodeta'],H:['historyk','hydraulik'],I:['informatyk','ilustrator'],K:['kucharz','kierowca'],L:['lekarz','listonosz'],M:['malarz','mechanik'],N:['nauczyciel','notariusz'],O:['ogrodnik','operator'],P:['piekarz','prawnik'],R:['ratownik','reżyser'],S:['stolarz','strażak'],T:['tłumacz','trener'],W:['weterynarz','wulkanizator'] },
  historical: { A:['Aleksander Wielki'],C:['Cezar'],D:['Danton'],E:['Edison'],F:['Fryderyk Chopin'],G:['Galileusz'],J:['Juliusz Cezar'],K:['Kleopatra','Kazimierz Wielki'],L:['Leonardo da Vinci'],M:['Maria Skłodowska-Curie','Mieszko I'],N:['Napoleon'],P:['Piłsudski'],S:['Sokrates'],W:['Władysław Jagiełło'] },
  title: { A:['Avatar','Ania z Zielonego Wzgórza'],B:['Barbie','Bolek i Lolek'],C:['Chłopi','Casablanca'],D:['Diuna','Dumbo'],F:['Forrest Gump'],H:['Harry Potter'],I:['Incepcja'],K:['Król Lew','Krzyżacy'],L:['Lalka'],M:['Matrix','Mały Książę'],O:['Oppenheimer'],P:['Pan Tadeusz'],R:['Rejs'],S:['Shrek','Solaris'],T:['Titanic'],W:['Wesele'],Z:['Znachor'] },
  food: { A:['arancini'],B:['barszcz','bigos'],C:['carbonara'],D:['dorsz'],F:['falafel','frytki'],G:['gulasz','gołąbki'],H:['hummus'],J:['jajecznica'],K:['kopytka','kebab'],L:['lasagne','leczo'],M:['mizeria'],N:['naleśniki'],O:['omlet'],P:['pierogi','pizza'],R:['risotto','rosół'],S:['sernik','sushi'],T:['tiramisu','tost'],W:['wuzetka'],Z:['zapiekanka','zupa'] },
  brand: { A:['Adidas','Apple'],B:['Bosch','Beko'],C:['Canon','Citroën'],D:['Dior','Dell'],F:['Ford','Fanta'],H:['Honda','Huawei'],I:['Ikea','Intel'],K:['Kia','Kodak'],L:['Lego','Lenovo'],M:['Mazda','Milka'],N:['Nike','Nikon'],O:['Opel'],P:['Pepsi','Puma'],R:['Reebok','Renault'],S:['Sony','Samsung'],T:['Toyota','Tefal'],V:['Volvo'],Z:['Zara'] },
  foreign: { A:['atelier'],B:['briefing'],C:['casting'],D:['design'],E:['event'],F:['feedback'],G:['gadget'],H:['hobby'],I:['interfejs'],J:['jazz'],K:['komfort'],L:['lunch'],M:['marketing'],N:['news'],O:['online'],P:['parking'],R:['ranking'],S:['smartfon'],T:['trend'],W:['weekend'] }
}

export const dictionary: Dictionary = Object.fromEntries(
  Object.keys({ ...baseDictionary, ...dictionaryExtensions, ...polishDictionaryMore }).map((categoryId) => {
    const base = baseDictionary[categoryId] ?? {}
    const extra = dictionaryExtensions[categoryId] ?? {}
    const more = polishDictionaryMore[categoryId] ?? {}
    const letters = new Set([...Object.keys(base), ...Object.keys(extra), ...Object.keys(more)])
    return [categoryId, Object.fromEntries([...letters].map((letter) => [letter, [...new Set([...(base[letter] ?? []), ...(extra[letter] ?? []), ...(more[letter] ?? [])])]]))]
  })
)

export const quips = {
  start: ['Balbina poprawia apaszkę. To podobno pomaga myśleć.', 'Balbina zna mapę. Skromność nadal studiuje.', 'Kompas otwarty. Uprzejmość opcjonalna.'],
  botDone: ['Balbina już skończyła. Oczywiście nie musi sprawdzać powiadomień.', 'Balbina odłożyła kompas. Demonstracyjnie.', 'Rywalka patrzy znacząco na zegar. Bardzo subtelnie.'],
  timeout: ['Czas minął. Balbina zachowywała się zupełnie normalnie.', 'Koniec czasu. Sekundy uciekły bez pożegnania.', 'Stoper powiedział „dość”. Nie negocjuje.'],
  win: ['Brawo. Geografia jednak nie poszła całkiem na marne.', 'Wygrana! Balbina prosi o chwilę sam na sam z kompasem.', 'To było poprawne. Nie przyzwyczajaj się.'],
  lose: ['Balbina wygrała i już przygotowuje przemowę. Ratujmy się.', 'Zero litości, dużo map.', 'Balbina triumfuje. Skromność nadal niedostępna.'],
  draw: ['Remis. Najbardziej elegancki sposób, żeby nikt nie był zadowolony.', 'Idealna równowaga. I umiarkowany niedosyt.', 'Remis. Balbina nazywa to strategiczną uprzejmością.'],
  empty: ['Pusta odpowiedź też jest odpowiedzią. Wyjątkowo słabo punktowaną.', 'Tu mieszka cisza. Za zero punktów.', 'Odważna strategia: nic.'],
  correct: ['Punktuje. Alfabet chwilowo współpracuje.', 'Dobrze. Podejrzanie dobrze.', 'Słownik kiwa głową z uznaniem.'],
  review: ['Słownik nie wie. Ty jesteś teraz komisją.', 'Do decyzji. Władza, odpowiedzialność i dwa przyciski.', 'Brzmi możliwie. Słownik wzrusza ramionami.']
}

export const funnyFragments: Record<string, { starts: string[]; ends: string[] }> = {
  late: { starts:['Awaria','Bardzo uparty','Całkiem niespodziewany','Dramatyczny','Epicki','Fantastycznie złośliwy','Groźny','Huk w instalacji','Internet, który odmówił współpracy','Jeleń na jezdni','Kłopotliwy','Losowy','Mega powolny','Nagły','Objazd przez trzy powiaty','Poważny','Rzekomy','Straszliwy','Tajemniczy','Uparcie zamknięty szlaban','Wyjątkowo ambitny','Złośliwy'], ends:['autobus','budzik','czajnik','dźwig','gołąb','korek','lift','meteor','remont','tramwaj','wiatr','wózek widłowy','zegar atomowy'] },
  fridge: { starts:['Ambitny','Bardzo stary','Cichy','Dziwnie uprzejmy','Eksperymentalny','Fioletowy','Gadatliwy','Hałaśliwy','Inteligentny','Jadowity','Kiepsko opisany','Lepki','Miniaturowy','Nieproszony','Oślizgły','Podejrzany','Rozczarowany','Samotny','Tajemniczy','Uśmiechnięty','Wędrujący','Zaginiony'], ends:['brokuł','dorsz','eksperyment','gołąb','kisiel','lokator','majonez','ogórek','projekt','sernik','słoik bez etykiety','świecący jogurt','wczorajszy plan'] },
  church: { starts:['Awanturniczo','Beztrosko','Cicho, ale uparcie','Demonstracyjnie','Entuzjastycznie','Figlarnie','Głośno','Hałaśliwie','Improwizując','Jawnie','Kategorycznie','Lekkomyślnie','Manifestacyjnie','Nerwowo','Ostentacyjnie','Podejrzanie','Rytmicznie','Szeptem','Triumfalnie','Uparcie','Wielokrotnie','Zamaszyście'], ends:['ćwiczyć karaoke','dzwonić do hydraulika','jeść chipsy','negocjować rabat','odpalać konfetti','parkować hulajnogę','prowadzić wideokonferencji','sprzedawać tostów','testować alarmu','urządzać castingu'] },
  passive: { starts:['Absolutnie','Bardzo','Cudownie','Doprawdy','Ewidentnie','Fantastycznie','Gratuluję','Historycznie','Interesujące','Jak miło','Klasycznie','Logicznie','Miło','Naturalnie','Oczywiście','Pewnie','Rozumiem','Szczerze','Teoretycznie','Uroczo','Wspaniale','Zaskakujące'], ends:['że pamiętałeś','jak zwykle','nie ma problemu','sam na to wpadłeś','tak też można','że pytasz dopiero teraz','że zauważyłeś','że termin był umowny','i na pewno masz ku temu powód'] },
  gift: { starts:['Ambitny','Bezużyteczny','Ciężki','Dziurawy','Ekskluzywny','Felerne','Gigantyczny','Hałaśliwy','Instruktażowy','Jaskrawy','Kiczowaty','Losowy','Mokry','Nadmuchiwany','Ozdobny','Przeterminowany','Ręcznie malowany','Skrzypiący','Tandetny','Używany','Wielki','Złamany'], ends:['budzik','dywan','faks','garnek','kalendarz','notes','odkurzacz','portret','termos','wieszak','zestaw śrubek','album cudzych wakacji','poradnik z 1998 roku'] },
  basement: { starts:['Aktywny','Błyszczący','Cichy','Dymiący','Eksperymentalny','Futrzasty','Gwiżdżący','Hałasujący','Inteligentny','Jaskrawy','Kroczący','Lepki','Mrugający','Nienazwany','Oddychający','Pulsujący','Ruchomy','Szeptający','Tajemniczy','Uwięziony','Wilgotny','Zamknięty'], ends:['karton','manekin','odkurzacz','projekt','rower','słoik','telewizor','worek','agregat bez kabla','dzwonek do drzwi','segregator z napisem „tajne”'] },
  pet: { starts:['Admirał','Baton','Cynamon','Dżemik','Ekscelencja','Fistaszek','Generał','Hrabia','Imbir','Jeżyk','Kluska','Lord','Mop','Naleśnik','Ogórek','Profesor','Rabarbar','Sierściuch','Tost','Uszatek','Wihajster','Ziemniak'], ends:['Pierwszy','Puchaty','Wielki','Zwyczajny','z Kanapy','od Miski','Bezkompromisowy'] },
  boss: { starts:['Awans jest Twój','Bardzo dobra robota','Cenię Twoją inicjatywę','Dzisiaj kończymy wcześniej','Elastyczny czas pracy zatwierdzony','Fantastycznie to poprowadziłeś','Gratuluję podwyżki','Home office bez limitu','Imponujący wynik','Jutro masz wolne','Kawa jest na mój koszt','Liczę na Twoje zdanie','Masz rację','Należy Ci się premia','Odpocznij, resztą się zajmę','Podwyżka wchodzi od dziś','Rozwijaj ten pomysł','Skończ dziś wcześniej','To była moja pomyłka','Urlop zatwierdzony','Wynik jest świetny','Zasługujesz na awans','Żadnych spotkań w piątek'], ends:['','— bez żadnego „ale”','i mówię to całkiem serio'] }
}
