import type { Dictionary } from './data'

// Druga warstwa popularnych polskich odpowiedzi, dodana na podstawie luk
// zauważanych podczas zwykłej rozgrywki. Jest łączona z bazą bez duplikatów.
export const polishDictionaryMore: Dictionary = {
  city: {
    A:['Akwizgran','Augustów'],B:['Biała Podlaska','Bochnia','Bolesławiec'],C:['Chojnice','Czeladź'],D:['Dąbrowa Górnicza','Dębno'],E:['Eger'],F:['Frombork'],G:['Głogów','Giżycko'],H:['Hrubieszów'],I:['Iłża'],J:['Jastarnia','Józefów'],K:['Kętrzyn','Kutno'],L:['Lębork','Lwów'],M:['Mrągowo','Mysłowice'],N:['Norymberga'],O:['Ostrołęka','Ostrów Wielkopolski'],P:['Puławy','Przemyśl'],R:['Rybnik','Racibórz'],S:['Szczyrk','Starogard Gdański'],T:['Tarnobrzeg'],U:['Ujście'],W:['Wejherowo','Włocławek'],Z:['Ząbki','Zgorzelec']
  },
  name: {
    A:['Adrian','Alan','Aneta'],B:['Bernadeta','Bruno'],C:['Czesław','Czesława'],D:['Daria','Diana'],E:['Edyta','Ernest'],F:['Florian'],G:['Gracjan','Greta'],H:['Helena','Hugo'],I:['Ignacy','Inga'],J:['Jerzy','Jowita'],K:['Kamila','Kinga'],L:['Leokadia','Lucjan'],M:['Maja','Mariusz'],N:['Natan','Nel'],O:['Oktawia','Oliwier'],P:['Pola','Przemek'],R:['Roksana','Ryszard'],S:['Sabina','Sonia'],T:['Tymon','Teodor'],U:['Urban'],W:['Wioletta'],Z:['Zachariasz']
  },
  animal: {
    A:['agama','albatros'],B:['bielik','bizon'],C:['cyranka','czeczotka'],D:['dudek','dżdżownica'],E:['eland'],F:['fretka'],G:['gawron','gronostaj'],H:['harpia'],I:['irbis'],J:['jerzyk'],K:['kawka','koliber'],L:['labrador','langusta'],M:['modliszka','muflon'],N:['niedźwiedź'],O:['okapi'],P:['pelikan','płaszczka'],R:['renifer'],S:['serwal','struś'],T:['traszka'],U:['urson'],W:['wombat'],Z:['zebu']
  },
  plant: {
    A:['agrest','azalia'],B:['begonia','bób'],C:['czosnek'],D:['dalia','dzika róża'],E:['epipremnum'],F:['fuksja'],G:['glicynia'],H:['hoja'],I:['iksja'],J:['jemioła'],K:['konwalia','koniczyna'],L:['laurowiśnia'],M:['mimoza','monstera'],N:['nasturcja'],O:['oliwka'],P:['prymula'],R:['rabarbar'],S:['szałwia'],T:['topola'],U:['ubiorek'],W:['wiśnia'],Z:['złocień']
  },
  thing: {
    A:['abażur','apteczka'],B:['bęben','broszka'],C:['cyrkiel'],D:['drukarka','durszlak'],E:['ekierka'],F:['flet','folder'],G:['garnitur'],H:['hantla'],I:['izolacja'],J:['jacht','jesionka'],K:['koc','koperta'],L:['luneta'],M:['mata','mikrofon'],N:['naszyjnik'],O:['opaska','otwieracz'],P:['pendrive','pudełko'],R:['rama'],S:['suszarka'],T:['termos','trzepaczka'],U:['ubranie'],W:['wiertarka'],Z:['zasłona']
  },
  capital: {
    A:['Addis Abeba','Astana'],B:['Banjul'],C:['Chartum'],D:['Dżakarta'],E:['Erywań'],F:['Funafuti'],G:['Gitega'],H:['Hawana'],I:['Islamabad'],J:['Jamusukro'],K:['Kingston','Kinszasa'],L:['La Paz'],M:['Meksyk'],N:['Nairobi'],O:['Oslo'],P:['Papeete'],R:['Ryga'],S:['Sofia'],T:['Tokio'],U:['Ułan Bator'],W:['Windhuk'],Z:['Zagrzeb']
  },
  water: {
    A:['Aare'],B:['Bzura'],C:['Cisa'],D:['Drużno'],E:['Eufrat'],F:['Firth of Forth'],G:['Garda'],H:['Hudson'],I:['Iławka'],J:['Jukon'],K:['Kama'],L:['Loch Ness'],M:['Missouri'],N:['Nysa Łużycka'],O:['Omo'],P:['Pacyfik'],R:['Rodan'],S:['Sawa'],T:['Tygrys'],U:['Ural'],W:['Wołga'],Z:['Zambezi']
  },
  job: {
    A:['animator'],B:['broker'],C:['celnik'],D:['doradca'],E:['epidemiolog'],F:['filolog'],G:['ginekolog'],H:['hotelarz'],I:['inspektor'],J:['jurysta'],K:['krawiec'],L:['laborant'],M:['meteorolog'],N:['neurolog'],O:['optyk'],P:['pilot'],R:['reporter'],S:['sędzia'],T:['terapeuta'],U:['urbanista'],W:['wydawca'],Z:['zoolog']
  },
  historical: {
    A:['Abraham Lincoln'],B:['Bolesław Krzywousty'],C:['Caryca Katarzyna'],D:['Dwight Eisenhower'],E:['Erazm z Rotterdamu'],F:['Franciszek Józef'],G:['Gustaw II Adolf'],H:['Hannibal'],I:['Iwan Groźny'],J:['Joanna d’Arc'],K:['Konstantyn Wielki'],L:['Ludwik XVI'],M:['Marek Antoniusz'],N:['Neron'],O:['Otto von Bismarck'],P:['Piotr Wielki'],R:['Ramses II'],S:['Stanisław Staszic'],T:['Tomasz Jefferson'],U:['Urban II'],W:['Witold Pilecki'],Z:['Zawisza Czarny']
  },
  title: {
    A:['Amadeusz'],B:['Blade Runner'],C:['Coco'],D:['Dżuma'],E:['Encanto'],F:['Fight Club'],G:['Granica'],H:['Hamlet'],I:['Idiota'],J:['Jądro ciemności'],K:['Kiler'],L:['Lśnienie'],M:['Mulan'],N:['Narcos'],O:['Obcy'],P:['Pulp Fiction'],R:['Rok 1984'],S:['Skazani na Shawshank'],T:['Tango'],U:['Up'],W:['Whiplash'],Z:['Zielona mila']
  },
  food: {
    A:['ajvar'],B:['babka'],C:['curry'],D:['dumplings'],E:['enchilada'],F:['fondue'],G:['gnocchi'],H:['halva'],I:['idli'],J:['jagodzianka'],K:['krupnik'],L:['lazania'],M:['musaka'],N:['nuggetsy'],O:['owsianka'],P:['paella'],R:['ramen'],S:['szarlotka'],T:['tacos'],U:['udon'],W:['wątróbka'],Z:['zrazy']
  },
  brand: {
    A:['Amazon'],B:['Bose'],C:['Colgate'],D:['Disney'],E:['Epson'],F:['Fila'],G:['Garmin'],H:['Hyundai'],I:['Instagram'],J:['Jysk'],K:['Kärcher'],L:['Lacoste'],M:['Motorola'],N:['Netflix'],O:['Oreo'],P:['Panasonic'],R:['Rolex'],S:['Siemens'],T:['Toshiba'],U:['Uniqlo'],W:['Winiary'],Z:['Zalando']
  },
  foreign: {
    A:['algorytm'],B:['branding'],C:['coach'],D:['deadline'],E:['emoji'],F:['freelancer'],G:['gaming'],H:['hejt'],I:['influencer'],J:['joint venture'],K:['konsulting'],L:['lajk'],M:['mail'],N:['newsletter'],O:['open space'],P:['podcast'],R:['research'],S:['streaming'],T:['tutorial'],U:['update'],W:['workshop'],Z:['zoom']
  }
}
