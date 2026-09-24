/*
  素材差し替え: assets/characters/ と assets/backgrounds/ に画像を置き、
  CSS の .magic 等の background を url(...) に置換してください。
  BGM は下の AUDIO_PATH にファイルパスを指定します。
*/
const AUDIO_PATH = "";
const characters = {
  hoshi: { name:"ホシくん", visual:"magic", mark:"♠", endings:[
    ["終幕：箱のなかの星", "眩いショーの最後、彼はあなたの手を取った。\n「カーテンコールは、ボクたちだけでいいんだよ」\n拍手のない世界で、永遠の演目がはじまる。"],
    ["終幕：消えない助手", "鏡の向こうへ逃げようとしても、そこにはホシくんの笑顔。\nあなたはもう、彼の秘密を知る唯一の可愛い助手だ。"],
    ["終幕：ふたりきりの舞台", "客席は空っぽ。空も、街も、消えてしまった。\n「大丈夫だよ。キミが見ていてくれれば、ボクは何度でも奇跡を起こせるんだ」"] ] },
  citrus: { name:"シトラス", visual:"angel", mark:"☼", endings:[
    ["規約：幸福な所有", "新しい世界規約・第一条。\n『主人公は常にシトラスのそばで幸福であること』\n違反の余地なんて、最初から残されていない。"],
    ["規約：おひとりさま禁止", "あなたの予定表は、すべて彼の整った字で埋め尽くされた。\n「規則ですから。……私以外を見てはいけません」"],
    ["規約：天使の檻", "白い羽根が、やわらかく扉を塞ぐ。\n「貴女を守るためです。ルールを守れば、ずっと優しくしますよ」"] ] },
  nemuri: { name:"ネムリ", visual:"dream", mark:"☾", endings:[
    ["おやすみ：やさしい隔離", "あなたに悪い夢を見せるものは、ぜんぶネムリが遠ざけた。\n鍵のかかった保健室で、彼は今日も優しく笑っている。"],
    ["おやすみ：世界一の患者", "「心配しなくていいですよ。外のことは、ぼくが全部しておきますから」\nあなたは、彼だけの大切な患者になった。"],
    ["おやすみ：永眠のとなり", "眠れば、何も怖くない。\n淡い夢のなか、ネムリはあなたの手を離さない。\n「ずっとここにいましょうね」"] ] }
};
let state = { route:null, level:0, choice:0, sound:false };
const $ = id => document.getElementById(id);
const screens = { title:$("title-screen"), story:$("story-screen"), ending:$("ending-screen") };
const story = $("story-screen"), visual=$("visual"), speaker=$("speaker"), text=$("text"), choices=$("choices"), next=$("next-button"), meter=$("meter"), fill=$("meter-fill"), value=$("meter-value"), status=$("meter-status");

function show(which){ Object.values(screens).forEach(s=>s.classList.add("hidden")); screens[which].classList.remove("hidden"); }
function setLevel(amount){ state.level=Math.min(130,state.level+amount); const shown=Math.min(state.level,100); fill.style.width=shown+"%"; value.textContent=state.level>100?"ERROR":shown+"%"; status.textContent=state.level>100?"OVERFLOW / 監視不能":state.level>=70?"危険域：執着が濃くなっている":state.level>=35?"注意域：あなたを見つめている":"安全圏"; if(state.level>100) story.classList.add("broken"); }
function scene({who="",body,opts=[],bg="daily",gain=0}){ visual.className="visual "+bg+(state.level>=70?" danger":""); speaker.textContent=who; text.textContent=body; choices.innerHTML=""; next.classList.add("hidden"); setLevel(gain); opts.forEach((o,i)=>{const b=document.createElement("button");b.className="choice";b.textContent=o.label;b.onclick=()=>o.go(i);choices.appendChild(b)}); if(!opts.length){next.classList.remove("hidden");next.onclick=()=>advance();} }
function start(){state={route:null,level:0,choice:0,sound:state.sound};story.classList.remove("broken");meter.classList.add("hidden");show("story");scene({body:"――落ちる。\n\n見知らぬ空から、あなたの身体はきらめく雲を突き抜けていく。\n下には三つの光が見えた。どこへ落ちる？",bg:"sky",opts:[{label:"紫のスポットライトへ",go:()=>pick("hoshi")},{label:"まぶしい白い庭園へ",go:()=>pick("citrus")},{label:"ふわふわの屋根の保健室へ",go:()=>pick("nemuri")} ]});}
const reactions = {
  hoshi: {
    pick: ["「ボクもキミに会えてうれしいよ。これは運命の登場シーンだろう？」", "「ここは星降る街だよ。帰り道より、まずはボクの手品を見てくれる？」", "「つれないなあ。キミが帰る道なら、ボクがいちばんよく知っているよ」"],
    daily: ["「ずっと、か。キミのその言葉、ボクが大切にしまっておくよ」", "「知りたいことは何でも聞いて。ボクだけが答えてあげるよ」", "「自由に歩いていいよ。でも、キミを見失うつもりはないんだ」"],
    danger: ["「ボクもキミが好きだよ。だから、もう離さない」", "「帰る？　ボクとの幕は、まだ下ろせないだろう？」", "「反抗するキミも好きだよ。でも出口は、ボクが消してしまったんだ」"]
  },
  citrus: {
    pick: ["「私も貴女にお会いできて光栄です。特別に、案内は私が務めます」", "「ここは雲上庭園です。貴女の質問には、規則に沿ってお答えします」", "「その口調は困ります。ですが、貴女を放置する規則はありません」"],
    daily: ["「そのお気持ちは、私が正式に記録しておきます。撤回はできませんよ」", "「この世界には決まりがあります。貴女には私が一つずつ教えます」", "「無断で離れるのは規則違反です。……次は許しません」"],
    danger: ["「私も貴女を大切にします。永遠に、規則として」", "「帰還申請は却下しました。私が責任を持ちます」", "「反抗も想定済みです。貴女の自由には、新しい制限を設けます」"]
  },
  nemuri: {
    pick: ["「ぼくもあなたに会えてうれしいです。もう安心してくださいね」", "「ここは夢の保健室です。分からないことは、ぼくに聞いてください」", "「怖かったんですね。怒ってもいいですよ。ぼくは離れませんから」"],
    daily: ["「うれしいです。あなたの居場所は、ずっとここにありますよ」", "「ゆっくり話しましょう。あなたが疲れないように、ぼくが選んで教えます」", "「元気そうでよかった。でも外は危ないから、ぼくもついていきますね」"],
    danger: ["「ぼくもあなたが好きです。眠るまで、ずっとそばにいます」", "「帰るより、ここで休むほうがあなたのためですよ」", "「怒っても大丈夫。疲れているだけです。ぼくが静かにしてあげますね」"]
  }
};
function reaction(phase,i){return reactions[state.route][phase][i]+"\n\n";}

function pick(route){state.route=route;meter.classList.remove("hidden");const c=characters[route];scene({who:c.name,body:route==="hoshi"?"おや。空からお客さま？　……ふふ、歓迎するよ。ボクはスターマイン。ホシくんと呼んでくれるだろう？":route==="citrus"?"お怪我はありませんか？　ここは雲上庭園です。私はシトラス。まずは安全規則をご説明しますね。":"まあ。あなた、痛いところはありませんか？　ここは夢の保健室。ぼくはネムリです。どうぞ、こちらへ。",bg:c.visual,gain:12,opts:[{label:"助けてくれてありがとう！　あなたに会えてうれしい",go:()=>daily(0)},{label:"ここがどこか教えてほしい",go:()=>daily(1)},{label:"勝手に近づくな。帰り道だけ教えろよ",go:()=>daily(2)}]});}
function daily(i){const r=state.route,c=characters[r];let body=r==="hoshi"?"ホシくんは紅茶を手品で花に変え、あなたの笑う顔をじっと見ていた。\n「不思議だよね。キミがいるだけで、この部屋は完璧なんだ」":r==="citrus"?"シトラスは庭を案内しながら、歩幅まであなたに合わせてくれた。\n「迷子にならないよう、私の右側を歩いてください」": "ネムリはあなたのために甘い薬草茶を淹れてくれた。\n「外は疲れますから、今日はここで休みましょうね」";scene({who:c.name,body:reaction("pick",i)+body,bg:"daily",gain:18,opts:[{label:"あなたとずっと一緒にいたい。大好き！",go:()=>bond(0)},{label:"この世界のことを聞く",go:()=>bond(1)},{label:"うるさいな。放っておいて、好きに歩かせろよ",go:()=>bond(2)}]});}
function bond(i){const r=state.route,c=characters[r];const body=r==="hoshi"?"空中庭園を歩くと、ホシくんは街の人々から何度も声をかけられる。\nけれど彼は、誰にも返事をしなかった。あなたの手を引くことだけに夢中だった。":r==="citrus"?"昼食の席で、シトラスはナプキンの角度まで整えてくれる。\n「大丈夫です。貴女が困らないよう、私が全部覚えています」": "ネムリはあなたの髪を優しく梳かして、眠気の残る目元を覗き込む。\n「今日はよく眠れました？　外の夢は、見なくてもいいんですよ」";scene({who:c.name,body:reaction("daily",i)+body,bg:"daily",gain:16,opts:[{label:"もっと甘やかして。あなたがいちばん好き",go:()=>danger(0)},{label:"少しだけ距離をとる",go:()=>danger(1)},{label:"べたべた触るな。ほかの奴のところへ行くから",go:()=>danger(2)}]});}
function danger(i){state.choice=i;const r=state.route,c=characters[r];let body=r==="hoshi"?["「……その言葉、魔法より嬉しいよ」彼の指が、そっとあなたの手袋を直す。","「もちろんだよ。けれど、失敗したらボクが悲しむだろう？」笑顔は少しも崩れない。","「ほかの人？　ああ……必要、あるのかな？」彼の杖が小さく鳴った。"][i]:r==="citrus"?["「承知しました。では“貴女と常に一緒にいる”規則を、今から作りましょう」","「それは規則違反です。……いえ、今のは聞かなかったことにします」","「許可なく面会を？　困ります。貴女の安全が最優先ですから」"][i]:["「うれしいです。でも依存ではありませんよ、保護です」ネムリは穏やかに微笑む。","「無理をしないで。あなたはもう、たくさん頑張りましたから」","「その人は、あなたを疲れさせませんか？」ネムリの声だけが、少し低くなる。"][i];scene({who:c.name,body,bg:c.visual,gain:42,opts:[{label:"あなたが好き。ずっとそばにいさせて",go:()=>finalScene(0)},{label:"やっぱり帰らせて",go:()=>finalScene(1)},{label:"ふざけるな！　お前の言いなりにはならない",go:()=>finalScene(2)}]});}
function finalScene(i){state.choice=(state.choice+i)%3;const c=characters[state.route];scene({who:c.name,body:reaction("danger",i)+(state.route==="hoshi"?"「大丈夫だよ。怖がらないで。ここから先は、二人だけの最高のショーなんだ」":state.route==="citrus"?"「ご安心ください。貴女が困らないよう、すべての規則を整えました」":"「眠ってしまえば、もう誰にも傷つけられませんよ」"),bg:c.visual,gain:55,opts:[{label:"目を閉じる",go:ending}]});}
function ending(){const c=characters[state.route],e=c.endings[state.choice];show("ending");$("ending-title").textContent=e[0];$("ending-copy").textContent=e[1];$("ending-mark").textContent=c.mark;}
$("start-button").onclick=start;$("restart-button").onclick=start;$("route-button").onclick=start;$("home-button").onclick=()=>show("title");$("sound-button").onclick=()=>{const a=$("bgm");if(!AUDIO_PATH){alert("BGMファイルを assets/bgm/ に置き、script.js の AUDIO_PATH を指定してください。");return;}a.src=AUDIO_PATH;state.sound=!state.sound;state.sound?a.play():a.pause();};
