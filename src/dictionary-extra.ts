// Rozszerzenie lokalnej bazy o najczęstsze odpowiedzi graczy.
// Dane pozostają w aplikacji i działają bez połączenia z internetem.
export const dictionaryExtensions: Record<string, Record<string, string[]>> = {
  country: {
    A:['Afganistan','Algieria','Andora','Angola','Antigua i Barbuda','Arabia Saudyjska','Armenia','Australia','Austria','Azerbejdżan'],
    B:['Bahamy','Bahrajn','Bangladesz','Barbados','Belize','Benin','Bhutan','Białoruś','Boliwia','Bośnia i Hercegowina','Botswana','Brunei','Bułgaria','Burkina Faso','Burundi'],
    C:['Czad','Czarnogóra','Czechy'],D:['Demokratyczna Republika Konga','Dżibuti'],E:['Ekwador','Erytrea','Eswatini','Etiopia'],
    F:['Fidżi','Filipiny'],G:['Gabon','Gambia','Gruzja','Gujana','Gwatemala','Gwinea','Gwinea Bissau','Gwinea Równikowa'],
    H:['Holandia','Honduras'],I:['Indonezja','Irak','Iran','Islandia','Izrael'],J:['Jemen','Jordania'],
    K:['Kambodża','Kamerun','Katar','Kazachstan','Kenia','Kirgistan','Kiribati','Kolumbia','Komory','Kongo','Korea Południowa','Korea Północna','Kostaryka','Kuba','Kuwejt'],
    L:['Laos','Lesotho','Liberia','Libia','Liechtenstein','Luksemburg'],M:['Madagaskar','Malawi','Malediwy','Malezja','Mali','Maroko','Mauretania','Mauritius','Mikronezja','Mjanma','Mołdawia','Monako','Mongolia','Mozambik'],
    N:['Namibia','Nauru','Niemcy','Niger','Nigeria','Nikaragua','Nowa Zelandia'],O:['Oman'],P:['Pakistan','Palau','Panama','Papua-Nowa Gwinea','Paragwaj','Peru'],
    R:['Republika Południowej Afryki','Republika Środkowoafrykańska','Rosja'],S:['Saint Kitts i Nevis','Saint Lucia','Saint Vincent i Grenadyny','Salwador','Samoa','San Marino','Senegal','Seszele','Sierra Leone','Singapur','Słowacja','Słowenia','Somalia','Sri Lanka','Stany Zjednoczone','Sudan','Sudan Południowy','Surinam','Syria','Szwajcaria'],
    T:['Tadżykistan','Tajlandia','Tanzania','Timor Wschodni','Togo','Tonga','Trynidad i Tobago','Tunezja','Turkmenistan','Tuvalu'],U:['Uganda','Urugwaj','Uzbekistan'],
    V:['Vanuatu'],W:['Watykan','Wenezuela','Wielka Brytania','Włochy'],Z:['Zjednoczone Emiraty Arabskie','Zielony Przylądek']
  },
  city: {
    A:['Aleksandrów Łódzki','Amsterdam','Ankara','Antwerpia','Asyż'],B:['Barcelona','Bełchatów','Bielsko-Biała','Bydgoszcz','Bytom','Boston','Bratysława','Budapeszt'],
    C:['Częstochowa','Chełm','Chorzów','Ciechocinek','Cork'],D:['Damaszek','Darłowo','Dortmund','Drezno','Duszniki-Zdrój'],E:['Elbląg','Erywań'],
    F:['Fryburg'],G:['Genewa','Gliwice','Gniezno','Gorzów Wielkopolski','Grudziądz'],H:['Haga','Hanoi','Hawana'],
    I:['Istambuł'],J:['Jaworzno','Jerozolima'],K:['Kalisz','Karpacz','Kielce','Kołobrzeg','Konin','Koszalin','Krynica-Zdrój'],
    L:['Legnica','Leszno','Limassol','Lizbona','Los Angeles'],M:['Manchester','Mediolan','Miami','Mikołajki','Monachium','Moskwa'],
    N:['Nairobi','Nowy Jork','Nowy Sącz','Nowy Targ'],O:['Olsztyn','Oświęcim','Otwock','Oxford'],P:['Pekin','Piła','Piotrków Trybunalski','Płock','Praga'],
    R:['Rabka-Zdrój','Ruda Śląska','Rzeszów'],S:['San Francisco','Sandomierz','Siedlce','Słupsk','Sosnowiec','Stambuł','Suwałki'],
    T:['Tarnów','Tbilisi','Tychy'],U:['Ustroń'],W:['Wałbrzych','Watykan','Wenecja','Wrocław'],Z:['Zakopane','Zielona Góra'],
    Ś:['Świnoujście'],Ł:['Łowicz'],Ż:['Żagań']
  },
  name: {
    A:['Agnieszka','Aleksandra','Aleksander','Alicja','Amelia','Andrzej','Antoni'],B:['Beata','Benedykt','Błażej','Bogdan'],C:['Cyprian'],
    D:['Dagmara','Damian','Dariusz','Dawid','Dominika'],E:['Edward','Eliza','Elżbieta'],F:['Fabian','Franciszek'],G:['Grażyna','Gustaw'],
    H:['Halina','Henryk'],I:['Ida','Ilona','Ireneusz','Iwona'],J:['Jacek','Jakub','Joanna','Jolanta','Józef'],
    K:['Kacper','Karol','Karolina','Katarzyna','Konrad','Krystyna','Krzysztof'],L:['Laura','Leszek','Liliana','Lucyna'],
    M:['Maciej','Magdalena','Marcel','Marcin','Marta','Mateusz','Michał','Monika'],N:['Nadia','Nikodem','Nina'],O:['Oliwia'],
    P:['Paulina','Piotr','Przemysław'],R:['Rafał','Renata','Roman'],S:['Sandra','Sławomir','Stanisław','Stefan','Sylwia','Szymon'],
    T:['Tadeusz','Tatiana'],W:['Wanda','Wojciech'],Z:['Zbigniew','Zuzanna'],Ł:['Łucja'],Ż:['Żaklina']
  },
  animal: {
    A:['alpaka','anakonda','ara'],B:['baran','bażant','bóbr','bawół','biedronka'],C:['chrząszcz','cietrzew','cykada'],D:['daniel','dingo','dromader','drozd'],
    E:['echidna'],F:['fenek'],G:['gazela','gęś','gnu','gołąb'],H:['hipopotam'],I:['iguana'],J:['jaszczurka','jenot'],
    K:['kaczka','kameleon','kanarek','kapibara','karp','koala','kogut','koń','kret','krokodyl','królik','kuna','kura'],
    L:['lampart','lemur','lew'],M:['meduza','mrówka','mysz'],N:['nietoperz'],O:['orangutan','orka','osioł','osa'],
    P:['pająk','pantera','paw','pingwin','pstrąg','puma'],R:['rekin','ropucha'],S:['salamandra','skorpion','sokół','sowa','szop'],
    T:['tapir','terier'],U:['ukwiał'],W:['ważka','wielbłąd','wydra'],Z:['zaskroniec'],Ł:['łoś','łabędź'],Ś:['ślimak','świstak'],Ż:['żubr','żuk']
  },
  plant: {
    A:['akacja','amarantus','ananas','aronia','awokado'],B:['bananowiec','bazylia','bluszcz','borówka','buk','burak'],
    C:['chaber','cis','cykoria','cynamonowiec'],D:['dereń','dracena','dynia'],E:['estragon'],F:['figowiec','forsycja','frezja'],
    G:['gardenia','głóg','goździk','grusza'],H:['hibiskus'],I:['imbir'],J:['jodła','juka'],K:['kalafior','kasztanowiec','koper','krokus'],
    L:['leszczyna','lobelia'],M:['magnolia','malina','melisa','modrzew'],N:['niezapominajka'],O:['oleander','oregano'],
    P:['palma','pelargonia','pietruszka','por','poziomka'],R:['rzodkiewka'],S:['sałata','słonecznik','świerk'],
    T:['trawa','truskawka','tuja'],W:['wanilia','winorośl'],Z:['zamiokulkas'],Ł:['łubin'],Ś:['śliwa'],Ż:['żurawina']
  },
  thing: {
    A:['adapter','agrafka','akwarium','antena'],B:['bateria','bidon','blender','bransoletka','budzik'],C:['cegła','cukiernica'],
    D:['deska','doniczka','dywan'],E:['ekspres','encyklopedia'],F:['farba','firanka','flakon'],G:['gąbka','gitara','globus','grzebień'],
    H:['hełm','huśtawka'],I:['instrument'],J:['joystick'],K:['kabel','kalendarz','kamera','karton','komputer','kosz','książka'],
    L:['laptop','lodówka','lustro'],M:['magnes','materac','mikser','monitor'],N:['naklejka','namiot'],O:['obrus','odkurzacz','ołówek'],
    P:['patelnia','pilot','poduszka','portfel','pralka'],R:['regał','ręcznik','rolka'],S:['słuchawki','spinacz','szklanka'],
    T:['taboret','tacka','torba'],U:['umywalka'],W:['wachlarz','widelec'],Z:['zamek','zapalniczka'],Ł:['łańcuch','ławka'],Ś:['świeca'],Ż:['żyrandol']
  },
  capital: {
    A:['Abu Zabi','Abudża','Akra','Algier','Amman','Asmara','Asunción'],B:['Bagdad','Baku','Bamako','Bandar Seri Begawan','Bangkok','Bandżul','Bejrut','Belgrad','Belmopan','Berno','Biszkek','Bogota','Brasília','Bratysława','Budapeszt','Buenos Aires','Bukareszt'],
    C:['Canberra'],D:['Dakar','Dili','Dodoma','Doha'],E:['Erywań'],F:['Freetown'],G:['Gaborone','Georgetown','Gitega','Gwatemala'],
    H:['Hanoi','Harare','Honiara'],I:['Islamabad'],J:['Jaunde','Jerozolima','Juba'],K:['Kabul','Kampala','Katmandu','Kiszyniów','Kopenhaga','Kuala Lumpur','Kuwejt'],
    L:['Libreville','Lilongwe','Lima','Lomé','Luanda','Lublana','Luksemburg','Lusaka'],M:['Malabo','Malé','Managua','Manama','Manila','Maputo','Maseru','Mbabane','Mińsk','Mogadiszu','Monako','Monrovia','Montevideo','Moroni','Moskwa'],
    N:['Ndżamena','Niamey','Nikozja','Nukualofa'],P:['Palikir','Panama','Paramaribo','Pekin','Phnom Penh','Podgorica','Port Louis','Port Moresby','Port Vila','Port-au-Prince','Pretoria','Pjongjang'],
    Q:['Quito'],R:['Rabat','Reykjavík','Rijad','Roseau'],S:['San José','San Marino','San Salvador','Sana','Santiago','Santo Domingo','Sarajewo','Seul','Singapur','Skopje','Suva'],
    T:['Taszkent','Tbilisi','Teheran','Thimphu','Tirana','Trypolis','Tunis'],U:['Ułan Bator'],V:['Vaduz'],W:['Waszyngton','Wellington','Wientian'],Y:['Yamoussoukro'],Z:['Zagrzeb']
  },
  water: {
    A:['Adriatyk','Aral'],B:['Biebrza','Bóbr'],C:['Czarna Hańcza'],D:['Dniestr','Dniepr'],E:['Ebro'],F:['Falklandzki Prąd'],
    G:['Gardno'],H:['Hańcza'],I:['Ina'],J:['Jezioro Białe','Jezioro Czorsztyńskie'],K:['Kaspijskie','Kongo','Krutynia'],
    L:['Lena','Loara'],M:['Mekong','Morskie Oko','Morze Bałtyckie','Morze Czarne','Morze Śródziemne'],N:['Narew','Noteć'],
    O:['Ocean Atlantycki','Ocean Indyjski','Ocean Spokojny','Orawa'],P:['Pilica','Pisa','Pregoła'],R:['Rospuda'],S:['Solina'],T:['Tamiza'],W:['Wieprz','Wigry'],Z:['Zalew Zegrzyński']
  },
  job: {
    A:['administrator','adwokat','analityk','archeolog'],B:['bankier','biolog','budowlaniec'],C:['copywriter'],D:['dietetyk','dziennikarz'],
    E:['elektronik'],F:['fizjoterapeuta','fryzjer'],G:['górnik'],H:['handlowiec'],I:['inżynier'],J:['jubiler'],
    K:['kelner','księgowy','kurier'],L:['leśnik','logopeda'],M:['makler','masażysta','muzyk'],N:['naukowiec'],O:['ochroniarz','okulista'],
    P:['pielęgniarz','pielęgniarka','policjant','programista','psycholog'],R:['radiolog','rolnik'],S:['sekretarka','socjolog','sprzedawca'],
    T:['technik'],U:['urzędnik'],W:['wartownik'],Z:['zegarmistrz'],Ż:['żołnierz']
  },
  historical: {
    A:['Adam Mickiewicz','Albert Einstein','Arystoteles'],B:['Bolesław Chrobry','Bona Sforza'],C:['Cyceron'],D:['Dante Alighieri'],
    E:['Elżbieta I'],F:['Fryderyk II'],G:['George Washington'],H:['Henryk VIII'],I:['Izaak Newton'],J:['Jan III Sobieski','Józef Piłsudski'],
    K:['Karol Wielki','Krzysztof Kolumb'],L:['Lech Wałęsa','Ludwik XIV'],M:['Mahatma Gandhi','Marek Aureliusz','Mikołaj Kopernik'],
    N:['Nikola Tesla'],P:['Perykles','Platon'],R:['Ryszard Lwie Serce'],S:['Stanisław August Poniatowski'],T:['Tadeusz Kościuszko'],W:['Winston Churchill'],Z:['Zygmunt Stary']
  },
  title: {
    A:['Akademia pana Kleksa','Alicja w Krainie Czarów','Amelia'],B:['Batman','Bogowie'],C:['Charlie i fabryka czekolady'],D:['Dzieci z Bullerbyn'],
    E:['E.T.'],F:['Ferdydurke','Frozen'],G:['Gra o tron','Gladiator'],H:['Hobbit'],J:['Joker'],K:['Kamienie na szaniec','Kevin sam w domu'],
    L:['Lista Schindlera'],M:['Mamma Mia','Miś'],N:['Nad Niemnem','Nietykalni'],O:['Ojciec chrzestny'],P:['Pianista','Potop'],
    R:['Romeo i Julia'],S:['Seksmisja','Sami swoi'],T:['Toy Story','Trędowata'],W:['Władca Pierścieni'],Z:['Zbrodnia i kara']
  },
  food: {
    A:['ananas','awokado'],B:['baklava','banan','burger','bułka'],C:['cebularz','chleb','ciasto'],D:['drożdżówka'],E:['eklerek'],
    F:['fasolka po bretońsku'],G:['grzanka'],H:['hot dog'],I:['indyk'],K:['kanapka','kaszanka','kurczak'],L:['lody'],
    M:['makaron','muffinka'],N:['nachosy'],O:['ogórek'],P:['pączek','placki','pomidor'],R:['racuchy'],S:['sałatka','schabowy'],
    T:['tarta'],W:['wafle'],Z:['ziemniaki'],Ż:['żurek']
  },
  brand: {
    A:['Allegro','Audi'],B:['BMW','Biedronka'],C:['Coca-Cola'],D:['Danone','Dacia'],E:['Electrolux'],F:['Ferrari','Fiat'],G:['Google','Gucci'],
    H:['H&M','Heineken'],I:['InPost'],J:['Jeep'],K:['Kaufland','KFC'],L:['Lidl','L’Oréal'],M:['McDonald’s','Mercedes','Microsoft'],
    N:['Nivea','Nokia'],O:['Orlen'],P:['Porsche','Prada'],R:['Rossmann'],S:['Skoda','Sprite'],T:['Tesla'],U:['Uber'],W:['Wedel'],X:['Xiaomi'],Y:['Yamaha'],Ż:['Żabka']
  },
  foreign: {
    A:['apartament','aplikacja'],B:['biznes','blog'],C:['centrum','czat'],D:['dżins'],E:['e-mail'],F:['fitness'],G:['grill'],
    H:['hashtag'],I:['internet'],K:['komputer'],L:['lider'],M:['menedżer'],N:['networking'],O:['outsourcing'],P:['projekt'],
    R:['relaks'],S:['selfie','skaner','sport'],T:['test'],W:['wideokonferencja'],Ż:['żargon']
  }
}
